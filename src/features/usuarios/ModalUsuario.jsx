import { useState, useEffect } from "react";
import { X, Loader2, UserCircle } from "lucide-react";
import { crearUsuario, actualizarUsuario, obtenerUsuarioPorId } from "../../services/usuarioService";
import { useNavigate } from "react-router-dom";
import { getTokenData } from "../../utils/tokenUtils";

const formInicial = {
  nombre: "", apPaterno: "", apMaterno: "",
  dni: "", correo: "", usuario: "", contrasena: "", rol: "administrador",
};

export default function ModalUsuario({ isOpen, onClose, usuarioId, onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(formInicial);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  
  const userID = getTokenData();
  const isEdit = !!usuarioId;

  // Efecto Profesional: Traer datos frescos desde la BD si es edición
  useEffect(() => {
    if (isEdit && isOpen) {
      const fetchUsuario = async () => {
        try {
          setLoadingFetch(true);
          const data = await obtenerUsuarioPorId(usuarioId);
          // Mapeamos los datos de la BD al formulario
          setFormData({
            nombre: data.nombre || "",
            apPaterno: data.ap_paterno || "",
            apMaterno: data.ap_materno || "",
            dni: data.dni || "",
            correo: data.correo || "",
            usuario: data.usuario || "",
            contrasena: "", // Jamás devolvemos la contraseña
            rol: data.rol?.toLowerCase() || "administrador",
          });
        } catch (err) {
          setError("Error al cargar los datos del usuario para editar.");
        } finally {
          setLoadingFetch(false);
        }
      };
      fetchUsuario();
    } else if (!isEdit && isOpen) {
      setFormData(formInicial);
      setError(null);
    }
  }, [usuarioId, isEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    try {
      if (isEdit) {
        const { dni, contrasena, ...updateData } = formData;
        await actualizarUsuario(usuarioId, updateData);

        const userIdLogueado = userID?.id;

        if (userIdLogueado && String(usuarioId) === String(userIdLogueado)) {
          alert("Actualizaste tus propios datos. Inicia sesión nuevamente.");
          localStorage.clear(); // elimina token y datos
          navigate("/administracion-login");
          return;
        }

      } else {
        await crearUsuario(formData);
      }

      onSuccess();
      onClose();

    } catch (err) {
      const msg =
        err.message ||
        (err.errors
          ? Object.values(err.errors).join(", ")
          : "Ocurrió un error inesperado.");
      setError(msg);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[popIn_0.3s_ease-out_forwards]">

        {/* Header Modal */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserCircle size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEdit ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {loadingFetch ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="animate-spin text-blue-600 mb-3" size={32} />
              <p className="text-slate-500 font-medium text-sm">Obteniendo datos del usuario...</p>
            </div>
          ) : (
            <form id="userForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  DNI 
                  {isEdit && <span className="text-rose-500 text-[10px] uppercase tracking-wider font-bold bg-rose-50 px-2 py-0.5 rounded-md">Bloqueado</span>}
                </label>
                <input type="text" name="dni" value={formData.dni} onChange={handleChange} required disabled={isEdit} maxLength={8} pattern="\d{8}" title="Debe contener 8 dígitos"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-all text-slate-700 font-mono" 
                  placeholder="Ej: 71234567" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required minLength={2} maxLength={50}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700" 
                  placeholder="Nombres del usuario" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Apellido Paterno</label>
                <input type="text" name="apPaterno" value={formData.apPaterno} onChange={handleChange} required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Apellido Materno</label>
                <input type="text" name="apMaterno" value={formData.apMaterno} onChange={handleChange} required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700" 
                  placeholder="correo@ejemplo.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usuario (Login)</label>
                <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} required minLength={4} maxLength={30}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium" 
                  placeholder="Nombre de usuario" />
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                  <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required minLength={8}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700" 
                    placeholder="Mínimo 8 caracteres" />
                </div>
              )}

              <div className={isEdit ? "md:col-span-2" : ""}>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Rol del Sistema</label>
                <select name="rol" value={formData.rol} onChange={handleChange} required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white cursor-pointer transition-all text-slate-700">
                  <option value="superadministrador">Superadministrador</option>
                  <option value="administrador">Administrador</option>
                  <option value="moderador">Moderador</option>
                  <option value="asistente">Asistente</option>
                </select>
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
            form="userForm" 
            type="submit" 
            disabled={loadingSubmit || loadingFetch} 
            className="px-5 py-2.5 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
            {isEdit ? "Guardar Cambios" : "Crear Usuario"}
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