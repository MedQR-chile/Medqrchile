// src/pages/editarfichafamiliar.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from './firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../index.css';

function EditarFichaFamiliar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [fotoNueva, setFotoNueva] = useState(null);

  useEffect(() => {
    const obtenerFicha = async () => {
      try {
        const docRef = doc(db, 'fichas_familiares', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setForm(docSnap.data());
        } else {
          alert('Ficha no encontrada');
        }
      } catch (error) {
        console.error('Error al obtener ficha:', error);
        alert('Error al cargar ficha');
      }
    };

    obtenerFicha();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFotoNueva(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let fotoURL = form.fotoURL || '';

      if (fotoNueva) {
        const photoRef = ref(storage, `fotos-familiares/${id}.jpg`);
        await uploadBytes(photoRef, fotoNueva);
        fotoURL = await getDownloadURL(photoRef);
      }

      const fichaRef = doc(db, 'fichas_familiares', id);
      await setDoc(fichaRef, {
        ...form,
        fotoURL,
        fechaActualizacion: new Date(),
      });

      alert('Ficha actualizada correctamente ✅');
    } catch (error) {
      console.error('Error al actualizar ficha:', error);
      alert('Error: ' + error.message);
    }
  };

  if (!form) return <p style={{ padding: 20 }}>Cargando datos...</p>;

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

  return (
    <div className="form-container">
      <h2>Editar Ficha Familiar</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>RUT</label>
        <input name="rut" value={form.rut} onChange={handleChange} required />

        <label>Fecha de nacimiento</label>
        <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />

        <label>Dirección</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} required />

        <label>Centro de atención preferente</label>
        <input name="centro" value={form.centro} onChange={handleChange} />

        <label>Previsión</label>
        <input name="prevision" value={form.prevision} onChange={handleChange} />

        <label>Alergias</label>
        <textarea name="alergias" value={form.alergias} onChange={handleChange} />

        <label>Enfermedades crónicas</label>
        <textarea name="enfermedades" value={form.enfermedades} onChange={handleChange} />

        <label>Medicamentos de uso habitual</label>
        <textarea name="medicamentos" value={form.medicamentos} onChange={handleChange} />

        <label>Grupo sanguíneo</label>
        <input name="grupoSanguineo" value={form.grupoSanguineo || ''} onChange={handleChange} />

        <label>Cirugías previas</label>
        <textarea name="cirugiasPrevias" value={form.cirugiasPrevias || ''} onChange={handleChange} />

        <h4>Contacto de Emergencia</h4>
        <label>Nombre</label>
        <input name="contactoNombre" value={form.contactoNombre || ''} onChange={handleChange} />

        <label>Parentesco</label>
        <input name="contactoParentesco" value={form.contactoParentesco || ''} onChange={handleChange} />

        <label>Número</label>
        <input name="contactoNumero" value={form.contactoNumero || ''} onChange={handleChange} />

        <h4>Segundo Contacto de Emergencia</h4>
        <label>Nombre</label>
        <input name="contactoNombre2" value={form.contactoNombre2 || ''} onChange={handleChange} />

        <label>Parentesco</label>
        <input name="contactoParentesco2" value={form.contactoParentesco2 || ''} onChange={handleChange} />

        <label>Número</label>
        <input name="contactoNumero2" value={form.contactoNumero2 || ''} onChange={handleChange} />

        <label>Observaciones</label>
        <textarea name="observaciones" value={form.observaciones} onChange={handleChange} />

        {form.fotoURL && (
          <>
            <label>Foto actual:</label>
            <img src={form.fotoURL} alt="foto actual" style={{ width: 100, borderRadius: 6 }} />
          </>
        )}

        <label>Actualizar foto (opcional)</label>
        <input type="file" accept="image/*" onChange={handleChange} />

        <button type="submit" className="btn-submit">
          Guardar cambios
        </button>
      </form>

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

export default EditarFichaFamiliar;
