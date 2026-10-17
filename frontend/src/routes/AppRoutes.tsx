import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { OrdenesListPage } from '../features/ordenes/OrdenesListPage';
import { OrdenDetailPage } from '../features/ordenes/OrdenDetailPage';
import { OrdenFormPage } from '../features/ordenes/OrdenFormPage';
import { ClientesListPage } from '../features/clientes/ClientesListPage';
import { VehiculosListPage } from '../features/vehiculos/VehiculosListPage';
import { ForbiddenPage } from '../features/error/ForbiddenPage';
import { NotFoundPage } from '../features/error/NotFoundPage';

import { AdministracionPage } from '../features/administracion/AdministracionPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/acceso-denegado" element={<ForbiddenPage />} />

      {/* Rutas Protegidas (Requieren Login con JWT) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          
          {/* CRUD Órdenes de Trabajo (Recurso Principal) */}
          <Route path="/ordenes" element={<OrdenesListPage />} />
          <Route path="/ordenes/nueva" element={<OrdenFormPage />} />
          <Route path="/ordenes/:id" element={<OrdenDetailPage />} />
          <Route path="/ordenes/:id/editar" element={<OrdenFormPage />} />

          {/* CRUD Clientes (Recurso Relacionado) */}
          <Route path="/clientes" element={<ClientesListPage />} />

          {/* CRUD Vehículos (Recurso Relacionado) */}
          <Route path="/vehiculos" element={<VehiculosListPage />} />

          {/* Módulo de Administración (Solo Admin) */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/administracion" element={<AdministracionPage />} />
            <Route path="/mecanicos" element={<Navigate to="/administracion" replace />} />
            <Route path="/servicios" element={<Navigate to="/administracion" replace />} />
            <Route path="/repuestos" element={<Navigate to="/administracion" replace />} />
          </Route>
        </Route>
      </Route>

      {/* 404 No Encontrado */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
