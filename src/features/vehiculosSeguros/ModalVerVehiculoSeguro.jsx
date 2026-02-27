import { useState, useEffect } from "react";
import { X, Calendar, BusFront, ShieldCheck, ShieldAlert, Building2, Hash } from "lucide-react";

export default function ModalVerVehiculoSeguro({ isOpen, onClose, seguro }) {
  const [imgError, setImgError] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) setTimeout(() => setIsRendered(true), 10);
    else setIsRendered(false);
    setImgError(false);
  }, [seguro, isOpen]);

  if (!isOpen || !seguro) return null;

  const esActivo = seguro.estado === 1;
  const esVigente = seguro.estado_vencimiento === "No Vencido";
  const vehiculo = seguro.vehiculo;
  const aseguradora = seguro.aseguradora;
  const mostrarFoto = vehiculo?.imagenUrl && vehiculo.imagenUrl.startsWith("http") && !imgError;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${isRendered ? "bg-slate-900/50 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0"}`}>
      <div className={`bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all duration-300 ease-out ${isRendered ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"}`}>
        
        {/* Barra superior Institucional */}
        <div className="h-2 w-full bg-blue-600"></div>

        {/* Header del Modal */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ficha de Póliza de Seguro</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto bg-slate-50/50">
          
          {/* Tarjeta Visual: Datos de la Póliza */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg relative overflow-hidden text-white">
            <ShieldCheck size={140} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
            
            <div className="relative z-10 flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Hash size={16} className="text-blue-400" />
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Número de Póliza</p>
              </div>
              <h3 className="text-3xl font-black text-white leading-none mb-4 tracking-wider font-mono drop-shadow-md">
                {seguro.numPoliza}
              </h3>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-center">
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider mb-0.5">Inicio Vigencia</p>
                  <p className="text-sm font-bold flex items-center gap-1.5"><Calendar size={14} className="text-blue-400"/> {seguro.fecha_vigencia_desde}</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
                  <p className="text-[10px] text-slate-300 uppercase font-bold tracking-wider mb-0.5">Fin Vigencia</p>
                  <p className={`text-sm font-bold flex items-center gap-1.5 ${esVigente ? "text-white" : "text-rose-400"}`}>
                    <Calendar size={14} className={esVigente ? "text-blue-400" : "text-rose-400"}/> {seguro.fecha_vigencia_hasta}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges Flotantes */}
            <div className="relative z-10 flex flex-col gap-2 items-center sm:items-end shrink-0 mt-4 sm:mt-0">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md border uppercase tracking-wider backdrop-blur-md ${esVigente ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}>
                {seguro.estado_vencimiento}
              </span>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md border uppercase tracking-wider backdrop-blur-md ${esActivo ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                {esActivo ? "REGISTRO ACTIVO" : "DE BAJA"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Aseguradora */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                <Building2 size={24} />
              </div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                  Compañía Aseguradora
                </p>
                <p className="text-lg font-bold text-slate-800 leading-tight">
                  {aseguradora?.aseguradora || "Desconocida"}
                </p>
              </div>
            </div>

             {/* Vehículo Asegurado (Estilo Credencial) */}
             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="p-5 flex flex-col sm:flex-row items-center gap-5">
                
                <div className="w-28 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 flex items-center justify-center shrink-0 relative">
                  {mostrarFoto ? (
                    <img src={vehiculo.imagenUrl} alt="Vehículo" className="w-full h-full object-cover" onError={() => setImgError(true)} />
                  ) : (
                    <BusFront size={48} className="text-slate-300" />
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left w-full">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-2">
                    <BusFront size={14} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Vehículo Asegurado
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-3xl font-black text-slate-800 font-mono tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shadow-sm inline-block">
                      {vehiculo?.placa || "N/A"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center sm:items-start">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase mb-0.5">Marca Registrada</span>
                      <span className="text-sm font-bold text-slate-700">{vehiculo?.marca || "No registrada"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivo de Baja (Si aplica) */}
            {seguro.detalle_baja && !esActivo && (
              <div className="mt-2 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 shadow-sm">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-rose-100 text-rose-500 shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">Motivo de Baja</p>
                  <p className="text-sm text-rose-600 font-medium leading-relaxed">{seguro.detalle_baja}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}