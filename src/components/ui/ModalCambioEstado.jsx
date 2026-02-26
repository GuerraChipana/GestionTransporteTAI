import { useState, useEffect } from "react";
import { X, Loader2, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

export default function ModalCambioEstado({
    isOpen,
    onClose,
    onConfirm,
    titulo = "Cambiar Estado",
    entidadNombre = "el registro",
    estadoActual,
    isLoading
}) {
    // Si estadoActual es 1 (Activo), el nuevo estado será 0 (Inactivo), y viceversa
    const isCurrentlyActive = estadoActual === 1;
    const nuevoEstado = isCurrentlyActive ? 0 : 1;

    const [detalleBaja, setDetalleBaja] = useState("");
    const [error, setError] = useState("");

    // Sincronizar el estado y limpiar errores cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setDetalleBaja("");
            setError("");
        }
    }, [isOpen, estadoActual]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación: Solo pedimos motivo si vamos a desactivar (estado 0)
        if (nuevoEstado === 0 && (!detalleBaja || detalleBaja.trim().length < 10)) {
            setError("Debe ingresar el motivo de la baja (mínimo 10 caracteres).");
            return;
        }

        setError("");
        // Pasamos el objeto tal como lo espera el DTO del backend
        onConfirm({
            estado: nuevoEstado,
            detalle_baja: nuevoEstado === 0 ? detalleBaja.trim() : null
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.25s_ease-out]">

            {/* Contenedor principal con animación popIn y borde superior estilo institucional */}
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">

                {/* Barra superior de color dependiendo de la acción */}
                <div className={`h-2 w-full ${isCurrentlyActive ? "bg-rose-500" : "bg-emerald-500"}`}></div>

                {/* Header: Icono y Botón Cerrar */}
                <div className="flex justify-between items-start p-6 pb-2">
                    <div className={`p-3 rounded-2xl shadow-sm border ${isCurrentlyActive ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                        {isCurrentlyActive ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body: Títulos y Formulario */}
                <div className="p-6 pt-2">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {isCurrentlyActive ? `Desactivar ${titulo}` : `Activar ${titulo}`}
                    </h3>

                    <p className="text-slate-600 mb-5 leading-relaxed">
                        ¿Estás seguro que deseas <strong className={isCurrentlyActive ? "text-rose-600" : "text-emerald-600"}>{isCurrentlyActive ? "desactivar" : "activar"}</strong> a <strong>{entidadNombre}</strong>?
                        {isCurrentlyActive ? " Esta acción restringirá su acceso o validez en el sistema." : " Esta acción restaurará sus permisos en el sistema."}
                    </p>

                    <form id="genericStatusForm" onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 flex items-start gap-2">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Campo de Detalle solo si vamos a Desactivar (nuevoEstado === 0) */}
                        {isCurrentlyActive && (
                            <div className="mb-2 animate-[fadeIn_0.3s_ease-out]">
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide text-[11px]">
                                    Motivo de la baja <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    minLength={10}
                                    maxLength={400}
                                    value={detalleBaja}
                                    onChange={(e) => setDetalleBaja(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none h-28 transition-all shadow-sm"
                                    placeholder="Especifique la razón legal o administrativa de la suspensión (Mínimo 10 caracteres)..."
                                />
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer: Botones de Acción */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>

                    <button
                        form="genericStatusForm"
                        type="submit"
                        disabled={isLoading}
                        className={`px-5 py-2.5 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${isCurrentlyActive
                                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                            }`}
                    >
                        {isLoading && <Loader2 className="animate-spin" size={18} />}
                        {isCurrentlyActive ? "Confirmar Baja" : "Confirmar Alta"}
                    </button>
                </div>
            </div>

            {/* Animaciones Inyectadas */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to { opacity: 1; backdrop-filter: blur(4px); }
                }
                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}