import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase.js';
import QRCode from 'qrcode';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const correoAdmin = "medqrchile@gmail.com";

  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const colecciones = [
          'fichas_individuales',
          'fichas_familiares',
          'fichas_institucionales'
        ];
        let todasFichas = [];
        for (const col of colecciones) {
          const snap = await getDocs(collection(db, col));
          todasFichas = todasFichas.concat(
            snap.docs.map(doc => ({ id: doc.id, coleccion: col, ...doc.data() }))
          );
        }
        setFichas(todasFichas);
      } catch (e) {
        console.error('Error al cargar fichas:', e);
      } finally {
        setCargando(false);
      }
    };

    if (user?.email === correoAdmin) {
      fetchFichas();
    } else {
      setCargando(false);
    }
  }, [user]);

  // Color principal del botón y hover más oscuro
  const buttonColor = '#00bfa5';
  const buttonHoverColor = '#009e88';

  const buttonStyle = {
    backgroundColor: buttonColor,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginRight: 10,
  };

  const generateQRConLogo = async (fichaId) => {
    try {
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, `https://medqrchile.cl/ver-ficha-individual?uid=${fichaId}`, {
       errorCorrectionLevel: 'H',
        width: 300,
       });
      const ctx = canvas.getContext('2d');
      const logo = new Image();
      logo.src = '/Logo.png';
      logo.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logo, x, y, size, size);
        const link = document.createElement('a');
        link.download = `qr_medqr_${fichaId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      logo.onerror = () => {
        alert('No se pudo cargar el logo desde /logo.png');
      };
    } catch (e) {
      console.error('Error generando QR con logo:', e);
      alert('Error al generar el QR');
    }
  };

  const toggleDescargado = async (ficha) => {
    try {
      const fichaRef = doc(db, ficha.coleccion, ficha.id);
      await updateDoc(fichaRef, { descargado: !ficha.descargado });
      setFichas((prev) =>
        prev.map((f) =>
          f.id === ficha.id ? { ...f, descargado: !f.descargado } : f
        )
      );
    } catch (error) {
      alert('Error actualizando estado: ' + error.message);
    }
  };

  if (cargando) {
    return <p style={{ padding: 20 }}>Cargando...</p>;
  }
  if (user?.email !== correoAdmin) {
    return (
      <p style={{ padding: 20, color: 'red' }}>
        Acceso denegado. No eres administrador.
      </p>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>Panel de Administrador - MedQR Chile</h2>
      {fichas.length === 0 ? (
        <p>No hay fichas registradas.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <thead style={{ backgroundColor: buttonColor, color: 'white' }}>
            <tr>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px 15px', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '12px 15px', textAlign: 'center' }}>QR</th>
              <th style={{ padding: '12px 15px', textAlign: 'center' }}>Descargado</th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((f) => (
              <tr
                key={f.id}
                style={{
                  borderBottom: '1px solid #ddd',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '10px 15px' }}>{f.nombre}</td>
                <td style={{ padding: '10px 15px', textTransform: 'capitalize' }}>{f.tipo}</td>
                <td style={{ padding: '10px 15px', textAlign: 'center' }}>
                  <button
                    style={{
                      ...buttonStyle,
                      ...(hoveredBtn === f.id ? { backgroundColor: buttonHoverColor } : {})
                    }}
                    onMouseEnter={() => setHoveredBtn(f.id)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    onClick={() => generateQRConLogo(f.id)}
                  >
                    Descargar QR con logo
                  </button>
                </td>
                <td style={{ padding: '10px 15px', textAlign: 'center' }}>
                  <button
                    style={{
                      ...buttonStyle,
                      backgroundColor: f.descargado ? '#007a66' : buttonColor,
                    }}
                    onClick={() => toggleDescargado(f)}
                  >
                    {f.descargado ? 'Descargado' : 'Marcar como descargado'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Botón Volver al final */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 30,
          padding: '10px 18px',
          backgroundColor: buttonColor,
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        ← Volver atrás
      </button>
    </div>
  );
}

export default AdminPanel;
