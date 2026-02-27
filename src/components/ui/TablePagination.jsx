import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination({
  paginaActual,
  totalPaginas,
  totalRegistros,
  indicePrimerRegistro,
  indiceUltimoRegistro,
  setPaginaActual
}) {
  if (totalRegistros === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 border border-t-0 border-slate-200 rounded-b-xl bg-slate-50 gap-4">
      <span className="text-sm text-slate-600 text-center sm:text-left">
        Mostrando <span className="font-bold text-slate-800">{indicePrimerRegistro + 1}</span> a <span className="font-bold text-slate-800">{Math.min(indiceUltimoRegistro, totalRegistros)}</span> de <span className="font-bold text-slate-800">{totalRegistros}</span> resultados
      </span>

      <div className="flex gap-2">
        <button
          onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center px-4 font-medium text-sm text-slate-700 bg-white border border-slate-200 rounded-lg">
          Página {paginaActual} de {totalPaginas}
        </div>

        <button
          onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}