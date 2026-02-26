import { useState, useEffect } from "react";
import { Plus, Edit, Power, PowerOff, BusFront, Search, Eye } from "lucide-react";
import { listarVehiculos, cambiarEstadoVehiculo } from "../../services/vehiculoService";
import ModalVerVehiculo from "../../features/vehiculos/ModalVerVehiculo.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado";
import ModalVehiculo from "../../features/vehiculos/ModalVehiculo.jsx";
export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

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

  // Filtro mejorado: Ignora mayúsculas/minúsculas y busca por placa o marca
  const vehiculosFiltrados = vehiculos.filter((v) => {
    const termino = busqueda.toLowerCase();
    return (
      v.placa?.toLowerCase().includes(termino)
    );
  });

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

  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoVehiculo(vehiculoSeleccionado.idVehi, datosEstado);
      setModalEstadoOpen(false);
      cargarVehiculos();
    } catch (error) {
      alert("Error al cambiar estado: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingEstado(false);
    }
  };

  return (
    <div className="p-6 animate-[fadeIn_0.3s_ease-out]">

      {/* 1. Cabecera de la Página
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BusFront className="text-blue-600" /> Gestión de Vehículos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Administra la flota vehicular municipal, propietarios y estados.
        </p>
      </div> */}

      {/* 2. Contenedor Principal de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Barra de Herramientas (Buscador y Botón) */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">

          {/* Buscador */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por placa"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-700 shadow-sm"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Botón Nuevo Vehículo */}
          <button
            onClick={handleOpenCrear}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={20} /> Registrar Vehículo
          </button>
        </div>

        {/* 3. Tabla de Datos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
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
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p>Cargando flota...</p>
                    </div>
                  </td>
                </tr>
              ) : vehiculosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-500">
                    <BusFront size={48} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-lg font-medium text-slate-600">No se encontraron vehículos</p>
                    {busqueda && <p className="text-sm">No hay coincidencias para "{busqueda}"</p>}
                  </td>
                </tr>
              ) : vehiculosFiltrados.map((v) => (
                <tr key={v.idVehi} className="hover:bg-slate-50 transition-colors group">
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
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Ver Detalles">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenEditar(v.idVehi)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleOpenEstado(v)}
                        className={`p-2 rounded-lg ${v.estado === 1 ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"}`} title="Cambiar Estado">
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
          titulo="Vehículo"
          entidadNombre={`Placa ${vehiculoSeleccionado.placa}`}
          estadoActual={vehiculoSeleccionado.estado}
          isLoading={loadingEstado}
        />
      )}
    </div>
  );
}