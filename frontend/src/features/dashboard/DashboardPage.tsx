import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordenesService } from '../../api/ordenes.service';
import { clientesService } from '../../api/clientes.service';
import { vehiculosService } from '../../api/vehiculos.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ClipboardList,
  Users,
  Car,
  Plus,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  Server,
  Calendar,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();

  const { data: ordenes = [], isLoading: loadingOrdenes } = useQuery({
    queryKey: ['ordenes'],
    queryFn: ordenesService.getAll,
  });

  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
  });

  const { data: vehiculos = [], isLoading: loadingVehiculos } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosService.getAll,
  });

  const isLoading = loadingOrdenes || loadingClientes || loadingVehiculos;

  const ordenesPendientes = ordenes.filter(
    (o) => o.estado?.toLowerCase() === 'pendiente' || o.estado?.toLowerCase() === 'ingresada'
  ).length;

  const ordenesEnProceso = ordenes.filter(
    (o) => o.estado?.toLowerCase() === 'en proceso' || o.estado?.toLowerCase() === 'reparacion'
  ).length;

  const ordenesCompletadas = ordenes.filter(
    (o) => o.estado?.toLowerCase() === 'completado' || o.estado?.toLowerCase() === 'finalizado'
  ).length;

  const todayFormatted = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Sistema Activo
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium capitalize">
                <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                {todayFormatted}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Hola, {user?.nombre || 'Usuario'} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-normal leading-relaxed">
              Monitorea el flujo de trabajo en tiempo real, administra órdenes de mantención vehicular y gestiona clientes desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/ordenes/nueva"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-950/60 transition-all transform active:scale-95 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Nueva Orden de Trabajo</span>
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Calculando indicadores operativos..." size="lg" />
      ) : (
        <>
          {/* Executive KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1: Total Ordenes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Órdenes
                </span>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {ordenes.length}
                </p>
                <span className="text-xs font-semibold text-slate-500">registros</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-700 font-medium">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Flujo de taller activo</span>
              </div>
            </div>

            {/* KPI 2: En Proceso */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  En Taller / Activas
                </span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {ordenesPendientes + ordenesEnProceso}
                </p>
                <span className="text-xs font-semibold text-amber-700 font-medium">
                  requieren atención
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{ordenesEnProceso} en reparación, {ordenesPendientes} pendientes</span>
              </div>
            </div>

            {/* KPI 3: Completadas */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Finalizadas
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {ordenesCompletadas}
                </p>
                <span className="text-xs font-semibold text-emerald-700 font-medium">
                  completadas
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Listas para entrega a cliente</span>
              </div>
            </div>

            {/* KPI 4: Clientes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Clientes
                </span>
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {clientes.length}
                </p>
                <span className="text-xs font-semibold text-slate-500">en base de datos</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                <Car className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{vehiculos.length} vehículos asociados</span>
              </div>
            </div>
          </div>

          {/* Section: Operational Tables & System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders Overview */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" aria-hidden="true" />
                    <span>Últimas Órdenes en Taller</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Resumen de las 5 órdenes más recientes ingresadas al sistema
                  </p>
                </div>
                <Link
                  to="/ordenes"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors min-h-[44px]"
                >
                  <span>Ver todas</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              {ordenes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No hay órdenes registradas todavía. Presiona "Nueva Orden" para comenzar.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {ordenes.slice(0, 5).map((orden) => (
                    <div
                      key={orden.ordenId}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs mt-0.5">
                          #{orden.ordenId}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {orden.cliente
                              ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                              : `Cliente #${orden.clienteId}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {orden.vehiculo && (
                              <span className="patente-chip text-[11px]">
                                {orden.vehiculo.patente}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">
                              {orden.vehiculo?.color || ''} {orden.vehiculo?.modelo?.nombre || ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            orden.estado?.toLowerCase() === 'completado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : orden.estado?.toLowerCase() === 'en proceso'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              orden.estado?.toLowerCase() === 'completado'
                                ? 'bg-emerald-500'
                                : orden.estado?.toLowerCase() === 'en proceso'
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {orden.estado}
                        </span>

                        <Link
                          to={`/ordenes/${orden.ordenId}`}
                          className="text-xs font-bold text-slate-600 hover:text-blue-700 p-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                          aria-label={`Ver orden #${orden.ordenId}`}
                        >
                          Detalle →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Column: Quick Shortcuts & Security Widget */}
            <div className="space-y-6">
              {/* Quick Actions Panel */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 mb-4">Acciones Operativas</h2>
                <div className="space-y-3">
                  <Link
                    to="/ordenes/nueva"
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all min-h-[44px] group"
                  >
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg group-hover:scale-105 transition-transform">
                      <ClipboardList className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Ingresar Orden</p>
                      <p className="text-xs text-slate-500">Registrar servicio para un vehículo</p>
                    </div>
                  </Link>

                  <Link
                    to="/clientes"
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all min-h-[44px] group"
                  >
                    <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Directorio de Clientes</p>
                      <p className="text-xs text-slate-500">Crear o consultar datos de clientes</p>
                    </div>
                  </Link>

                  <Link
                    to="/vehiculos"
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all min-h-[44px] group"
                  >
                    <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg group-hover:scale-105 transition-transform">
                      <Car className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Parque Automotriz</p>
                      <p className="text-xs text-slate-500">Vehículos, patentes y modelos</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* System Architecture & Security Health Card */}
              <div className="bg-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Estado del Sistema
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    En Línea
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">API Backend:</span>
                    <span className="font-mono text-slate-200">ASP.NET Core v1.0</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Protección OWASP:</span>
                    <span className="text-emerald-400 font-semibold">Rate Limiting 100/min</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                    <span className="text-slate-400">Almacenamiento Token:</span>
                    <span className="text-blue-300 font-semibold">sessionStorage (Seguro)</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Rol Autenticado:</span>
                    <span className="font-bold text-white uppercase">{role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
