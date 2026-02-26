import { useState, useEffect } from "react";
import { Search, Plus, Edit, User, Power, PowerOff, Eye } from "lucide-react";
import { listarPersonas, cambiarEstadoPersona } from "../../services/personaService";
import ModalPersona from "../../features/personas/ModalPersona.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado";
import ModalVerPersona from "../../features/personas/ModalVerPersona.jsx";

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);

  // Estados para los modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Selección de registro
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const handleOpenVer = (persona) => {
    setPersonaSeleccionada(persona);
    setModalVerOpen(true);
  };

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      const data = await listarPersonas();
      setPersonas(data);
    } catch (error) {
      console.error("Error al cargar personas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  const personasFiltradas = personas.filter((p) =>
    p.dni.includes(busqueda)
  );

  // --- HANDLERS PARA ABRIR MODALES ---
  const handleOpenCrear = () => {
    setPersonaSeleccionada(null); // null significa que vamos a Crear
    setModalFormOpen(true);
  };

  const handleOpenEditar = (id) => {
    setPersonaSeleccionada(id); // Pasamos el ID para Editar
    setModalFormOpen(true);
  };

  const handleOpenEstado = (persona) => {
    setPersonaSeleccionada(persona); // Pasamos todo el objeto para tener su estado actual y nombre
    setModalEstadoOpen(true);
  };

  // --- HANDLER PARA PROCESAR EL CAMBIO DE ESTADO ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      // datosEstado ya viene formateado desde ModalCambioEstado: { estado: 1|0, detalle_baja: "..." }
      await cambiarEstadoPersona(personaSeleccionada.idPers, datosEstado);
      setModalEstadoOpen(false);
      cargarPersonas(); // Recargamos la tabla
    } catch (error) {
      alert("Error al cambiar estado: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingEstado(false);
    }
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
          onClick={handleOpenCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Nueva Persona</span>
        </button>
      </div>

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">N°</th>
              <th className="p-4 font-semibold border-b">DNI</th>
              <th className="p-4 font-semibold border-b">Nombre Completo</th>
              <th className="p-4 font-semibold border-b">Email</th>
              <th className="p-4 font-semibold border-b">Foto</th>
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
            ) : personasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No hay personas registradas que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              personasFiltradas.map((p) => (
                <tr key={p.idPers} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4 text-sm text-gray-700">{p.idPers}</td>
                  <td className="p-4 text-sm font-medium text-gray-900">{p.dni}</td>
                  <td className="p-4 text-sm text-gray-700">{p.nombre} {p.ap_paterno} {p.ap_materno}</td>
                  <td className="p-4 text-sm text-gray-500">{p.correo}</td>
                  <td className="p-4">
                    {p.foto ? (
                      <img
                        src={p.foto}
                        alt="Foto de perfil"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentElement.querySelector(".fallback-icon").style.display = "flex";
                        }}
                      />
                    ) : null}

                    {/* Fallback */}
                    <div
                      className={`w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center ${p.foto ? "fallback-icon hidden" : ""
                        }`}
                    >
                      <User className="text-gray-400" size={18} />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                      {p.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenVer(p)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Ver Detalles">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditar(p.idPers)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEstado(p)}
                      className={`p-2 rounded-lg ${p.estado === 1 ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`} title="Cambiar Estado">
                      {p.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALES INTEGRADOS */}
      <ModalPersona
        isOpen={modalFormOpen}
        onClose={() => setModalFormOpen(false)}
        personaId={personaSeleccionada}
        onSuccess={cargarPersonas}
      />

      {personaSeleccionada && typeof personaSeleccionada === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de Persona"
          entidadNombre={`${personaSeleccionada.nombre} ${personaSeleccionada.ap_paterno}`}
          estadoActual={personaSeleccionada.estado}
          isLoading={loadingEstado}
        />
      )}

      <ModalVerPersona
        isOpen={modalVerOpen}
        onClose={() => setModalVerOpen(false)}
        persona={personaSeleccionada}
      />
    </div>
  );
}