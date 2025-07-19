import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode.react';
import logoImage from '../assets/Logo.png'; // Importación al inicio
import '../App.css'; // Si tienes estilos globales

const AdminPanel = () => {
  const [fichas, setFichas] = useState([]);
  const [qrGenerado, setQrGenerado] = useState(null);
  const [descargadas, setDescargadas] = useState({});

  useEffect(() => {
    const obtenerFichas = async () => {
      const fichasSnapshot = await getDocs(collection(db, 'fichas'));
      const fichasData = fichasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFichas(fichasData);
    };

    obtenerFichas();
  }, []);

  const generarQR = (id) => {
    setQrGenerado(id);
  };

  const descargarQR = (id) => {
    const canvas = document.getElementById(`qr-${id}`);
    const url = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}.png`;
    a.click();

    setDescargadas(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <img src={logoImage} alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />

      <h2 style={{ color: '#00bfa5' }}>Panel de Administración</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Generar QR</th>
            <th style={styles.th}>Descargar</th>
            <th style={styles.th}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {fichas.map((ficha) => (
            <tr key={ficha.id} style={{ backgroundColor: '#f9f9f9' }}>
              <td style={styles.td}>{ficha.nombre}</td>
              <td style={styles.td}>
                <button onClick={() => generarQR(ficha.id)} style={styles.button}>Generar</button>
              </td>
              <td style={styles.td}>
                {qrGenerado === ficha.id && (
                  <>
                    <QRCode
                      id={`qr-${ficha.id}`}
                      value={`https://medqrchile.vercel.app/ficha/${ficha.id}`}
                      size={100}
                      includeMargin={true}
                      style={{ display: 'none' }}
                    />
                    <button onClick={() => descargarQR(ficha.id)} style={styles.button}>
                      Descargar
                    </button>
                  </>
                )}
              </td>
              <td style={styles.td}>
                {descargadas[ficha.id] ? '✅ Descargado' : '⬜ No descargado'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => window.history.back()} style={{ marginTop: '30px', ...styles.buttonVolver }}>
        Volver atrás
      </button>
    </div>
  );
};

const styles = {
  th: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#00bfa5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  buttonVolver: {
    padding: '10px 16px',
    backgroundColor: '#555',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default AdminPanel;




