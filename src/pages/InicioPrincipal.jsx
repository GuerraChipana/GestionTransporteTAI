import Busqueda from '../components/Busqueda'; // Ajusta la ruta si es necesario

export default function InicioPrincipal() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">

      {/* Hero / Banner Superior (Fondo azul marino estilo institucional) */}
      <div className="relative bg-[#0b172a] bg-gradient-to-b from-slate-900 to-blue-950 pb-40 pt-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">

        {/* Decoraciones sutiles opcionales */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8">

          {/* Logo */}
          <div className="flex justify-center">
            <img
              src="logo-mdati-blanco.png"
              alt="Municipalidad Distrital de Túpac Amaru Inca"
              className="h-28 sm:h-32 object-contain drop-shadow-lg"
            />
          </div>

          {/* Textos principales */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              Portal de Búsqueda Vehicular
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal px-4">
              Consulta rápida del estado de empadronamiento, pólizas de seguro y permisos (TUC) de los vehículos de transporte en la jurisdicción.
            </p>
          </div>

        </div>
      </div>

      {/* Contenedor del Buscador (Se superpone al banner) */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-24 pb-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <Busqueda />
        </div>
      </div>

    </div>
  );
}