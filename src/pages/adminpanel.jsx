import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import QRCode from 'qrcode';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import logoImage from './logo.png'; // asegúrate de tener el logo en tu carpeta src

function PanelAdm() {
  const [fichas, setFichas] = useState([]);
  const [descargadas, setDescargadas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFichas = async () => {
      const colecciones = [
        'fichas_individuales',
        'fichas_familiares',
        'fichas_institucionales',
      ];
      let todasFichas = [];
      for (const col of colecciones) {
        const snap = await getDocs(collection(db, col));
        todasFichas = todasFichas.concat(
          snap.docs.map((doc) => ({ id: doc.id, coleccion: col, ...doc.data() }))
        );
      }
      setFichas(todasFichas);
    };

    obtenerFichas();
  }, []);

  const marcarDescargada = (id) => {
    setDescargadas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const volverAtras = () => {
    navigate('/');
  };

  const obtenerUrlFicha = (ficha) => {
    const baseUrl = 'https://medqrchile.cl';
    switch (ficha.coleccion) {
      case 'fichas_individuales':
        return `${baseUrl}/ver-ficha-individual/${ficha.id}`;
      case 'fichas_familiares':
        return `${baseUrl}/ver-ficha-familiar/${ficha.id}`;
      case 'fichas_institucionales':
        return `${baseUrl}/ver-ficha-institucional/${ficha.id}`;
      default:
        return `${baseUrl}/ver-ficha-individual/${ficha.id}`;
    }
  };

  const descargarQrConLogo = async (ficha) => {
    const url = obtenerUrlFicha(ficha);
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;

    await QRCode.toCanvas(canvas, url, {
      width: 500,
      margin: 2,
      color: {
        dark: '#000',
        light: '#fff',
      },
    });

    const ctx = canvas.getContext('2d');
    const logo = new Image();
    logo.src = logoImage;
    logo.onload = () => {
      const size = 100;
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;
      ctx.drawImage(logo, x, y, size, size);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${ficha.nombre || 'qr'}.png`;
      link.click();
    };
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#00bfa5', marginBottom: '1rem' }}>Panel de Administración</h2>

      <button
        onClick={volverAtras}
        style={{
          marginBottom: '1.5rem',
          padding: '10px 20px',
          backgroundColor: '#00bfa5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ← Volver atrás
      </button>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#00bfa5', color: 'white' }}>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Ver QR</th>
              <th style={styles.th}>Descargar QR</th>
              <th style={styles.th}>¿Descargada?</th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((ficha) => (
              <tr key={ficha.id} style={styles.tr}>
                <td style={styles.td}>{ficha.nombre || 'Sin nombre'}</td>
                <td style={styles.td}>
                  <a
                    href={obtenerUrlFicha(ficha)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.boton}
                  >
                    Ver QR
                  </a>
                </td>
                <td style={styles.td}>
                  <button onClick={() => descargarQrConLogo(ficha)} style={styles.boton}>
                    Descargar QR
                  </button>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => marcarDescargada(ficha.id)}
                    style={{
                      backgroundColor: descargadas[ficha.id] ? '#00bfa5' : '#ccc',
                      color: descargadas[ficha.id] ? 'white' : '#333',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    {descargadas[ficha.id] ? 'Sí' : 'No'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #ccc',
    fontSize: '16px',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    fontSize: '15px',
  },
  tr: {
    backgroundColor: '#f9f9f9',
  },
  boton: {
    backgroundColor: '#00bfa5',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',
  },
};

export default PanelAdm;
