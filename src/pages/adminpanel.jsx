import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import logoImage from '../assets/Logo.png';
import '../App.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const PanelAdm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [modalQR, setModalQR] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [busqueda, setBusqueda] = useState('');

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

  const generarQRDataUrl = async (ficha) => {
    let tipoRuta = '';
    if (ficha.coleccion === 'fichas_individuales') tipoRuta = 'ver-ficha-individual';
    else if (ficha.coleccion === 'fichas_familiares') tipoRuta = 'ver-ficha-familiar';
    else if (ficha.coleccion === 'fichas_institucionales') tipoRuta = 'ver-ficha-institucional';

    const urlQR = `https://medqrchile.cl/${tipoRuta}/${ficha.id}`;

    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, urlQR, {
      errorCorrectionLevel: 'H',
      width: 300,
    });

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
      logo.onerror = reject;
    });
  };

  const mostrarQR = async (ficha) => {
    const dataUrl = await generarQRDataUrl(ficha);
    setQrDataUrl(dataUrl);
    setModalQR(ficha);
  };

  const descargarQR = () => {
    const link = document.createElement('a');
    link.download = `qr_medqr_${modalQR.id}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const fichasFiltradas = fichas.filter(ficha => ficha.nombre?.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <img src={logoImage} alt="Logo MedQR Chile" style={{ width: 150, marginBottom: 20 }} />

      <h1 style={{ color: '#00bfa5', marginBottom: 20, textAlign: 'center' }}>Panel de Administración</h1>

      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#00bfa5',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          cursor: 'pointer',
          marginBottom: 20,
        }}
      >
        ← Volver atrás
      </button>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ padding: 10, width: '100%', maxWidth: 400, marginBottom: 20, borderRadius: 6, border: '1px solid #ccc' }}
      />

      {fichasFiltradas.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No se encontraron fichas.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0, 191, 165, 0.3)', borderRadius: 12, overflow: 'hidden' }}>
          <thead style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <tr>
              <th style={{ padding: 12 }}>Nombre</th>
              <th style={{ padding: 12 }}>Tipo de Ficha</th>
              <th style={{ padding: 12 }}>Creación</th>
              <th style={{ padding: 12 }}>Últ. actualización</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Ver QR</th>
            </tr>
          </thead>
          <tbody>
            {fichasFiltradas.map((ficha, index) => (
              <tr key={ficha.id} style={{ backgroundColor: index % 2 === 0 ? '#f0fdfd' : 'white' }}>
                <td style={{ padding: 12 }}>{ficha.nombre || 'Sin nombre'}</td>
                <td style={{ padding: 12, textTransform: 'capitalize' }}>{ficha.coleccion.replace('fichas_', '').replace('_', ' ')}</td>
                <td style={{ padding: 12 }}>{ficha.fechaCreacion?.toDate?.().toLocaleDateString?.() || '—'}</td>
                <td style={{ padding: 12 }}>{ficha.fechaActualizacion?.toDate?.().toLocaleDateString?.() || '—'}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button
                    onClick={() => mostrarQR(ficha)}
                    style={{
                      backgroundColor: '#00bfa5',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#009e88')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#00bfa5')}
                  >
                    Ver QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal QR */}
      {modalQR && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 12, textAlign: 'center' }}>
            <h2>QR de {modalQR.nombre}</h2>
            <img src={qrDataUrl} alt="QR code" style={{ width: 300, marginBottom: 20 }} />
            <div>
              <button
                onClick={descargarQR}
                style={{
                  backgroundColor: '#00bfa5',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 20px',
                  marginRight: 10,
                  cursor: 'pointer'
                }}
              >
                Descargar QR
              </button>
              <button
                onClick={() => setModalQR(null)}
                style={{
                  backgroundColor: '#ccc',
                  color: 'black',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 20px',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAdm;
