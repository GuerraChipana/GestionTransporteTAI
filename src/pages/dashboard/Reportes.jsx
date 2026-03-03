import { useState, useEffect, useMemo } from "react";
import {
  Car,
  Users,
  Handshake,
  ShieldCheck,
  NotepadText,
  FileSpreadsheet,
  Activity,
  DownloadCloud,
  CheckCircle2,
  TrendingUp,
  FileText,
  BarChart3
} from "lucide-react";
import { CardSim } from "lucide-react";
import { obtenerDashboard, descargarExcel } from "../../services/reporteService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Reportes() {
  const [resumen, setResumen] = useState({
    totalVehiculosActiv: 0,
    totalConductoresActiv: 0,
    totalAsociacionesActiv: 0,
    totalAseguradorasActiv: 0,
    totalTucsActiv: 0,
    totalPersonasActiv: 0,
    totalEmpadronamientosActiv: 0
  });

  const [loading, setLoading] = useState(true);
  const [descargando, setDescargando] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await obtenerDashboard();

      if (res.success) {
        setResumen(res.data);
      }
    } catch (error) {
      console.error("Error al cargar el dashboard de reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDescarga = async (tipo) => {
    try {
      setDescargando(tipo);
      await descargarExcel(tipo);
    } catch (error) {
      console.error("Error en la descarga", error);
    } finally {
      setDescargando(null);
    }
  };

  const dataGrafico = useMemo(() => [
    { name: 'Vehículos', cantidad: resumen.totalVehiculosActiv, color: '#3b82f6' }, 
    { name: 'Conductores', cantidad: resumen.totalConductoresActiv, color: '#10b981' }, 
    { name: 'Asociaciones', cantidad: resumen.totalAsociacionesActiv, color: '#a855f7' }, 
    { name: 'Aseguradoras', cantidad: resumen.totalAseguradorasActiv, color: '#f43f5e' }, 
    { name: 'Empadronam.', cantidad: resumen.totalEmpadronamientosActiv, color: '#06b6d4' }, 
    { name: 'TUCs', cantidad: resumen.totalTucsActiv, color: '#f97316' }, 
    { name: 'Personas', cantidad: resumen.totalPersonasActiv, color: '#475569' }, 
  ], [resumen]);

  // Animación numérica fluida
  const AnimatedNumber = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTimestamp = null;
      const duration = 1000; 
      const endValue = parseInt(value, 10) || 0;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeProgress * endValue));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }, [value]);

    return <span>{count.toLocaleString('es-PE')}</span>;
  };

  // Tarjeta compacta para que no empuje el contenido
  const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
    <div className={`bg-white rounded-xl border-l-4 ${borderClass} border-y border-r border-gray-100 p-2.5 shadow-sm hover:shadow-md transition-all flex items-center justify-between`}>
      <div className="overflow-hidden pr-2">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5 truncate" title={title}>{title}</p>
        <div className="flex items-center gap-1.5">
          {loading ? (
            <div className="h-5 w-8 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h3 className="text-lg font-extrabold text-gray-800 leading-none">
              <AnimatedNumber value={value} />
            </h3>
          )}
        </div>
      </div>
      <div className={`p-1.5 rounded-lg ${colorClass} bg-opacity-10 shrink-0`}>
        <Icon size={16} className={colorClass.replace('bg-', 'text-').replace('-500', '-600')} />
      </div>
    </div>
  );

  // Fila de descarga optimizada
  const ExportRow = ({ title, tipo, icon: Icon, isLast }) => (
    <div className={`flex items-center justify-between py-2 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors px-1`}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
          <Icon size={15} />
        </div>
        <div>
          <h4 className="text-[12px] font-bold text-gray-700 leading-tight">{title}</h4>
          <p className="text-[9px] text-gray-500 flex items-center gap-1">
            <FileText size={9} /> Data oficial
          </p>
        </div>
      </div>
      <button
        onClick={() => handleDescarga(tipo)}
        disabled={descargando === tipo}
        className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:bg-blue-400 min-w-[85px] justify-center"
      >
        {descargando === tipo ? (
          <><Activity size={10} className="animate-spin" /> Procesando</>
        ) : (
          <><DownloadCloud size={10} /> Descargar</>
        )}
      </button>
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-xl rounded-md">
          <p className="font-bold text-gray-700 text-xs">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-semibold text-[11px] mt-0.5">
            Activos: <span className="text-sm">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    // LA MAGIA ESTÁ AQUÍ: Se fuerza una altura calculada restando los headers y paddings
    <div className="flex flex-col w-full" style={{ height: "calc(100vh - 145px)" }}>
      
      {/* ENCABEZADO ESTÁTICO (No se encoge) */}
      <div className="flex-none flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 tracking-tight">
             Métricas y Reportes Oficiales
          </h1>
          <p className="text-[10px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider">
            Municipalidad Distrital Túpac Amaru Inca
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-bold">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          SISTEMA EN LÍNEA
        </div>
      </div>

      {/* CUERPO PRINCIPAL FLEXIBLE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* PANEL IZQUIERDO */}
        <div className="lg:col-span-8 flex flex-col min-h-0">
          
          {/* Tarjetas */}
          <div className="flex-none grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 mb-3">
            <StatCard title="Vehículos" value={resumen.totalVehiculosActiv} icon={Car} borderClass="border-blue-500" colorClass="bg-blue-500" />
            <StatCard title="Conductores" value={resumen.totalConductoresActiv} icon={Users} borderClass="border-emerald-500" colorClass="bg-emerald-500" />
            <StatCard title="Asociaciones" value={resumen.totalAsociacionesActiv} icon={Handshake} borderClass="border-purple-500" colorClass="bg-purple-500" />
            <StatCard title="Aseguradoras" value={resumen.totalAseguradorasActiv} icon={ShieldCheck} borderClass="border-rose-500" colorClass="bg-rose-500" />
            
            <StatCard title="Empadronamientos" value={resumen.totalEmpadronamientosActiv} icon={NotepadText} borderClass="border-cyan-500" colorClass="bg-cyan-500" />
            <StatCard title="TUCs Emitidos" value={resumen.totalTucsActiv} icon={CardSim} borderClass="border-orange-500" colorClass="bg-orange-500" />
            <StatCard title="Total Personas" value={resumen.totalPersonasActiv} icon={Users} borderClass="border-slate-600" colorClass="bg-slate-600" />
          </div>

          {/* Gráfico de Barras que se ajusta al espacio restante automáticamente */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex flex-col min-h-0">
             <h2 className="flex-none text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <BarChart3 size={14} className="text-blue-600" /> 
                Distribución de Entidades Activas
             </h2>
             <div className="flex-1 w-full min-h-0">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Cargando...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataGrafico} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280', fontWeight: 600 }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} content={<CustomTooltip />} />
                      <Bar dataKey="cantidad" radius={[3, 3, 0, 0]} animationDuration={1000}>
                        {dataGrafico.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
             </div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm min-h-0">
          <div className="flex-none bg-slate-50 border-b border-gray-200 p-3">
             <h2 className="text-[12px] font-bold text-gray-800 flex items-center gap-1.5 uppercase tracking-wide">
              <FileSpreadsheet size={14} className="text-emerald-600" /> 
              Exportación de Datos
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
              Listados oficiales en formato Excel (.xlsx).
            </p>
          </div>
          
          {/* Lista scrolleable si las pantallas son MUY pequeñas, pero normalmente encajará */}
          <div className="flex-1 p-2 overflow-y-auto min-h-0">
            <ExportRow title="Padrón Vehicular" tipo="vehiculos" icon={Car} />
            <ExportRow title="Registro de Conductores" tipo="conductores" icon={Users} />
            <ExportRow title="Directorio Asociaciones" tipo="asociaciones" icon={Handshake} />
            <ExportRow title="Listado Aseguradoras" tipo="aseguradoras" icon={ShieldCheck} />
            <ExportRow title="Constancias Empadron." tipo="empadronamientos" icon={NotepadText} />
            <ExportRow title="Registro TUCs Emitidos" tipo="tucs" icon={CardSim} />
            <ExportRow title="Base de Datos Personas" tipo="personas" icon={Users} isLast={true} />
          </div>
          
          <div className="flex-none bg-blue-50/50 border-t border-blue-100 p-2.5 flex items-center gap-1.5 text-blue-800 text-[9px] font-bold uppercase tracking-wider justify-center">
             <CheckCircle2 size={12} className="shrink-0" />
             Generación instantánea
          </div>
        </div>

      </div>
    </div>
  );
}