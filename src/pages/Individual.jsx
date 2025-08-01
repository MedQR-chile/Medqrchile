import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { db, storage } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Individual() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    fechaNacimiento: '',
    direccion: '',
    centro: '',
    prevision: '',
    alergias: '',
    enfermedades: '',
    grupoSanguineo: '',
    cirugiasPrevias: '',
    medicamentos: '',
    contactoNombre: '',
    contactoParentesco: '',
    contactoNumero: '',
    contactoNombre2: '',
    contactoParentesco2: '',
    contactoNumero2: '',
    observaciones: '',
  });

  const [foto, setFoto] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFoto(files[0]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fotoURL = '';
      if (foto) {
        const photoRef = ref(storage, `fotos-individuales/${user.uid}.jpg`);
        await uploadBytes(photoRef, foto);
        fotoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, 'fichas_individuales', user.uid), {
        ...form,
        fotoURL,
        usuarioId: user.uid,
        email: user.email,
        tipo: 'individual',
        fechaCreacion: new Date(),
      });

      alert('Ficha registrada correctamente ✅');
      navigate('/menu');
    } catch (error) {
      alert('Error al guardar ficha: ' + error.message);
    }
  };

  const botonVolverStyle = {
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

  return (
    <div className="form-container">
      <h2>Crear Ficha Individual</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" onChange={handleChange} value={form.nombre} required />

        <label>RUT</label>
        <input name="rut" onChange={handleChange} value={form.rut} required />

        <label>Fecha de nacimiento</label>
        <input type="date" name="fechaNacimiento" onChange={handleChange} value={form.fechaNacimiento} required />

        <label>Dirección</label>
        <input name="direccion" onChange={handleChange} value={form.direccion} required />

        <label>Centro de atención preferente</label>
        <input name="centro" onChange={handleChange} value={form.centro} />

        <label>Previsión</label>
        <input name="prevision" onChange={handleChange} value={form.prevision} />

        <label>Alergias</label>
        <textarea name="alergias" onChange={handleChange} value={form.alergias} />

        <label>Enfermedades crónicas</label>
        <textarea name="enfermedades" onChange={handleChange} value={form.enfermedades} />

        <label>Grupo sanguíneo</label>
        <input name="grupoSanguineo" onChange={handleChange} value={form.grupoSanguineo} />

        <label>Cirugías previas</label>
        <textarea name="cirugiasPrevias" onChange={handleChange} value={form.cirugiasPrevias} />

        <label>Medicamentos de uso habitual</label>
        <textarea name="medicamentos" onChange={handleChange} value={form.medicamentos} />

        <h4>Contacto de Emergencia</h4>
        <label>Nombre</label>
        <input name="contactoNombre" onChange={handleChange} value={form.contactoNombre} />

        <label>Parentesco</label>
        <input name="contactoParentesco" onChange={handleChange} value={form.contactoParentesco} />

        <label>Número</label>
        <input name="contactoNumero" onChange={handleChange} value={form.contactoNumero} />

        <h4>Segundo Contacto de Emergencia</h4>
        <label>Nombre</label>
        <input name="contactoNombre2" onChange={handleChange} value={form.contactoNombre2} />

        <label>Parentesco</label>
        <input name="contactoParentesco2" onChange={handleChange} value={form.contactoParentesco2} />

        <label>Número</label>
        <input name="contactoNumero2" onChange={handleChange} value={form.contactoNumero2} />

        <label>Observaciones</label>
        <textarea name="observaciones" onChange={handleChange} value={form.observaciones} />

        <label>Foto tamaño carnet (opcional)</label>
        <input type="file" accept="image/*" onChange={handleChange} />

        <button type="submit" className="btn-submit">
          Guardar ficha
        </button>
      </form>

      <button
        style={botonVolverStyle}
        onClick={() => navigate(-1)}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#009e88')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#00bfa5')}
      >
        Volver atrás
      </button>
    </div>
  );
}

export default Individual;
