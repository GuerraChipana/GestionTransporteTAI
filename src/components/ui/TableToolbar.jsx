import { Search, Plus } from "lucide-react";

export default function TableToolbar({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  onAdd,
  addLabel = "Nuevo",
  searchPlaceholder = "Buscar..."
}) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6">

      <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto flex-1">
        {/* Buscador */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Filtro de Estado Tipo "Pills" (Mucho más bonito que un select) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          {['todos', 'activos', 'inactivos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFiltroEstado(tab)}
              className={`flex-1 sm:px-4 py-1.5 text-sm font-bold rounded-lg capitalize transition-all ${filtroEstado === tab
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Botón Acción Principal */}
      <button
        onClick={onAdd}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 shrink-0"
      >
        <Plus size={20} />
        <span className="font-medium">{addLabel}</span>
      </button>
    </div>
  );
}