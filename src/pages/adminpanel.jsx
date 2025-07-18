// src/pages/adminpanel.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';  // Ajusta si tu archivo firebase.js está en otra carpeta
import { toCanvas } from 'qrcode';  // Importamos solo toCanvas para generar QR
import { useAuth } from './AuthContext';  // Ajusta según donde tengas AuthContext.js
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);
  const [qrGenerado, setQrGenerado] = useState(null);
  const [tipoFicha, setTipoFicha] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.email !== 'medqrchile@gmail.com') {
        navigate('/');
        return;
      }

      const colecciones = [
        { nombre: 'fichas_individuales', tipo: 'individual' },
        { nombre: 'fichas_familiares', tipo: 'familiar' },
        { nombre: 'fichas_institucionales', tipo: 'institucional' }
      ];

      const fichasTotales = [];

      for (const coleccion of colecciones) {
        const querySnapshot = await getDocs(collection(db, coleccion.nombre));
        querySnapshot.forEach(docSnap => {
          fichasTotales.push({
            id: docSnap.id,
            ...docSnap.data(),
            tipo: coleccion.tipo,
            coleccion: coleccion.nombre
          });
        });
      }

      setFichas(fichasTotales);
    };

    fetchData();
  }, [user, navigate]);

  const generarQR = async (ficha) => {
    setQrGenerado({
      id: ficha.id,
      tipo: ficha.tipo,
      url: `https://medqrchile.cl/ficha/${ficha.id}?tipo=${ficha.tipo}`
    });

    // Guardar que fue descargado
    const fichaRef = doc(db, ficha.coleccion, ficha.id);
    await updateDoc(fichaRef, {
      descargado: true
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Panel de Administrador</h1>
      {fichas.map((ficha, index) => (
        <div key={index} className="border rounded p-4 mb-4 shadow">
          <p><strong>Nombre:</strong> {ficha.nombre}</p>
          <p><strong>Tipo:</strong> {ficha.tipo}</p>
          <button
            onClick={() => generarQR(ficha)}
            className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          >
            Generar QR
          </button>
        </div>
      ))}

      {qrGenerado && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Código QR generado</h2>
          <QRCode value={qrGenerado.url} size={256} />
          <p className="mt-2">URL: {qrGenerado.url}</p>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;


    
