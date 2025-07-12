import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // importa los estilos

function VerFichaIndividual() {
  const { user } = useAuth();
  const [ficha, setFicha] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFicha = async () => {
      const ref = doc(db, 'fichas_individuales', user.uid);
      const snap = await getDoc(ref);
      setFicha(snap.exists() ? snap.data() : null);
    };
    if (user) obtenerFicha();
  }, [user]);

  if (ficha === null) {
    return (
      <div className="view-container">
        <div className="view-body">
          <p>No hay ficha individual registrada.</p>
          <button
            style={{
              backgroundColor: '#00bfa5',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: 20,
              transition: 'background-color 0.3s ease',
            }}
            onClick={() => navigate(-1)}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#009e88')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#00bfa5')}
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="info">
          <h2>{ficha.nombre}</h2>
          <p><strong>RUT:</strong> {ficha.rut}</p>
          <p><strong>Fecha Nac.:</strong> {ficha.fechaNacimiento}</p>
        </div>
        {ficha.fotoURL && (
          <img
            src={ficha.fotoURL}
            alt="Foto carnet"
            className="view-photo"
          />
        )}
      </div>

      <div className="view-body">
        <div className="view-field">
          <strong>Dirección:</strong> {ficha.direccion}
        </div>
        <div className="view-field">
          <strong>Centro pref.:</strong> {ficha.centro}
        </div>
        <div className="view-field">
          <strong>Previsión:</strong> {ficha.prevision}
        </div>
        <div className="view-field">
          <strong>Alergias:</strong> {ficha.alergias || '—'}
        </div>
        <div className="view-field">
          <strong>Enfermedades:</strong> {ficha.enfermedades || '—'}
        </div>
        <div className="view-field">
          <strong>Medicamentos:</strong> {ficha.medicamentos || '—'}
        </div>

        <h4 className="section-title">Contacto de Emergencia</h4>

        <div className="view-field">
          <strong>Nombre:</strong> {ficha.contactoNombre || '—'}
        </div>
        <div className="view-field">
          <strong>Parentesco:</strong> {ficha.contactoParentesco || '—'}
        </div>
        <div className="view-field">
          <strong>Número:</strong> {ficha.contactoNumero || '—'}
        </div>

        <div className="view-field">
          <strong>Observaciones:</strong> {ficha.observaciones || '—'}
        </div>

        <button
          style={{
            backgroundColor: '#00bfa5',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            marginTop: 20,
            transition: 'background-color 0.3s ease',
          }}
          onClick={() => navigate(-1)}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#009e88')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#00bfa5')}
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
}

export default VerFichaIndividual;
