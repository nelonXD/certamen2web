# 🤖 Bitácora de Uso de Inteligencia Artificial Generativa

**Estudiante**: Nelson Inostroza  
**Proyecto**: Taller Mecánico - Certamen 2 (Frontend, Consumo de API y Seguridad)  
**Herramienta Principal**: Antigravity Assistant  
**Modelos Empleados**: Claude Opus 4.6 (Thinking) / Gemini 3.8 Flash  
**Tipo de Cuenta / Plan**: Plan Pro / Avanzado  

---

## 1. Declaración de Uso de IA

Se declara de manera transparente el uso de herramientas de Inteligencia Artificial para el análisis de código del backend previo, el diseño de la arquitectura frontend, la generación de componentes accesibles y la estructuración de suites de pruebas automatizadas. Todo el código generado fue revisado, probado, refactorizado y validado para garantizar su correcta operatividad y comprensión técnica para la defensa oral del proyecto.

---

## 2. Registro de Prompts y Decisiones Técnicas

### 2.1 Fase 1: Análisis y Revisión de la API Backend (.NET)
- **Prompt Relevante**:
  > *"ya tengo la api y falta el frontend, revisa las api porciacaso"*
- **Respuesta de la IA**:
  - Análisis detallado de los endpoints de la API en ASP.NET Core, modelos EF Core, controladores DTO, autenticación JWT y configuración CORS en `Program.cs`.
  - Detección de incompatibilidades: CORS restringido solo a `http://localhost:3000` (el frontend Vite utiliza `5173`), respuesta de `/login` que no devolvía el perfil del usuario, y permiso `Admin` rígido en `MapVersionedV1Group` que impedía a los mecánicos consultar catálogos.
- **Acciones y Correcciones Realizadas**:
  - **Aceptado**: Se añadieron los orígenes `http://localhost:5173` y `http://localhost:3000` en la política CORS del backend.
  - **Aceptado**: Se enriqueció la respuesta del endpoint `/api/v1/usuarios/login` para incluir los datos del usuario y su rol.
  - **Aceptado y Corregido**: Se parametrizó `MapVersionedV1Group` para permitir acceso de lectura a `Admin, Mecanico` manteniendo `RolApi` reservado exclusivamente a `Admin`.

---

### 2.2 Fase 2: Arquitectura Frontend y Consumo Centralizado
- **Prompt Relevante**:
  > *"ahora necesito que crees un frontend para consumir las api, crea una carpeta frontend para crearlo"*
- **Respuesta de la IA**:
  - Estructuración de proyecto Vite + React 19 + TypeScript.
  - Cliente Axios centralizado en `src/api/client.ts` con interceptor para adjuntar token `Bearer` y normalizar errores de API.
  - Servicios desacoplados de los componentes (`auth.service.ts`, `ordenes.service.ts`, `clientes.service.ts`, `vehiculos.service.ts`, `catalogos.service.ts`).
- **Acciones y Correcciones Realizadas**:
  - **Aceptado**: Implementación de interceptor que escucha respuestas `401 Unauthorized` para desloguear automáticamente y `403 Forbidden` para accesos indebidos.
  - **Corregido**: Se configuró `tsconfig.app.json` con `verbatimModuleSyntax: false` para evitar conflictos en compilaciones de módulos TypeScript y garantizar builds sin fricciones.

---

### 2.3 Fase 3: Seguridad, Autenticación y Autorización por Roles
- **Prompt Relevante**:
  > *"Diseñar el flujo de autenticación JWT y guardas de rutas protegidas distinguiendo roles Admin y Mecánico según las pautas OWASP."*
- **Respuesta de la IA**:
  - Contexto `AuthContext` con almacenamiento en `sessionStorage`.
  - Componente de enrutamiento `ProtectedRoute` que evalúa roles permitidos (`allowedRoles`).
  - Vistas condicionadas: los mecánicos no tienen visible el botón de eliminación; si intentasen acceder a una función no autorizada, se muestra la vista `ForbiddenPage (403)`.
- **Acciones y Correcciones Realizadas**:
  - **Aceptado**: Se justificó técnicamente la elección de `sessionStorage` sobre `localStorage` en el informe técnico (mitigación de retención indefinida del token y exposición en disco).
  - **Aceptado**: Se implementó decodificación segura del JWT en `jwt.ts` para extraer claims de rol estándar de ASP.NET Core (`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`).

---

### 2.4 Fase 4: Accesibilidad (WCAG 2.2 AA) y Diseño Responsivo
- **Prompt Relevante**:
  > *"Asegurar cumplimiento WCAG 2.2 AA y diseño mobile-first sin scroll horizontal."*
- **Respuesta de la IA**:
  - Implementación de Skip link (`.skip-link`) al inicio del DOM.
  - Landmarks semánticos (`<header>`, `<nav>`, `<main>`, `<footer>`).
  - Formularios con etiquetas asociadas (`<label htmlFor>`), mensajes de error referenciados con `aria-describedby` y estados invalidantes con `aria-invalid`.
  - Componente modal de confirmación `ConfirmModal` con captura de teclado (`Escape`), foco inicial seguro en cancelar y atributos `role="dialog"` y `aria-modal="true"`.
  - Transformación automática de tablas a tarjetas táctiles en pantallas pequeñas (< 768px).
- **Acciones y Correcciones Realizadas**:
  - **Aceptado**: Asegurado el tamaño táctil de al menos 44 × 44 px en todos los botones y enlaces interactivos.
  - **Aceptado**: Se especificó el atributo `lang="es"` en `index.html`.

---

### 2.5 Fase 5: Pruebas Automatizadas
- **Prompt Relevante**:
  > *"Configurar suite de pruebas con Vitest y Testing Library que cubra login, ruta protegida y CRUD, además de prueba E2E."*
- **Respuesta de la IA**:
  - Configuración de Vitest con entorno `jsdom` en `vitest.config.ts`.
  - Pruebas unitarias de `LoginPage.test.tsx`, `ProtectedRoute.test.tsx` y `OrdenesListPage.test.tsx`.
  - Configuración y script de pruebas End-to-End con Playwright (`e2e/taller-flow.spec.ts`).
- **Acciones y Correcciones Realizadas**:
  - **Aceptado**: Todas las 9 pruebas de componentes ejecutadas y pasadas exitosamente al 100%.
  - **Aceptado**: Suite de integración previa del backend verificada y aprobada (3/3 pruebas superadas).
