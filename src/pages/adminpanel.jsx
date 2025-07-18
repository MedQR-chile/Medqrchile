import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import QRCode from 'qrcode';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function PanelAdm() {
  const [fichasIndividuales, setFichasIndividuales] = useState([]);
  const [fichasFamiliares, setFichasFamiliares] = useState([]);
  const [fichasInstitucionales, setFichasInstitucionales] = useState([]);
  const [descargadas, setDescargadas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDatos = async () => {
      const refIndividual = collection(db, 'fichas');
      const refFamiliar = collection(db, 'fichas_familiares');
      const refInstitucional = collection(db, 'fichas_institucionales');

      const [snap1, snap2, snap3] = await Promise.all([
        getDocs(refIndividual),
        getDocs(refFamiliar),
        getDocs(refInstitucional),
      ]);

      setFichasIndividuales(snap1.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setFichasFamiliares(snap2.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setFichasInstitucionales(snap3.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    obtenerDatos();
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

  const renderTabla = (titulo, fichas, tipo) => (
    <>
      <h3 style={{ marginTop: '2rem', color: '#00bfa5' }}>{titulo}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Ver QR</th>
            <th style={styles.th}>¿Descargada?</th>
          </tr>
        </thead>
        <tbody>
          {fichas.map((ficha) => (
            <tr key={`${tipo}_${ficha.id}`} style={styles.tr}>
              <td style={styles.td}>{ficha.nombre}</td>
              <td style={styles.td}>
                <a
                  href={`/qr/${ficha.id}?tipo=${tipo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.botonQr}
                >
                  Ver QR
                </a>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => marcarDescargada(`${tipo}_${ficha.id}`)}
                  style={{
                    ...styles.botonEstado,
                    backgroundColor: descargadas[`${tipo}_${ficha.id}`] ? '#00bfa5' : '#ccc',
                    color: descargadas[`${tipo}_${ficha.id}`] ? 'white' : '#333',
                  }}
                >
                  {descargadas[`${tipo}_${ficha.id}`] ? 'Sí' : 'No'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <img
        src="/logo.png"
        alt="Logo"
        style={{ width: '180px', marginBottom: '1.5rem' }}
      />

      <h2 style={{ color: '#00bfa5', marginBottom: '1rem' }}>Panel de Administración</h2>

      <button
        onClick={volverAtras}
        style={styles.botonVolver}
      >
        ← Volver atrás
      </button>

      <div style={{ overflowX: 'auto' }}>
        {renderTabla('Fichas Individuales', fichasIndividuales, 'individual')}
        {renderTabla('Fichas Familiares', fichasFamiliares, 'familiar')}
        {renderTabla('Fichas Institucionales', fichasInstitucionales, 'institucional')}
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
  botonQr: {
    backgroundColor: '#00bfa5',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '14px',
  },
  botonEstado: {
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  botonVolver: {
    marginBottom: '1.5rem',
    padding: '10px 20px',
    backgroundColor: '#00bfa5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default PanelAdm;
