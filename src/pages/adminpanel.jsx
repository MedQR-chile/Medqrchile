import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import logoImage from '../assets/Logo.png'; // Importación al inicio
import '../App.css'; // Si tienes estilos globales

const PanelAdm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [descargadas, setDescargadas] = useState({});

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

  const generarYDescargarQR = async (ficha) => {
    try {
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

      logo.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logo, x, y, size, size);

        const link = document.createElement('a');
        link.download = `qr_medqr_${ficha.id}.png`;
        link.href = canvas.toDataURL();
        link.click();

        setDescargadas(prev => ({ ...prev, [ficha.id]: true }));
      };

      logo.onerror = () => {
        alert('No se pudo cargar el logo');
      };
    } catch (e) {
      console.error('Error generando QR con logo:', e);
      alert('Error al generar el QR');
    }
  };

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
          marginBottom: 30,
        }}
      >
        ← Volver atrás
      </button>

      {fichas.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>Cargando fichas...</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0, 191, 165, 0.3)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <thead style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Tipo de Ficha</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Descargar QR</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>

          <tbody>
            {fichas.map((ficha, index) => (
              <tr
                key={ficha.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f0fdfd' : 'white',
                }}
              >
                <td style={{ padding: 12 }}>{ficha.nombre || 'Sin nombre'}</td>
                <td style={{ padding: 12, textTransform: 'capitalize' }}>
                  {ficha.coleccion.replace('fichas_', '').replace('_', ' ')}
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button
                    onClick={() => generarYDescargarQR(ficha)}
                    style={{
                      backgroundColor: '#00bfa5',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={e => (e.target.style.backgroundColor = '#009e88')}
                    onMouseLeave={e => (e.target.style.backgroundColor = '#00bfa5')}
                  >
                    Descargar QR
                  </button>
                </td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  {descargadas[ficha.id] ? '✅ Descargado' : '⬜ No descargado'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PanelAdm;
