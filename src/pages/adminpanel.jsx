// PanelAdm mejorado con búsqueda, fechas, ver QR, iconos y más
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import logoImage from '../assets/Logo.png';
import '../App.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaEye, FaSearch, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

const PanelAdm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [descargadas, setDescargadas] = useState({});
  const [filtro, setFiltro] = useState('');
  const [qrActual, setQrActual] = useState(null);
  const [mostrarQR, setMostrarQR] = useState(false);

  const esAdmin = user?.email === 'medqrchile@gmail.com';

  useEffect(() => {
    if (!esAdmin) {
      navigate('/');
      return;
    }

    const obtenerFichas = async () => {
      try {
        const colecciones = ['fichas_individuales', 'fichas_familiares', 'fichas_institucionales'];
        const todasFichas = [];

        for (const nombreColeccion of colecciones) {
          const snapshot = await getDocs(collection(db, nombreColeccion));
          snapshot.forEach(doc => {
            todasFichas.push({
              id: doc.id,
              ...doc.data(),
              coleccion: nombreColeccion,
            });
          });
        }

        setFichas(todasFichas);
      } catch (error) {
        console.error('Error obteniendo fichas:', error);
      }
    };

    obtenerFichas();
  }, [esAdmin, navigate]);

  const generarQR = async (ficha) => {
    let tipoRuta = '';
    if (ficha.coleccion === 'fichas_individuales') tipoRuta = 'ver-ficha-individual';
    else if (ficha.coleccion === 'fichas_familiares') tipoRuta = 'ver-ficha-familiar';
    else if (ficha.coleccion === 'fichas_institucionales') tipoRuta = 'ver-ficha-institucional';

    const urlQR = `https://medqrchile.cl/${tipoRuta}/${ficha.id}`;

    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, urlQR, { errorCorrectionLevel: 'H', width: 300 });

    const ctx = canvas.getContext('2d');
    const logo = new Image();
    logo.src = logoImage;

    return new Promise((resolve, reject) => {
      logo.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logo, x, y, size, size);
        resolve(canvas.toDataURL());
      };
      logo.onerror = () => reject('Error cargando logo');
    });
  };

  const verQR = async (ficha) => {
    try {
      const dataUrl = await generarQR(ficha);
      setQrActual(dataUrl);
      setMostrarQR(true);
    } catch (err) {
      alert(err);
    }
  };

  const descargarQR = async (ficha) => {
    const dataUrl = await generarQR(ficha);
    const link = document.createElement('a');
    link.download = `qr_medqr_${ficha.id}.png`;
    link.href = dataUrl;
    link.click();
    setDescargadas(prev => ({ ...prev, [ficha.id]: true }));
  };

  const fichasFiltradas = fichas.filter(f =>
    (f.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (f.rut || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
      <img src={logoImage} alt="Logo MedQR Chile" style={{ width: 150, marginBottom: 20 }} />
      <h1 style={{ color: '#00bfa5', textAlign: 'center' }}>Panel de Administración</h1>

      <button onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
        ← Volver atrás
      </button>

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
        <FaSearch style={{ marginRight: 8 }} />
        <input
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1 }}
        />
      </div>

      {fichasFiltradas.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No se encontraron fichas.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Creación</th>
              <th>Últ. actualización</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {fichasFiltradas.map((ficha, idx) => (
              <tr key={ficha.id} style={{ backgroundColor: idx % 2 ? '#f0fdfd' : 'white' }}>
                <td>{ficha.nombre}</td>
                <td>{ficha.coleccion.replace('fichas_', '')}</td>
                <td>{ficha.fechaCreacion?.toDate?.().toLocaleDateString() || '—'}</td>
                <td>{ficha.fechaActualizacion?.toDate?.().toLocaleDateString() || '—'}</td>
                <td style={{ textAlign: 'center' }}>
                  <button onClick={() => verQR(ficha)} title="Ver QR" style={{ marginRight: 8 }}><FaEye /></button>
                  <button onClick={() => descargarQR(ficha)} title="Descargar QR" style={{ marginRight: 8 }}><FaDownload /></button>
                  <button onClick={() => navigate(`/editar/${ficha.coleccion}/${ficha.id}`)} title="Editar ficha"><FaEdit /></button>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {descargadas[ficha.id] ? <FaCheck color="green" /> : <FaTimes color="gray" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mostrarQR && qrActual && (
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <h3>QR generado:</h3>
          <img src={qrActual} alt="QR generado" style={{ width: 300, marginTop: 10 }} />
          <br />
          <button onClick={() => setMostrarQR(false)} style={{ marginTop: 10 }}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default PanelAdm;
