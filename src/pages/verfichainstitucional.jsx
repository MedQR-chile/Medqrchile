import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import '../index.css';

function VerFichaInstitucional() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ficha, setFicha] = useState(null);

  useEffect(() => {
    const obtenerFicha = async () => {
      const docRef = doc(db, 'fichas_institucionales', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFicha(docSnap.data());
      } else {
        alert('Ficha no encontrada');
      }
    };
    obtenerFicha();
  }, [id]);

  if (!ficha) {
    return (
      <div className="view-container">
        <div className="view-body">
          <p>No se encontró la ficha institucional.</p>
        </div>
      </div>
    );
  }

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
    maxWidth: 200,
    display: 'block',
  };

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
  );
}

export default VerFichaInstitucional;
