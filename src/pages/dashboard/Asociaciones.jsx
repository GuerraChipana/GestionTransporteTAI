import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, Building2 } from "lucide-react";
import { listarAsociaciones, cambiarEstadoAsociacion } from "../../services/asociacionService";
import ModalAsociacion from "../../features/asocicaciones/ModalAsociacion.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

export default function Asociaciones() {
  const [asociaciones, setAsociaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA BÚSQUEDA, FILTROS Y PAGINACIÓN ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

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

  // --- RESETEAR PÁGINA SI CAMBIAN LOS FILTROS ---
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (Por Nombre, Documento y Estado) ---
  const asociacionesFiltradas = asociaciones.filter((a) => {
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda =
      a.nombre?.toLowerCase().includes(textoBusqueda) ||
      a.documento?.toLowerCase().includes(textoBusqueda);

    const coincideEstado =
      filtroEstado === "todos" ? true :
        filtroEstado === "activos" ? a.estado === 1 :
          a.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const asociacionesPaginadas = asociacionesFiltradas.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(asociacionesFiltradas.length / registrosPorPagina) || 1;

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

  // --- HANDLER CAMBIO DE ESTADO ACTUALIZADO ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoAsociacion(asociacionSeleccionada.idAsoci, datosEstado);

      setModalEstadoOpen(false);
      cargarAsociaciones();

      // Mensaje de éxito
      const accion = datosEstado.estado === 1 ? "activada" : "dada de baja";
      toast.success(`Asociación ${accion} exitosamente.`);

    } catch (error) {
      // El error lo maneja automáticamente main.jsx
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
        addLabel="Nueva Asociación"
        searchPlaceholder="Buscar asociación o documento..."
      />

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
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
            ) : asociacionesPaginadas.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron resultados</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              asociacionesPaginadas.map((a, index) => (
                <tr key={a.idAsoci} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {/* Número correlativo real */}
                    {indicePrimerRegistro + index + 1}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800">{a.nombre}</td>
                  <td className="p-4 text-sm text-slate-600">
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {a.documento}
                    </span>
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEstado(a)}
                      className={`p-2 rounded-lg transition-colors ${a.estado === 1 ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`} title="Cambiar Estado">
                      {a.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
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
          totalRegistros={asociacionesFiltradas.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

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