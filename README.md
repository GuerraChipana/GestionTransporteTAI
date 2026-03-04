# Municipalidad TAI - Sistema de Gestión de Transporte (Frontend)

Este proyecto corresponde a la interfaz web (Frontend) del Sistema de Gestión de Transporte para la Municipalidad (municipalidasTAI). Proporciona una plataforma moderna, rápida y segura para la administración integral de vehículos, conductores, asociaciones y tarjetas de circulación, facilitando el trabajo administrativo del municipio.

## 🚀 Tecnologías Principales

* **Librería Principal:** React (potenciado por Vite para una recarga rápida)
* **Enrutamiento:** React Router Dom (incluyendo manejo de rutas privadas/protegidas)
* **Gestión de Estado:** React Context API (Ej: `ThemeContext`)
* **Conexión Backend:** Consumo de API REST (Servicios modulares listos para conectar con el servidor Spring Boot)

## 📦 Módulos y Funcionalidades Principales

El sistema está diseñado bajo una arquitectura modular basada en características (`features`), lo que facilita su mantenimiento y escalabilidad. Sus módulos principales son:

* **Gestión de Conductores y Personas:** Registro detallado de ciudadanos y operadores de transporte.
* **Control Vehicular:** Administración del parque automotor municipal, incluyendo inspecciones y seguros vinculados.
* **TUC (Tarjeta Única de Circulación):** Módulo dedicado a la emisión, validación y control del estado de las tarjetas de circulación.
* **Asociaciones y Empadronamiento:** Control de empresas y gremios de transporte registrados en el municipio.
* **Módulo de Reportes:** Generación de estadísticas y datos consolidados.
* **Administración de Usuarios:** Control de acceso, roles y estados de los usuarios que operan el sistema (Dashboard).

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno de desarrollo local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    cd municipalidasTAI
    ```

2.  **Instalar las dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto basándote en la configuración de tu servidor en la nube. Necesitarás especificar al menos la ruta de tu API:
    ```env
    VITE_API_URL=http://tu-servidor-backend-url/api
    ```

4.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 📁 Estructura del Proyecto

El código fuente principal se encuentra en la carpeta `src/`, organizado de la siguiente manera:

* `/assets`: Imágenes, logos y recursos estáticos de la municipalidad.
* `/components`: Componentes UI reutilizables (Modales, Tablas con paginación, Buscadores).
* `/features`: Lógica y vistas específicas encapsuladas por dominio del negocio (Aseguradoras, TUCs, Vehículos, etc.).
* `/pages`: Vistas principales a nivel de página (Login, Inicio, Dashboard).
* `/services`: Funciones encargadas de las peticiones HTTP a la base de datos y la API.
* `/routes`: Archivos para el manejo y protección de las rutas de la aplicación.
* `/utils`: Funciones auxiliares genéricas (formateo de fechas, manejo de tokens JWT).
