import { useState, useEffect } from "react";
import { X, Loader2, ShieldCheck, Car, Building2, Hash, Calendar } from "lucide-react";
import {
    crearVehiculoSeguro,
    actualizarVehiculoSeguro,
    obtenerVehiculoSeguroPorId
} from "../../services/vehiculoSeguroService";
import { listarVehiculos } from "../../services/vehiculoService";
import { listarAseguradoras } from "../../services/aseguradoraService";
import SelectBuscador from "../../components/ui/SelectBuscador";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

const formInicial = {
    idVehiculo: "",
    idAseguradora: "",
    numPoliza: "",
    fecha_vigencia_desde: "",
    fecha_vigencia_hasta: "",
};

export default function ModalVehiculoSeguro({ isOpen, onClose, seguroId, onSuccess }) {
    const [formData, setFormData] = useState(formInicial);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    // Estados para los Selectores
    const [vehiculosOpciones, setVehiculosOpciones] = useState([]);
    const [aseguradorasOpciones, setAseguradorasOpciones] = useState([]);
    const [loadingListas, setLoadingListas] = useState(false);

    const isEdit = !!seguroId;

    useEffect(() => {
        if (!isOpen) return;

        const cargarDatos = async () => {
            try {
                setLoadingFetch(true);
                setLoadingListas(true);

                // 1. Cargar las listas de Vehículos y Aseguradoras Activos
                const [listaVehiculos, listaAseguradoras] = await Promise.all([
                    listarVehiculos(),
                    listarAseguradoras()
                ]);

                // Formateamos para el SelectBuscador
                const vFormat = listaVehiculos
                    .filter(v => v.estado === 1)
                    .map(v => ({
                        value: v.idVehi,
                        label: v.placa,
                        subText: v.marca
                    }));

                const aFormat = listaAseguradoras
                    .filter(a => a.estado === 1)
                    .map(a => ({
                        value: a.idAseg,
                        label: a.aseguradora
                    }));

                setVehiculosOpciones(vFormat);
                setAseguradorasOpciones(aFormat);

                // 2. Cargar datos si es edición
                if (isEdit && typeof seguroId !== 'object') {
                    const data = await obtenerVehiculoSeguroPorId(seguroId);
                    setFormData({
                        idVehiculo: data.vehiculo?.id || "",
                        idAseguradora: data.aseguradora?.id || "",
                        numPoliza: data.numPoliza || "",
                        fecha_vigencia_desde: data.fecha_vigencia_desde || "",
                        fecha_vigencia_hasta: data.fecha_vigencia_hasta || "",
                    });
                } else {
                    setFormData(formInicial);
                }
            } catch (err) {
                // Si falla, cerramos el modal, el interceptor muestra el error visual
                onClose();
            } finally {
                setLoadingFetch(false);
                setLoadingListas(false);
            }
        };

        cargarDatos();
    }, [seguroId, isEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de Selectores
        if (!formData.idVehiculo || !formData.idAseguradora) {
            toast.error("Datos incompletos", { description: "Debe seleccionar un vehículo y una aseguradora." });
            return;
        }

        // Validación de fechas
        if (new Date(formData.fecha_vigencia_desde) > new Date(formData.fecha_vigencia_hasta)) {
            toast.error("Fechas inválidas", { description: "La fecha de inicio no puede ser mayor a la fecha de fin." });
            return;
        }

        setLoadingSubmit(true);

        try {
            const payload = {
                ...formData,
                idVehiculo: Number(formData.idVehiculo),
                idAseguradora: Number(formData.idAseguradora)
            };

            if (isEdit) {
                await actualizarVehiculoSeguro(seguroId, payload);
                toast.success("Seguro vehicular actualizado exitosamente.");
            } else {
                await crearVehiculoSeguro(payload);
                toast.success("Seguro vehicular registrado exitosamente.");
            }
            onSuccess();
            onClose();
        } catch (err) {
            // El error es manejado en main.jsx
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[popIn_0.3s_ease-out_forwards]">

                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <ShieldCheck size={22} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {isEdit ? "Editar Seguro Vehicular" : "Registrar Seguro Vehicular"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 overflow-visible">

                    {loadingFetch || loadingListas ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />
                            <p className="text-slate-500 font-medium">Cargando catálogos...</p>
                        </div>
                    ) : (
                        <form id="seguroForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Póliza */}
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Hash size={14} className="text-blue-500" />
                                    Número de Póliza / Certificado <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="numPoliza"
                                    value={formData.numPoliza}
                                    onChange={(e) => setFormData({ ...formData, numPoliza: e.target.value })}
                                    required
                                    placeholder="Ej: POL-9988776655"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-slate-800 font-mono text-lg font-bold shadow-sm"
                                />
                            </div>

                            {/* Vehículo */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Car size={14} className="text-blue-500" />
                                    Vehículo Asegurado <span className="text-rose-500">*</span>
                                </label>
                                <SelectBuscador
                                    options={vehiculosOpciones}
                                    value={formData.idVehiculo}
                                    onChange={(val) => setFormData({ ...formData, idVehiculo: val })}
                                    placeholder="Busca la placa..."
                                />
                            </div>

                            {/* Aseguradora */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Building2 size={14} className="text-blue-500" />
                                    Compañía Aseguradora <span className="text-rose-500">*</span>
                                </label>
                                <SelectBuscador
                                    options={aseguradorasOpciones}
                                    value={formData.idAseguradora}
                                    onChange={(val) => setFormData({ ...formData, idAseguradora: val })}
                                    placeholder="Busca aseguradora..."
                                />
                            </div>

                            {/* Fecha Desde */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Calendar size={14} className="text-blue-500" />
                                    Vigencia Desde <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_vigencia_desde"
                                    value={formData.fecha_vigencia_desde}
                                    onChange={(e) => setFormData({ ...formData, fecha_vigencia_desde: e.target.value })}
                                    required
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-slate-700 bg-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>

                            {/* Fecha Hasta */}
                            <div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                                    <Calendar size={14} className="text-blue-500" />
                                    Vigencia Hasta <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_vigencia_hasta"
                                    value={formData.fecha_vigencia_hasta}
                                    onChange={(e) => setFormData({ ...formData, fecha_vigencia_hasta: e.target.value })}
                                    required
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-slate-700 bg-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>

                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3 mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loadingSubmit || loadingFetch || loadingListas}
                        className="px-6 py-2.5 text-slate-600 font-bold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        form="seguroForm"
                        type="submit"
                        disabled={loadingSubmit || loadingFetch || loadingListas}
                        className="px-6 py-2.5 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 hover:shadow-lg"
                    >
                        {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Guardar Cambios" : "Registrar Póliza"}
                    </button>
                </div>
            </div>
        </div>
    );
}