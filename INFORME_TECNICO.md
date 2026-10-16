# 📄 Informe Técnico: Decisiones de Diseño y Seguridad (Trabajo 2)

**Proyecto**: Sistema de Gestión de Taller Mecánico  
**Estudiante**: Nelson Inostroza  
**Curso**: Programación Web 2 / Certamen 2  
**Fecha**: Octubre 2026  

---

## 1. Decisiones de Arquitectura y Diseño Frontend

### 1.1 Framework y Herramientas de Compilación
- **React 19 + TypeScript + Vite**: Se seleccionó React junto a TypeScript por su tipado estático riguroso que refleja el contrato de la API RESTful (DTOs y modelos del backend). Vite proporciona un entorno de desarrollo ultrarrápido con Hot Module Replacement (HMR) y compilación optimizada en producción.
- **Estructura por Módulos y Capas**: El código se organiza separando la capa de infraestructura/consumo (`src/api/`), lógica de estado y autenticación (`src/context/`), componentes reutilizables (`src/components/`) y vistas agrupadas por features de negocio (`src/features/ordenes/`, `src/features/clientes/`, `src/features/vehiculos/`, `src/features/auth/`).

### 1.2 Manejo de Estado Asíncrono
- **TanStack Query (React Query v5)**: Se implementó para gestionar el ciclo de vida del estado remoto (caché, revalidación automática, sincronización en segundo plano, y estados explícitos de `isLoading`, `isError`, y datos). Permite optimizar las peticiones HTTP evitando llamadas redundantes (`staleTime: 2 minutos`) y simplifica la invalidación tras mutaciones (`onSuccess: queryClient.invalidateQueries`).

### 1.3 Formularios y Validación en Cliente
- **React Hook Form + Zod**: Se implementó validación desacoplada basada en esquemas declarativos de Zod. Cada campo valida tipos, longitudes mínimas/máximas y formatos (como email y teléfonos) en el cliente antes de despachar la petición HTTP, reduciendo carga innecesaria en el servidor. Ante errores de validación devueltos por la API (HTTP 400 ValidationProblem de MiniValidation), el cliente mapea los errores de campo (`fieldErrors`) para anunciarlos en pantalla.

---

## 2. Estrategia de Autenticación y Almacenamiento del Token

### 2.1 Almacenamiento en `sessionStorage`
- **Decisión y Justificación**: Se optó por almacenar el token JWT en `sessionStorage`. A diferencia de `localStorage` (cuyo almacenamiento es indefinido y persistente en el disco del equipo del cliente), `sessionStorage` se destruye inmediatamente al cerrar la pestaña o el navegador. Esto mitiga el riesgo de robo de tokens en equipos compartidos o frente a ataques de extracción pasiva.
- **Envío en Cabecera**: Todas las peticiones autenticadas adjuntan el token en la cabecera HTTP estándar `Authorization: Bearer <token>` mediante un interceptor centralizado en Axios.
- **Ciclo de Cierre de Sesión (Logout) y Expiración**: La función `logout()` limpia de forma atómica tanto el estado en memoria de React como el almacenamiento en `sessionStorage`. Si la API responde con código `401 Unauthorized` (por token caducado o inválido), el interceptor captura el evento globalmente, purga las credenciales y redirige de inmediato a la pantalla de `/login`.

---

## 3. Autorización por Roles y Rutas Protegidas

- **Guardas de Navegación (`ProtectedRoute`)**: Se implementó un componente envoltorio que evalúa la presencia de sesión activa y valida el rol del usuario autenticado frente a una lista de roles permitidos (`allowedRoles`).
- **Definición de Roles**:
  - **Admin**: Acceso completo a creación, consulta, edición y **eliminación** de órdenes de trabajo, clientes y vehículos.
  - **Mecánico**: Puede consultar, crear y modificar órdenes de trabajo y clientes, pero **no tiene autorización para eliminar registros**.
- **Seguridad en Ambos Extremos**: La interfaz no reemplaza al backend. En la interfaz se oculta el botón de eliminación para roles no administrativos, y si un usuario intentase invocar manualmente el endpoint `DELETE /api/v1/ordenes-trabajo/{id}` o `DELETE /api/v1/clientes/{id}`, el backend .NET rechaza la operación con código `403 Forbidden` (`[Authorize(Roles = "Admin")]`), lo cual el cliente maneja mostrando la página de Acceso Denegado (`/acceso-denegado`).

---

## 4. Accesibilidad (WCAG 2.2 Nivel AA)

