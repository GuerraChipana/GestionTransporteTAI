import React, { useState, useEffect } from 'react';
import { getTokenData } from '../utils/tokenUtils';
import {
    Crown,
    ShieldCheck,
    UserPen,
    Users,
    User,
    Building2,
    MapPin,
    Calendar,
    Briefcase,
    Globe,
    LifeBuoy,
    Mail
} from 'lucide-react';

export default function Inicio() {
    const [userData, setUserData] = useState(null);
    const [saludo, setSaludo] = useState('');
    const [fechaActual, setFechaActual] = useState('');

    useEffect(() => {
        const data = getTokenData();
        if (data) {
            setUserData(data);
        }

        const hora = new Date().getHours();
        if (hora >= 5 && hora < 12) {
            setSaludo('Buenos días');
        } else if (hora >= 12 && hora < 19) {
            setSaludo('Buenas tardes');
        } else {
            setSaludo('Buenas noches');
        }

        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormat = new Date().toLocaleDateString('es-PE', opciones);
        setFechaActual(fechaFormat.charAt(0).toUpperCase() + fechaFormat.slice(1));
    }, []);

    const renderRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'superadministrador':
                return <Crown className="text-amber-500" size={20} />;
            case 'administrador':
                return <ShieldCheck className="text-blue-500" size={20} />;
            case 'moderador':
                return <UserPen className="text-emerald-500" size={20} />;
            case 'asistente':
                return <Users className="text-purple-500" size={20} />;
            default:
                return <User className="text-gray-500" size={20} />;
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">

            {/* 1. Encabezado Compacto (Reemplaza la caja gigante blanca) */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                        ¡{saludo}, {userData?.name || 'Usuario'}!
                    </h2>
                    <p className="text-slate-500 mt-1 capitalize">{fechaActual}</p>
                </div>

                {userData && (
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm">
                        {renderRoleIcon(userData.role)}
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400 font-semibold uppercase leading-none">Rol activo</span>
                            <span className="text-sm font-bold text-slate-700 capitalize leading-none mt-1">{userData.role}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Tarjeta Principal: Información Institucional */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-slate-800/5 border-b border-gray-100 p-4">
                    <h3 className="text-base font-bold text-slate-700 flex items-center gap-2">
                        <Building2 size={18} className="text-blue-600" />
                        Información de la Institución
                    </h3>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
                        <div className="flex gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg h-fit">
                                <Building2 className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Razón Social</p>
                                <p className="text-slate-800 font-semibold mt-1">Municipalidad Distrital de Tupac Amaru Inca</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg h-fit">
                                <Calendar className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inicio de Actividades</p>
                                <p className="text-slate-800 font-semibold mt-1">01/07/1993</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg h-fit">
                                <Briefcase className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo de Entidad</p>
                                <p className="text-slate-800 font-semibold mt-1">Gobierno Local</p>
                                <p className="text-slate-500 text-sm">Administración Pública</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-blue-50 p-2 rounded-lg h-fit">
                                <MapPin className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ubicación</p>
                                <p className="text-slate-800 font-semibold mt-1">Ica / Pisco / Tupac Amaru Inca</p>
                            </div>
                        </div>

                        <div className="flex gap-3 md:col-span-2 lg:col-span-1">
                            <div className="bg-blue-50 p-2 rounded-lg h-fit">
                                <Globe className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portal Web</p>
                                <a
                                    href="http://www.munitai.gob.pe"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-semibold mt-1 inline-block"
                                >
                                    www.munitai.gob.pe
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Banner de Soporte Técnico (Horizontal y Elegante) */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-md p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700">
                <div className="flex items-center gap-4 text-white">
                    <div className="bg-white/10 p-3 rounded-full">
                        <LifeBuoy size={24} className="text-blue-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">¿Necesitas soporte técnico?</h3>
                        <p className="text-slate-400 text-sm mt-0.5">Contacta al desarrollador si encuentras errores en el sistema.</p>
                    </div>
                </div>

                <a
                    href="mailto:fernandoguerrachipana@gmail.com?subject=Soporte%20Sistema%20Transporte%20TAI"
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors duration-200 shadow-sm whitespace-nowrap"
                >
                    <Mail size={18} />
                    Enviar Correo
                </a>
            </div>

        </div>
    );
}