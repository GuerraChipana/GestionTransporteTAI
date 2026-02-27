import Busqueda from '../components/Busqueda'; // Ajusta la ruta si es necesario

export default function InicioPrincipal() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">

      {/* Fondo decorativo (Brillos sutiles) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Hero / Banner Superior con Degradado */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 pb-32 pt-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-5">

          <div className="inline-flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-400/20 backdrop-blur-sm shadow-inner">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <p className="text-blue-200 font-semibold text-xs sm:text-sm uppercase tracking-widest">
              Sistema Integrado TAI
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 tracking-tight leading-tight">
            Portal de Búsqueda Vehicular
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-medium px-4">
            Consulta rápida del estado de empadronamiento, pólizas de seguro y permisos (TUC) de los vehículos de transporte en la jurisdicción.
          </p>
        </div>
      </div>

      {/* Contenedor del Buscador (Se superpone al banner) */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-24 pb-16">
        <Busqueda />
      </div>

    </div>
  );
}