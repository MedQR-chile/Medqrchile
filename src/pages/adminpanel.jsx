import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';

const PanelAdm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fichas, setFichas] = useState([]);

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
          snapshot.forEach(doc => {
            todasFichas.push({
              id: doc.id,
              ...doc.data(),
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

  const generateQRConLogo = async (fichaId) => {
    try {
      const ficha = fichas.find(f => f.id === fichaId);

      let tipoRuta = '';
      if (ficha.coleccion === 'fichas_individuales') {
        tipoRuta = 'ver-ficha-individual';
      } else if (ficha.coleccion === 'fichas_familiares') {
        tipoRuta = 'ver-ficha-familiar';
      } else if (ficha.coleccion === 'fichas_institucionales') {
        tipoRuta = 'ver-ficha-institucional';
      }

      const urlQR = `https://medqrchile.cl/${tipoRuta}/${ficha.id}`;

      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, urlQR, {
        errorCorrectionLevel: 'H',
        width: 300,
      });

      const ctx = canvas.getContext('2d');
      const logo = new Image();
      logo.src = '/Logo.png';

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
        alert('No se pudo cargar el logo desde /Logo.png');
      };
    } catch (e) {
      console.error('Error generando QR con logo:', e);
      alert('Error al generar el QR');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Panel Administrador</h1>

      {fichas.length === 0 ? (
        <p className="text-center text-gray-600">Cargando fichas...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fichas.map((ficha) => (
            <div key={ficha.id} className="bg-white shadow rounded-xl p-4 border border-gray-200">
              <p className="font-semibold text-lg mb-2">{ficha.nombre || 'Sin nombre'}</p>
              <p className="text-sm text-gray-600 mb-2">Tipo: {ficha.coleccion.replace('fichas_', '')}</p>
              <button
                onClick={() => generateQRConLogo(ficha.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Generar QR
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanelAdm;
