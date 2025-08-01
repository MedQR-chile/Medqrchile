import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db, storage } from './firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import '../index.css';

function VerFichaIndividual() {
  const { id } = useParams(); // ID desde la URL
  const [ficha, setFicha] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerFicha = async () => {
      try {
        const ref = doc(db, 'fichas_individuales', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFicha(snap.data());
        } else {
          setFicha(null);
        }
      } catch (error) {
        console.error('Error al obtener la ficha:', error);
        setFicha(null);
      } finally {
        setCargando(false);
      }
    };

    if (id) obtenerFicha();
  }, [id]);

  if (cargando) {
    return <p style={{ textAlign: 'center' }}>Cargando ficha médica...</p>;
  }

  if (ficha === null) {
    return (
      <div className="view-container">
        <div className="view-body">
          <p>Ficha no encontrada o ha sido eliminada.</p>
          <button
            style={btnStyle}
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
        <div className="view-field"><strong>Dirección:</strong> {ficha.direccion}</div>
        <div className="view-field"><strong>Centro pref.:</strong> {ficha.centro}</div>
        <div className="view-field"><strong>Previsión:</strong> {ficha.prevision}</div>
        <div className="view-field"><strong>Alergias:</strong> {ficha.alergias || '—'}</div>
        <div className="view-field"><strong>Enfermedades:</strong> {ficha.enfermedades || '—'}</div>
        
        {/* NUEVOS CAMPOS */}
        <div className="view-field"><strong>Grupo sanguíneo:</strong> {ficha.grupoSanguineo || '—'}</div>
        <div className="view-field"><strong>Cirugías previas:</strong> {ficha.cirugiasPrevias || '—'}</div>
        
        <div className="view-field"><strong>Medicamentos:</strong> {ficha.medicamentos || '—'}</div>

        <h4 className="section-title">Contacto de Emergencia</h4>
        <div className="view-field"><strong>Nombre:</strong> {ficha.contactoNombre || '—'}</div>
        <div className="view-field"><strong>Parentesco:</strong> {ficha.contactoParentesco || '—'}</div>
        <div className="view-field"><strong>Número:</strong> {ficha.contactoNumero || '—'}</div>

        {/* SEGUNDO CONTACTO */}
        <h4 className="section-title">Segundo Contacto de Emergencia</h4>
        <div className="view-field"><strong>Nombre:</strong> {ficha.contactoNombre2 || '—'}</div>
        <div className="view-field"><strong>Parentesco:</strong> {ficha.contactoParentesco2 || '—'}</div>
        <div className="view-field"><strong>Número:</strong> {ficha.contactoNumero2 || '—'}</div>

        <div className="view-field"><strong>Observaciones:</strong> {ficha.observaciones || '—'}</div>

        <button
          style={btnStyle}
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

const btnStyle = {
  backgroundColor: '#00bfa5',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '10px 20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: 20,
  transition: 'background-color 0.3s ease',
};

export default VerFichaIndividual;

