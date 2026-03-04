import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { buscarPorPlaca, buscarPorPadron } from '../services/busquedaService';
import {
    Search,
    Car,
    ShieldCheck,
    Users,
    Building2,
    AlertCircle,
    CalendarDays,
    CheckCircle2,
    XCircle,
    FileText,
    X 
} from 'lucide-react';

export default function Busqueda() {
    const navigate = useNavigate();
    const location = useLocation();

    const [tipoBusqueda, setTipoBusqueda] = useState('placa');
    const [valorBusqueda, setValorBusqueda] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const placaParam = params.get('placa');
        const padronParam = params.get('padron');

        if (placaParam) {
            setTipoBusqueda('placa');
            setValorBusqueda(placaParam);
            ejecutarBusqueda('placa', placaParam);
        } else if (padronParam) {
            setTipoBusqueda('padron');
            setValorBusqueda(padronParam);
            ejecutarBusqueda('padron', padronParam);
        } else {
            setResultado(null);
            setError(null);
            setValorBusqueda('');
        }
    }, [location.search]);

    const ejecutarBusqueda = async (tipo, valor) => {
        setLoading(true);
        setError(null);
        setResultado(null);

        try {
            let res;
            if (tipo === 'placa') {
                res = await buscarPorPlaca({ placa: valor });
            } else {
                res = await buscarPorPadron({ numEmpadronamiento: valor });
            }

            if (res && res.data) {
                setResultado(res.data);
            } else {
                setError("No se encontraron resultados para la búsqueda.");
            }
        } catch (err) {
            setError(err.message || "No se encontraron resultados para el vehículo ingresado.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!valorBusqueda.trim()) return;

        if (tipoBusqueda === 'placa') {
            navigate(`?placa=${encodeURIComponent(valorBusqueda.trim())}`);
        } else {
            navigate(`?padron=${encodeURIComponent(valorBusqueda.trim())}`);
        }
    };

    const handleClear = () => {
        navigate(location.pathname, { replace: true });
    };

    return (
        <div className="w-full mx-auto space-y-6 md:space-y-8 animate-fade-in transition-all duration-500">

            {/* --- CAJA DE BÚSQUEDA ADAPTADA AL DISEÑO --- */}
            <div className="w-full rounded-[2rem] shadow-2xl overflow-hidden bg-white max-w-5xl mx-auto">
                
                {/* Selector Segmentado (Pestañas) */}
                <div className="bg-[#f1f5f9] p-4 flex justify-center gap-2 sm:gap-4 border-b border-slate-200">
                    <button
                        type="button"
                        onClick={() => { setTipoBusqueda('placa'); setValorBusqueda(''); setError(null); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                            tipoBusqueda === 'placa' 
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-200 font-semibold' 
                            : 'text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        <Car size={18} className={tipoBusqueda === 'placa' ? 'text-blue-600' : 'text-slate-400'} />
                        Por Placa
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => { setTipoBusqueda('padron'); setValorBusqueda(''); setError(null); }}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                            tipoBusqueda === 'padron' 
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-200 font-semibold' 
                            : 'text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        <FileText size={18} className={tipoBusqueda === 'padron' ? 'text-blue-600' : 'text-slate-400'} />
                        Por N° Padrón
                    </button>
                </div>

                {/* Formulario de Input */}
                <div className="bg-white p-6 sm:p-8">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto">
                        
                        <div className="relative w-full max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={valorBusqueda}
                                onChange={(e) => setValorBusqueda(e.target.value)}
                                placeholder={tipoBusqueda === 'placa' ? "EJ. ABC-123" : "EJ. 1045"}
                                className="w-full pl-11 pr-12 py-3.5 border border-blue-200 rounded-xl leading-5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all shadow-sm uppercase placeholder:normal-case font-medium"
                            />
                            
                            {/* BOTÓN X DENTRO DEL INPUT */}
                            {valorBusqueda && (
                                <button
                                    type="button"
                                    onClick={() => setValorBusqueda('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
                                    title="Borrar texto"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !valorBusqueda.trim()}
                            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:shadow-none shrink-0"
                        >
                            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Consultar'}
                        </button>
                    </form>

                    {/* Mensaje de Error (ahora integrado dentro de la caja blanca) */}
                    {error && (
                        <div className="mt-6 max-w-3xl mx-auto bg-red-50 text-red-700 p-4 rounded-xl flex items-start sm:items-center gap-3 border border-red-200 animate-fade-in">
                            <AlertCircle size={20} className="shrink-0 mt-0.5 sm:mt-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- RESULTADOS --- */}
            {/* (Esta sección se mantiene exactamente igual a tu código original) */}
            {resultado && (
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-400/30 border border-white overflow-hidden animate-fade-in mt-8 flex flex-col">

                    {/* --- HEADER DEL RESULTADO MEJORADO --- */}
                    <div className="bg-slate-900 w-full flex flex-col">
                        
                        {/* Barra Superior: Título y Botón Cerrar */}
                        <div className="flex justify-between items-center w-full px-6 py-4 sm:px-8 border-b border-slate-700/50">
                            <span className="text-slate-400 text-xs sm:text-sm font-bold tracking-widest uppercase">
                                Detalles del Vehículo
                            </span>
                            <button
                                onClick={handleClear}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                                aria-label="Cerrar resultados"
                            >
                                <XCircle size={18} /> <span className="hidden sm:inline">Cerrar</span>
                            </button>
                        </div>

                        {/* Contenido Principal del Header (Placa y Padrón) */}
                        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 w-full">
                            
                            {/* Información del Vehículo (Izquierda) */}
                            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                <div className="bg-blue-500/20 p-4 sm:p-5 rounded-2xl border border-blue-400/30 backdrop-blur-sm shrink-0">
                                    <Car size={36} className="text-blue-300" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-widest drop-shadow-md break-all">
                                        {resultado.vehiculo?.placa || 'SIN PLACA'}
                                    </h3>
                                    <p className="text-blue-200 text-sm sm:text-base font-semibold uppercase tracking-wider mt-1 sm:mt-2">
                                        {resultado.vehiculo?.marca || '-'} • {resultado.vehiculo?.color || '-'}
                                    </p>
                                </div>
                            </div>

                            {/* Número de Padrón (Derecha) */}
                            <div className="w-full sm:w-auto bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-inner flex flex-col sm:items-end shrink-0">
                                <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
                                    N° Padrón
                                </p>
                                <p className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-400 drop-shadow-lg">
                                    {resultado.numEmpadronamiento || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* --- FIN HEADER --- */}


                    {/* Cuerpo del Resultado (Grid Responsivo) */}
                    <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 bg-slate-50/80 w-full">
                        
                        {/* Columna Izquierda */}
                        <div className="space-y-6 sm:space-y-8">
                            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md">
                                <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                    <Building2 size={18} className="text-blue-600" /> Asociación y TUC
                                </h4>
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Asociación Asignada</p>
                                        <p className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">{resultado.asociacion?.nombre || 'Independiente / Ninguna'}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 flex-1">
                                            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">N° TUC</p>
                                            <p className="font-black text-slate-800 text-lg mt-0.5">{resultado.tuc?.numTuc || 'No registrado'}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 flex-1">
                                            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Estado TUC</p>
                                            <span className={`inline-flex items-center gap-1.5 font-bold text-sm mt-1.5 px-2.5 py-1 rounded-lg ${resultado.tuc?.estadoVigencia?.toUpperCase() === 'NO VENCIDO' || resultado.tuc?.estadoVigencia?.toUpperCase() === 'ACTIVO' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                                {(resultado.tuc?.estadoVigencia?.toUpperCase() === 'NO VENCIDO' || resultado.tuc?.estadoVigencia?.toUpperCase() === 'ACTIVO') ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                {resultado.tuc?.estadoVigencia || 'Desconocido'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md">
                                <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                    <Users size={18} className="text-blue-600" /> Propietarios
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-slate-50 py-3 px-4 rounded-xl border border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                            <Users size={14} className="text-slate-500" />
                                        </div>
                                        <p className="text-sm sm:text-base font-bold text-slate-700">
                                            {resultado.vehiculo?.propietario1 || 'No registrado'}
                                        </p>
                                    </div>
                                    {resultado.vehiculo?.propietario2 && (
                                        <div className="flex items-center gap-3 bg-slate-50 py-3 px-4 rounded-xl border border-slate-100">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                <Users size={14} className="text-slate-500" />
                                            </div>
                                            <p className="text-sm sm:text-base font-bold text-slate-700">
                                                {resultado.vehiculo.propietario2}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-6 sm:space-y-8">
                            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md">
                                <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                    <ShieldCheck size={18} className="text-blue-600" /> Póliza de Seguro
                                </h4>
                                {resultado.vehiculoSeguro ? (
                                    <div className={`p-5 rounded-2xl border ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'bg-red-50/50 border-red-200' : 'bg-blue-50/50 border-blue-200'}`}>
                                        <div className="space-y-4">
                                            <div>
                                                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'text-red-500' : 'text-blue-600'}`}>Aseguradora</p>
                                                <p className="font-bold text-slate-800 text-base sm:text-lg">{resultado.aseguradora?.nombreAseguradora || 'Desconocida'}</p>
                                            </div>
                                            <div>
                                                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'text-red-500' : 'text-blue-600'}`}>N° Póliza</p>
                                                <p className="font-bold text-slate-700">{resultado.vehiculoSeguro.numPoliza}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-slate-200/60">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                    <CalendarDays size={16} className="text-slate-400" />
                                                    Hasta: {resultado.vehiculoSeguro.fechaVigenciaHasta}
                                                </div>
                                                <span className={`inline-flex justify-center text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                                                    {resultado.vehiculoSeguro.estadoVencimiento}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 border-dashed p-6 rounded-2xl text-center text-slate-500 text-sm font-medium flex flex-col items-center gap-2">
                                        <AlertCircle size={24} className="text-slate-400" />
                                        No cuenta con seguro vehicular registrado.
                                    </div>
                                )}
                            </div>

                            {resultado.vehiculo?.imagenUrl && (
                                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md">
                                    <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                        Foto Referencial
                                    </h4>
                                    <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                                        <img
                                            src={resultado.vehiculo.imagenUrl}
                                            alt="Vehículo Referencial"
                                            className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}