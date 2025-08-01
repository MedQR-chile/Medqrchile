import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db, storage } from './firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function EditarFichaIndividual() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [fotoNueva, setFotoNueva] = useState(null);

  useEffect(() => {
    const obtenerFicha = async () => {
      const fichaRef = doc(db, 'fichas_individuales', user.uid);
      const snap = await getDoc(fichaRef);
      if (snap.exists()) {
        setForm(snap.data());
      } else {
        alert('No hay ficha registrada.');
      }
    };
    if (user) obtenerFicha();
  }, [user]);

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
        const photoRef = ref(storage, `fotos-individuales/${user.uid}.jpg`);
        await uploadBytes(photoRef, fotoNueva);
        fotoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, 'fichas_individuales', user.uid), {
        ...form,
        fotoURL,
        usuarioId: user.uid,
        email: user.email,
        tipo: 'individual',
        fechaActualizacion: new Date(),
      });

      alert('Ficha actualizada correctamente ✅');
    } catch (error) {
      alert('Error al actualizar ficha: ' + error.message);
    }
  };

  if (!form) return <p style={{ padding: 20 }}>Cargando datos...</p>;

  return (
    <div className="form-container">
      <h2>Editar Ficha Individual</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input name="nombre" value={form.nombre || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>RUT</label>
          <input name="rut" value={form.rut || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Fecha de nacimiento</label>
          <input type="date" name="fechaNacimiento" value={form.fechaNacimiento || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input name="direccion" value={form.direccion || ''} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Centro de atención preferente</label>
          <input name="centro" value={form.centro || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Previsión</label>
          <input name="prevision" value={form.prevision || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Alergias</label>
          <textarea name="alergias" value={form.alergias || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Enfermedades crónicas</label>
          <textarea name="enfermedades" value={form.enfermedades || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Grupo sanguíneo</label>
          <input name="grupoSanguineo" value={form.grupoSanguineo || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Cirugías previas</label>
          <textarea name="cirugiasPrevias" value={form.cirugiasPrevias || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Medicamentos de uso habitual</label>
          <textarea name="medicamentos" value={form.medicamentos || ''} onChange={handleChange} />
        </div>

        <h4 className="section-title">Contacto de Emergencia</h4>
        <div className="form-group">
          <label>Nombre</label>
          <input name="contactoNombre" value={form.contactoNombre || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Parentesco</label>
          <input name="contactoParentesco" value={form.contactoParentesco || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Número</label>
          <input name="contactoNumero" value={form.contactoNumero || ''} onChange={handleChange} />
        </div>

        <h4 className="section-title">Segundo Contacto de Emergencia</h4>
        <div className="form-group">
          <label>Nombre</label>
          <input name="contactoNombre2" value={form.contactoNombre2 || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Parentesco</label>
          <input name="contactoParentesco2" value={form.contactoParentesco2 || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Número</label>
          <input name="contactoNumero2" value={form.contactoNumero2 || ''} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Observaciones</label>
          <textarea name="observaciones" value={form.observaciones || ''} onChange={handleChange} />
        </div>

        {form.fotoURL && (
          <div className="form-group">
            <label>Foto actual:</label>
            <img src={form.fotoURL} alt="foto actual" style={{ width: 100, borderRadius: 6 }} />
          </div>
        )}

        <div className="form-group">
          <label>Actualizar foto (opcional)</label>
          <input type="file" accept="image/*" onChange={handleChange} />
        </div>

        <button type="submit" className="btn-submit">
          Guardar cambios
        </button>
      </form>

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
  );
}

export default EditarFichaIndividual;
