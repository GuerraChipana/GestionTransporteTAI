import { useState, useEffect } from "react";
import { X, Loader2, CreditCard, Hash, Calendar, FileText } from "lucide-react";
import { crearTuc, actualizarTuc, obtenerTucPorId } from "../../services/tucService";
import { listarEmpadronamientos } from "../../services/empadronamientoService";
import AutocompleteSelect from "./AutocompleteSelect";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

const formInicial = {
  numTuc: "",
  anoTuc: new Date().getFullYear(),
  idEmpa: "",
  fecha_desde: "",
};

export default function ModalTuc({ isOpen, onClose, tucId, onSuccess }) {
  const [formData, setFormData] = useState(formInicial);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Opciones para el buscador de Empadronamientos
  const [empadronamientosOpciones, setEmpadronamientosOpciones] = useState([]);
  const [loadingListas, setLoadingListas] = useState(false);

  const isEdit = !!tucId;

  useEffect(() => {
    if (!isOpen) return;

    const cargarDatos = async () => {
      try {
        setLoadingFetch(true);
        setLoadingListas(true);

        const listaEmpadronamientos = await listarEmpadronamientos();

        const empaFormat = listaEmpadronamientos
          .filter(e => e.estado === 1)
          .map(e => ({
            value: e.idEmpa,
            label: String(e.numEmpadronamiento),
            subText: `Placa: ${e.vehiculo?.placa || 'N/A'}`
          }));

        setEmpadronamientosOpciones(empaFormat);

        const esIdValido = tucId && typeof tucId !== 'object';
        if (isEdit && esIdValido) {
          const data = await obtenerTucPorId(tucId);
          setFormData({
            numTuc: data.numTuc || "",
            anoTuc: data.anoTuc || new Date().getFullYear(),
            idEmpa: data.empadronamiento?.idEmpa || "",
            fecha_desde: data.fechaDesde || "",
          });
        } else {
          setFormData(formInicial);
        }
      } catch (err) {
        onClose(); // Si falla la carga, cerramos el modal
      } finally {
        setLoadingFetch(false);
        setLoadingListas(false);
      }
    };

    cargarDatos();
  }, [tucId, isEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.idEmpa) {
      toast.error("Datos incompletos", { description: "Debe seleccionar un empadronamiento vinculado." });
      return;
    }

    setLoadingSubmit(true);

    try {
      const payload = {
        ...formData,
        numTuc: Number(formData.numTuc),
        anoTuc: Number(formData.anoTuc),
        idEmpa: Number(formData.idEmpa)
      };

      if (isEdit) {
        await actualizarTuc(tucId, payload);
        toast.success("Tarjeta TUC actualizada exitosamente.");
      } else {
        await crearTuc(payload);
        toast.success("Tarjeta TUC emitida exitosamente.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      // El error rojo se maneja solo gracias al interceptor en main.jsx
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-[popIn_0.3s_ease-out_forwards]">

        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CreditCard size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              {isEdit ? "Editar Tarjeta TUC" : "Emitir Nueva TUC"}
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
              <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
              <p className="text-slate-500 font-medium">Cargando base de datos...</p>
            </div>
          ) : (
            <form id="tucForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Padrón Vinculado */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  <FileText size={14} className="text-blue-500" />
                  Empadronamiento Vinculado <span className="text-rose-500">*</span>
                </label>
                <AutocompleteSelect
                  options={empadronamientosOpciones}
                  value={formData.idEmpa}
                  onChange={(val) => setFormData({ ...formData, idEmpa: val })}
                  placeholder="Escribe el N° de Padrón..."
                />
              </div>

              {/* Número TUC */}
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  <Hash size={14} className="text-blue-500" />
                  Número de TUC <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="numTuc"
                  value={formData.numTuc}
                  onChange={(e) => setFormData({ ...formData, numTuc: e.target.value })}
                  required
                  placeholder="Ej: 1542"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-800 font-bold font-mono shadow-sm"
                />
              </div>

              {/* Año */}
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  <Calendar size={14} className="text-blue-500" />
                  Año de Emisión <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="anoTuc"
                  value={formData.anoTuc}
                  onChange={(e) => setFormData({ ...formData, anoTuc: e.target.value })}
                  required
                  min="2000"
                  max="2100"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-800 font-mono shadow-sm"
                />
              </div>

              {/* Fecha Desde */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  <Calendar size={14} className="text-blue-500" />
                  Fecha de Activación (Desde) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_desde"
                  value={formData.fecha_desde}
                  onChange={(e) => setFormData({ ...formData, fecha_desde: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-slate-700 bg-slate-50 cursor-pointer shadow-sm"
                />
                <p className="text-[11px] text-slate-500 mt-2 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-2">
                  <span className="text-blue-500">💡</span>
                  La fecha de vencimiento (Hasta) se calculará automáticamente sumando 1 año.
                </p>
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
            form="tucForm"
            type="submit"
            disabled={loadingSubmit || loadingFetch || loadingListas}
            className="px-6 py-2.5 text-white font-bold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 hover:shadow-lg"
          >
            {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
            {isEdit ? "Guardar Cambios" : "Emitir TUC"}
          </button>
        </div>

      </div>
    </div>
  );
}