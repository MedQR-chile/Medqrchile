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
  const [fichasIndividuales, setFichasIndividuales] = useState([]);
  const [fichasFamiliares, setFichasFamiliares] = useState([]);
  const [fichasInstitucionales, setFichasInstitucionales] = useState([]);
  const qrRefs = useRef({});

  useEffect(() => {
    if (!user || user.email !== 'tucorreo@admin.cl') {
      navigate('/');
    }

    const fetchFichas = async () => {
      const fichasInd = await getDocs(collection(db, 'fichasIndividuales'));
      const fichasFam = await getDocs(collection(db, 'fichasFamiliares'));
      const fichasInst = await getDocs(collection(db, 'fichasInstitucionales'));

      setFichasIndividuales(fichasInd.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFichasFamiliares(fichasFam.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFichasInstitucionales(fichasInst.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchFichas();
  }, [user, navigate]);

  const handleDownloadQR = (id, tipo) => {
    const canvas = qrRefs.current[`${tipo}-${id}`];
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_${tipo}_${id}.png`;
    link.click();
  };

  const renderFichaQR = (ficha, tipo) => (
    <div key={ficha.id} style={{ margin: '20px', border: '1px solid gray', padding: '10px' }}>
      <h3>{ficha.nombre}</h3>
      <QRCode
        value={`${window.location.origin}/ver-ficha-${tipo}/${ficha.id}`}
        size={150}
        ref={(ref) => {
          if (ref) {
            qrRefs.current[`${tipo}-${ficha.id}`] = ref.canvas;
          }
        }}
        includeMargin
      />
      <br />
      <button onClick={() => handleDownloadQR(ficha.id, tipo)}>Descargar QR</button>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel de Administrador</h2>
      
      <h3>Fichas Individuales</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {fichasIndividuales.map(ficha => renderFichaQR(ficha, 'individual'))}
      </div>

      <h3>Fichas Familiares</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {fichasFamiliares.map(ficha => renderFichaQR(ficha, 'familiar'))}
      </div>

      <h3>Fichas Institucionales</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {fichasInstitucionales.map(ficha => renderFichaQR(ficha, 'institucional'))}
      </div>
    </div>
  );
}

export default AdminPanel;


    
