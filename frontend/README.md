# 🚗 Frontend Taller Mecánico - Certamen 2 Web

Aplicación web desarrollada en **React 19 + TypeScript + Vite** para la gestión integral de un Taller Mecánico, consumiendo la API RESTful construida en ASP.NET Core (.NET 8/10).

El sistema implementa autenticación JWT, autorización por roles (Admin y Mecánico), accesibilidad conforme a **WCAG 2.2 nivel AA**, diseño mobile-first responsivo y mitigación de vulnerabilidades de seguridad web y API (OWASP).

---

## 📋 Requisitos Previos

- **Node.js**: v18.0 o superior (recomendado v20+ / v22+)
- **npm**: v9.0 o superior
- **Backend .NET**: API en ejecución en `https://localhost:7027` (o `http://localhost:5290`)

---

## 🚀 Instalación y Puesta en Marcha

### 1. Clonar o navegar a la carpeta `frontend`
```bash
cd frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo de ejemplo `.env.example` a `.env`:
```bash
cp .env.example .env
```

Contenido del archivo `.env`:
```env
# URL base de la API RESTful de Taller Mecánico
VITE_API_BASE_URL=https://localhost:7027/api/v1
```

> **Nota de Seguridad**: En aplicaciones frontend empaquetadas con Vite, todas las variables con prefijo `VITE_*` son públicas y se incluyen en el bundle. Nunca coloques claves secretas, contraseñas o llaves privadas aquí.

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: [http://localhost:5173](http://localhost:5173)

### 5. Compilación para Producción
```bash
npm run build
```

---

## 🧪 Pruebas Automatizadas

### Pruebas Unitarias y de Componentes (Vitest + Testing Library)
Ejecuta la suite de pruebas que evalúa el formulario de login, guardas de rutas protegidas y operaciones CRUD:
```bash
npm test
```

### Auditoría de Dependencias de Seguridad (OWASP)
```bash
npm audit
```

---

## 🏛️ Arquitectura del Proyecto

El código está organizado por **módulos y capas**:

```
frontend/
├── e2e/                     # Pruebas End-to-End con Playwright
├── public/                  # Recursos estáticos
├── src/
│   ├── api/                 # Cliente Axios centralizado e interceptores
│   │   ├── client.ts        # Manejo de JWT Bearer y normalización de errores (401, 403, 429)
│   │   ├── auth.service.ts
│   │   ├── ordenes.service.ts
│   │   ├── clientes.service.ts
│   │   └── vehiculos.service.ts
│   ├── components/
│   │   ├── common/          # Componentes accesibles (Navbar, Modal, Alert, LoadingSpinner)
│   │   └── layout/          # AppLayout con landmarks semánticos y Skip Link
│   ├── context/             # AuthContext (almacenamiento en sessionStorage, estado de sesión)
│   ├── features/            # Vistas y formularios organizados por funcionalidad
│   │   ├── auth/            # LoginPage, RegisterPage
│   │   ├── dashboard/       # Dashboard con métricas y accesos rápidos
│   │   ├── ordenes/         # CRUD Ordenes de Trabajo (listado, detalle, formulario)
│   │   ├── clientes/        # CRUD Clientes (listado y modal de creación/edición)
│   │   ├── vehiculos/       # CRUD Vehículos
│   │   └── error/           # 403 Forbidden y 404 Not Found
│   ├── routes/              # ProtectedRoute y definición de rutas con React Router
│   ├── test/                # Configuración y utilidades de prueba
│   ├── types/               # Tipos TypeScript / DTOs
│   ├── utils/               # Utilidades de decodificación y validación de tokens JWT
│   ├── App.tsx              # Proveedores globales (QueryClientProvider, AuthProvider)
│   ├── index.css            # Estilos globales y utilidades de accesibilidad
│   └── main.tsx             # Punto de entrada
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ♿ Accesibilidad (WCAG 2.2 Nivel AA)

- **Landmarks semánticos**: `<header>`, `<nav>`, `<main id="main-content">`, `<footer>`.
- **Skip Link**: Enlace visible al enfocar con `Tab` para saltar directamente al contenido principal.
- **Formularios**: Cada control cuenta con `<label htmlFor="...">`, vinculación de errores con `aria-describedby` y estados invalidantes con `aria-invalid`.
- **Anuncios para lectores de pantalla**: Mensajes de error y estado con `role="alert"` y `aria-live="polite" / "assertive"`.
- **Navegación por teclado**: Foco visible en todos los elementos interactivos (`:focus-visible`), cierre de diálogos con `Escape`, y orden de tabulación secuencial.
- **Áreas táctiles**: Controles interactivos con tamaño mínimo de 44 × 44 px.
- **Contraste**: Colores con contraste superior a 4.5:1 sobre fondo claro.

---

## 📱 Diseño Responsivo Mobile-First

- La interfaz se adapta desde pantallas pequeñas de **320 px** hasta escritorio.
- Sin scroll horizontal: en dispositivos móviles, los listados tabulares cambian automáticamente a un formato de **tarjetas legibles y táctiles**.
- Menú de navegación responsive con cajón móvil accesible.
