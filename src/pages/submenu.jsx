// src/pages/SubMenu.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlusCircle, FaEdit, FaEye, FaArrowLeft } from 'react-icons/fa';
import '../index.css'; // asegúrate de importar aquí

function SubMenu() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);

  const manejarNavegacion = (accion) => {
    if (accion === 'crear') {
      navigate(`/${tipo}`);
    } else if (accion === 'editar') {
      navigate(`/listar-fichas-${tipo}`);
    } else if (accion === 'ver') {
      if (tipo === 'individual') {
        navigate('/ver-ficha-individual');
      } else if (tipo === 'familiar') {
        navigate('/listar-fichas-familiar');
      } else if (tipo === 'institucional') {
        navigate('/listar-fichas-institucional');
      }
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '30px',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div className="submenu-container">
      <h2>Menú {tipoCapitalizado}</h2>

      <button
        className="submenu-btn"
        onClick={() => manejarNavegacion('crear')}
      >
        <FaPlusCircle className="submenu-icon" />
        Crear ficha
      </button>

      <button
        className="submenu-btn"
        onClick={() => manejarNavegacion('editar')}
      >
        <FaEdit className="submenu-icon" />
        Editar ficha
      </button>

      <button
        className="submenu-btn"
        onClick={() => manejarNavegacion('ver')}
      >
        <FaEye className="submenu-icon" />
        Ver ficha
      </button>

      <button
        style={botonVolverStyle}
        onClick={() => navigate(-1)}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#009e88'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00bfa5'}
      >
        <FaArrowLeft />
        Volver atrás
      </button>
    </div>
  );
}

export default SubMenu;
