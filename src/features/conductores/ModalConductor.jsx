import { useState, useEffect } from "react";
import { X, Loader2, User, Car, Droplets, AlertCircle, IdCard, Calendar, ShieldCheck, Tag } from "lucide-react";
import { crearConductor, actualizarConductor, obtenerConductorPorId } from "../../services/conductorService";
import { listarPersonas } from "../../services/personaService";
import { listarVehiculos } from "../../services/vehiculoService";
import SelectBuscador from "../../components/ui/SelectBuscador";

const formInicial = {
    idPers: "",
    numLicencia: "",
    clase: "B", // <-- Siempre fijo en "B"
    categoria: "",
    fecha_desde: "",
    fecha_hasta: "",
    restriccion: "NINGUNA",
    grupSangre: "",
    vehiculos: []
};

export default function ModalConductor({ isOpen, onClose, conductorId, onSuccess }) {
    const [formData, setFormData] = useState(formInicial);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    const [personasOpciones, setPersonasOpciones] = useState([]);
    const [vehiculosOpciones, setVehiculosOpciones] = useState([]);
    const [loadingListas, setLoadingListas] = useState(false);

    const [vehiculoSeleccionadoTemp, setVehiculoSeleccionadoTemp] = useState("");

    const isEdit = !!conductorId;

    useEffect(() => {
        if (!isOpen) return;

        const cargarDatos = async () => {
            try {
                setLoadingFetch(true);
                setLoadingListas(true);

                const [listaPersonas, listaVehiculos] = await Promise.all([
                    listarPersonas(),
                    listarVehiculos()
                ]);

                const pFormat = listaPersonas.map(p => ({
                    value: p.id_pers || p.idPers,
                    label: `${p.dni} - ${p.nombre || p.nombres} ${p.ap_paterno || p.apPaterno}`
                }));

                const vFormat = listaVehiculos
                    .filter(v => v.estado === 1)
                    .map(v => ({
                        value: v.idVehi,
                        label: v.placa,
                        subText: v.marca
                    }));

                setPersonasOpciones(pFormat);
                setVehiculosOpciones(vFormat);

                let idRealParaBuscar = conductorId;
                if (typeof conductorId === 'object' && conductorId !== null) {
                    idRealParaBuscar = conductorId.idConduc;
                }

                if (isEdit && idRealParaBuscar) {
                    const data = await obtenerConductorPorId(idRealParaBuscar);
                    setFormData({
                        idPers: data.persona?.idPers || "",
                        numLicencia: data.numLicencia || "",
                        clase: "B", // Lo forzamos a B sin importar lo que venga
                        categoria: data.categoria || "",
                        fecha_desde: data.fecha_desde || "",
                        fecha_hasta: data.fecha_hasta || "",
                        restriccion: data.restriccion || "NINGUNA",
                        grupSangre: data.grupSangre || "",
                        vehiculos: data.vehiculosAsignados?.map(v => v.idVehi) || []
                    });
                } else {
                    setFormData(formInicial);
                    setVehiculoSeleccionadoTemp("");
                }

            } catch (err) {
                setError("Error al cargar los catálogos del sistema.");
            } finally {
                setLoadingFetch(false);
                setLoadingListas(false);
            }
        };

        cargarDatos();
    }, [conductorId, isEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAgregarVehiculo = (idVehiculo) => {
        if (!idVehiculo) return;
        if (!formData.vehiculos.includes(idVehiculo)) {
            setFormData({
                ...formData,
                vehiculos: [...formData.vehiculos, idVehiculo]
            });
        }
        setVehiculoSeleccionadoTemp("");
    };

    const handleQuitarVehiculo = (idVehiculo) => {
        setFormData({
            ...formData,
            vehiculos: formData.vehiculos.filter(id => id !== idVehiculo)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEdit && !formData.idPers) return setError("Debe seleccionar una persona.");
        if (!formData.categoria) return setError("Debe especificar la categoría de licencia.");
        if (new Date(formData.fecha_desde) > new Date(formData.fecha_hasta)) return setError("La fecha de inicio no puede ser mayor a la de fin.");

        setLoadingSubmit(true);
        setError(null);

        try {
            const payload = {
                idPers: Number(formData.idPers),
                numLicencia: formData.numLicencia,
                clase: formData.clase, // Va a mandar "B" por defecto
                categoria: formData.categoria,
                fecha_desde: formData.fecha_desde,
                fecha_hasta: formData.fecha_hasta,
                restriccion: formData.restriccion,
                grupSangre: formData.grupSangre,
                vehiculos: formData.vehiculos
            };

            let idRealParaActualizar = conductorId;
            if (typeof conductorId === 'object' && conductorId !== null) {
                idRealParaActualizar = conductorId.idConduc;
            }

            if (isEdit) {
                await actualizarConductor(idRealParaActualizar, payload);
            } else {
                await crearConductor(payload);
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

    const getPlacaById = (id) => {
        const v = vehiculosOpciones.find(opt => opt.value === id);
        return v ? v.label : "ID " + id;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-[popIn_0.3s_ease-out_forwards]">

                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <IdCard size={22} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                            {isEdit ? "Editar Ficha de Conductor" : "Registrar Nuevo Conductor"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-white">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-medium border border-rose-100 flex items-center gap-3 shadow-sm">
                            <AlertCircle size={20} className="text-rose-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    {loadingFetch || loadingListas ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                            <p className="text-slate-500 font-medium">Cargando datos del sistema...</p>
                        </div>
                    ) : (
                        <form id="conductorForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">

                            {/* Persona */}
                            <div className="md:col-span-3 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-widest">
                                    <User size={16} className="text-blue-500" />
                                    Persona a Registrar como Conductor <span className="text-rose-500">*</span>
                                    {isEdit && <span className="ml-auto text-rose-600 bg-rose-100 px-2 py-0.5 rounded border border-rose-200 text-[9px] shadow-sm">BLOQUEADO</span>}
                                </label>
                                <SelectBuscador
                                    options={personasOpciones}
                                    value={formData.idPers}
                                    onChange={(val) => setFormData({ ...formData, idPers: val })}
                                    placeholder="Buscar por DNI o Nombres completos..."
                                    disabled={isEdit}
                                />
                            </div>

                            <div className="md:col-span-3 h-px bg-slate-100 my-1"></div>

                            {/* Licencia */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <IdCard size={14} className="text-slate-400" />
                                    Número de Licencia <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="numLicencia"
                                    value={formData.numLicencia}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Q12345678"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-800 font-mono font-bold uppercase shadow-sm"
                                />
                            </div>

                            {/* Clase (BLOQUEADO visualmente y lógicamente) */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <Tag size={14} className="text-slate-400" />
                                    Clase <span className="text-rose-500">*</span>
                                    <span className="ml-auto text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[9px] shadow-sm">FIJA</span>
                                </label>
                                <input
                                    type="text"
                                    value="B"
                                    disabled
                                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 font-bold uppercase cursor-not-allowed shadow-inner"
                                />
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <ShieldCheck size={14} className="text-slate-400" />
                                    Categoría <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: IIb o IIc"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-800 font-bold uppercase shadow-sm"
                                />
                            </div>

                            {/* Vigencia Desde */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <Calendar size={14} className="text-slate-400" />
                                    Expedición (Desde) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_desde"
                                    value={formData.fecha_desde}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 bg-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>

                            {/* Vigencia Hasta */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <Calendar size={14} className="text-slate-400" />
                                    Vencimiento (Hasta) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="fecha_hasta"
                                    value={formData.fecha_hasta}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 bg-slate-50 cursor-pointer shadow-sm"
                                />
                            </div>

                            {/* Grupo Sanguíneo */}
                            <div>
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    <Droplets size={14} className="text-rose-500" />
                                    Grupo Sanguíneo
                                </label>
                                <select
                                    name="grupSangre"
                                    value={formData.grupSangre}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 bg-white shadow-sm"
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="O+">O Positivo (O+)</option>
                                    <option value="O-">O Negativo (O-)</option>
                                    <option value="A+">A Positivo (A+)</option>
                                    <option value="A-">A Negativo (A-)</option>
                                    <option value="B+">B Positivo (B+)</option>
                                    <option value="B-">B Negativo (B-)</option>
                                    <option value="AB+">AB Positivo (AB+)</option>
                                    <option value="AB-">AB Negativo (AB-)</option>
                                </select>
                            </div>

                            {/* Restricciones */}
                            <div className="md:col-span-3">
                                <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-widest">
                                    Restricciones de Conducción
                                </label>
                                <input
                                    type="text"
                                    name="restriccion"
                                    value={formData.restriccion}
                                    onChange={handleChange}
                                    placeholder="Ej: NINGUNA, LENTES, AUDIFONOS"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 shadow-sm"
                                />
                            </div>

                            {/* Vehículos Asignados (ZONA PREMIUM) */}
                            <div className="md:col-span-3 pt-4 border-t border-slate-100">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4">
                                    <Car size={18} className="text-blue-500" />
                                    Asignación de Vehículos
                                </label>

                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                                    <div className="mb-5 relative z-50 w-full md:w-2/3">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-widest">Buscador de Vehículos</p>
                                        <SelectBuscador
                                            options={vehiculosOpciones}
                                            value={vehiculoSeleccionadoTemp}
                                            onChange={handleAgregarVehiculo}
                                            placeholder="Escribe la placa para añadir..."
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2.5">
                                        {formData.vehiculos.length === 0 ? (
                                            <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-white/50">
                                                <Car size={24} className="mx-auto text-slate-300 mb-2" />
                                                <p className="text-sm text-slate-500 font-medium">
                                                    No hay vehículos asignados. <br /><span className="text-xs font-normal">Use el buscador de arriba para añadir unidades.</span>
                                                </p>
                                            </div>
                                        ) : (
                                            formData.vehiculos.map(idVehi => (
                                                <div key={idVehi} className="flex items-center gap-2.5 bg-white border border-blue-200 text-slate-700 px-3.5 py-2 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all group">
                                                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                                                        <Car size={16} />
                                                    </div>
                                                    <span className="font-mono font-black text-slate-800 tracking-wider text-[15px]">{getPlacaById(idVehi)}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuitarVehiculo(idVehi)}
                                                        className="ml-1 p-1 bg-slate-50 hover:bg-rose-100 rounded-md transition-colors group-hover:bg-rose-50"
                                                        title="Quitar vehículo"
                                                    >
                                                        <X size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
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
                        className="px-6 py-2.5 text-slate-600 font-bold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        form="conductorForm"
                        type="submit"
                        disabled={loadingSubmit || loadingFetch || loadingListas}
                        className="px-6 py-2.5 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 hover:shadow-lg"
                    >
                        {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Guardar Cambios" : "Registrar Conductor"}
                    </button>
                </div>
            </div>
        </div>
    );
}