1. **HTML Semántico**: Estructuración jerárquica con encabezados `<h1>` a `<h3>`, landmarks `<header>`, `<nav>`, `<main id="main-content">` y `<footer>`.
2. **Navegación por Teclado y Foco**: Enlace de salto inicial ("Skip link") para permitir que usuarios con lectores de pantalla o teclado salten la navegación directamente al contenido. Estilos `:focus-visible` con contorno de 2px y contraste visible.
3. **Gestión de Foco en Diálogos (`ConfirmModal`)**: El modal implementa `role="dialog"`, `aria-modal="true"`, captura de tecla `Escape`, y enfoca el botón seguro de cancelación al abrirse.
4. **Formularios Accesibles**: Todo `input` y `select` cuenta con `<label htmlFor="...">`. Los mensajes de error están enlazados mediante `aria-describedby` y se anuncia su presencia con `aria-invalid="true"`.
5. **Regiones Dinámicas**: Componentes de alerta configurados con `role="alert"` y `aria-live="polite"` o `aria-live="assertive"`.
6. **Contraste de Color y Tamaño Táctil**: Ratios de contraste superiores a 4.5:1 en textos estándar. Controles táctiles diseñados con un tamaño mínimo de **44 × 44 px** (`min-h-[44px] min-w-[44px]`).
7. **Idioma**: Atributo `lang="es"` definido en el documento HTML.

---

## 5. Diseño Responsivo Mobile-First

- Enfoque **Mobile-First** con media queries y diseño fluido mediante Tailwind CSS y CSS Grid / Flexbox.
- **Prevención de Scroll Horizontal**: Los listados de órdenes de trabajo, clientes y vehículos se presentan como tablas completas en pantallas de escritorio (`md+`), y cambian automáticamente a **tarjetas táctiles verticales** en viewports móviles (desde 320 px de ancho), eliminando el desplazamiento horizontal.
- Menú de navegación responsive con cajón accesible para dispositivos móviles.

---

## 6. Matriz de Mitigación de Riesgos de Seguridad (OWASP)

A continuación se detalla la mitigación de los riesgos seleccionados del catálogo OWASP Top 10 Web (2021) y OWASP API Security Top 10 (2023):

| # | Riesgo de Seguridad | Referencia OWASP | Lado | Dónde aparecía en la app | Mitigación Aplicada | Evidencia Verificable |
|---|---------------------|------------------|------|--------------------------|---------------------|-----------------------|
| 1 | **Cross-Site Scripting (XSS)** | Top 10 Web: A03 Injection | Cliente | Renderizado de datos del cliente, observaciones y campos de texto | No se utiliza `dangerouslySetInnerHTML`. React escapa automáticamente todo texto interpolado en JSX. Se valida que todo dato ingresado se renderice como nodo de texto seguro. | Código auditado sin uso de APIs inseguras de inyección HTML. |
| 2 | **Robo o filtración del token** | API2:2023 Broken Authentication | Cliente | Almacenamiento y transporte de credenciales de sesión | Uso justificado de `sessionStorage` que purga el token al cerrar pestaña. Token transportado únicamente en cabecera `Authorization: Bearer`, excluido de parámetros URL y nunca impreso en `console.log`. Cierre de sesión y auto-logout en 401. | Pruebas en `AuthContext.tsx` y verificación de `sessionStorage.clear()` en logout. |
| 3 | **Control de acceso a nivel de función** | API5:2023 Broken Function Level Authorization | Ambos | Eliminación de órdenes, clientes y vehículos (`DELETE`) | El frontend oculta y bloquea acciones destructivas a roles sin privilegio (`Mecanico`). En el backend, endpoints `DELETE` están protegidos obligatoriamente con `[Authorize(Roles = "Admin")]`, retornando 403 Forbidden ante accesos indebidos. | Pruebas de integración en `ProtectedRoute.test.tsx` y rechazo HTTP 403 verificado. |
| 4 | **Fuerza bruta y consumo sin límites** | API4:2023 Unrestricted Resource Consumption | Ambos | Endpoint de login y consultas repetitivas de API | El backend implementa `RateLimiter` particionado por IP (100 req/minuto). El cliente HTTP intercepta el código HTTP `429 Too Many Requests` y notifica al usuario con un mensaje claro en lugar de fallar silenciosamente. | Configuración en `Program.cs` e interceptor de respuesta en `client.ts`. |
| 5 | **Validación de entradas insuficiente** | Top 10 Web: A03 Injection | Ambos | Formularios de órdenes, clientes y autenticación | Validación estricta con esquemas Zod en el cliente antes de la transmisión HTTP. En el servidor, validación con DataAnnotations y MiniValidation (`Validar()`), junto a consultas parametrizadas con EF Core. | Validación de esquemas en `LoginPage.tsx`, `OrdenFormPage.tsx` y `ClienteModalForm.tsx`. |
| 6 | **Dependencias vulnerables** | Top 10 Web: A06 Vulnerable Components | Cliente | Paquetes y librerías del ecosistema npm | Bloqueo estricto de versiones con `package-lock.json`, escaneo continuo de seguridad con `npm audit`. | Reporte de `npm audit` arrojando **0 vulnerabilidades**. |
| 7 | **Secretos expuestos en el bundle** | Top 10 Web: A05 Security Misconfiguration | Cliente | Variables de configuración del cliente Vite | Ninguna clave privada o secreto se incluye en las variables `VITE_*`. Solo se expone la URL base de consumo público (`VITE_API_BASE_URL`). El repositorio incluye `.env.example`. | Inspección de `.env.example` y revisión de bundles generados en `dist/`. |
