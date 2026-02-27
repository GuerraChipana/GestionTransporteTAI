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
    Eraser,
    FileText
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
        <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">

            {/* --- CAJA DE BÚSQUEDA --- */}
            <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50">

                {/* Selector Segmentado (Estilo iOS) */}
                <div className="max-w-md mx-auto bg-slate-100 p-1.5 rounded-2xl flex items-center mb-6">
                    <button
                        type="button"
                        onClick={() => { setTipoBusqueda('placa'); setValorBusqueda(''); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl flex justify-center items-center gap-2 transition-all duration-300 ${tipoBusqueda === 'placa' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Car size={16} className={tipoBusqueda === 'placa' ? 'text-blue-600' : 'text-slate-400'} />
                        Por Placa
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTipoBusqueda('padron'); setValorBusqueda(''); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-xl flex justify-center items-center gap-2 transition-all duration-300 ${tipoBusqueda === 'padron' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <FileText size={16} className={tipoBusqueda === 'padron' ? 'text-blue-600' : 'text-slate-400'} />
                        Por N° Padrón
                    </button>
                </div>

                {/* Formulario de Input */}
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-2xl mx-auto">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={valorBusqueda}
                            onChange={(e) => setValorBusqueda(e.target.value)}
                            placeholder={tipoBusqueda === 'placa' ? "EJ. ABC-123" : "EJ. 1045"}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-800 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all uppercase placeholder:normal-case placeholder:font-normal"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !valorBusqueda.trim()}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px] shadow-lg shadow-blue-600/30 disabled:shadow-none"
                    >
                        {loading ? <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Consultar'}
                    </button>
                </form>

                {/* Mensaje de Error */}
                {error && (
                    <div className="mt-6 max-w-2xl mx-auto bg-red-50 text-red-700 p-4 rounded-2xl flex items-start sm:items-center gap-3 border border-red-100 animate-fade-in">
                        <AlertCircle size={20} className="shrink-0 mt-0.5 sm:mt-0" />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}
            </div>

            {/* --- RESULTADOS --- */}
            {resultado && (
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden animate-fade-in">

                    {/* Header del Resultado */}
                    <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white text-center sm:text-left">

                        {/* Botón Limpiar (Adaptable a celular) */}
                        <button
                            onClick={handleClear}
                            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs sm:text-sm font-bold transition-all backdrop-blur-md"
                        >
                            <Eraser size={16} /> <span className="hidden sm:inline">Limpiar</span>
                        </button>

                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full mt-8 sm:mt-0">
                            <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-400/20 backdrop-blur-sm">
                                <Car size={36} className="text-blue-300" />
                            </div>
                            <div>
                                <h3 className="text-3xl sm:text-4xl font-black tracking-widest drop-shadow-md">
                                    {resultado.vehiculo?.placa || 'SIN PLACA'}
                                </h3>
                                <p className="text-blue-200 text-sm sm:text-base font-semibold uppercase tracking-wider mt-1">
                                    {resultado.vehiculo?.marca || '-'} • {resultado.vehiculo?.color || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="w-full sm:w-auto bg-slate-900/50 rounded-2xl p-4 border border-white/5 backdrop-blur-sm shrink-0">
                            <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">N° Padrón</p>
                            <p className="text-4xl sm:text-5xl font-black text-amber-400 drop-shadow-lg">{resultado.numEmpadronamiento || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Cuerpo del Resultado (Grid Responsivo) */}
                    <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

                        {/* Columna Izquierda */}
                        <div className="space-y-6 sm:space-y-8">

                            {/* Asociación y TUC */}
                            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100">
                                <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                    <Building2 size={18} className="text-blue-600" /> Asociación y TUC
                                </h4>
                                <div className="space-y-4">
                                    <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Asociación Asignada</p>
                                        <p className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">{resultado.asociacion?.nombre || 'Independiente / Ninguna'}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">N° TUC</p>
                                            <p className="font-black text-slate-800 text-lg mt-0.5">{resultado.tuc?.numTuc || 'No registrado'}</p>
                                        </div>
                                        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                                            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Estado TUC</p>
                                            <span className={`inline-flex items-center gap-1.5 font-bold text-sm mt-1.5 px-2.5 py-1 rounded-lg ${resultado.tuc?.estadoVigencia?.toUpperCase() === 'NO VENCIDO' || resultado.tuc?.estadoVigencia?.toUpperCase() === 'ACTIVO' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                {(resultado.tuc?.estadoVigencia?.toUpperCase() === 'NO VENCIDO' || resultado.tuc?.estadoVigencia?.toUpperCase() === 'ACTIVO') ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                                {resultado.tuc?.estadoVigencia || 'Desconocido'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Propietarios */}
                            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100">
                                <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                    <Users size={18} className="text-blue-600" /> Propietarios
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 bg-white py-3 px-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                            <Users size={14} className="text-slate-500" />
                                        </div>
                                        <p className="text-sm sm:text-base font-bold text-slate-700">
                                            {resultado.vehiculo?.propietario1 || 'No registrado'}
                                        </p>
                                    </div>
                                    {resultado.vehiculo?.propietario2 && (
                                        <div className="flex items-center gap-3 bg-white py-3 px-4 rounded-xl border border-slate-200 shadow-sm">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
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

                            {/* Póliza de Seguro */}
                            <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100">
                                <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                    <ShieldCheck size={18} className="text-blue-600" /> Póliza de Seguro
                                </h4>
                                {resultado.vehiculoSeguro ? (
                                    <div className={`p-5 rounded-2xl border shadow-sm ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'bg-red-50/50 border-red-200' : 'bg-blue-50/50 border-blue-200'}`}>
                                        <div className="space-y-4">
                                            <div>
                                                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'text-red-500' : 'text-blue-500'}`}>Aseguradora</p>
                                                <p className="font-bold text-slate-800 text-base sm:text-lg">{resultado.aseguradora?.nombreAseguradora || 'Desconocida'}</p>
                                            </div>
                                            <div>
                                                <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'text-red-500' : 'text-blue-500'}`}>N° Póliza</p>
                                                <p className="font-bold text-slate-700">{resultado.vehiculoSeguro.numPoliza}</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 border-t border-slate-200/60">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                                    <CalendarDays size={16} className="text-slate-400" />
                                                    Hasta: {resultado.vehiculoSeguro.fechaVigenciaHasta}
                                                </div>
                                                <span className={`inline-flex justify-center text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${resultado.vehiculoSeguro.estadoVencimiento?.toUpperCase() === 'VENCIDO' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {resultado.vehiculoSeguro.estadoVencimiento}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200 border-dashed p-6 rounded-2xl text-center text-slate-500 text-sm font-medium flex flex-col items-center gap-2">
                                        <AlertCircle size={24} className="text-slate-300" />
                                        No cuenta con seguro vehicular registrado.
                                    </div>
                                )}
                            </div>

                            {/* Imagen del Vehículo */}
                            {resultado.vehiculo?.imagenUrl && (
                                <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100">
                                    <h4 className="flex items-center gap-2 text-sm sm:text-base font-black text-slate-800 uppercase mb-4">
                                        Foto Referencial
                                    </h4>
                                    <div className="rounded-2xl overflow-hidden border-2 border-white shadow-md">
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