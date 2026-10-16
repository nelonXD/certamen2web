import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ordenesService } from '../../api/ordenes.service';
import { clientesService } from '../../api/clientes.service';
import { vehiculosService } from '../../api/vehiculos.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  FileText,
  Users,
  Car,
  PlusCircle,
  Clock,
  CheckCircle,
  Shield,
  Activity,
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

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-semibold mb-2">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Rol activo: {role}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenido, {user?.nombre}
            </h1>
            <p className="mt-1 text-slate-300 text-sm max-w-xl">
              Panel de control operativo para gestión del taller mecánico, órdenes de trabajo y clientes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ordenes/nueva"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-white"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Nueva Orden</span>
            </Link>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Obteniendo métricas del taller..." />
      ) : (
        <>
          {/* Key metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <FileText className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Órdenes
                </p>
                <p className="text-2xl font-bold text-slate-900">{ordenes.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <Clock className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  En Proceso / Pendientes
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {ordenesPendientes + ordenesEnProceso}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Completadas
                </p>
                <p className="text-2xl font-bold text-slate-900">{ordenesCompletadas}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                <Users className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Clientes
                </p>
                <p className="text-2xl font-bold text-slate-900">{clientes.length}</p>
              </div>
            </div>
          </div>

          {/* Quick links & summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders Overview */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <span>Últimas Órdenes Registradas</span>
                </h2>
                <Link
                  to="/ordenes"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800 underline"
                >
                  Ver todas
                </Link>
              </div>

              {ordenes.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No hay órdenes registradas aún.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {ordenes.slice(0, 5).map((orden) => (
                    <div
                      key={orden.ordenId}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Orden #{orden.ordenId} —{' '}
                          {orden.cliente
                            ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                            : `Cliente ID ${orden.clienteId}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          Vehículo:{' '}
                          {orden.vehiculo
                            ? `${orden.vehiculo.patente} (${orden.vehiculo.color})`
                            : `ID ${orden.vehiculoId}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                          {orden.estado}
                        </span>
                        <Link
                          to={`/ordenes/${orden.ordenId}`}
                          className="text-xs font-semibold text-blue-700 hover:underline min-h-[44px] flex items-center"
                        >
                          Detalles →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions & Security Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Acciones Rápidas</h2>
                <div className="space-y-3">
                  <Link
                    to="/ordenes/nueva"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors min-h-[44px]"
                  >
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-md">
                      <FileText className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Crear Orden</p>
                      <p className="text-xs text-slate-500">Ingresar nuevo vehículo a taller</p>
                    </div>
                  </Link>

                  <Link
                    to="/clientes"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors min-h-[44px]"
                  >
                    <div className="p-2 bg-purple-50 text-purple-700 rounded-md">
                      <Users className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Gestionar Clientes</p>
                      <p className="text-xs text-slate-500">Consultar y agregar clientes</p>
                    </div>
                  </Link>

                  <Link
                    to="/vehiculos"
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors min-h-[44px]"
                  >
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-md">
                      <Car className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Gestionar Vehículos</p>
                      <p className="text-xs text-slate-500">Patentes y modelos asociados</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span>Seguridad de Extremo a Extremo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistema protegido con JWT Bearer en sessionStorage, rate limiting activo y validaciones en cliente y servidor bajo estándares OWASP.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
