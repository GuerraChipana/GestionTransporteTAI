import { useState, useEffect } from "react";
import { Edit, User, Power, PowerOff, Eye, Users } from "lucide-react";
import { listarPersonas, cambiarEstadoPersona } from "../../services/personaService";
import ModalPersona from "../../features/personas/ModalPersona.jsx";
import ModalVerPersona from "../../features/personas/ModalVerPersona.jsx";
import ModalCambioEstado from "../../components/ui/ModalCambioEstado";

import TableToolbar from "../../components/ui/TableToolbar.jsx";
import TablePagination from "../../components/ui/TablePagination.jsx";

// 1. IMPORTAMOS SONNER
import { toast } from "sonner";

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE TABLA (Busqueda, Filtro y Paginación) ---
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  // Estados para los modales
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false);

  // Selección de registro
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [loadingEstado, setLoadingEstado] = useState(false);

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      const data = await listarPersonas();
      setPersonas(data);
    } catch (error) {
      console.error("Error al cargar personas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  // Resetear a la página 1 si cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // --- LÓGICA DE FILTRADO (DNI o Nombre + Estado) ---
  const personasFiltradas = personas.filter((p) => {
    const textoBusqueda = busqueda.toLowerCase();

    // Búsqueda inteligente por DNI o Nombre Completo
    const dniMatch = p.dni?.toLowerCase().includes(textoBusqueda);
    const nombreCompleto = `${p.nombre} ${p.ap_paterno} ${p.ap_materno}`.toLowerCase();
    const nombreMatch = nombreCompleto.includes(textoBusqueda);

    const coincideBusqueda = dniMatch || nombreMatch;

    // Filtro por estado
    const coincideEstado =
      filtroEstado === "todos" ? true :
        filtroEstado === "activos" ? p.estado === 1 :
          p.estado === 0;

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoRegistro = paginaActual * registrosPorPagina;
  const indicePrimerRegistro = indiceUltimoRegistro - registrosPorPagina;
  const personasPaginadas = personasFiltradas.slice(indicePrimerRegistro, indiceUltimoRegistro);
  const totalPaginas = Math.ceil(personasFiltradas.length / registrosPorPagina) || 1;

  // --- HANDLERS PARA ABRIR MODALES ---
  const handleOpenCrear = () => { setPersonaSeleccionada(null); setModalFormOpen(true); };
  const handleOpenEditar = (id) => { setPersonaSeleccionada(id); setModalFormOpen(true); };
  const handleOpenVer = (persona) => { setPersonaSeleccionada(persona); setModalVerOpen(true); };
  const handleOpenEstado = (persona) => { setPersonaSeleccionada(persona); setModalEstadoOpen(true); };

  // --- HANDLER PARA PROCESAR EL CAMBIO DE ESTADO ACTUALIZADO ---
  const confirmarCambioEstado = async (datosEstado) => {
    try {
      setLoadingEstado(true);
      await cambiarEstadoPersona(personaSeleccionada.idPers, datosEstado);
      setModalEstadoOpen(false);
      cargarPersonas();

      const accion = datosEstado.estado === 1 ? "activada" : "dada de baja";
      toast.success(`Persona ${accion} exitosamente.`);
    } catch (error) {
      setModalEstadoOpen(false);
    } finally {
      setLoadingEstado(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm p-6 border border-slate-100 overflow-hidden">

      {/* Uso de nuestro componente reutilizable de cabecera */}
      <TableToolbar
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        onAdd={handleOpenCrear}
        addLabel="Nueva Persona"
        searchPlaceholder="Buscar por DNI o Nombre..."
      />

      {/* Tabla Responsiva */}
      <div className="overflow-x-auto rounded-t-xl border border-slate-200">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-700 text-sm">
            <tr>
              <th className="p-4 font-semibold border-b">N°</th>
              <th className="p-4 font-semibold border-b">DNI</th>
              <th className="p-4 font-semibold border-b">Nombre Completo</th>
              <th className="p-4 font-semibold border-b">Email</th>
              <th className="p-4 font-semibold border-b text-center">Foto</th>
              <th className="p-4 font-semibold border-b text-center">Estado</th>
              <th className="p-4 font-semibold border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium">Cargando personas...</p>
                  </div>
                </td>
              </tr>
            ) : personasPaginadas.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users size={40} className="text-slate-300 mb-2" />
                    <p className="font-medium text-lg">No se encontraron resultados</p>
                    <p className="text-sm">Intenta con otros términos de búsqueda o filtros.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Mapeamos personasPaginadas en lugar de filtradas directamente
              personasPaginadas.map((p, index) => (
                <tr key={p.idPers} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {/* Número real correlativo */}
                    {indicePrimerRegistro + index + 1}
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-800 font-mono">{p.dni}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">
                    {p.nombre} {p.ap_paterno} {p.ap_materno}
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {p.correo || <span className="text-slate-300 italic">Sin correo</span>}
                  </td>
                  <td className="p-4 flex justify-center">
                    {/* Contenedor relativo para manejar la foto y el fallback de React */}
                    <div className="relative w-10 h-10">
                      {p.foto ? (
                        <img
                          src={p.foto}
                          alt="Perfil"
                          className="absolute inset-0 w-10 h-10 rounded-full object-cover border border-slate-200 z-10 bg-white"
                          onError={(e) => {
                            // Oculta la imagen rota, permitiendo que se vea el icono de fondo
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {/* Icono por defecto (siempre está debajo) */}
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center z-0">
                        <User className="text-slate-400" size={18} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase ${p.estado === 1 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {p.estado === 1 ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenVer(p)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Ver Detalles">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleOpenEditar(p.idPers)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleOpenEstado(p)}
                      className={`p-2 rounded-lg transition-colors ${p.estado === 1 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`} title="Cambiar Estado">
                      {p.estado === 1 ? <PowerOff size={18} /> : <Power size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Uso de nuestro componente reutilizable de Paginación */}
      {!loading && (
        <TablePagination
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          totalRegistros={personasFiltradas.length}
          indicePrimerRegistro={indicePrimerRegistro}
          indiceUltimoRegistro={indiceUltimoRegistro}
          setPaginaActual={setPaginaActual}
        />
      )}

      {/* MODALES INTEGRADOS */}
      <ModalPersona
        isOpen={modalFormOpen}
        onClose={() => setModalFormOpen(false)}
        personaId={personaSeleccionada}
        onSuccess={cargarPersonas}
      />

      {personaSeleccionada && typeof personaSeleccionada === 'object' && (
        <ModalCambioEstado
          isOpen={modalEstadoOpen}
          onClose={() => setModalEstadoOpen(false)}
          onConfirm={confirmarCambioEstado}
          titulo="Estado de Persona"
          entidadNombre={`${personaSeleccionada.nombre} ${personaSeleccionada.ap_paterno}`}
          estadoActual={personaSeleccionada.estado}
          isLoading={loadingEstado}
        />
      )}

      <ModalVerPersona
        isOpen={modalVerOpen}
        onClose={() => setModalVerOpen(false)}
        persona={personaSeleccionada}
      />
    </div>
  );
}