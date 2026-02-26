import { useState, useEffect } from "react";
import { X, Loader2, Upload, BusFront, Users, Search, CheckCircle, AlertCircle } from "lucide-react";
import { crearVehiculo, actualizarVehiculo, obtenerVehiculoPorId } from "../../services/vehiculoService";
import { listarPersonas } from "../../services/personaService";

const formInicial = {
    placa: "",
    nTarjeta: "",
    nMotor: "",
    marca: "",
    color: "",
    ano_de_compra: "",
    propietario1Id: "", 
    propietario2Id: "", 
};

export default function ModalVehiculo({ isOpen, onClose, vehiculoId, onSuccess }) {
    const [formData, setFormData] = useState(formInicial);
    const [imagenFile, setImagenFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    
    // Lista de personas para el buscador por DNI
    const [listaPersonas, setListaPersonas] = useState([]);

    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    const isEdit = !!vehiculoId;

    // Cargar la lista de personas al abrir el modal para poder buscar por DNI
    useEffect(() => {
        if (isOpen) {
            listarPersonas()
                .then(data => setListaPersonas(data))
                .catch(() => console.error("Error al cargar la lista de personas para el buscador."));
        }
    }, [isOpen]);

    // Cargar datos del vehículo si estamos en modo edición
    useEffect(() => {
        if (isOpen && isEdit && vehiculoId && typeof vehiculoId !== 'object') {
            const fetchVehiculo = async () => {
                try {
                    setLoadingFetch(true);
                    const data = await obtenerVehiculoPorId(vehiculoId);
                    setFormData({
                        placa: data.placa || "",
                        nTarjeta: data.nTarjeta || "",
                        nMotor: data.nMotor || "",
                        marca: data.marca || "",
                        color: data.color || "",
                        ano_de_compra: data.anoDeCompra || "",
                        propietario1Id: data.propietario1?.id_pers || "", 
                        propietario2Id: data.propietario2?.id_pers || "", 
                    });
                    if (data.imagenUrl) setFotoPreview(data.imagenUrl);
                } catch (err) {
                    setError("Error al cargar los datos del vehículo.");
                } finally {
                    setLoadingFetch(false);
                }
            };
            fetchVehiculo();
        } else if (!isEdit) {
            setFormData(formInicial);
            setImagenFile(null);
            setFotoPreview(null);
            setError(null);
        }
    }, [vehiculoId, isEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manejador específico para los IDs que vienen del Buscador por DNI
    const handlePropietarioChange = (campo, id) => {
        setFormData(prev => ({ ...prev, [campo]: id }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagenFile(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setError(null);

        if (!formData.propietario1Id) {
            setError("Debe especificar al menos un Propietario principal válido (DNI registrado).");
            setLoadingSubmit(false);
            return;
        }

        try {
            const submitData = new FormData();
            
            Object.keys(formData).forEach(key => {
                // Solo enviamos si tiene valor, para no mandar vacíos en propietario2Id
                if (formData[key] !== "" && formData[key] !== null && formData[key] !== undefined) {
                    submitData.append(key, formData[key]);
                }
            });

            if (imagenFile) {
                submitData.append("imagen", imagenFile); 
            }

            if (isEdit) {
                await actualizarVehiculo(vehiculoId, submitData);
            } else {
                await crearVehiculo(submitData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || "Ocurrió un error inesperado al guardar.");
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-[fadeIn_0.25s_ease-out]">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
                
                <div className="h-2 w-full bg-slate-800"></div>
                <div className="flex justify-between items-center p-5 border-b bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-800">
                        <BusFront className="text-blue-600" size={24} />
                        <h3 className="text-xl font-bold uppercase tracking-wide">
                            {isEdit ? "Actualizar Vehículo" : "Registrar Vehículo"}
                        </h3>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-start gap-2">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>}

                    {loadingFetch ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                            <p className="text-slate-500 font-medium">Cargando datos del vehículo...</p>
                        </div>
                    ) : (
                        <form id="vehiculoForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            
                            {/* Imagen */}
                            <div className="md:col-span-2 flex flex-col items-center mb-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fotografía del Vehículo (Opcional)</label>
                                <div className="relative w-48 h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:bg-slate-100 transition cursor-pointer group">
                                    {fotoPreview ? (
                                        <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition" />
                                    ) : (
                                        <>
                                            <Upload className="text-slate-400 mb-1" size={24} />
                                            <span className="text-xs text-slate-500 font-medium">Subir Imagen</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>
                            </div>

                            {/* Campos Básicos (Acorde al DTO) */}
                            <Input name="placa" label="Placa" value={formData.placa} onChange={handleChange} required />
                            <Input name="marca" label="Marca" value={formData.marca} onChange={handleChange} required />
                            <Input name="color" label="Color" value={formData.color} onChange={handleChange} required />
                            <Input name="ano_de_compra" label="Año de Compra" type="number" value={formData.ano_de_compra} onChange={handleChange} required />
                            <Input name="nMotor" label="Nro. de Motor" value={formData.nMotor} onChange={handleChange} required />
                            <Input name="nTarjeta" label="Nro. Tarjeta de Propiedad" value={formData.nTarjeta} onChange={handleChange} required />

                            {/* Buscadores de Propietarios */}
                            <div className="md:col-span-2 mt-2 pt-5 border-t border-slate-100">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase mb-4">
                                    <Users size={18} className="text-slate-400"/>
                                    Datos de los Propietarios (Búsqueda por DNI)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <BuscadorPersona 
                                        label="Propietario 1" 
                                        required={true}
                                        personas={listaPersonas}
                                        idSeleccionado={formData.propietario1Id}
                                        onSelect={(id) => handlePropietarioChange("propietario1Id", id)}
                                    />
                                    <BuscadorPersona 
                                        label="Propietario 2 (Opcional)" 
                                        required={false}
                                        personas={listaPersonas}
                                        idSeleccionado={formData.propietario2Id}
                                        onSelect={(id) => handlePropietarioChange("propietario2Id", id)}
                                    />
                                </div>
                            </div>

                        </form>
                    )}
                </div>

                {/* Footer y Botones */}
                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={loadingSubmit || loadingFetch} className="px-5 py-2.5 text-slate-700 font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition">
                        Cancelar
                    </button>
                    <button form="vehiculoForm" type="submit" disabled={loadingSubmit || loadingFetch} className="px-5 py-2.5 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 shadow-md disabled:opacity-70">
                        {loadingSubmit && <Loader2 className="animate-spin" size={18} />}
                        {isEdit ? "Guardar Cambios" : "Registrar Vehículo"}
                    </button>
                </div>
            </div>
            
            {/* Estilos inyectados */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(4px); } }
                @keyframes popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            `}</style>
        </div>
    );
}

// ----------------------------------------------------------------------
// SUBCOMPONENTES
// ----------------------------------------------------------------------

// Componente para inputs de texto básicos
function Input({ label, name, value, onChange, type = "text", required = false }) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            <input 
                type={type} name={name} value={value} onChange={onChange} required={required}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-sm font-medium text-slate-800"
            />
        </div>
    );
}

// Componente Inteligente para buscar Persona por DNI
function BuscadorPersona({ label, required, personas, idSeleccionado, onSelect }) {
    const [dni, setDni] = useState("");
    const [personaEncontrada, setPersonaEncontrada] = useState(null);

    // Efecto para sincronizar si viene un ID de edición
    useEffect(() => {
        if (idSeleccionado && personas.length > 0) {
            // Buscamos la persona por idPers
            const p = personas.find(x => x.idPers === idSeleccionado || x.id_pers === idSeleccionado);
            if (p) {
                setDni(p.dni);
                setPersonaEncontrada(p);
            }
        } else if (!idSeleccionado) {
            setDni("");
            setPersonaEncontrada(null);
        }
    }, [idSeleccionado, personas]);

    const handleDniChange = (e) => {
        // Solo permitir números, máximo 8 dígitos
        const val = e.target.value.replace(/\D/g, '').slice(0, 8);
        setDni(val);

        if (val.length === 8) {
            // Buscar automáticamente en la lista cuando llega a 8 dígitos
            const found = personas.find(x => x.dni === val);
            if (found) {
                setPersonaEncontrada(found);
                onSelect(found.idPers || found.id_pers); // Pasamos el ID real al formulario principal
            } else {
                setPersonaEncontrada(null);
                onSelect(""); // Limpiamos si no existe
            }
        } else {
            setPersonaEncontrada(null);
            onSelect(""); 
        }
    };

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            
            <div className="relative mb-2">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Ingresar DNI (8 dígitos)"
                    value={dni}
                    onChange={handleDniChange}
                    required={required && !personaEncontrada}
                    className={`w-full pl-10 p-2 border rounded-lg outline-none text-sm transition-shadow font-medium ${
                        dni.length === 8 && !personaEncontrada 
                        ? "border-rose-400 focus:ring-2 focus:ring-rose-200" 
                        : "border-slate-300 focus:ring-2 focus:ring-blue-500"
                    }`}
                />
            </div>

            {/* Resultado de Búsqueda Visual */}
            <div className="h-10"> 
                {personaEncontrada ? (
                    <div className="flex items-center gap-2 p-2 bg-emerald-100 text-emerald-800 rounded text-xs font-bold border border-emerald-200">
                        <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{personaEncontrada.nombre} {personaEncontrada.ap_paterno} {personaEncontrada.ap_materno}</span>
                    </div>
                ) : dni.length === 8 ? (
                    <div className="flex items-center gap-2 p-2 bg-rose-50 text-rose-700 rounded text-xs font-bold border border-rose-200">
                        <AlertCircle size={16} className="text-rose-500 shrink-0" />
                        <span>Persona no registrada.</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-2 text-slate-400 text-xs italic">
                        <span>Escribe el DNI para buscar...</span>
                    </div>
                )}
            </div>
        </div>
    );
}