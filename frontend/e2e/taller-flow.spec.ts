import { test, expect } from '@playwright/test';

test.describe('Flujo E2E Taller Mecánico: Login, Crear y Listar', () => {
  test('Completa el flujo de autenticación, creación de orden de trabajo y visualización en listado', async ({ page }) => {
    // 1. Mock de endpoints API para pruebas controladas y reproducibles
    await page.route('**/api/v1/usuarios/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluVGVzdCIsInJvbGUiOiJBZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0.dummy',
          usuario: {
            usuarioId: 1,
            nombre: 'AdminTest',
            correo: 'admin@taller.cl',
            rol: 'Admin',
          },
        }),
      });
    });

    const mockClientes = [
      { clienteId: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '+56912345678', correo: 'juan@email.com' },
    ];
    const mockVehiculos = [
      { vehiculoId: 1, patente: 'AA1122', color: 'Negro', clienteId: 1, modeloId: 1 },
    ];
    const mockMecanicos = [
      { mecanicoId: 1, nombre: 'Pedro', apellido: 'Gómez', especialidadId: 1 },
    ];
    const mockOrdenes = [
      {
        ordenId: 501,
        fechaIngreso: new Date().toISOString(),
        estado: 'Pendiente',
        observaciones: 'Mantención preventiva 50.000 km',
        clienteId: 1,
        vehiculoId: 1,
        mecanicoId: 1,
        cliente: mockClientes[0],
        vehiculo: mockVehiculos[0],
        mecanico: mockMecanicos[0],
      },
    ];

    await page.route('**/api/v1/clientes', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockClientes) });
    });
    await page.route('**/api/v1/vehiculos', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockVehiculos) });
    });
    await page.route('**/api/v1/mecanicos', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockMecanicos) });
    });
    await page.route('**/api/v1/ordenes-trabajo', async (route) => {
      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON();
        mockOrdenes.push({
          ordenId: 502,
          ...payload,
          cliente: mockClientes[0],
          vehiculo: mockVehiculos[0],
          mecanico: mockMecanicos[0],
        });
        await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(mockOrdenes[1]) });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockOrdenes) });
      }
    });

    // 2. Navegar al Login
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /taller mecánico/i })).toBeVisible();

    // 3. Completar formulario de inicio de sesión
    await page.getByLabel(/nombre de usuario/i).fill('AdminTest');
    await page.getByLabel(/contraseña/i).fill('Password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // 4. Redirección al Dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /bienvenido, admintest/i })).toBeVisible();

    // 5. Ir a Nueva Orden de Trabajo
    await page.getByRole('link', { name: /nueva orden/i }).first().click();
    await expect(page).toHaveURL('/ordenes/nueva');
    await expect(page.getByRole('heading', { name: /crear nueva orden de trabajo/i })).toBeVisible();

    // 6. Completar formulario de Orden
    await page.getByLabel(/cliente asignado/i).selectOption('1');
    await page.getByLabel(/vehículo en reparación/i).selectOption('1');
    await page.getByLabel(/mecánico responsable/i).selectOption('1');
    await page.getByLabel(/estado de la orden/i).selectOption('Pendiente');
    await page.getByLabel(/observaciones y diagnóstico/i).fill('Revisión completa de frenos y suspensión');

    // 7. Enviar formulario
    await page.getByRole('button', { name: /guardar orden/i }).click();

    // 8. Confirmar redirección al Listado y visualización de órdenes
    await expect(page).toHaveURL('/ordenes');
    await expect(page.getByText('Juan Pérez')).toBeVisible();
    await expect(page.getByText('AA1122')).toBeVisible();
  });
});
