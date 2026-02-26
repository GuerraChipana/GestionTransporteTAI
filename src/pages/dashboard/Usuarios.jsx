import { useState, useEffect } from "react";
import { Search, Plus, Edit, PowerOff, ShieldAlert } from "lucide-react";
import { listarUsuarios } from "../../services/usuarioService";
import ModalUsuario from "../../features/usuarios/ModalUsuario";
import ModalEstadoUsuario from "../../features/usuarios/ModalEstadoUsuario";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorGlobal, setErrorGlobal] = useState(null);

  // Control de Modales (Guardamos el ID en lugar del objeto completo)
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalStatusOpen, setModalStatusOpen] = useState(false);
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setErrorGlobal(null);
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      setErrorGlobal("No se pudieron cargar los usuarios. Verifica tu conexión.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.dni.includes(busqueda)
    // u.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    // u.ap_paterno?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAbrirModal = (id = null) => {
    setUsuarioSeleccionadoId(id);
    setModalFormOpen(true);
  };

  const handleAbrirEstado = (id) => {
    setUsuarioSeleccionadoId(id);
    setModalStatusOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      {/* Cabecera y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por DNI"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 shadow-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleAbrirModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Manejo de Error Global */}
      {errorGlobal && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <ShieldAlert size={20} />
          <p>{errorGlobal}</p>
        </div>
      )}

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">DNI</th>
              <th className="p-4 font-semibold border-b">Usuario</th>
              <th className="p-4 font-semibold border-b">Apellido Paterno</th>
              <th className="p-4 font-semibold border-b">Correo</th>
              <th className="p-4 font-semibold border-b">Rol</th>
              <th className="p-4 font-semibold border-b text-center">Estado</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Cargando datos...</p>
                  </div>
                </td>
              </tr>
            ) : usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">No hay usuarios registrados que coincidan con la búsqueda.</td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id_user} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-700">{u.dni}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{u.usuario}</td>
                  <td className="p-4 text-sm text-gray-700">{u.ap_paterno}</td>
                  <td className="p-4 text-sm text-gray-500">{u.correo}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide">
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {u.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleAbrirModal(u.id_user)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleAbrirEstado(u.id_user)} className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition" title="Cambiar Estado">
                      <PowerOff size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {modalFormOpen && (
        <ModalUsuario
          isOpen={modalFormOpen}
          onClose={() => setModalFormOpen(false)}
          usuarioId={usuarioSeleccionadoId} // Pasamos solo el ID
          onSuccess={cargarUsuarios}
        />
      )}

      {modalStatusOpen && (
        <ModalEstadoUsuario
          isOpen={modalStatusOpen}
          onClose={() => setModalStatusOpen(false)}
          usuarioId={usuarioSeleccionadoId}
          onSuccess={cargarUsuarios}
        />
      )}
    </div>
  );
}