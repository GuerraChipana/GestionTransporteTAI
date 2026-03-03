import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, Users } from "lucide-react";
import { listarUsuarios } from "../../services/usuarioService";
import ModalUsuario from "../../features/usuarios/ModalUsuario";
import ModalEstadoUsuario from "../../features/usuarios/ModalEstadoUsuario";

// Importamos nuestros componentes reutilizables
import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE TABLA (Busqueda, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Control de Modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalStatusOpen, setModalStatusOpen] = useState(false);
  const [usuarioSeleccionadoId, setUsuarioSeleccionadoId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      // El toast rojo de error de red lo lanza el main.jsx
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Resetear a la página 1 si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (Solo DNI + Estado) ---
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideBusqueda = u.dni?.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ? true :
        filtroEstado === "activos" ? u.estado === 1 :
          u.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina) || 1;

  const handleAbrirModal = (id = null) => {
    setUsuarioSeleccionadoId(id);
    setModalFormOpen(true);
  };

  const handleAbrirEstado = (id) => {
    setUsuarioSeleccionadoId(id);
    setModalStatusOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100 overflow-hidden">

      <TableToolbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onAdd={() => handleAbrirModal()}
        addLabel="Nuevo Usuario"
        searchPlaceholder="Buscar por DNI..."
      />

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">N°</th>
              <th className="p-4 font-semibold border-b">DNI</th>
              <th className="p-4 font-semibold border-b">Usuario</th>
              <th className="p-4 font-semibold border-b">Nombre Completo</th>
              <th className="p-4 font-semibold border-b">Correo</th>
              <th className="p-4 font-semibold border-b">Rol</th>
              <th className="p-4 font-semibold border-b text-center">Estado</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando usuarios...</p>
                  </div>
                </td>
              </tr>
            ) : usuariosPaginados.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron resultados</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Mapeamos usuariosPaginados
              usuariosPaginados.map((u, index) => (
                <tr key={u.id_user} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {indicePrimerRegistro + index + 1}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800 font-mono">{u.dni}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{u.usuario}</td>
                  <td className="p-4 text-sm text-slate-700">{`${u.nombre} ${u.ap_paterno} ${u.ap_materno}`}</td>
                  <td className="p-4 text-sm text-slate-500">{u.correo}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border border-blue-100">
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${u.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {u.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleAbrirModal(u.id_user)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleAbrirEstado(u.id_user)}
                      className={`p-2 rounded-lg transition-colors ${u.estado === 1 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`} title="Cambiar Estado">
                      {u.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Uso de nuestro componente reutilizable de Paginación */}
      {!loading && (
        <TablePagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={usuariosFiltrados.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* Modales */}
      {modalFormOpen && (
        <ModalUsuario
          isOpen={modalFormOpen}
          onClose={() => setModalFormOpen(false)}
          usuarioId={usuarioSeleccionadoId}
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