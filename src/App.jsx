// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Menu from './pages/Menu';

import ProtectedRoute from './components/ProtectedRoute';

import Individual from './pages/Individual';
import Familiar from './pages/Familiar';
import Institucional from './pages/Institucional';

import SubMenu from './pages/submenu';
import VerFichaIndividual from './pages/VerFichaIndividual';
import EditarFichaIndividual from './pages/EditarFichaIndividual';

import ListarFichasFamiliares from './pages/ListarFichasFamiliares';
import VerFichaFamiliar from './pages/verfichafamiliar';
import EditarFichaFamiliar from './pages/editarfichafamiliar';

import ListarFichasInstitucionales from './pages/listarfichasinstitucionales';
import VerFichaInstitucional from './pages/verfichainstitucional';
import EditarFichaInstitucional from './pages/editarfichainstitucional';

import AdminPanel from './pages/adminpanel';

function App() {
  return (
    <Router>
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Menú principal protegido */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        {/* Submenú dinámico */}
        <Route
          path="/submenu/:tipo"
          element={
            <ProtectedRoute>
              <SubMenu />
            </ProtectedRoute>
          }
        />

        {/* Ficha Individual */}
        <Route
          path="/individual"
          element={
            <ProtectedRoute>
              <Individual />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listar-fichas-individual"
          element={
            <ProtectedRoute>
              <EditarFichaIndividual />
            </ProtectedRoute>
          }
        />

        {/* RUTA PÚBLICA: Ver ficha individual sin login */}
        <Route
          path="/ver-ficha-individual/:id"
          element={<VerFichaIndividual />}
        />

        {/* Fichas Familiares */}
        <Route
          path="/familiar"
          element={
            <ProtectedRoute>
              <Familiar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listar-fichas-familiar"
          element={
            <ProtectedRoute>
              <ListarFichasFamiliares />
            </ProtectedRoute>
          }
        />

        {/* RUTA PÚBLICA: Ver ficha familiar sin login */}
        <Route
          path="/ver-ficha-familiar/:id"
          element={<VerFichaFamiliar />}
        />
        <Route
          path="/editar-ficha-familiar/:id"
          element={
            <ProtectedRoute>
              <EditarFichaFamiliar />
            </ProtectedRoute>
          }
        />

        {/* Fichas Institucionales */}
        <Route
          path="/institucional"
          element={
            <ProtectedRoute>
              <Institucional />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listar-fichas-institucional"
          element={
            <ProtectedRoute>
              <ListarFichasInstitucionales />
            </ProtectedRoute>
          }
        />

        {/* RUTA PÚBLICA: Ver ficha institucional sin login */}
        <Route
          path="/ver-ficha-institucional/:id"
          element={<VerFichaInstitucional />}
        />
        <Route
          path="/editar-ficha-institucional/:id"
          element={
            <ProtectedRoute>
              <EditarFichaInstitucional />
            </ProtectedRoute>
          }
        />

        {/* Panel de administrador */}
        <Route
          path="/adminpanel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

