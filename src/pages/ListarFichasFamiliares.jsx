import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function ListarFichasFamiliares() {
  const { user } = useAuth();
  const [fichas, setFichas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFichas = async () => {
      try {
        const q = query(collection(db, 'fichas_familiares'), where('usuarioId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fichasData = [];
        querySnapshot.forEach((doc) => {
          fichasData.push({ id: doc.id, ...doc.data() });
        });
        setFichas(fichasData);
      } catch (error) {
        console.error('Error al obtener fichas familiares:', error);
      }
    };

    if (user) obtenerFichas();
  }, [user]);

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

  if (fichas.length === 0) return <p style={{ padding: 20 }}>No tienes fichas familiares creadas.</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>Mis Fichas Familiares</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {fichas.map((ficha) => (
          <li
            key={ficha.id}
            style={{
              marginBottom: 15,
              borderBottom: '1px solid #ccc',
              paddingBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong>{ficha.nombre}</strong> - RUT: {ficha.rut}
            </div>
            <div>
              <button
                style={buttonStyle}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = buttonColor)}
                onClick={() => navigate(`/ver-ficha-familiar/${ficha.id}`)}
              >
                Ver ficha
              </button>
              <button
                style={buttonStyle}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = buttonColor)}
                onClick={() => navigate(`/editar-ficha-familiar/${ficha.id}`)}
              >
                Editar ficha
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Botón Volver atrás */}
      <button
        style={{
          ...buttonStyle,
          marginTop: 20,
          marginRight: 0,
          width: '100%',
          fontSize: 16,
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = buttonColor)}
        onClick={() => navigate(-1)}
      >
        Volver atrás
      </button>
    </div>
  );
}

export default ListarFichasFamiliares;


