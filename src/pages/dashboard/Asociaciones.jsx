import { useState, useEffect } from "react";
import { Search, Plus, Edit, Power, PowerOff, Building2 } from "lucide-react";
import { listarAsociaciones, cambiarEstadoAsociacion } from "../../services/asociacionService";
import ModalAsociacion from "../../features/asocicaciones/ModalAsociacion.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

export default function Asociaciones() {
  const [asociaciones, setAsociaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Estados de modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

  // Selección de registro
  const [asociacionSeleccionada, setAsociacionSeleccionada] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarAsociaciones = async () => {
    try {
      setLoading(true);
      const data = await listarAsociaciones();
      setAsociaciones(data);
    } catch (error) {
      console.error("Error al cargar asociaciones", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsociaciones();
  }, []);

  // Filtramos por nombre o documento
  const asociacionesFiltradas = asociaciones.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  // --- HANDLERS MODALES ---
  const handleOpenCrear = () => {
    setAsociacionSeleccionada(null);
    setModalFormOpen(true);
  };

  const handleOpenEditar = (id) => {
    setAsociacionSeleccionada(id);
    setModalFormOpen(true);
  };

  const handleOpenEstado = (asoc) => {
    setAsociacionSeleccionada(asoc);
    setModalEstadoOpen(true);
  };

  // --- HANDLER CAMBIO DE ESTADO ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      // datosEstado = { estado: 1|0, detalle_baja: "..." }
      await cambiarEstadoAsociacion(asociacionSeleccionada.idAsoci, datosEstado);
      setModalEstadoOpen(false);
      cargarAsociaciones();
    } catch (error) {
      alert("Error al cambiar estado: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingEstado(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100">

      {/* Cabecera y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 shadow-sm"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button
          onClick={handleOpenCrear}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
        >
          <Plus size={20} />
          <span className="font-medium">Nueva Asociación</span>
        </button>
      </div>

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">N°</th>
              <th className="p-4 font-semibold border-b">Nombre de Asociación</th>
              <th className="p-4 font-semibold border-b">Documento</th>
              <th className="p-4 font-semibold border-b text-center">Estado</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando asociaciones...</p>
                  </div>
                </td>
              </tr>
            ) : asociacionesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron resultados</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda.</p>
                  </div>
                </td>
              </tr>
            ) : (
              asociacionesFiltradas.map((a) => (
                <tr key={a.idAsoci} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-600">{a.idAsoci}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{a.nombre}</td>
                  <td className="p-4 text-sm text-slate-600 font-mono bg-slate-50/50 rounded-md inline-block mt-2 ml-4 px-2 py-1 border border-slate-100">
                    {a.documento}
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${a.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      }`}>
                      {a.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenEditar(a.idAsoci)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEstado(a)}
                      className={`p-2 rounded-lg transition-colors ${a.estado === 1
                        ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                      title="Cambiar Estado"
                    >
                      {a.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALES INTEGRADOS */}
      <ModalAsociacion
        isOpen={modalFormOpen}
        onClose={() => setModalFormOpen(false)}
        asociacionId={asociacionSeleccionada}
        onSuccess={cargarAsociaciones}
      />

      {asociacionSeleccionada && typeof asociacionSeleccionada === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de Asociación"
          entidadNombre={asociacionSeleccionada.nombre}
          estadoActual={asociacionSeleccionada.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}