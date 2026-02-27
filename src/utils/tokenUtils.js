const TOKEN_KEY = "token";

//  Obtiene y valida el token JWT
export const getTokenData = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));

    const now = Date.now() / 1000;

    // Verificar expiración
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    return {
      id: decoded.uid,
      name: decoded.sub,
      email: decoded.correo,
      role: decoded.rol,
      nombre: decoded.nombre,
      apellidos: decoded.apellidos,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
    };
  } catch (error) {
    console.error("Token inválido:", error);
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

//  Verifica si el usuario está autenticado
export const isAuthenticated = () => {
  return !!getTokenData();
};

// Obtiene solo el rol del usuario
export const getUserRole = () => {
  const user = getTokenData();
  return user ? user.role : null;
};
