import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SelectBuscador({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "Escribe para buscar...",
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    
    // El texto que se ve en el input (ej: "ABC-123")
    const [inputValue, setInputValue] = useState("");
    
    const wrapperRef = useRef(null);

    // Cuando el valor externo cambia (ej: al cargar datos de edición), 
    // actualizamos el texto del input para que coincida.
    useEffect(() => {
        const selected = options.find(opt => opt.value === value);
        if (selected) {
            setInputValue(selected.label);
        } else {
            setInputValue("");
        }
    }, [value, options]);

    // Cerrar el menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                // Si hizo click fuera y no había seleccionado nada válido, 
                // restauramos el texto al valor actualmente guardado.
                const currentSelected = options.find(opt => opt.value === value);
                setInputValue(currentSelected ? currentSelected.label : "");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value, options]);

    // Lógica de filtrado: 
    // Buscamos ignorando mayúsculas/minúsculas.
    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Solo mostramos un máximo de 5 sugerencias para no saturar la pantalla
    const suggestionsToShow = filteredOptions.slice(0, 5);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setIsOpen(true);
        // Si el usuario borra todo, reseteamos el valor padre a null/vacío
        if (e.target.value === "") {
            onChange("");
        }
    };

    const handleOptionSelect = (opt) => {
        setInputValue(opt.label);
        onChange(opt.value); // Guardamos el ID en el formulario padre
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            
            {/* Input Principal */}
            <div className="relative">
                <input 
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && setIsOpen(true)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full p-3 pl-10 border rounded-xl outline-none transition-shadow text-slate-700
                        ${disabled ? "bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400" : "bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"}
                    `}
                />
                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${disabled ? "text-slate-300" : "text-slate-400"}`} />
            </div>

            {/* Menú Flotante de Sugerencias */}
            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-[fadeIn_0.1s_ease-out]">
                    
                    <div className="max-h-64 overflow-y-auto p-1">
                        {suggestionsToShow.length === 0 ? (
                            <div className="p-3 text-center text-sm text-slate-500 italic">
                                No se encontraron coincidencias.
                            </div>
                        ) : (
                            suggestionsToShow.map((opt) => (
                                <div 
                                    key={opt.value}
                                    onClick={() => handleOptionSelect(opt)}
                                    className={`px-3 py-2.5 my-0.5 rounded-lg cursor-pointer text-sm transition-colors
                                        ${value === opt.value ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-100"}
                                    `}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                        
                        {/* Indicador sutil si hay más de 5 resultados */}
                        {filteredOptions.length > 5 && (
                             <div className="px-3 py-1.5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 mt-1 rounded-md">
                                Hay {filteredOptions.length - 5} resultados más. Refina tu búsqueda.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}