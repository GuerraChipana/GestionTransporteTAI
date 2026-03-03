import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, Eye, ClipboardList } from "lucide-react";
import { listarEmpadronamientos, cambiarEstadoEmpadronamiento } from "../../services/empadronamientoService";
import ModalEmpadronamiento from "../../features/empadronamientos/ModalEmpadronamiento.jsx";
import ModalVerEmpadronamiento from "../../features/empadronamientos/ModalVerEmpadronamiento.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

// Importamos nuestros componentes reutilizables
import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

// 1. Importamos la librería de notificaciones
import { toast } from "sonner";

export default function Empadronamientos() {
  const [empadronamientos, setEmpadronamientos] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE TABLA (Búsqueda unificada, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

  const [empaSeleccionado, setEmpaSeleccionado] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarEmpadronamientos = async () => {
    try {
      setLoading(true);
      const data = await listarEmpadronamientos();
      setEmpadronamientos(data);
    } catch (error) {
      console.error("Error al cargar empadronamientos", error);
      toast.error("Error al cargar la lista de empadronamientos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpadronamientos();
  }, []);

  // Resetear a la página 1 si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (Búsqueda inteligente en Placa O Padrón + Estado) ---
  const empadronamientosFiltrados = empadronamientos.filter((e) => {
    const textoBusqueda = busqueda.toLowerCase();

    // Busca coincidencias en Placa o en Número de Padrón
    const placaMatch = e.vehiculo?.placa?.toLowerCase().includes(textoBusqueda);
    const padronMatch = String(e.numEmpadronamiento).toLowerCase().includes(textoBusqueda);
    const coincideBusqueda = placaMatch || padronMatch;

    // Filtro por estado
    const coincideEstado =
      filtroEstado === "todos" ? true :
        filtroEstado === "activos" ? e.estado === 1 :
          e.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const empadronamientosPaginados = empadronamientosFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(empadronamientosFiltrados.length / registrosPorPagina) || 1;

  // --- HANDLERS MODALES ---
  const handleOpenCrear = () => { setEmpaSeleccionado(null); setModalFormOpen(true); };
  const handleOpenEditar = (id) => { setEmpaSeleccionado(id); setModalFormOpen(true); };
  const handleOpenVer = (empa) => { setEmpaSeleccionado(empa); setModalVerOpen(true); };
  const handleOpenEstado = (empa) => { setEmpaSeleccionado(empa); setModalEstadoOpen(true); };

  // --- FUNCIÓN MODIFICADA CON SONNER ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoEmpadronamiento(empaSeleccionado.idEmpa, datosEstado);

      setModalEstadoOpen(false);
      cargarEmpadronamientos();

      const accion = datosEstado.estado === 1 ? "activado" : "dado de baja";
      toast.success(`Empadronamiento ${accion} correctamente.`);

    } catch (error) {
      // ¡SOLO CIERRAS EL MODAL! 
      // El main.jsx ya se encargó de mostrar el toast rojo en la esquina.
      setModalEstadoOpen(false);

    } finally {
      setLoadingEstado(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100">

      {/* Uso de nuestro componente reutilizable de cabecera */}
      <TableToolbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onAdd={handleOpenCrear}
        addLabel="Nuevo Empadronamiento"
        searchPlaceholder="Buscar por Placa o N° Padrón..."
      />

      {/* Tabla de Resultados */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b w-24">N° Padrón</th>
              <th className="p-4 font-semibold border-b">Placa Vehículo</th>
              <th className="p-4 font-semibold border-b">Asociación</th>
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
                    <p className="font-medium">Cargando Padrones...</p>
                  </div>
                </td>
              </tr>
            ) : empadronamientosPaginados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ClipboardList size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron padrones</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o ajusta los filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Mapeamos los datos paginados
              empadronamientosPaginados.map((e) => (
                <tr key={e.idEmpa} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-800 font-mono text-lg">
                    {e.numEmpadronamiento}
                  </td>
                  <td className="p-4 text-sm">
                    <span className="font-mono bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-bold uppercase tracking-wider">
                      {e.vehiculo?.placa || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700 max-w-[200px] truncate" title={e.asociacion?.nombre}>
                    {e.asociacion?.nombre || "N/A"}
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${e.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {e.estado === 1 ? "Activo" : "Baja"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenVer(e)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Ver Detalles">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleOpenEditar(e.idEmpa)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleOpenEstado(e)}
                      className={`p-2 rounded-lg transition-colors ${e.estado === 1 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`} title="Cambiar Estado">
                      {e.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
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
          totalRegistros={empadronamientosFiltrados.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* MODALES */}
      <ModalEmpadronamiento isOpen={modalFormOpen} onClose={() => setModalFormOpen(false)} empadronamientoId={empaSeleccionado} onSuccess={cargarEmpadronamientos} />
      <ModalVerEmpadronamiento isOpen={modalVerOpen} onClose={() => setModalVerOpen(false)} empadronamiento={empaSeleccionado} />

      {empaSeleccionado && typeof empaSeleccionado === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de Padrón"
          entidadNombre={`Padrón N° ${empaSeleccionado.numEmpadronamiento}`}
          estadoActual={empaSeleccionado.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}