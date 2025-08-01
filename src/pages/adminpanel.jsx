import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import QRCode from 'qrcode';
import logoImage from '../assets/Logo.png';
import '../App.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaQrcode } from 'react-icons/fa';

const PanelAdm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const esAdmin = user?.email === 'medqrchile@gmail.com';

  useEffect(() => {
    if (!esAdmin) {
      navigate('/');
      return;
    }

    const obtenerFichas = async () => {
      try {
        const colecciones = ['fichas_individuales', 'fichas_familiares', 'fichas_institucionales'];
        const todasFichas = [];

        for (const nombreColeccion of colecciones) {
          const snapshot = await getDocs(collection(db, nombreColeccion));
          snapshot.forEach(docSnap => {
            todasFichas.push({
              id: docSnap.id,
              ...docSnap.data(),
              coleccion: nombreColeccion,
            });
          });
        }

        setFichas(todasFichas);
      } catch (error) {
        console.error('Error obteniendo fichas:', error);
      }
    };

    obtenerFichas();
  }, [esAdmin, navigate]);

  const generarYDescargarQR = async (ficha) => {
    try {
      let tipoRuta = '';
      if (ficha.coleccion === 'fichas_individuales') tipoRuta = 'ver-ficha-individual';
      else if (ficha.coleccion === 'fichas_familiares') tipoRuta = 'ver-ficha-familiar';
      else if (ficha.coleccion === 'fichas_institucionales') tipoRuta = 'ver-ficha-institucional';

      const urlQR = `https://medqrchile.cl/${tipoRuta}/${ficha.id}`;

      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, urlQR, {
        errorCorrectionLevel: 'H',
        width: 300,
      });

      const ctx = canvas.getContext('2d');
      const logo = new Image();
      logo.src = logoImage;

      logo.onload = () => {
        const size = 60;
        const x = (canvas.width - size) / 2;
        const y = (canvas.height - size) / 2;
        ctx.drawImage(logo, x, y, size, size);

        const link = document.createElement('a');
        link.download = `qr_medqr_${ficha.id}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };

      logo.onerror = () => {
        alert('No se pudo cargar el logo');
      };
    } catch (e) {
      console.error('Error generando QR con logo:', e);
      alert('Error al generar el QR');
    }
  };

  const toggleEstado = async (ficha) => {
    try {
      const nuevoEstado = ficha.estadoQR === 'descargado' ? 'no descargado' : 'descargado';
      const ref = doc(db, ficha.coleccion, ficha.id);
      await updateDoc(ref, { estadoQR: nuevoEstado });

      setFichas(prev => prev.map(f => f.id === ficha.id ? { ...f, estadoQR: nuevoEstado } : f));
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  };

  const fichasFiltradas = fichas.filter(f => {
    const texto = `${f.nombre} ${f.rut}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <img src={logoImage} alt="Logo MedQR Chile" style={{ width: 150, marginBottom: 20 }} />

      <h1 style={{ color: '#00bfa5', marginBottom: 20, textAlign: 'center' }}>Panel de Administración</h1>

      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#00bfa5',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          cursor: 'pointer',
          marginBottom: 30,
        }}
      >
        ← Volver atrás
      </button>

      <input
        type="text"
        placeholder="Buscar por nombre o RUT"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          padding: 10,
          borderRadius: 6,
          border: '1px solid #ccc',
          marginBottom: 20,
          width: '100%',
          maxWidth: 400,
        }}
      />

      {fichasFiltradas.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No hay fichas que coincidan.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 0 10px rgba(0, 191, 165, 0.3)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <thead style={{ backgroundColor: '#00bfa5', color: 'white' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: 12 }}>Tipo</th>
              <th style={{ padding: 12 }}>Creación</th>
              <th style={{ padding: 12 }}>Actualización</th>
              <th style={{ padding: 12 }}>QR</th>
              <th style={{ padding: 12 }}>Estado</th>
              <th style={{ padding: 12 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fichasFiltradas.map((ficha, i) => (
              <tr key={ficha.id} style={{ backgroundColor: i % 2 === 0 ? '#f0fdfd' : '#fff' }}>
                <td style={{ padding: 10 }}>{ficha.nombre || 'Sin nombre'}</td>
                <td style={{ padding: 10 }}>{ficha.coleccion.replace('fichas_', '')}</td>
                <td style={{ padding: 10 }}>{ficha.fechaCreacion?.toDate?.().toLocaleDateString() || '—'}</td>
                <td style={{ padding: 10 }}>{ficha.fechaActualizacion?.toDate?.().toLocaleDateString() || '—'}</td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => generarYDescargarQR(ficha)}>Ver QR</button>
                </td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => toggleEstado(ficha)} style={{ cursor: 'pointer' }}>
                    {ficha.estadoQR === 'descargado' ? '✅ Descargado' : '⬜ No descargado'}
                  </button>
                </td>
                <td style={{ padding: 10 }}>
                  <button onClick={() => navigate(`/editar/${ficha.id}`)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PanelAdm;

