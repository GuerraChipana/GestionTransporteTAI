import { useState, useEffect } from "react";
import { X, User, IdCard, Calendar, Droplets, Car, ShieldCheck, ShieldAlert, TriangleAlert, Hash } from "lucide-react";

export default function ModalVerConductor({ isOpen, onClose, conductor }) {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) setTimeout(() => setIsRendered(true), 10);
        else setIsRendered(false);
    }, [conductor, isOpen]);

    if (!isOpen || !conductor) return null;

    const esActivo = conductor.estado === 1;
    const esVigente = conductor.estadoVigencia === "Vigente";
    const persona = conductor.persona;
    const vehiculos = conductor.vehiculosAsignados || [];

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-out ${isRendered ? "bg-slate-900/50 backdrop-blur-sm opacity-100" : "bg-transparent opacity-0"}`}>
            <div className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] transform transition-all duration-300 ease-out ${isRendered ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-95 opacity-0"}`}>

                {/* Barra superior Institucional */}
                <div className="h-2 w-full bg-blue-600"></div>

                {/* Header del Modal */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <IdCard size={22} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ficha del Conductor</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto bg-slate-50/50 custom-scrollbar">

                    {/* Tarjeta Visual: Licencia de Conducir (Estilo Premium) */}
                    <div className="flex flex-col mb-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg relative overflow-hidden text-white border border-slate-700">
                        <IdCard size={150} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />

                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 border-b border-white/10 pb-5">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Hash size={14} className="text-blue-400" />
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Licencia de Conducir</p>
                                </div>
                                <h3 className="text-4xl font-black text-white leading-none tracking-wider font-mono drop-shadow-md">
                                    {conductor.numLicencia}
                                </h3>
                            </div>

                            <div className="flex flex-col items-start sm:items-end gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md border uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 ${esVigente ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"}`}>
                                    {esVigente ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                    LICENCIA {conductor.estadoVigencia}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md border uppercase tracking-wider backdrop-blur-md ${esActivo ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                                    {esActivo ? "ESTADO ACTIVO" : "DADO DE BAJA"}
                                </span>
                            </div>
                        </div>

                        {/* DATOS DE LA LICENCIA */}
                        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Clase - Cat.</p>
                                <p className="text-xl font-black text-white">{conductor.clase || "B"} <span className="text-slate-400 font-medium text-base">-</span> {conductor.categoria}</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Grupo Sangre</p>
                                <p className="text-lg font-black text-rose-400 flex items-center gap-1.5"><Droplets size={18} className="drop-shadow-sm" /> {conductor.grupSangre || "N/A"}</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Expedición</p>
                                <p className="text-sm font-bold mt-1 text-slate-200 flex items-center gap-1.5"><Calendar size={12} className="text-blue-400" /> {conductor.fecha_desde}</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
                                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-1">Vencimiento</p>
                                <p className={`text-sm font-bold mt-1 flex items-center gap-1.5 ${!esVigente ? "text-rose-400" : "text-slate-200"}`}>
                                    <Calendar size={12} className={esVigente ? "text-blue-400" : "text-rose-400"} /> {conductor.fecha_hasta}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5">

                        {/* Información Personal */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div>
                            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl border border-slate-100 shrink-0">
                                <User size={36} />
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">
                                    Datos Personales
                                </p>
                                <p className="text-2xl font-black text-slate-800 leading-tight mb-3 uppercase tracking-tight">
                                    {persona?.nombre} {persona?.apPaterno} {persona?.apMaterno}
                                </p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center sm:items-start">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">DNI</span>
                                        <span className="text-sm font-bold text-slate-800 font-mono">{persona?.dni || "N/A"}</span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center sm:items-start">
                                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Celular</span>
                                        <span className="text-sm font-bold text-slate-800 font-mono">{persona?.telefono || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Restricciones */}
                        {conductor.restriccion && conductor.restriccion !== "NINGUNA" && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-amber-100 text-amber-500 shrink-0">
                                    <TriangleAlert size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-0.5">Restricciones de Conducción</p>
                                    <p className="text-sm font-bold text-amber-900">{conductor.restriccion}</p>
                                </div>
                            </div>
                        )}

                        {/* Vehículos Asignados */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Car size={18} className="text-blue-500" />
                                Vehículos Asignados
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs ml-auto">Total: {vehiculos.length}</span>
                            </h4>

                            {vehiculos.length === 0 ? (
                                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 text-center">
                                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                                        <Car size={24} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium">Este conductor no tiene vehículos asignados actualmente.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {vehiculos.map((v) => (
                                        <div key={v.idVehi} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-4 hover:border-blue-300 hover:shadow-sm transition-all group">
                                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-blue-500 group-hover:text-blue-600 group-hover:scale-105 transition-transform">
                                                <Car size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Placa</p>
                                                <p className="text-base font-black text-slate-800 font-mono tracking-widest leading-none mb-1">{v.placa}</p>
                                                <p className="text-[11px] text-slate-500 font-medium bg-white px-2 py-0.5 rounded inline-block border border-slate-100">{v.marca || "No registrada"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Motivo de Baja (Si aplica) */}
                        {conductor.detalle_baja && !esActivo && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 shadow-sm">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-rose-100 text-rose-500 shrink-0">
                                    <ShieldAlert size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">Motivo de Baja Registrado</p>
                                    <p className="text-sm text-rose-600 font-medium leading-relaxed">{conductor.detalle_baja}</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}