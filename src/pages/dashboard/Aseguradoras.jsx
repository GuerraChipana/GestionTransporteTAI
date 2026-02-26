import { useState, useEffect } from "react";
import { Search, Plus, Edit, Power, PowerOff, Shield } from "lucide-react";
import { listarAseguradoras, cambiarEstadoAseguradora } from "../../services/aseguradoraService";
import ModalAseguradora from "../../features/aseguradoras/ModalAseguradora.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

export default function Aseguradoras() {
    const [aseguradoras, setAseguradoras] = useState([]);
    const [loading, setLoading] = useState(false);
    const [busqueda, setBusqueda] = useState("");

    // Estados de modales
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

    // Selección de registro
    const [aseguradoraSeleccionada, setAseguradoraSeleccionada] = useState(null);
    const [loadingEstado, setLoadingEstado] = useState(false);

    const cargarAseguradoras = async () => {
        try {
            setLoading(true);
            const data = await listarAseguradoras();
            setAseguradoras(data);
        } catch (error) {
            console.error("Error al cargar aseguradoras", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarAseguradoras();
    }, []);

    // Filtrado por nombre de aseguradora
    const aseguradorasFiltradas = aseguradoras.filter((a) =>
        a.aseguradora.toLowerCase().includes(busqueda.toLowerCase())
    );

    // --- HANDLERS MODALES ---
    const handleOpenCrear = () => {
        setAseguradoraSeleccionada(null);
        setModalFormOpen(true);
    };

    const handleOpenEditar = (id) => {
        setAseguradoraSeleccionada(id);
        setModalFormOpen(true);
    };

    const handleOpenEstado = (aseg) => {
        setAseguradoraSeleccionada(aseg);
        setModalEstadoOpen(true);
    };

    // --- HANDLER CAMBIO DE ESTADO ---
    const confirmarCambioEstado = async (datosEstado) => {
        try {
            setLoadingEstado(true);
            // datosEstado ya trae el formato { estado: 1|0, detalle_baja: "..." } gracias a tu componente reciclado
            await cambiarEstadoAseguradora(aseguradoraSeleccionada.idAseg, datosEstado);
            setModalEstadoOpen(false);
            cargarAseguradoras();
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
                        placeholder="Buscar aseguradora..."
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
                    <span className="font-medium">Nueva Aseguradora</span>
                </button>
            </div>

            {/* Tabla Responsiva */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 text-sm">
                        <tr>
                            <th className="p-4 font-semibold border-b">ID</th>
                            <th className="p-4 font-semibold border-b">Nombre de Aseguradora</th>
                            <th className="p-4 font-semibold border-b text-center">Estado</th>
                            <th className="p-4 font-semibold border-b text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="font-medium">Cargando aseguradoras...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : aseguradorasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Shield size={40} className="text-slate-300 mb-2" />
                                        <p className="font-medium text-lg">No se encontraron resultados</p>
                                        <p className="text-sm">Intenta con otros términos de búsqueda.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            aseguradorasFiltradas.map((a) => (
                                <tr key={a.idAseg} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-slate-600">{a.idAseg}</td>
                                    <td className="p-4 text-sm font-bold text-slate-800">{a.aseguradora}</td>
                                    <td className="p-4 text-sm text-center">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${a.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            }`}>
                                            {a.estado === 1 ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center justify-center gap-2">
                                        {/* Botón Editar */}
                                        <button
                                            onClick={() => handleOpenEditar(a.idAseg)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        {/* Botón Cambiar Estado */}
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
            <ModalAseguradora
                isOpen={modalFormOpen}
                onClose={() => setModalFormOpen(false)}
                aseguradoraId={aseguradoraSeleccionada}
                onSuccess={cargarAseguradoras}
            />

            {/* Tu Modal Reutilizable de Cambio de Estado */}
            {aseguradoraSeleccionada && typeof aseguradoraSeleccionada === 'object' && (
                <ModalCambioEstado
                    isOpen={modalEstadoOpen}
                    onClose={() => setModalEstadoOpen(false)}
                    onConfirm={confirmarCambioEstado}
                    titulo="Estado de Aseguradora"
                    entidadNombre={aseguradoraSeleccionada.aseguradora}
                    estadoActual={aseguradoraSeleccionada.estado}
                    isLoading={loadingEstado}
                />
            )}
        </div>
    );
}