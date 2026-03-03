import { useState, useEffect } from "react";
import { X, Loader2, Search, Upload, UserPlus, UserCog } from "lucide-react";
import { crearPersona, actualizarPersona, obtenerPersonaPorId, consultarReniec } from "../../services/personaService";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

const formInicial = {
    dni: "",
    nombre: "",
    apPaterno: "",
    apMaterno: "",
    telefono: "",
    ubigeo: "",
    correo: "",
    domicilio: "",
    fotoBase64: "", // Se enviará al backend para guardarse en FTP
};

export default function ModalPersona({ isOpen, onClose, personaId, onSuccess }) {
    const [formData, setFormData] = useState(formInicial);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingReniec, setLoadingReniec] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(null);

    const isEdit = !!personaId;

    useEffect(() => {
        const esIdValido = personaId && typeof personaId !== 'object';

        if (isEdit && isOpen && esIdValido) {
            const fetchPersona = async () => {
                try {
                    setLoadingFetch(true);
                    const data = await obtenerPersonaPorId(personaId);

                    // Mapeo seguro usando los nombres exactos que envía tu PersonaResponseDto
                    setFormData({
                        dni: data.dni || "",
                        nombre: data.nombre || "",
                        apPaterno: data.ap_paterno || "",
                        apMaterno: data.ap_materno || "",
                        telefono: data.telefono || "",
                        ubigeo: data.ubigeo || "",
                        correo: data.correo || "",
                        domicilio: data.domicilio || "",
                        fotoBase64: "",
                    });
                    if (data.foto) setFotoPreview(data.foto);
                } catch (err) {
                    onClose();
                } finally {
                    setLoadingFetch(false);
                }
            };
            fetchPersona();
        } else if (!isEdit && isOpen) {
            setFormData(formInicial);
            setFotoPreview(null);
        }
    }, [personaId, isEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- LÓGICA MÁGICA DE RENIEC ACTUALIZADA ---
    const handleConsultarReniec = async () => {
        if (formData.dni.length !== 8) {
            toast.error("Formato inválido", { description: "El DNI debe tener 8 dígitos para consultar en RENIEC." });
            return;
        }

        const passConsulta = prompt("Ingrese la contraseña de consulta RENIEC (para auditoría):");
        if (!passConsulta) return;

        try {
            setLoadingReniec(true);
            const dataReniec = await consultarReniec(formData.dni, passConsulta);

            setFormData((prev) => ({
                ...prev,
                nombre: dataReniec.nombre || "",
                apPaterno: dataReniec.apPaterno || "",
                apMaterno: dataReniec.apMaterno || "",
                ubigeo: dataReniec.ubigeo || "",
                domicilio: dataReniec.direccion || "",
                fotoBase64: dataReniec.foto || "",
            }));

            if (dataReniec.foto) {
                setFotoPreview(`data:image/jpeg;base64,${dataReniec.foto}`);
            }

            toast.success("Datos importados exitosamente desde RENIEC.");

        } catch (err) {
            // El error es manejado globalmente en main.jsx
        } finally {
            setLoadingReniec(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        try {
            if (isEdit) {
                await actualizarPersona(personaId, formData);
                toast.success("Persona actualizada exitosamente.");
            } else {
                await crearPersona(formData);
                toast.success("Persona registrada exitosamente.");
            }
            onSuccess();
            onClose();
        } catch (err) {
            // El error es manejado globalmente en main.jsx
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[popIn_0.3s_ease-out_forwards]">

                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            {isEdit ? <UserCog size={22} /> : <UserPlus size={22} />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {isEdit ? "Editar Persona" : "Registrar Nueva Persona"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">

                    {loadingFetch ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                            <p className="text-slate-500 font-medium text-sm">Obteniendo datos de la persona...</p>
                        </div>
                    ) : (
                        <form id="personaForm" onSubmit={handleSubmit} className="flex flex-col gap-6">

                            {/* Sección Superior: Foto y DNI */}
                            <div className="flex flex-col sm:flex-row gap-6 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">

                                {/* Foto Preview */}
                                <div className="flex-shrink-0 flex justify-center sm:justify-start">
                                    <div className="w-24 h-28 rounded-xl border-2 border-white shadow-md overflow-hidden bg-slate-200 flex items-center justify-center">
                                        {fotoPreview ? (
                                            <img src={fotoPreview} alt="Perfil" className="w-full h-full object-cover" />
                                        ) : (
                                            <Upload className="text-slate-400" size={32} />
                                        )}
                                    </div>
                                </div>

                                {/* Controles DNI y Reniec */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between items-center">
                                        Documento de Identidad (DNI)
                                        {isEdit && <span className="text-rose-600 text-[10px] uppercase tracking-wider font-bold bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">Bloqueado</span>}
                                    </label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            required
                                            disabled={isEdit}
                                            maxLength={8}
                                            placeholder="Ingrese 8 dígitos..."
                                            className="w-full sm:max-w-[200px] p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-500 transition-all font-mono"
                                        />
                                        {!isEdit && (
                                            <button
                                                type="button"
                                                onClick={handleConsultarReniec}
                                                disabled={loadingReniec || formData.dni.length !== 8}
                                                className="px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-800/20"
                                            >
                                                {loadingReniec ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                                <span className="hidden sm:inline font-semibold text-sm tracking-wide">RENIEC</span>
                                            </button>
                                        )}
                                    </div>
                                    {!isEdit && <p className="text-xs text-slate-500 mt-2 italic">Usa el botón RENIEC para autocompletar los datos y la foto oficial.</p>}
                                </div>
                            </div>

                            {/* Grid de Campos Restantes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombres</label>
                                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700"
                                        placeholder="Nombres completos" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Apellido Paterno</label>
                                    <input type="text" name="apPaterno" value={formData.apPaterno} onChange={handleChange} required
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Apellido Materno</label>
                                    <input type="text" name="apMaterno" value={formData.apMaterno} onChange={handleChange} required
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Teléfono Celular</label>
                                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} maxLength={9}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 font-mono"
                                        placeholder="Ej: 987654321" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
                                    <input type="email" name="correo" value={formData.correo} onChange={handleChange}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700"
                                        placeholder="correo@ejemplo.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ubigeo (Reniec)</label>
                                    <input type="text" name="ubigeo" value={formData.ubigeo} onChange={handleChange} maxLength={6}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 font-mono"
                                        placeholder="000000" />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Domicilio Registrado</label>
                                    <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChange}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700"
                                        placeholder="Dirección exacta" />
                                </div>

                            </div>
                        </form>
                    )}
                </div>

                {/* Footer Modal */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loadingSubmit || loadingFetch}
                        className="px-5 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        form="personaForm"
                        type="submit"
                        disabled={loadingSubmit || loadingFetch}
                        className="px-5 py-2.5 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                        {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Guardar Cambios" : "Crear Persona"}
                    </button>
                </div>

            </div>
        </div>
    );
}