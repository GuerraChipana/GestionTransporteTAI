import { useLocation } from "react-router-dom";

export function AutoSeguroIcon(props) {
    const { size = 24, color = "currentColor", strokeWidth = 2, ...rest } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* AUTO (base lucide style) */}
            <path d="M3 13l1.5-3.5A2 2 0 0 1 6.3 8h5.4c.6 0 1.2.3 1.6.8L15 11" />
            <path d="M3 13v4h2" />
            <path d="M17 17h2v-3c0-1-.7-1.8-1.6-2L15 11" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />

            {/* ESCUDO sobresaliente a la derecha */}
            <path d="M18 3l3 1.3v3.2c0 2.5-1.7 4.6-3 5-1.3-.4-3-2.5-3-5V4.3L18 3z" />
        </svg>
    );
}
export function HeaderDianmico() {
    const location = useLocation();
    const titles = {
        "/dashboard/usuarios": "Gestión de Usuarios",
        "/dashboard/empadronamientos": "Gestión de Empadronamientos",
        "/dashboard/tucs": "Gestión de TUC",
        "/dashboard/vehiculos": "Gestión de Vehículos",
        "/dashboard/vehiculos-seguros": "Gestión de Vehículos Seguros",
        "/dashboard/personas": "Gestión de Personas",
        "/dashboard/conductores": "Gestión de Conductores",
        "/dashboard/aseguradoras": "Gestión de Aseguradoras",
        "/dashboard/asociaciones": "Gestión de Asociaciones",
    };

    const title =
        titles[location.pathname] || "Sistema de Transporte Municipal";
    return (
        <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-semibold text-gray-800">
                {title}
            </h1>
        </div>);
}