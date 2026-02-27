import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from '../../../utils/tokenUtils';
import { cambiarCredenciales } from '../../../services/usuarioService';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Password() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    password_actual: '',
    password_nueva: '',
    confirmacion_password: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [originalUsuario, setOriginalUsuario] = useState('');

  useEffect(() => {
    const data = getTokenData();
    if (data) {
      setFormData(prev => ({
        ...prev,
        usuario: data.name || '',
        correo: data.email || ''
      }));
      // NUEVO: Guardamos el usuario con el que entró
      setOriginalUsuario(data.name || '');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password_actual.length < 8) return setError("La contraseña actual requiere al menos 8 caracteres.");

    if (formData.password_nueva || formData.confirmacion_password) {
      if (formData.password_nueva.length < 8) return setError("La nueva contraseña requiere al menos 8 caracteres.");
      if (formData.password_nueva === formData.password_actual) return setError("La nueva contraseña no puede ser igual a la actual.");
      if (formData.password_nueva !== formData.confirmacion_password) return setError("Las contraseñas nuevas no coinciden.");
    }

    setLoading(true);
    try {
      const payload = {
        usuario: formData.usuario,
        correo: formData.correo,
        password_actual: formData.password_actual,
        password_nueva: formData.password_nueva || null,
        confirmacion_password: formData.confirmacion_password || null
      };

      await cambiarCredenciales(payload);

      // NUEVA LÓGICA: Verificar si el usuario cambió
      if (formData.usuario !== originalUsuario) {
        localStorage.removeItem('token');

        navigate('/administracion-login', { replace: true });
        return;
      }
      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        password_actual: '',
        password_nueva: '',
        confirmacion_password: ''
      }));
    } catch (err) {
      setError(err.message || err.error || "Error al actualizar las credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 max-w-2xl mx-auto animate-fade-in">

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard/perfil')}
          className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-600 rounded-full transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Actualizar Credenciales</h2>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 size={20} className="shrink-0" />
          <p className="text-sm font-medium">¡Credenciales actualizadas correctamente!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-6 md:p-8 space-y-6">

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-gray-200 pb-2">Información Básica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-1">Nombre de Usuario</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-gray-300 rounded-lg text-slate-700 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 block mb-1">Correo Electrónico</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-gray-300 rounded-lg text-slate-700 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-gray-200 pb-2">Seguridad</h3>

            <div>
              <label className="text-sm font-bold text-slate-600 flex justify-between mb-1">
                <span>Contraseña Actual <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="password_actual"
                  value={formData.password_actual}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-slate-700 focus:border-blue-500 outline-none"
                  placeholder="Requerida para autorizar cambios"
                />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-2.5 text-slate-400">
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-600 block mb-1">Nueva Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-2.5 text-blue-500" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="password_nueva"
                    value={formData.password_nueva}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-slate-700 focus:border-blue-500 outline-none"
                    placeholder="Opcional"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-2.5 text-slate-400">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 block mb-1">Confirmar Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-2.5 text-blue-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmacion_password"
                    value={formData.confirmacion_password}
                    onChange={handleChange}
                    disabled={!formData.password_nueva}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-slate-700 focus:border-blue-500 outline-none disabled:bg-slate-100"
                    placeholder="Repita la nueva"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={!formData.password_nueva} className="absolute right-3 top-2.5 text-slate-400">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-gray-200 p-4 md:p-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/perfil')}
            className="px-5 py-2 text-sm font-bold rounded-lg border border-gray-300 text-slate-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !formData.password_actual}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save size={16} />}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}