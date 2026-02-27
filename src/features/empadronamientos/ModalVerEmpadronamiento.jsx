import { useState, useEffect } from "react";
import { X, BusFront, ShieldCheck, ShieldAlert, ClipboardList, Building2, Hash, CheckCircle2 } from "lucide-react";

export default function ModalVerEmpadronamiento({ isOpen, onClose, empadronamiento }) {
  const [imgError, setImgError] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsRendered(true), 10);
    else setIsRendered(false);
    setImgError(false);
  }, [empadronamiento, isOpen]);

  if (!isOpen || !empadronamiento) return null;

  const esActivo = empadronamiento.estado === 1;
  const vehiculo = empadronamiento.vehiculo;
  const asociacion = empadronamiento.asociacion;
  const mostrarFoto = vehiculo?.imagenUrl && vehiculo.imagenUrl.startsWith("http") && !imgError;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${isRendered ? "bg-slate-900/50 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0"}`}>
      <div className={`bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all duration-300 ease-out ${isRendered ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"}`}>

        {/* Barra superior Institucional */}
        <div className="h-2 w-full bg-blue-600"></div>

        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ClipboardList size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ficha Oficial de Padrón</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-50/50">

          {/* Tarjeta Visual: Número de Padrón (Estilo Certificado Oficial) */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg relative overflow-hidden">
            {/* Icono de fondo decorativo */}
            <ClipboardList size={140} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />

            <div className="relative z-10 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Hash size={16} className="text-blue-400" />
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Número de Registro</p>
              </div>
              <h3 className="text-5xl font-black text-white leading-none tracking-wider font-mono drop-shadow-md">
                {empadronamiento.numEmpadronamiento}
              </h3>
            </div>

            {/* Badge Status Flotante */}
            <div className="relative z-10 flex justify-end">
              <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold shadow-md border ${esActivo
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-md"
                : "bg-rose-500/20 text-rose-400 border-rose-500/30 backdrop-blur-md"
                }`}>
                {esActivo ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                {esActivo ? "PADRÓN ACTIVO" : "DADO DE BAJA"}
              </span>
            </div>
          </div>

          <div className="space-y-4">

            {/* Información del Vehículo (Estilo Credencial) */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="p-5 flex flex-col sm:flex-row items-center gap-5">

                {/* Foto del vehículo */}
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 flex items-center justify-center shrink-0 relative">
                  {mostrarFoto ? (
                    <img src={vehiculo.imagenUrl} alt="Vehículo" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  ) : (
                    <BusFront size={48} className="text-slate-300" />
                  )}
                </div>

                {/* Datos del vehículo */}
                <div className="flex-1 text-center sm:text-left w-full">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
                    <BusFront size={14} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Vehículo Asignado
                    </span>
                  </div>

                  {/* Placa gigante */}
                  <div className="mb-3">
                    <span className="text-3xl font-black text-slate-800 font-mono tracking-widest">
                      {vehiculo?.placa || "N/A"}
                    </span>
                  </div>

                  {/* Badges de información pública (Marca, Color, etc) */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center sm:items-start">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase mb-0.5">Marca Registrada</span>
                      <span className="text-sm font-bold text-slate-700">{vehiculo?.marca || "No registrada"}</span>
                    </div>
                    {/* Aquí puedes agregar más info en el futuro si quieres, como el color, pero SIN poner IDs */}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Asociación */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Building2 size={24} />
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                  Asociación Transportista Vinculada
                </p>
                <p className="text-lg font-bold text-slate-800 leading-tight mb-2">
                  {asociacion?.nombre || "Asociación Desconocida"}
                </p>
                {/* <div className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 rounded-md">
                  ID Ref: {asociacion?.id || "N/A"}
                </div> */}
              </div>
            </div>

            {/* Motivo de Baja (Si aplica) */}
            {empadronamiento.detalle_baja && !esActivo && (
              <div className="mt-2 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100 text-rose-500 shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Motivo de Baja del Padrón</p>
                  <p className="text-sm text-rose-600 font-medium leading-relaxed">{empadronamiento.detalle_baja}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}