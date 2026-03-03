import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, BusFront, Eye } from "lucide-react";
import { listarVehiculos, cambiarEstadoVehiculo } from "../../services/vehiculoService";
import ModalVerVehiculo from "../../features/vehiculos/ModalVerVehiculo.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado";
import ModalVehiculo from "../../features/vehiculos/ModalVehiculo.jsx";

import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE TABLA (Búsqueda, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);

  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      const data = await listarVehiculos();
      setVehiculos(data);
    } catch (error) {
      console.error("Error al cargar vehículos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  // Resetear a la página 1 si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (Placa + Estado) ---
  const vehiculosFiltrados = vehiculos.filter((v) => {
    const termino = busqueda.toLowerCase();

    // Filtro por placa
    const coincideBusqueda = v.placa?.toLowerCase().includes(termino);

    // Filtro por estado
    const coincideEstado =
      filtroEstado === "todos" ? true :
        filtroEstado === "activos" ? v.estado === 1 :
          v.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const vehiculosPaginados = vehiculosFiltrados.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(vehiculosFiltrados.length / registrosPorPagina) || 1;

  // Handlers Modales
  const handleOpenCrear = () => {
    setVehiculoSeleccionado(null);
    setModalFormOpen(true);
  };

  const handleOpenEditar = (id) => {
    setVehiculoSeleccionado(id);
    setModalFormOpen(true);
  };

  const handleOpenEstado = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalEstadoOpen(true);
  };

  const handleOpenVer = (vehiculo) => {
    setVehiculoSeleccionado(vehiculo);
    setModalVerOpen(true);
  };

  // --- HANDLER CAMBIO DE ESTADO ACTUALIZADO ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoVehiculo(vehiculoSeleccionado.idVehi, datosEstado);

      setModalEstadoOpen(false);
      cargarVehiculos();

      const accion = datosEstado.estado === 1 ? "activado" : "dado de baja";
      toast.success(`Vehículo ${accion} exitosamente.`);

    } catch (error) {
      setModalEstadoOpen(false); // El interceptor ya muestra la alerta roja
    } finally {
      setLoadingEstado(false);
    }
  };

  return (
    <div className="p-6 animate-[fadeIn_0.3s_ease-out]">

      {/* Uso de nuestro componente reutilizable de cabecera */}
      <TableToolbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onAdd={handleOpenCrear}
        addLabel="Registrar Vehículo"
        searchPlaceholder="Buscar por placa..."
      />

      {/* Contenedor Principal de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Tabla de Datos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">N°</th>
                <th className="p-4">Placa</th>
                <th className="p-4">Vehículo</th>
                <th className="p-4">Propietario Principal</th>
                <th className="p-4 text-center">Imagen</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p>Cargando flota...</p>
                    </div>
                  </td>
                </tr>
              ) : vehiculosPaginados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-500">
                    <BusFront size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-lg font-medium text-slate-600">No se encontraron vehículos</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                  </td>
                </tr>
              ) : vehiculosPaginados.map((v, index) => (
                <tr key={v.idVehi} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {indicePrimerRegistro + index + 1}
                  </td>
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-sm">
                      <span className="text-sm font-bold text-slate-800 font-mono tracking-widest">{v.placa}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{v.marca}</p>
                    <p className="text-xs text-slate-500 font-medium">{v.color} - Año: {v.anoDeCompra}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">{v.propietario1?.nombreCompleto || <span className="text-slate-400 italic">No asignado</span>}</p>
                    {v.propietario1?.dni && <p className="text-[11px] font-medium text-slate-500">DNI: {v.propietario1.dni}</p>}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      {v.imagenUrl ? (
                        <img src={v.imagenUrl} alt="Vehículo" className="w-16 h-10 rounded-lg object-cover border border-slate-200 shadow-sm hover:scale-150 transition-transform duration-300" />
                      ) : (
                        <div className="w-16 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                          <BusFront size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${v.estado === 1 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}>
                      {v.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenVer(v)}
                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Ver Detalles">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenEditar(v.idVehi)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleOpenEstado(v)}
                        className={`p-2 rounded-lg transition-colors ${v.estado === 1 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`} title="Cambiar Estado">
                        {v.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uso de nuestro componente reutilizable de Paginación */}
      {!loading && (
        <TablePagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={vehiculosFiltrados.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* Modales */}
      <ModalVehiculo
        isOpen={modalFormOpen}
        onClose={() => setModalFormOpen(false)}
        vehiculoId={vehiculoSeleccionado}
        onSuccess={cargarVehiculos}
      />

      <ModalVerVehiculo
        isOpen={modalVerOpen}
        onClose={() => setModalVerOpen(false)}
        vehiculo={vehiculoSeleccionado}
      />

      {vehiculoSeleccionado && typeof vehiculoSeleccionado === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado del Vehículo"
          entidadNombre={`Placa ${vehiculoSeleccionado.placa}`}
          estadoActual={vehiculoSeleccionado.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}