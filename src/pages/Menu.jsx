// src/pages/Menu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { FaUser, FaUsers, FaBuilding, FaTools } from 'react-icons/fa';
import logo from '../assets/Logo.png';

function Menu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const esAdmin = user?.email === 'medqrchile@gmail.com';

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <img src={logo} alt="MedQR Logo" className="logo" />
        <h1>¡Bienvenidos a MedQR Chile!</h1>
        <p className="subtitle">
          Registra tus datos médicos y llévalos siempre contigo con un solo QR.
        </p>

        <button className="btn" onClick={() => navigate('/submenu/individual')}>
          <FaUser className="btn-icon" />
          Ficha individual
        </button>

        <button className="btn" onClick={() => navigate('/submenu/familiar')}>
          <FaUsers className="btn-icon" />
          Ficha familiar
        </button>

        <button className="btn" onClick={() => navigate('/submenu/institucional')}>
          <FaBuilding className="btn-icon" />
          Ficha institucional
        </button>

        {esAdmin && (
          <button
            className="btn"
            style={{ marginTop: '24px', backgroundColor: '#ff9800' }}
            onClick={() => navigate('/adminpanel')}
          >
            <FaTools className="btn-icon" />
            Panel de Administración
          </button>
        )}

        <button
          className="btn"
          style={{ marginTop: esAdmin ? '16px' : '32px', backgroundColor: '#d32f2f' }}
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Pie de página */}
      <footer className="footer-contact">
        <p><strong>Contáctanos</strong></p>
        <p>
          📞 WhatsApp:{' '}
          <a href="https://wa.me/56999863217" target="_blank" rel="noopener noreferrer">
            +56 9 9986 3217
          </a>
        </p>
        <p>
          📷 Instagram:{' '}
          <a href="https://www.instagram.com/medqr_chile" target="_blank" rel="noopener noreferrer">
            @medqr_chile
          </a>
        </p>
        <p>
          📧 Correo:{' '}
          <a href="mailto:contacto@medqrchile.cl">
            contacto@medqrchile.cl
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Menu;
