import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/Logo.png';

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

  const generateQRConLogo = async (ficha) => {
    try {
      let tipoRuta = '';
      if (ficha.coleccion === 'fichas_individuales') tipoRuta = 'ver-ficha-individual';
      if (ficha.coleccion === 'fichas_familiares') tipoRuta = 'ver-ficha-familiar';
      if (ficha.coleccion === 'fichas_institucionales') tipoRuta = 'ver-ficha-institucional';

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

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#00bfa5] mb-10">Panel de Administrador</h1>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition"
          >
            ← Volver atrás
          </button>
        </div>

        {fichas.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Cargando fichas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fichas.map((ficha) => (
              <div
                key={ficha.id}
                className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-xl transition"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {ficha.nombre || 'Sin nombre'}
                  </h2>
                  <p className="text-gray-600 text-sm capitalize">
                    Tipo: {ficha.coleccion.replace('fichas_', '').replace('_', ' ')}
                  </p>
                </div>

                <button
                  onClick={() => generateQRConLogo(ficha)}
                  className="w-full bg-[#00bfa5] text-white font-medium py-2 rounded-xl hover:bg-[#009e88] transition"
                >
                  Generar y Descargar QR
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdm;


