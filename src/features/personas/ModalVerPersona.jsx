import { useState, useEffect } from "react";
import {
  X, User, MapPin, Phone, Mail, FileText,
  ShieldAlert, ShieldCheck, UserCircle, Map
} from "lucide-react";

export default function ModalVerPersona({ isOpen, onClose, persona }) {
  const [imgError, setImgError] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Efecto para animación fluida
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsRendered(true), 10);
    } else {
      setIsRendered(false);
    }
    setImgError(false);
  }, [persona, isOpen]);

  if (!isOpen || !persona) return null;

  const mostrarFoto = persona.foto && persona.foto.startsWith("http") && !imgError;
  const esActivo = persona.estado === 1;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${
        isRendered ? "bg-slate-900/40 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0"
      }`}
    >
      {/* Contenedor principal */}
      <div 
        className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all duration-300 ease-out ${
          isRendered ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Barra superior Institucional */}
        <div className="h-2 w-full bg-blue-600"></div>

        {/* Header del Modal */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <UserCircle size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Ficha del Ciudadano</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo escrolleable */}
        <div className="p-6 overflow-y-auto">

          {/* Tarjeta Principal (Hero) */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/60 relative">
            
            {/* Badge Estado */}
            <div className="absolute top-4 right-4">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${
                esActivo 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}>
                {esActivo ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                {esActivo ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>

            {/* Foto del Ciudadano */}
            <div className="shrink-0 flex justify-center sm:block mt-6 sm:mt-0">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-slate-200 flex items-center justify-center">
                {mostrarFoto ? (
                  <img
                    src={persona.foto}
                    alt={`Foto de ${persona.nombre}`}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <User size={48} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Datos Resumen */}
            <div className="flex-1 flex flex-col justify-center text-center sm:text-left mt-2 sm:mt-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Nombre Completo</p>
              <h3 className="text-2xl font-black text-slate-800 leading-tight mb-1">
                {persona.nombre}
              </h3>
              <p className="text-lg text-slate-600 font-medium mb-4">
                {persona.ap_paterno} {persona.ap_materno}
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {/* DNI Destacado */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-sm">
                  <span className="text-xs text-slate-400 uppercase font-semibold">DNI</span>
                  <span className="text-base font-bold text-slate-800 font-mono tracking-wider">{persona.dni}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Información de Contacto */}
          <div className="mb-2">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
              Información de Contacto y Residencia
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<Phone size={18} />} label="Teléfono Celular" value={persona.telefono} />
              <InfoCard icon={<Mail size={18} />} label="Correo Electrónico" value={persona.correo} />
              <InfoCard icon={<Map size={18} />} label="Ubigeo" value={persona.ubigeo} />
              <InfoCard icon={<MapPin size={18} />} label="Domicilio Registrado" value={persona.domicilio} />
            </div>
          </div>

          {/* Motivo de Baja (Si aplica) */}
          {persona.detalle_baja && !esActivo && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100 text-rose-500 shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Motivo de Baja</p>
                <p className="text-sm text-rose-600 font-medium leading-relaxed">{persona.detalle_baja}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Subcomponente de texto rediseñado como tarjeta
function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
      <div className="p-2.5 bg-white text-blue-500 rounded-lg shadow-sm border border-slate-100">
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-slate-800 truncate">
          {value || <span className="text-slate-400 italic font-normal">No registrado</span>}
        </p>
      </div>
    </div>
  );
}