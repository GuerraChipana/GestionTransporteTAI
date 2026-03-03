import { useState, useEffect } from "react";
import { Edit, Power, PowerOff, Shield } from "lucide-react";
import { listarAseguradoras, cambiarEstadoAseguradora } from "../../services/aseguradoraService";
import ModalAseguradora from "../../features/aseguradoras/ModalAseguradora.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado.jsx";

// Importamos nuestros componentes reutilizables
import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

import { toast } from "sonner";

export default function Aseguradoras() {
    const [aseguradoras, setAseguradoras] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- ESTADOS DE TABLA (Busqueda, Filtro y Paginación) ---
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;

    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [modalEstadoOpen, setModalEstadoOpen] = useState(false);
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

    // Resetear a la página 1 si cambia la búsqueda o el filtro
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, filtroEstado]);

    // --- LÓGICA DE FILTRADO ---
    const aseguradorasFiltradas = aseguradoras.filter((a) => {
        const coincideBusqueda = a.aseguradora.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado =
            filtroEstado === "todos" ? true :
                filtroEstado === "activos" ? a.estado === 1 :
                    a.estado === 0;

        return coincideBusqueda && coincideEstado;
    });

    // --- LÓGICA DE PAGINACIÓN ---
    const indiceUltimoRegistro = paginaActual * registrosPorPagina;
    const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
    const aseguradorasPaginadas = aseguradorasFiltradas.slice(indicePrimerRegistro, indiceUltimoRegistro);
    const totalPaginas = Math.ceil(aseguradorasFiltradas.length / registrosPorPagina) || 1;

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
            await cambiarEstadoAseguradora(aseguradoraSeleccionada.idAseg, datosEstado);
            setModalEstadoOpen(false);
            cargarAseguradoras();
            
            const accion = datosEstado.estado === 1 ? "activada" : "dada de baja";
            toast.success(`Aseguradora ${accion} exitosamente.`);
        } catch (error) {
            setModalEstadoOpen(false); // El error lo maneja el interceptor en main.jsx
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
                addLabel="Nueva Aseguradora"
                searchPlaceholder="Buscar aseguradora..."
            />

            {/* Tabla Responsiva */}
            <div className="overflow-x-auto rounded-t-xl border border-slate-200">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-slate-50 text-slate-700 text-sm">
                        <tr>
                            <th className="p-4 font-semibold border-b">N°</th>
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
                        ) : aseguradorasPaginadas.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Shield size={40} className="text-slate-300 mb-2" />
                                        <p className="font-medium text-lg">No se encontraron resultados</p>
                                        <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            aseguradorasPaginadas.map((a, index) => (
                                <tr key={a.idAseg} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 text-sm font-medium text-slate-600">
                                        {indicePrimerRegistro + index + 1}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-slate-800">{a.aseguradora}</td>
                                    <td className="p-4 text-sm text-center">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${a.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            }`}>
                                            {a.estado === 1 ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleOpenEditar(a.idAseg)}
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
                    totalRegistros={aseguradorasFiltradas.length}
                    indicePrimerRegistro={indicePrimerRegistro}
                    indiceUltimoRegistro={indiceUltimoRegistro}
                    setPaginaActual={setPaginaActual}
                />
            )}

            {/* MODALES INTEGRADOS */}
            <ModalAseguradora
                isOpen={modalFormOpen}
                onClose={() => setModalFormOpen(false)}
                aseguradoraId={aseguradoraSeleccionada}
                onSuccess={cargarAseguradoras}
            />

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