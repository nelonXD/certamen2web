# 🚗 Proyecto Taller Mecánico - Trabajo 2: Integración Frontend, API y Seguridad

Sistema integrado de gestión para Taller Mecánico que une una **API RESTful en ASP.NET Core** y un **Frontend React + TypeScript + Vite**, con autenticación JWT, autorización basada en roles (Admin / Mecánico), accesibilidad WCAG 2.2 AA y controles de seguridad OWASP.

---

## 📂 Estructura del Repositorio

- `TallerMecanico/`: API RESTful construida con ASP.NET Core (.NET 8/10), Entity Framework Core, SQL Server, JWT y Rate Limiting.
- `frontend/`: Aplicación cliente React 19, TypeScript, Vite, TanStack Query, React Hook Form, Zod y Tailwind CSS.
- `INFORME_TECNICO.md`: Informe técnico con decisiones de diseño y matriz de mitigación de riesgos OWASP.
- `AI_LOG.md`: Bitácora obligatoria del uso de herramientas de Inteligencia Artificial Generativa.

---

## ⚡ Guía Rápida de Ejecución

### Paso 1: Ejecutar la API Backend (.NET)

1. Abre una terminal y navega a la carpeta del proyecto backend:
   ```bash
   cd TallerMecanico/TallerMecanico
   ```
2. Restaura dependencias y compila:
   ```bash
   dotnet build
   ```
3. Ejecuta las pruebas de integración del backend:
   ```bash
   dotnet test
   ```
4. Inicia la API:
   ```bash
   dotnet run
   ```
   La API estará activa en: `https://localhost:7027` (y `http://localhost:5290`), con documentación interactiva en `https://localhost:7027/scalar/v1`.

---

### Paso 2: Ejecutar la Aplicación Frontend (React + Vite)

1. Abre una segunda terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Verifica o ajusta el archivo `.env` (creado a partir de `.env.example`):
   ```env
   VITE_API_BASE_URL=/api/v1
   ```
4. Ejecuta la suite de pruebas automatizadas:
   ```bash
   npm test
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Roles y Credenciales de Demostración

La aplicación maneja control de acceso basado en roles (RBAC):
- **Admin**: Acceso completo a lectura, creación, edición y **eliminación** de órdenes, clientes, vehículos, mecánicos, catálogo de servicios e inventario de repuestos.
  - **Usuario:** `admin` | **Contraseña:** `admin123`
- **Mecánico**: Acceso a consultar, crear y editar órdenes y clientes; no tiene permiso para eliminar registros ni acceder a la administración del taller (recibe HTTP 403 en API y vista `/acceso-denegado` en cliente).
  - **Usuario:** `tomas` | **Contraseña:** `admin123`

> En la pantalla de inicio de sesión (`/login`), dispones de botones de **Acceso Rápido para Demostración** con autocompletado en un solo clic. También puedes registrar nuevos mecánicos desde el formulario de **Registro** (`/registro`).
