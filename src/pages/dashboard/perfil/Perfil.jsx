import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTokenData } from '../../../utils/tokenUtils';
import { Key } from 'lucide-react';

export default function Perfil() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = getTokenData();
    if (data) {
      setUserData(data);
    }
  }, []);

  const getInitials = () => {
    if (!userData) return 'U';
    const firstInitial = userData.nombre ? userData.nombre.charAt(0) : '';
    const lastInitial = userData.apellidos ? userData.apellidos.charAt(0) : '';
    if (!firstInitial && !lastInitial) return userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Título de la sección */}
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Mi Perfil</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Columna Izquierda: Avatar y Foto */}
          <div className="flex flex-col items-center md:w-1/4">
            {/* Avatar Grande */}
            <div className="w-40 h-40 rounded-full bg-slate-800 text-white flex items-center justify-center text-5xl font-bold shadow-md mb-4">
              {getInitials()}
            </div>
            {/* Botón Actualizar Foto (Visual) */}
            {/* <button className="w-full border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Actualizar foto
            </button> */}
          </div>

          {/* Columna Derecha: Datos Estructurados */}
          <div className="md:w-3/4 flex flex-col justify-center">
            
            {/* Nombre como Título */}
            <h3 className="text-3xl font-bold text-slate-800 mb-6">
              {userData.nombre} {userData.apellidos}
            </h3>

            {/* Tabla de Datos (Estilo UTP Referencia) */}
            <div className="border border-gray-300 rounded-lg overflow-hidden text-sm md:text-base">
              
              <div className="flex flex-col sm:flex-row border-b border-gray-300 hover:bg-slate-50 transition-colors">
                <div className="sm:w-1/3 bg-slate-50 sm:bg-transparent px-4 py-3 font-bold text-slate-700">Nombre de Usuario</div>
                <div className="sm:w-2/3 px-4 py-3 text-slate-600">{userData.name}</div>
              </div>

              <div className="flex flex-col sm:flex-row border-b border-gray-300 hover:bg-slate-50 transition-colors">
                <div className="sm:w-1/3 bg-slate-50 sm:bg-transparent px-4 py-3 font-bold text-slate-700">Correo Electrónico</div>
                <div className="sm:w-2/3 px-4 py-3 text-slate-600">{userData.email}</div>
              </div>

              <div className="flex flex-col sm:flex-row border-b border-gray-300 hover:bg-slate-50 transition-colors">
                <div className="sm:w-1/3 bg-slate-50 sm:bg-transparent px-4 py-3 font-bold text-slate-700">Nivel de Acceso</div>
                <div className="sm:w-2/3 px-4 py-3 text-slate-600 capitalize">{userData.role}</div>
              </div>

              <div className="flex flex-col sm:flex-row border-b border-gray-300 hover:bg-slate-50 transition-colors">
                <div className="sm:w-1/3 bg-slate-50 sm:bg-transparent px-4 py-3 font-bold text-slate-700">Entidad</div>
                <div className="sm:w-2/3 px-4 py-3 text-slate-600">Municipalidad Distrital TAI</div>
              </div>

              <div className="flex flex-col sm:flex-row hover:bg-slate-50 transition-colors">
                <div className="sm:w-1/3 bg-slate-50 sm:bg-transparent px-4 py-3 font-bold text-slate-700">Sede</div>
                <div className="sm:w-2/3 px-4 py-3 text-slate-600">Pisco, Ica</div>
              </div>

            </div>

            {/* Sección de Seguridad integrada abajo */}
            <div className="mt-8 flex items-center justify-between p-4 bg-slate-800 rounded-lg text-white">
              <div>
                <p className="font-bold">Seguridad de la Cuenta</p>
                <p className="text-sm text-slate-300">Modifica tu contraseña de acceso al panel</p>
              </div>
              <Link
                to="/dashboard/cambiar-password"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                <Key size={16} />
                Cambiar Contraseña
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}