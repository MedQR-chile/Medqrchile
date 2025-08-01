import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import QRCode from 'qrcode';
import logoImage from '../assets/Logo.png';
import '../App.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const PanelAdm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
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
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            todasFichas.push({
              id: docSnap.id,
              ...data,
              coleccion: nombreColeccion,
              estadoDescargado: data.estadoDescargado || false,
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

  const generarUrlFicha = (ficha) => {
    if (ficha.coleccion === 'fichas_individuales') return `https://medqrchile.cl/ver-ficha-individual/${ficha.id}`;
    if (ficha.coleccion === 'fichas_familiares') return `https://medqrchile.cl/ver-ficha-familiar/${ficha.id}`;
    if (ficha.coleccion === 'fichas_institucionales') return `https://medqrchile.cl/ver-ficha-institucional/${ficha.id}`;
    return '#';
  };

  const generarYDescargarQR = async (ficha) => {
    try {
      const urlQR = generarUrlFicha(ficha);

      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, urlQR, {
        errorCorrectionLevel: 'H',
        width: 300,
      });

      const ctx = canvas.getContext('2d');
      const logo = new Image();
      logo.src = logoImage;

      logo.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logo, x, y, size, size);

        const link = document.createElement('a');
        link.download = `qr_medqr_${ficha.id}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };

      logo.onerror = () => {
        alert('No se pudo cargar el logo');
      };
    } catch (e) {
      console.error('Error generando QR:', e);
    }
  };

  const toggleEstadoDescargado = async (ficha) => {
    const nuevoEstado = !ficha.estadoDescargado;
    const fichaRef = doc(db, ficha.coleccion, ficha.id);

    try {
      await updateDoc(fichaRef, { estadoDescargado: nuevoEstado });
      setFichas(prev =>
        prev.map(f =>
          f.id === ficha.id ? { ...f, estadoDescargado: nuevoEstado } : f
        )
      );
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const fichasFiltradas = fichas.filter(f =>
    (f.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (f.rut || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: 20 }}>
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
          marginBottom: 15,
        }}
      >
        ← Volver atrás
      </button>

      <input
        placeholder="Buscar por nombre o RUT"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: 10,
          width: '100%',
          maxWidth: 400,
          borderRadius: 8,
          border: '1px solid #ccc',
          marginBottom: 20,
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#00bfa5', color: 'white' }}>
          <tr>
            <th style={{ padding: 12, textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: 12 }}>Tipo</th>
            <th style={{ padding: 12 }}>Creación</th>
            <th style={{ padding: 12 }}>Actualización</th>
            <th style={{ padding: 12 }}>QR</th>
            <th style={{ padding: 12 }}>Estado</th>
            <th style={{ padding: 12 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {fichasFiltradas.map((ficha, index) => (
            <tr key={ficha.id} style={{ backgroundColor: index % 2 === 0 ? '#f0fdfd' : 'white' }}>
              <td style={{ padding: 10 }}>{ficha.nombre || '—'}</td>
              <td style={{ textTransform: 'capitalize', textAlign: 'center' }}>{ficha.coleccion.replace('fichas_', '')}</td>
              <td style={{ textAlign: 'center' }}>{ficha.fechaCreacion ? new Date(ficha.fechaCreacion.seconds * 1000).toLocaleDateString() : '—'}</td>
              <td style={{ textAlign: 'center' }}>{ficha.fechaActualizacion ? new Date(ficha.fechaActualizacion.seconds * 1000).toLocaleDateString() : '—'}</td>
              <td style={{ textAlign: 'center' }}>
                <button
                  onClick={() => window.open(generarUrlFicha(ficha), '_blank')}
                  style={{
                    backgroundColor: '#00bfa5',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  Ver QR
                </button>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  onClick={() => toggleEstadoDescargado(ficha)}
                  style={{
                    backgroundColor: ficha.estadoDescargado ? '#00bfa5' : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '6px 12px',
                    cursor: 'pointer',
                  }}
                >
                  {ficha.estadoDescargado ? 'Descargado' : 'No descargado'}
                </button>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button
                  onClick={() => navigate(`/editar-ficha/${ficha.id}`)}
                  title="Editar"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  🖉
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PanelAdm;
