import { useState, useEffect } from "react";
import { X, Loader2, ClipboardList, Car, Building2, Hash } from "lucide-react";
import {
    crearEmpadronamiento,
    actualizarEmpadronamiento,
    obtenerEmpadronamientoPorId
} from "../../services/empadronamientoService";
import { listarVehiculos } from "../../services/vehiculoService";
import { listarAsociaciones } from "../../services/asociacionService";
import SelectBuscador from "../../components/ui/SelectBuscador";

const formInicial = {
    numEmpadronamiento: "",
    idVehiculo: "",
    idAsociacion: "",
};

export default function ModalEmpadronamiento({ isOpen, onClose, empadronamientoId, onSuccess }) {
    const [formData, setFormData] = useState(formInicial);

    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    // Estados para las listas
    const [vehiculosOpciones, setVehiculosOpciones] = useState([]);
    const [asociacionesOpciones, setAsociacionesOpciones] = useState([]);
    const [loadingListas, setLoadingListas] = useState(false);

    const isEdit = !!empadronamientoId;

    useEffect(() => {
        if (!isOpen) return;

        const cargarDatos = async () => {
            try {
                setLoadingFetch(true);
                setLoadingListas(true);

                const [listaVehiculos, listaAsociaciones] = await Promise.all([
                    listarVehiculos(),
                    listarAsociaciones()
                ]);

                const vFormat = listaVehiculos
                    .filter(v => v.estado === 1)
                    .map(v => ({ value: v.idVehi, label: `${v.placa} - ${v.marca}` }));
                const aFormat = listaAsociaciones
                    .filter(a => a.estado === 1)
                    .map(a => ({ value: a.idAsoci, label: a.nombre }));

                setVehiculosOpciones(vFormat);
                setAsociacionesOpciones(aFormat);

                if (isEdit && typeof empadronamientoId !== 'object') {
                    const data = await obtenerEmpadronamientoPorId(empadronamientoId);
                    setFormData({
                        numEmpadronamiento: data.numEmpadronamiento || "",
                        idVehiculo: data.vehiculo?.id || "",
                        idAsociacion: data.asociacion?.id || "",
                    });
                } else {
                    setFormData(formInicial);
                }

            } catch (err) {
                setError("Error al cargar los catálogos del sistema.");
            } finally {
                setLoadingFetch(false);
                setLoadingListas(false);
            }
        };

        cargarDatos();
    }, [empadronamientoId, isEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.idVehiculo || !formData.idAsociacion) {
            setError("Debe seleccionar un vehículo y una asociación.");
            return;
        }

        setLoadingSubmit(true);
        setError(null);

        try {
            const payload = {
                numEmpadronamiento: Number(formData.numEmpadronamiento),
                idVehiculo: Number(formData.idVehiculo),
                idAsociacion: Number(formData.idAsociacion)
            };

            if (isEdit) {
                await actualizarEmpadronamiento(empadronamientoId, payload);
            } else {
                await crearEmpadronamiento(payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Ocurrió un error inesperado al guardar.");
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Container: Lo mantenemos en max-w-2xl para que no sea excesivamente ancho */}
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col animate-[popIn_0.3s_ease-out_forwards]">

                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <ClipboardList size={22} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {isEdit ? "Editar Empadronamiento" : "Nuevo Empadronamiento"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal - Con overflow-visible para que las listas flotantes no se corten */}
                <div className="p-6 overflow-visible">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100 flex items-center gap-2 shadow-sm">
                            <X size={18} className="text-rose-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    {loadingFetch || loadingListas ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />
                            <p className="text-slate-500 font-medium">Cargando catálogos del sistema...</p>
                        </div>
                    ) : (
                        <form id="empaForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Número de Padrón */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Hash size={14} className="text-blue-500" />
                                    Número de Padrón <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="numEmpadronamiento"
                                    value={formData.numEmpadronamiento}
                                    onChange={(e) => setFormData({ ...formData, numEmpadronamiento: e.target.value })}
                                    required
                                    placeholder="Ej: 501"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-slate-800 font-bold"
                                />
                            </div>

                            {/* Asociación */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Building2 size={14} className="text-blue-500" />
                                    Asociación Vinculada <span className="text-rose-500">*</span>
                                </label>
                                <SelectBuscador
                                    options={asociacionesOpciones}
                                    value={formData.idAsociacion}
                                    onChange={(val) => setFormData({ ...formData, idAsociacion: val })}
                                    placeholder="Busca por nombre..."
                                />
                            </div>

                            {/* Vehículo (Ocupa ambas columnas) */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Car size={14} className="text-blue-500" />
                                    Vehículo a Empadronar <span className="text-rose-500">*</span>
                                </label>
                                <SelectBuscador
                                    options={vehiculosOpciones}
                                    value={formData.idVehiculo}
                                    onChange={(val) => setFormData({ ...formData, idVehiculo: val })}
                                    placeholder="Busca la placa del vehículo..."
                                />
                            </div>

                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loadingSubmit || loadingFetch || loadingListas}
                        className="px-6 py-2.5 text-slate-600 font-bold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        form="empaForm"
                        type="submit"
                        disabled={loadingSubmit || loadingFetch || loadingListas}
                        className="px-6 py-2.5 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 hover:shadow-lg"
                    >
                        {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Guardar Cambios" : "Crear Padrón"}
                    </button>
                </div>
            </div>
        </div>
    );

}