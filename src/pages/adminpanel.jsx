import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function PanelAdm() {
  const [fichas, setFichas] = useState([]);
  const [descargadas, setDescargadas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFichas = async () => {
      const fichasRef = collection(db, 'fichas');
      const snapshot = await getDocs(fichasRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFichas(data);
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
              <th style={styles.th}>Descargar QR</th>
              <th style={styles.th}>¿Descargada?</th>
            </tr>
          </thead>
          <tbody>
            {fichas.map((ficha) => (
              <tr key={ficha.id} style={styles.tr}>
                <td style={styles.td}>{ficha.nombre}</td>
                <td style={styles.td}>
                  <a
                    href={`/qr/${ficha.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#00bfa5',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Ver QR
                  </a>
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
};

export default PanelAdm;

  
