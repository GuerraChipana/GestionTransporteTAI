import { useState, useEffect } from "react";
import {
  X, Phone, FileText,
  ShieldAlert, BusFront, Calendar, Palette, Key, Hash, Users, CheckCircle2
} from "lucide-react";

export default function ModalVerVehiculo({ isOpen, onClose, vehiculo }) {
  const [imgError, setImgError] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Efecto para manejar una animación de entrada suave
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsRendered(true), 10);
    } else {
      setIsRendered(false);
    }
    setImgError(false);
  }, [vehiculo, isOpen]);

  if (!isOpen || !vehiculo) return null;

  const mostrarFoto = vehiculo.imagenUrl && vehiculo.imagenUrl.startsWith("http") && !imgError;
  const esActivo = vehiculo.estado === 1;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${isRendered ? "bg-slate-900/40 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0"
        }`}
    >
      {/* Contenedor principal */}
      <div
        className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all duration-300 ease-out ${isRendered ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"
          }`}
      >
        {/* Barra superior Institucional */}
        <div className="h-2 w-full bg-blue-600"></div>

        {/* Header del Modal */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BusFront size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Ficha del Vehículo</h2>
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

            {/* Badge Estado Absolute */}
            <div className="absolute top-4 right-4">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${esActivo
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
                }`}>
                {esActivo ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
                {esActivo ? "ACTIVO" : "INACTIVO"}
              </span>
            </div>

            {/* Foto del Vehículo */}
            <div className="shrink-0 flex justify-center sm:block mt-6 sm:mt-0">
              <div className="relative w-32 h-32 sm:w-40 sm:h-32 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white flex items-center justify-center">
                {mostrarFoto ? (
                  <img
                    src={vehiculo.imagenUrl}
                    alt={`Placa ${vehiculo.placa}`}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <BusFront size={40} className="text-slate-300" />
                )}
              </div>
            </div>

            {/* Datos Resumen */}
            <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Marca</p>
              <h3 className="text-3xl font-black text-slate-800 leading-none mb-4">
                {vehiculo.marca}
              </h3>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
                {/* Placa Destacada */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-sm">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Placa</span>
                  <span className="text-base font-bold text-slate-800 font-mono tracking-wider">{vehiculo.placa}</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-600">
                  <Palette size={16} className="text-blue-500" />
                  {vehiculo.color}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-600">
                  <Calendar size={16} className="text-blue-500" />
                  {vehiculo.anoDeCompra}
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Especificaciones Técnicas */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
              Especificaciones Técnicas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<Key size={18} />} label="Tarjeta de Propiedad" value={vehiculo.nTarjeta || vehiculo.ntarjeta} />
              <InfoCard icon={<Hash size={18} />} label="Número de Motor" value={vehiculo.nMotor || vehiculo.nmotor} />
            </div>
          </div>

          {/* Grid de Propietarios */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
              Datos de Propietarios
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Propietario 1 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    Propietario 1
                  </span>
                  <Users size={16} className="text-slate-300" />
                </div>
                {vehiculo.propietario1 ? (
                  <>
                    <p className="font-bold text-slate-800 text-sm mb-2 line-clamp-1" title={vehiculo.propietario1.nombreCompleto}>
                      {vehiculo.propietario1.nombreCompleto}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FileText size={14} className="text-slate-400" />
                        <span className="font-mono">{vehiculo.propietario1.dni}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {vehiculo.propietario1.telefono || "Sin registrar"}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 italic mt-2">No asignado</p>
                )}
              </div>

              {/* Propietario 2 */}
              <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 ${vehiculo.propietario2 ? 'border-l-slate-400' : 'border-l-slate-200'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                    Propietario 2
                  </span>
                  <Users size={16} className="text-slate-300" />
                </div>
                {vehiculo.propietario2 ? (
                  <>
                    <p className="font-bold text-slate-800 text-sm mb-2 line-clamp-1" title={vehiculo.propietario2.nombreCompleto}>
                      {vehiculo.propietario2.nombreCompleto}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FileText size={14} className="text-slate-400" />
                        <span className="font-mono">{vehiculo.propietario2.dni}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={14} className="text-slate-400" />
                        {vehiculo.propietario2.telefono || "Sin registrar"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center pb-4">
                    <p className="text-xs font-medium text-slate-400 italic">No existe un segundo propietario</p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponente de texto rediseñado como tarjeta
function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
      <div className="p-2.5 bg-white text-slate-400 rounded-lg shadow-sm border border-slate-100">
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