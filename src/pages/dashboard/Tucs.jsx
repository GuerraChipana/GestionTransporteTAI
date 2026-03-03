import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, Eye, CreditCard } from "lucide-react";
import { listarTucs, cambiarEstadoTuc } from "../../services/tucService";
import ModalTuc from "../../features/tucs/ModalTuc.jsx";
import ModalVerTuc from "../../features/tucs/ModalVerTuc.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

// Importamos nuestros componentes reutilizables
import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

export default function Tucs() {
  const [tucs, setTucs] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE TABLA (Busqueda, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estados modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

  const [tucSeleccionado, setTucSeleccionado] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarTucs = async () => {
    try {
      setLoading(true);
      const data = await listarTucs();
      setTucs(data);
    } catch (error) {
      console.error("Error al cargar TUCs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTucs();
  }, []);

  // Resetear a la página 1 si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (N° TUC o Placa + Estado) ---
  const tucsFiltrados = tucs.filter((t) => {
    const term = busqueda.toLowerCase();
    const numTuc = String(t.numTuc).toLowerCase();
    const placa = t.empadronamiento?.vehiculo?.placa?.toLowerCase() || "";

    // Búsqueda inteligente
    const coincideBusqueda = numTuc.includes(term) || placa.includes(term);

    // Filtro por estado
    const coincideEstado =
      filtroEstado === "todos" ? true :
        filtroEstado === "activos" ? t.estado === 1 :
          t.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const tucsPaginados = tucsFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(tucsFiltrados.length / registrosPorPagina) || 1;

  // Handlers
  const handleOpenCrear = () => { setTucSeleccionado(null); setModalFormOpen(true); };
  const handleOpenEditar = (id) => { setTucSeleccionado(id); setModalFormOpen(true); };
  const handleOpenVer = (tuc) => { setTucSeleccionado(tuc); setModalVerOpen(true); };
  const handleOpenEstado = (tuc) => { setTucSeleccionado(tuc); setModalEstadoOpen(true); };

  // --- HANDLER CAMBIO DE ESTADO ACTUALIZADO ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoTuc(tucSeleccionado.idTuc, datosEstado);
      setModalEstadoOpen(false);
      cargarTucs();

      const accion = datosEstado.estado === 1 ? "activada" : "dada de baja";
      toast.success(`TUC ${accion} exitosamente.`);
    } catch (error) {
      setModalEstadoOpen(false); // El interceptor maneja el error visual
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
        addLabel="Emitir TUC"
        searchPlaceholder="Buscar por N° TUC o Placa..."
      />

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">N° TUC</th>
              <th className="p-4 font-semibold border-b">Año</th>
              <th className="p-4 font-semibold border-b">Placa Vehículo</th>
              <th className="p-4 font-semibold border-b">Vencimiento</th>
              <th className="p-4 font-semibold border-b text-center">Vigencia</th>
              <th className="p-4 font-semibold border-b text-center">Estado</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando Tarjetas TUC...</p>
                  </div>
                </td>
              </tr>
            ) : tucsPaginados.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <CreditCard size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron TUCs</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Mapeamos los datos paginados
              tucsPaginados.map((t) => (
                <tr key={t.idTuc} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-800 font-mono text-lg">{t.numTuc}</td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{t.anoTuc}</td>
                  <td className="p-4 text-sm">
                    <span className="font-mono bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-bold uppercase tracking-wider">
                      {t.empadronamiento?.vehiculo?.placa || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{t.fechaHasta}</td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${t.estadoVigencia === "No Vencido"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}>
                      {t.estadoVigencia}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${t.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {t.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenVer(t)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Ver Detalles">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleOpenEditar(t.idTuc)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleOpenEstado(t)}
                      className={`p-2 rounded-lg transition-colors ${t.estado === 1 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`} title="Cambiar Estado">
                      {t.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
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
          totalRegistros={tucsFiltrados.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* MODALES */}
      <ModalTuc isOpen={modalFormOpen} onClose={() => setModalFormOpen(false)} tucId={tucSeleccionado} onSuccess={cargarTucs} />
      <ModalVerTuc isOpen={modalVerOpen} onClose={() => setModalVerOpen(false)} tuc={tucSeleccionado} />

      {tucSeleccionado && typeof tucSeleccionado === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de TUC"
          entidadNombre={`TUC N° ${tucSeleccionado.numTuc}`}
          estadoActual={tucSeleccionado.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}