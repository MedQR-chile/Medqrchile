// src/pages/verfichafamiliar.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../index.css';

function VerFichaFamiliar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    const fetchFicha = async () => {
      const ref = doc(db, 'fichas_familiares', id);
      const snap = await getDoc(ref);
      setFicha(snap.exists() ? snap.data() : null);
    };
    fetchFicha();
  }, [id]);

  const buttonColor = '#00bfa5';
  const buttonHoverColor = '#009e88';

  const buttonStyle = {
    backgroundColor: buttonColor,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '10px 18px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
    display: 'block',
  };

  if (!ficha) {
    return (
      <div className="view-container">
        <div className="view-body">
          <p>No se encontró la ficha familiar.</p>
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
          <strong>Centro pref.:</strong> {ficha.centro || '—'}
        </div>
        <div className="view-field">
          <strong>Previsión:</strong> {ficha.prevision || '—'}
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
        <div className="view-field">
          <strong>Grupo sanguíneo:</strong> {ficha.grupoSanguineo || '—'}
        </div>
        <div className="view-field">
          <strong>Cirugías previas:</strong> {ficha.cirugiasPrevias || '—'}
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

        <h4 className="section-title">Segundo Contacto de Emergencia</h4>
        <div className="view-field">
          <strong>Nombre:</strong> {ficha.contactoNombre2 || '—'}
        </div>
        <div className="view-field">
          <strong>Parentesco:</strong> {ficha.contactoParentesco2 || '—'}
        </div>
        <div className="view-field">
          <strong>Número:</strong> {ficha.contactoNumero2 || '—'}
        </div>

        <div className="view-field">
          <strong>Observaciones:</strong> {ficha.observaciones || '—'}
        </div>

        <button
          style={buttonStyle}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHoverColor)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = buttonColor)}
          onClick={() => navigate(-1)}
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
}

export default VerFichaFamiliar;

