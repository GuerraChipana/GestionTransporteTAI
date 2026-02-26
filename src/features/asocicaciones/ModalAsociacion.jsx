import { useState, useEffect } from "react";
import { X, Loader2, Building2 } from "lucide-react";
import {
    crearAsociacion,
    actualizarAsociacion,
    obtenerAsociacionPorId
} from "../../services/asociacionService";

const formInicial = {
    nombre: "",
    documento: "",
};

export default function ModalAsociacion({ isOpen, onClose, asociacionId, onSuccess }) {
    const [formData, setFormData] = useState(formInicial);
    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    const isEdit = !!asociacionId;

    useEffect(() => {
        const esIdValido = asociacionId && typeof asociacionId !== 'object';

        if (isEdit && isOpen && esIdValido) {
            const fetchAsociacion = async () => {
                try {
                    setLoadingFetch(true);
                    const data = await obtenerAsociacionPorId(asociacionId);
                    setFormData({
                        nombre: data.nombre || "",
                        documento: data.documento || "",
                    });
                } catch (err) {
                    setError("Error al cargar los datos de la asociación.");
                } finally {
                    setLoadingFetch(false);
                }
            };
            fetchAsociacion();
        } else if (!isEdit && isOpen) {
            setFormData(formInicial);
            setError(null);
        }
    }, [asociacionId, isEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);

        try {
            if (isEdit) {
                await actualizarAsociacion(asociacionId, formData);
            } else {
                await crearAsociacion(formData);
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
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-[popIn_0.3s_ease-out_forwards]">

                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Building2 size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">
                            {isEdit ? "Editar Asociación" : "Nueva Asociación"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-6">
                    {error && (
                        <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    {loadingFetch ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
                            <p className="text-slate-500 font-medium text-sm">Cargando información...</p>
                        </div>
                    ) : (
                        <form id="asociacionForm" onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Nombre de la Asociación
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Asociación de Transportistas..."
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Documento (RUC / Resolución)
                                </label>
                                <input
                                    type="text"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: 20123456789"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-slate-700 font-mono"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
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
                        form="asociacionForm"
                        type="submit"
                        disabled={loadingSubmit || loadingFetch}
                        className="px-5 py-2.5 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                        {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Guardar Cambios" : "Crear Asociación"}
                    </button>
                </div>

            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(4px); } }
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}