import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, UserCheck, Eye, Car } from "lucide-react";
import { listarConductores, cambiarEstadoConductor } from "../../services/conductorService";
import ModalConductor from "../../features/conductores/ModalConductor.jsx";
import ModalVerConductor from "../../features/conductores/ModalVerConductor.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

// Importamos nuestros nuevos super-componentes
import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

export default function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- ESTADOS DE TABLA (Busqueda, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estados de modales
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

  // Selección de registro
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarConductores = async () => {
    try {
      setLoading(true);
      const data = await listarConductores();
      setConductores(data);
    } catch (error) {
      console.error("Error al cargar conductores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarConductores();
  }, []);

  // Resetear página si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO COMPLETA ---
  const conductoresFiltrados = conductores.filter((c) => {
    const textoBusqueda = busqueda.toLowerCase();
    const dni = c.persona?.dni || "";
    const nombreCompleto = `${c.persona?.nombre || ""} ${c.persona?.apPaterno || ""}`.toLowerCase();
    
    // Compara por DNI o por Nombre
    const coincideBusqueda = dni.includes(textoBusqueda) || nombreCompleto.includes(textoBusqueda);
    
    // Compara el estado
    const coincideEstado = 
      filtroEstado === "todos" ? true : 
      filtroEstado === "activos" ? c.estado === 1 : 
      c.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const conductoresPaginados = conductoresFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(conductoresFiltrados.length / registrosPorPagina) || 1;

  // Handlers
  const handleOpenCrear = () => { setConductorSeleccionado(null); setModalFormOpen(true); };
  const handleOpenEditar = (id) => { setConductorSeleccionado(id); setModalFormOpen(true); };
  const handleOpenVer = (cond) => { setConductorSeleccionado(cond); setModalVerOpen(true); };
  const handleOpenEstado = (cond) => { setConductorSeleccionado(cond); setModalEstadoOpen(true); };

  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoConductor(conductorSeleccionado.idConduc, datosEstado);
      setModalEstadoOpen(false);
      cargarConductores();
    } catch (error) {
      alert("Error al cambiar estado: " + (error.response?.data?.message || error.message));
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
        addLabel="Nuevo Conductor"
        searchPlaceholder="Buscar DNI o nombre..."
      />

      {/* Tabla */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">Licencia / Cat.</th>
              <th className="p-4 font-semibold border-b">Conductor (DNI)</th>
              <th className="p-4 font-semibold border-b text-center">Vehículos</th>
              <th className="p-4 font-semibold border-b text-center">Vigencia</th>
              <th className="p-4 font-semibold border-b text-center">Estado</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando conductores...</p>
                  </div>
                </td>
              </tr>
            ) : conductoresPaginados.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserCheck size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron conductores</p>
                    <p className="text-sm">Prueba ajustando los filtros de búsqueda.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Usamos conductoresPaginados aquí
              conductoresPaginados.map((c) => {
                const nombreCompleto = `${c.persona?.nombre} ${c.persona?.apPaterno}`;
                const numVehiculos = c.vehiculosAsignados?.length || 0;

                return (
                  <tr key={c.idConduc} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-black text-slate-800 font-mono tracking-wider">{c.numLicencia}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Cat: {c.categoria}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-800">{nombreCompleto}</p>
                      <p className="text-xs text-slate-500 font-mono">DNI: {c.persona?.dni}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${numVehiculos > 0 ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-slate-100 text-slate-500"}`}>
                        <Car size={14} />
                        {numVehiculos}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${c.estadoVigencia === "Vigente" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                        {c.estadoVigencia}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${c.estado === 1 ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                        {c.estado === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      <button onClick={() => handleOpenVer(c)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Ver Detalles">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenEditar(c.idConduc)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleOpenEstado(c)} className={`p-2 rounded-lg transition-colors ${c.estado === 1 ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`} title="Cambiar Estado">
                        {c.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Uso de nuestro componente reutilizable de Paginación */}
      {!loading && (
        <TablePagination 
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={conductoresFiltrados.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* MODALES */}
      <ModalConductor isOpen={modalFormOpen} onClose={() => setModalFormOpen(false)} conductorId={conductorSeleccionado} onSuccess={cargarConductores} />
      <ModalVerConductor isOpen={modalVerOpen} onClose={() => setModalVerOpen(false)} conductor={conductorSeleccionado} />

      {conductorSeleccionado && typeof conductorSeleccionado === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de Conductor"
          entidadNombre={`Conductor ${conductorSeleccionado.persona?.nombre} (Licencia: ${conductorSeleccionado.numLicencia})`}
          estadoActual={conductorSeleccionado.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}