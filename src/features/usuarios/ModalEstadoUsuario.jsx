import { useState, useEffect } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { cambiarEstadoUsuario, obtenerUsuarioPorId } from "../../services/usuarioService";

export default function ModalEstadoUsuario({ isOpen, onClose, usuarioId, onSuccess }) {
  const [usuarioData, setUsuarioData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [detalle, setDetalle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuarioId) {
      obtenerUsuarioPorId(usuarioId)
        .then((data) => {
          setUsuarioData(data);
          setLoadingFetch(false);
        })
        .catch(() => {
          setError("No se pudo obtener el estado actual del usuario.");
          setLoadingFetch(false);
        });
    }
  }, [usuarioId]);

  const isCurrentlyActive = usuarioData?.estado === 1;
  const nuevoEstado = isCurrentlyActive ? 0 : 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    try {
      const payload = {
        estado: nuevoEstado,
        detalle_baja: nuevoEstado === 0 ? detalle : null,
      };

      await cambiarEstadoUsuario(usuarioId, payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Error al cambiar el estado.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        <div className="flex justify-between items-start p-6 pb-2">
          <div className={`p-3 rounded-full shadow-sm ${isCurrentlyActive ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"}`}>
            <AlertTriangle size={28} />
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 pt-2">
          {loadingFetch ? (
            <div className="flex justify-center items-center py-6">
               <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {isCurrentlyActive ? "Desactivar Usuario" : "Activar Usuario"}
              </h3>
              <p className="text-gray-600 mb-5">
                ¿Estás seguro que deseas {isCurrentlyActive ? "desactivar" : "activar"} el acceso para el usuario <strong>{usuarioData?.usuario}</strong>?
              </p>

              <form id="statusForm" onSubmit={handleSubmit}>
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium border border-red-200">{error}</div>}

                {isCurrentlyActive && (
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de la baja <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      minLength={10}
                      maxLength={400}
                      value={detalle}
                      onChange={(e) => setDetalle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none resize-none h-24 transition-shadow"
                      placeholder="Escribe el motivo de la suspensión (Mínimo 10 caracteres)..."
                    ></textarea>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        <div className="p-5 border-t bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={loadingSubmit} className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition">
            Cancelar
          </button>
          <button 
            form="statusForm" 
            type="submit" 
            disabled={loadingSubmit || loadingFetch} 
            className={`px-5 py-2.5 text-white font-medium rounded-lg transition flex items-center gap-2 shadow-md ${
              isCurrentlyActive ? "bg-rose-600 hover:bg-rose-700 shadow-rose-500/30" : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
            }`}
          >
            {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
            {isCurrentlyActive ? "Desactivar Acceso" : "Activar Acceso"}
          </button>
        </div>
        
      </div>
    </div>
  );
}