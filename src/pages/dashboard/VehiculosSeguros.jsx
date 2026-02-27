import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, ShieldCheck, Eye } from "lucide-react";
import { listarVehiculosSeguros, cambiarEstadoVehiculoSeguro } from "../../services/vehiculoSeguroService";
import ModalVehiculoSeguro from "../../features/vehiculosSeguros/ModalVehiculoSeguro.jsx";
import ModalVerVehiculoSeguro from "../../features/vehiculosSeguros/ModalVerVehiculoSeguro.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

// Importamos nuestros componentes reutilizables
import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

export default function VehiculosSeguros() {
  const [seguros, setSeguros] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE TABLA (Busqueda, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

  const [seguroSeleccionado, setSeguroSeleccionado] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarSeguros = async () => {
    try {
      setLoading(true);
      const data = await listarVehiculosSeguros();
      setSeguros(data);
    } catch (error) {
      console.error("Error al cargar seguros", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSeguros();
  }, []);

  // Resetear a la página 1 si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (Póliza, Placa, Aseguradora + Estado) ---
  const segurosFiltrados = seguros.filter((s) => {
    const term = busqueda.toLowerCase();
    const poliza = s.numPoliza?.toLowerCase() || "";
    const placa = s.vehiculo?.placa?.toLowerCase() || "";
    const aseguradora = s.aseguradora?.aseguradora?.toLowerCase() || "";
    
    // Búsqueda en cualquiera de los 3 campos
    const coincideBusqueda = poliza.includes(term) || placa.includes(term) || aseguradora.includes(term);

    // Filtro por estado del registro (Activo/Baja)
    const coincideEstado = 
      filtroEstado === "todos" ? true : 
      filtroEstado === "activos" ? s.estado === 1 : 
      s.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const segurosPaginados = segurosFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(segurosFiltrados.length / registrosPorPagina) || 1;

  // Handlers
  const handleOpenCrear = () => { setSeguroSeleccionado(null); setModalFormOpen(true); };
  const handleOpenEditar = (id) => { setSeguroSeleccionado(id); setModalFormOpen(true); };
  const handleOpenVer = (seguro) => { setSeguroSeleccionado(seguro); setModalVerOpen(true); };
  const handleOpenEstado = (seguro) => { setSeguroSeleccionado(seguro); setModalEstadoOpen(true); };

  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoVehiculoSeguro(seguroSeleccionado.id_vehseg, datosEstado);
      setModalEstadoOpen(false);
      cargarSeguros();
    } catch (error) {
      alert("Error al cambiar estado: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingEstado(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100 overflow-hidden">

      {/* Uso de nuestro componente reutilizable de cabecera */}
      <TableToolbar 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onAdd={handleOpenCrear}
        addLabel="Registrar Seguro"
        searchPlaceholder="Buscar por Póliza, Placa o Aseguradora..."
      />

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">N°</th>
              <th className="p-4 font-semibold border-b">N° Póliza</th>
              <th className="p-4 font-semibold border-b">Vehículo</th>
              <th className="p-4 font-semibold border-b">Aseguradora</th>
              <th className="p-4 font-semibold border-b text-center">Vigencia</th>
              <th className="p-4 font-semibold border-b text-center">Estado Póliza</th>
              <th className="p-4 font-semibold border-b text-center">Registro</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando pólizas...</p>
                  </div>
                </td>
              </tr>
            ) : segurosPaginados.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron seguros</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Mapeamos los datos paginados
              segurosPaginados.map((s, index) => (
                <tr key={s.id_vehseg} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {/* Número real correlativo */}
                    {indicePrimerRegistro + index + 1}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800 font-mono tracking-wider">{s.numPoliza}</td>
                  <td className="p-4 text-sm">
                    <span className="font-mono bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-bold">
                      {s.vehiculo?.placa || "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">{s.aseguradora?.aseguradora || "N/A"}</td>
                  <td className="p-4 text-xs text-slate-500 text-center font-medium">
                    {s.fecha_vigencia_hasta}
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${s.estado_vencimiento === "No Vencido"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                      : "bg-rose-50 text-rose-600 border-rose-200"
                      }`}>
                      {s.estado_vencimiento}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${s.estado === 1 ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                      }`}>
                      {s.estado === 1 ? "Activo" : "Baja"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenVer(s)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Ver Detalles">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleOpenEditar(s.id_vehseg)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleOpenEstado(s)}
                      className={`p-2 rounded-lg transition-colors ${s.estado === 1 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`} title="Cambiar Estado">
                      {s.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
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
          totalRegistros={segurosFiltrados.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* MODALES INTEGRADOS */}
      <ModalVehiculoSeguro isOpen={modalFormOpen} onClose={() => setModalFormOpen(false)} seguroId={seguroSeleccionado} onSuccess={cargarSeguros} />
      <ModalVerVehiculoSeguro isOpen={modalVerOpen} onClose={() => setModalVerOpen(false)} seguro={seguroSeleccionado} />

      {seguroSeleccionado && typeof seguroSeleccionado === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de Seguro"
          entidadNombre={`Póliza N° ${seguroSeleccionado.numPoliza}`}
          estadoActual={seguroSeleccionado.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}