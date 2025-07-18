// src/pages/adminpanel.jsx
import React, { useRef } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';  // Ajusta si tu archivo firebase.js está en otra carpeta
import { QRCodeCanvas } from 'qrcode.react'; // Importamos solo toCanvas para generar QR
import { useAuth } from './AuthContext';  // Ajusta según donde tengas AuthContext.js
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';

function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fichasIndividuales, setFichasIndividuales] = useState([]);
  const [fichasFamiliares, setFichasFamiliares] = useState([]);
  const [fichasInstitucionales, setFichasInstitucionales] = useState([]);
  const [urlQR, setUrlQR] = useState('');
  const [qrKey, setQrKey] = useState('');
  const qrRef = useRef();

  const adminEmail = 'medqrchile@gmail.com';

  useEffect(() => {
    if (!user || user.email !== adminEmail) {
      navigate('/');
    } else {
      obtenerFichas();
    }
  }, [user]);

  const obtenerFichas = async () => {
    try {
      const [snapIndividual, snapFamiliar, snapInstitucional] = await Promise.all([
        getDocs(collection(db, 'fichas_individuales')),
        getDocs(collection(db, 'fichas_familiares')),
        getDocs(collection(db, 'fichas_institucionales')),
      ]);

      setFichasIndividuales(snapIndividual.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'fichas_individuales' })));
      setFichasFamiliares(snapFamiliar.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'fichas_familiares' })));
      setFichasInstitucionales(snapInstitucional.docs.map(doc => ({ id: doc.id, ...doc.data(), tipo: 'fichas_institucionales' })));
    } catch (error) {
      console.error('Error al obtener fichas:', error);
    }
  };

  const generarQR = (id, tipo) => {
    const url = `${window.location.origin}/verpublica/${id}?tipo=${tipo}`;
    setUrlQR(url);
    setQrKey(`${tipo}-${id}`);
  };

  const descargarQR = () => {
    if (!qrRef.current) return;
    htmlToImage.toPng(qrRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'codigo_qr.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error al descargar el QR:', error);
      });
  };

  const renderLista = (titulo, fichas) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">{titulo}</h2>
      {fichas.length === 0 ? (
        <p>No hay fichas registradas.</p>
      ) : (
        <ul className="space-y-2">
          {fichas.map(ficha => (
            <li key={ficha.id} className="border p-2 rounded flex justify-between items-center">
              <span>{ficha.nombre || 'Sin nombre'}</span>
              <button
                onClick={() => generarQR(ficha.id, ficha.tipo)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Generar QR
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>

      {renderLista('Fichas Individuales', fichasIndividuales)}
      {renderLista('Fichas Familiares', fichasFamiliares)}
      {renderLista('Fichas Institucionales', fichasInstitucionales)}

      {urlQR && (
        <div className="mt-10 text-center">
          <p className="mb-2 font-semibold">Código QR generado:</p>
          <div ref={qrRef} className="inline-block p-4 bg-white">
            <QRCodeCanvas value={urlQR} size={200} key={qrKey} />
          </div>
          <div className="mt-4">
            <button
              onClick={descargarQR}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Descargar QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
