import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Perfil from '../pages/dashboard/perfil/Perfil';
import Password from '../pages/dashboard/perfil/Password';
import Usuarios from '../pages/dashboard/Usuarios';
import Personas from '../pages/dashboard/Personas';
import Empadronamientos from '../pages/dashboard/Empadronamientos';
import Asociaciones from '../pages/dashboard/Asociaciones';
import Tucs from '../pages/dashboard/Tucs';
import Aseguradoras from '../pages/dashboard/Aseguradoras.jsx';
import Vehiculos from '../pages/dashboard/Vehiculos';
import VehiculosSeguros from '../pages/dashboard/VehiculosSeguros';
import Conductores from '../pages/dashboard/Conductores.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import Inicio from '../pages/Inicio.jsx';
import InicioPrincipal from '../pages/InicioPrincipal.jsx';
import PrivateRoute from './PrivateRoute';
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* === RUTA INICIO === */}
        <Route path="/" element={<InicioPrincipal />} />

        {/* === LOGIN === */}
        <Route path="/administracion-login" element={<LoginPage />} />

        {/* === RUTAS PRIVADAS === */}
        {/* Envolvemos el Layout para exigir que estén logueados */}
        <Route
          path="/dashboard" element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Inicio />} />

          {/* RUTA PROTEGIDA POR ROLES */}
          <Route
            path="usuarios"
            element={
              <PrivateRoute allowedRoles={['SUPERADMINISTRADOR', 'ADMINISTRADOR']}>
                <Usuarios />
              </PrivateRoute>
            }
          />

          {/* DEMÁS RUTAS (Solo requieren estar logueado) */}
          <Route path="perfil" element={<Perfil />} />
          <Route path="cambiar-password" element={<Password />} />
          <Route path="personas" element={<Personas />} />
          <Route path="empadronamientos" element={<Empadronamientos />} />
          <Route path="asociaciones" element={<Asociaciones />} />
          <Route path="tucs" element={<Tucs />} />
          <Route path="aseguradoras" element={<Aseguradoras />} />
          <Route path="vehiculos-seguros" element={<VehiculosSeguros />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="conductores" element={<Conductores />} />
        </Route>

        {/* === RUTA NO EXISTE → REDIRIGE AL INICIO === */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}