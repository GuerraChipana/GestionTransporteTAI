import { useLocation, useNavigate } from "react-router-dom";
import { Outlet, NavLink } from "react-router-dom";
import {
    LayoutDashboard, ChartNoAxesCombined, Car, Users, Menu, Icon,
    User, Lock, ShieldCheck, LogOut, Handshake, NotepadText, UserStar, CardSim
} from "lucide-react";
import { steeringWheel } from '@lucide/lab';
import { useState } from "react";
import logo from "../assets/logo-muni.jpg";
import { getTokenData } from "../utils/tokenUtils";
import { AutoSeguroIcon, HeaderDianmico } from "../components/layout/funcionExtra.jsx";
export default function DashboardLayout() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const user = getTokenData();
    const isSuperOrAdmin = user?.role === 'superadministrador' || user?.role === 'administrador';

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/administracion-login", { replace: true });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* SIDEBAR */}
            <aside
                className={`${collapsed ? "w-20" : "w-72"
                    } bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col shadow-xl transition-all duration-300`}
            >
                {/* HEADER SIDEBAR */}
                <div className="p-4 border-b border-blue-800">
                    <div className="flex items-center justify-between">
                        {!collapsed && (
                            <div className="flex items-center gap-3">
                                <img
                                    src={logo}
                                    alt="Logo Municipalidad"
                                    className="w-12 h-14 object-cover rounded-[50%/40%] border-2 border-white shadow-md"
                                />
                                <div>
                                    <h2 className="text-sm font-bold leading-tight">Municipalidad Distrital</h2>
                                    <p className="text-xs text-blue-200">Túpac Amaru Inca</p>
                                </div>
                            </div>
                        )}

                        {collapsed && (
                            <img
                                src={logo} alt="Logo Municipalidad"
                                className="w-8 h-10 object-cover rounded-[50%/40%] border border-white"
                            />
                        )}

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-2 hover:bg-blue-800 rounded transition"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>

                {/* NAVEGACIÓN */}
                <nav className="flex-1 px-3 py-3 space-y-2">
                    <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18} />}
                        text="Inicio" collapsed={collapsed}
                    />

                    <SidebarLink to="/dashboard/reportes" icon={<ChartNoAxesCombined size={18} />}
                        text="Reportes" collapsed={collapsed}
                    />

                    {/* 2. Envolver el enlace de Usuarios con la condición */}
                    {isSuperOrAdmin && (
                        <SidebarLink to="/dashboard/usuarios" icon={<UserStar size={18} />}
                            text="Usuarios" collapsed={collapsed}
                        />
                    )}

                    <SidebarLink to="/dashboard/empadronamientos" icon={<NotepadText size={18} />}
                        text="Empadronamientos" collapsed={collapsed}
                    />
                    <SidebarLink to="/dashboard/tucs" icon={<CardSim size={18} />}
                        text="TUC" collapsed={collapsed}
                    />
                    <SidebarLink to="/dashboard/vehiculos" icon={<Car size={18} />}
                        text="Vehículos" collapsed={collapsed}
                    />
                    <SidebarLink to="/dashboard/vehiculos-seguros" icon={<AutoSeguroIcon size={20} color="#ffffff" />}
                        text="Vehículos Seguros" collapsed={collapsed}
                    />
                    <SidebarLink to="/dashboard/personas" icon={<Users size={18} />}
                        text="Personas" collapsed={collapsed}
                    />
                    <SidebarLink to="/dashboard/conductores" icon={<Icon iconNode={steeringWheel} size={18} />}
                        text="Conductores" collapsed={collapsed}
                    />
                    <SidebarLink to="/dashboard/aseguradoras" icon={<ShieldCheck size={18} />}
                        text="Aseguradoras" collapsed={collapsed} title
                    />
                    <SidebarLink to="/dashboard/asociaciones" icon={<Handshake size={18} />}
                        text="Asociaciones" collapsed={collapsed}
                    />

                </nav>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white shadow-md flex items-center justify-between px-8 relative">

                    <HeaderDianmico />

                    {/* USUARIO */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenUserMenu(!openUserMenu)}
                            className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                        >
                            <div className="text-right">
                                <p className="text-sm font-medium">
                                    Hola, <span className="text-blue-600">
                                        {user ? user.name : "Usuario"}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-500">

                                    {user ? user.role : 'Invitado'}
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                <User size={18} />
                            </div>

                            {/* Flecha */}
                            <span className="text-gray-600">
                                {openUserMenu ? "▲" : "▼"}
                            </span>
                        </button>

                        {/* DROPDOWN */}
                        {openUserMenu && (
                            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg py-2 z-50">

                                <NavLink
                                    to="/dashboard/perfil"
                                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                                    onClick={() => setOpenUserMenu(false)}
                                >
                                    <User size={18} />
                                    Ver perfil
                                </NavLink>

                                <NavLink
                                    to="/dashboard/cambiar-password"
                                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 text-sm"
                                    onClick={() => setOpenUserMenu(false)}
                                >
                                    <Lock size={16} />
                                    Cambiar contraseña
                                </NavLink>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setOpenUserMenu(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Cerrar sesión
                                </button>

                            </div>
                        )}
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto p-2">
                    <div className="bg-white rounded-2xl shadow-md p-6 min-h-full">
                        <Outlet />
                    </div>
                </section>
            </main>
        </div>
    );
}

function SidebarLink({ to, icon, text, collapsed }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition duration-200
                ${isActive ? "bg-blue-800" : "hover:bg-blue-800"}`
            }
        >
            {icon}
            {!collapsed && <span>{text}</span>}
        </NavLink>
    );
}
