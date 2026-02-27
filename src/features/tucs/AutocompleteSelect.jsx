import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export default function AutocompleteSelect({
    options = [],
    value,
    onChange,
    placeholder = "Buscar...",
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Formatea el texto que se queda en el input cuando seleccionas algo
    const getDisplayText = (opt) => {
        if (!opt) return "";
        return opt.subText ? `${opt.label} — ${opt.subText}` : opt.label;
    };

    // Sincronizar el texto del input con la opción seleccionada si la hay
    useEffect(() => {
        const selectedOption = options.find(opt => opt.value === value);
        if (selectedOption && !isOpen) {
            setSearchTerm(getDisplayText(selectedOption));
        } else if (!selectedOption && !isOpen) {
            setSearchTerm("");
        }
    }, [value, options, isOpen]);

    // Cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                const currentOpt = options.find(opt => opt.value === value);
                setSearchTerm(currentOpt ? getDisplayText(currentOpt) : "");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value, options]);

    const filteredOptions = searchTerm.trim() === ""
        ? options.slice(0, 5)
        : options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelect = (opt) => {
        onChange(opt.value);
        setSearchTerm(getDisplayText(opt));
        setIsOpen(false);
        inputRef.current?.blur();
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className={disabled ? "text-slate-300" : "text-blue-500"} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                        if (e.target.value === "") onChange("");
                    }}
                    onFocus={() => {
                        if (!disabled) {
                            setIsOpen(true);
                            setSearchTerm("");
                        }
                    }}
                    className={`w-full pl-9 pr-10 py-2.5 bg-white border rounded-xl outline-none transition-all text-slate-800 font-medium placeholder:font-normal placeholder:text-slate-400
                        ${disabled ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed" : "border-slate-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm"}
                    `}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-[100] w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] overflow-hidden animate-[fadeIn_0.15s_ease-out]">
                    <div className="max-h-56 overflow-y-auto custom-scrollbar p-1.5">

                        {searchTerm.trim() === "" && options.length > 5 && (
                            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/80 rounded-lg mb-1">
                                Sugerencias recientes
                            </div>
                        )}

                        {filteredOptions.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500 font-medium">
                                No se encontraron resultados
                            </div>
                        ) : (
                            filteredOptions.map((opt) => {
                                const isSelected = value === opt.value;
                                return (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt)}
                                        className={`px-3 py-2.5 my-0.5 rounded-lg cursor-pointer transition-all flex items-center justify-between group
                                            ${isSelected ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-slate-700 hover:bg-slate-50 border border-transparent"}
                                        `}
                                    >
                                        {/* AQUI ESTÁ LA MAGIA: flex-row y items-center para que salgan al costado */}
                                        <div className="flex items-center gap-2 truncate">
                                            <span className={`text-sm ${isSelected ? 'font-bold' : 'font-semibold'}`}>
                                                {opt.label}
                                            </span>
                                            {opt.subText && (
                                                <>
                                                    <span className="text-slate-300">|</span>
                                                    <span className={`text-xs ${isSelected ? 'text-blue-500 font-medium' : 'text-slate-500'}`}>
                                                        {opt.subText}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {isSelected && <Check size={16} className="text-blue-600 shrink-0 ml-2" />}
                                    </div>
                                );
                            })
                        )}
                        {searchTerm.trim() !== "" && filteredOptions.length > 5 && (
                            <div className="px-3 py-2 text-center text-[10px] text-slate-400 uppercase tracking-wider border-t border-slate-100 mt-1">
                                {filteredOptions.length} resultados en total
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}