import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import QRCode from 'qrcode';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from './assets/Logo.png'; // Ajusta el path según la ubicación exacta

function PanelAdm() {
  const [fichasIndividuales, setFichasIndividuales] = useState([]);
  const [fichasFamiliares, setFichasFamiliares] = useState([]);
  const [fichasInstitucionales, setFichasInstitucionales] = useState([]);
  const [descargadas, setDescargadas] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFichas = async () => {
      const fichasIndiv = await getDocs(collection(db, 'fichas_individuales'));
      const fichasFam = await getDocs(collection(db, 'fichas_familiares'));
      const fichasInst = await getDocs(collection(db, 'fichas_institucionales'));

      setFichasIndividuales(fichasIndiv.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'Individual' })));
      setFichasFamiliares(fichasFam.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'Familiar' })));
      setFichasInstitucionales(fichasInst.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'Institucional' })));
    };

    obtenerFichas();
  }, []);

  const marcarDescargada = (id) => {
    setDescargadas(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const volverAtras = () => {
    navigate('/');
  };

  const renderTabla = (titulo, fichas) => (
    <>
      <h3 style={{ color: '#00bfa5', marginTop: '2rem' }}>{titulo}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Tipo</th>
            <th style={styles.th}>Ver QR</th>
            <th style={styles.th}>¿Descargada?</th>
          </tr>
        </thead>
        <tbody>
          {fichas.map((ficha) => (
            <tr key={ficha.id} style={styles.tr}>
              <td style={styles.td}>{ficha.nombre}</td>
              <td style={styles.td}>{ficha.tipo}</td>
              <td style={styles.td}>
                <a
                  href={`/qr/${ficha.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.botonVer}
                >
                  Ver QR
                </a>
              </td>
              <td style={styles.td}>
                <button
                  onClick={() => marcarDescargada(ficha.id)}
                  style={{
                    ...styles.botonDescargada,
                    backgroundColor: descargadas[ficha.id] ? '#00bfa5' : '#ccc',
                    color: descargadas[ficha.id] ? 'white' : '#333',
                  }}
                >
                  {descargadas[ficha.id] ? 'Sí' : 'No'}
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
      <img src={logo} alt="Logo" style={{ width: '150px', marginBottom: '1rem' }} />
      <h2 style={{ color: '#00bfa5', marginBottom: '1rem' }}>Panel de Administración</h2>

      <button onClick={volverAtras} style={styles.botonVolver}>
        ← Volver atrás
      </button>

      <div style={{ overflowX: 'auto' }}>
        {renderTabla('Fichas Individuales', fichasIndividuales)}
        {renderTabla('Fichas Familiares', fichasFamiliares)}
        {renderTabla('Fichas Institucionales', fichasInstitucionales)}
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
  botonVolver: {
    marginBottom: '1.5rem',
    padding: '10px 20px',
    backgroundColor: '#00bfa5',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  botonVer: {
    backgroundColor: '#00bfa5',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '14px',
  },
  botonDescargada: {
    border: 'none',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default PanelAdm;
