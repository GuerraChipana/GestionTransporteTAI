import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../services/auth";
import { Mail, Lock, Eye, EyeOff, Sun, Moon, AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import fondo from "../assets/fondo.png";
import LogoLogin from "../assets/login.webp";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { dark, toggleTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await Login({
                correo: email,
                contrasena: password
            });

            const token = response.data?.token;

            if (token) {
                localStorage.setItem("token", token);
            }

            navigate("/dashboard");

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setErrorMessage("Correo o contraseña incorrectos");
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative transition-all duration-500"
            style={{ backgroundImage: `url(${fondo})` }}
        >
            {/* Overlay oscuro elegante */}
            <div className={`absolute inset-0 
                ${dark ? "bg-black/70" : "bg-blue-900/70"} 
                backdrop-blur-sm transition-all duration-500`} />

            {/* Contenedor principal */}
            <div className="relative w-full max-w-6xl mx-4 grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">

                {/* PANEL IZQUIERDO (Branding) */}
                <div className="hidden md:flex flex-col justify-center items-center 
                    bg-gradient-to-br from-blue-900 to-blue-800 
                    text-white p-12">

                    <img
                        src={LogoLogin}
                        alt="Municipalidad"
                        className="w-80 mb-8 drop-shadow-lg"
                    />

                    <h2 className="text-3xl font-bold text-center">
                        Sistema de Transporte
                    </h2>

                    <p className="mt-4 text-blue-100 text-center max-w-sm">
                        Gestión y Control de Vehículos Menores (Mototaxis)
                    </p>

                    <div className="mt-10 h-1 w-20 bg-yellow-400 rounded-full"></div>
                </div>

                {/* PANEL DERECHO (Login) */}
                <div className={`p-10 md:p-14 flex flex-col justify-center 
                    ${dark ? "bg-slate-900 text-white" : "bg-white text-slate-800"} 
                    transition-colors duration-500`}>

                    {/* Toggle theme */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition 
                            ${dark ? "bg-slate-700" : "bg-slate-200"}`}
                        >
                            {dark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold">
                        Iniciar Sesión
                    </h1>

                    <p className={`text-sm mt-2 
                        ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        Acceso al sistema municipal
                    </p>
                    {errorMessage && (
                        <div
                            className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 transition-all duration-300
                          ${dark
                                    ? "bg-red-900/40 border-red-700 text-red-300"
                                    : "bg-red-50 border-red-300 text-red-700"
                                }`}
                        >
                            <AlertCircle size={18} />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {/* EMAIL */}
                        <div>
                            <label className="text-sm font-medium">
                                Correo electronico
                            </label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="usuario@gmail.com" className={`w-full pl-10 pr-4 py-3 rounded-xl border 
                                    ${dark
                                            ? "bg-slate-800 border-slate-600 focus:ring-yellow-400"
                                            : "bg-white border-slate-300 focus:ring-blue-600"
                                        } 
                                    focus:ring-2 outline-none transition`}
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm font-medium">
                                Contraseña
                            </label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingrese su contraseña"
                                    className={`w-full pl-10 pr-10 py-3 rounded-xl border 
                                    ${dark
                                            ? "bg-slate-800 border-slate-600 focus:ring-yellow-400"
                                            : "bg-white border-slate-300 focus:ring-blue-600"
                                        } 
                                    focus:ring-2 outline-none transition`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* BOTÓN */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl 
                            bg-yellow-400 hover:bg-yellow-500 
                            text-slate-900 font-semibold 
                            shadow-lg transition"
                        >
                            Ingresar al Sistema
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}