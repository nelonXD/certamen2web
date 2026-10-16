import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordenesService } from '../../api/ordenes.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';
import {
  ArrowLeft,
  Edit2,
  Calendar,
  User,
  Car,
  Wrench,
  CreditCard,
  FileText,
  Clock,
  Printer,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const OrdenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ordenId = Number(id);

  const {
    data: orden,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['orden', ordenId],
    queryFn: () => ordenesService.getById(ordenId),
    enabled: !isNaN(ordenId),
  });

  if (isLoading) {
    return <LoadingSpinner message="Cargando detalles de la orden..." size="lg" />;
  }

  if (isError || !orden) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto py-8">
        <Alert
          type="error"
          title="Orden no encontrada"
          message={error?.message || 'No fue posible cargar la información de esta orden de trabajo.'}
        />
        <button
          type="button"
          onClick={() => navigate('/ordenes')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver a órdenes
        </button>
      </div>
    );
  }

  const isCompleted =
    orden.estado?.toLowerCase() === 'completado' || orden.estado?.toLowerCase() === 'completada';
  const isInProgress =
    orden.estado?.toLowerCase() === 'en proceso' || orden.estado?.toLowerCase() === 'en reparacion';

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {orden.estado}
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          {orden.estado}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        {orden.estado}
      </span>
    );
  };

  const getClientInitials = () => {
    if (!orden.cliente) return 'CL';
    const first = orden.cliente.nombre ? orden.cliente.nombre[0].toUpperCase() : '';
    const last = orden.cliente.apellido ? orden.cliente.apellido[0].toUpperCase() : '';
    return `${first}${last}` || 'CL';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:m-0 print:max-w-none">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Ruta de navegación" className="print:hidden">
        <ol className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <li>
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Inicio
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </li>
          <li>
            <Link to="/ordenes" className="hover:text-slate-900 transition-colors">
              Órdenes de Trabajo
            </Link>
          </li>
          <li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          </li>
          <li className="font-semibold text-slate-900" aria-current="page">
            Ficha #{orden.ordenId}
          </li>
        </ol>
      </nav>

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-start sm:items-center gap-3">
          <Link
            to="/ordenes"
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs transition-colors print:hidden"
            aria-label="Volver al listado de órdenes"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                Orden #{orden.ordenId}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>
                Ingreso registrada el{' '}
                <strong className="text-slate-700">
                  {orden.fechaIngreso
                    ? new Date(orden.fechaIngreso).toLocaleString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Fecha no especificada'}
                </strong>
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition-colors shadow-xs min-h-[44px] focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Printer className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>Imprimir Ficha</span>
          </button>
          <Link
            to={`/ordenes/${orden.ordenId}/editar`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-xs min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95"
          >
            <Edit2 className="w-4 h-4" aria-hidden="true" />
            <span>Editar Orden</span>
          </Link>
        </div>
      </div>

      {/* Progress / Lifecycle Stepper */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:hidden">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
          Progreso de la Orden en Taller
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">1. Ingreso e Inspección</p>
              <p className="text-[11px] text-emerald-700">Completado</p>
            </div>
          </div>

          {/* Step 2 */}
          <div
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              isCompleted
                ? 'bg-emerald-50/70 border-emerald-200'
                : isInProgress
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-emerald-600 text-white'
                  : isInProgress
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Clock className="w-4 h-4" aria-hidden="true" />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-bold ${
                  isCompleted
                    ? 'text-emerald-900'
                    : isInProgress
                    ? 'text-blue-900'
                    : 'text-amber-900'
                }`}
              >
                2. Diagnóstico & Reparación
              </p>
              <p
                className={`text-[11px] ${
                  isCompleted
                    ? 'text-emerald-700'
                    : isInProgress
                    ? 'text-blue-700 font-semibold'
                    : 'text-amber-700'
                }`}
              >
                {isCompleted ? 'Finalizado' : isInProgress ? 'En progreso activo' : 'Pendiente'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              isCompleted
                ? 'bg-emerald-50/70 border-emerald-200 ring-2 ring-emerald-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p
                className={`text-xs font-bold ${
                  isCompleted ? 'text-emerald-900' : 'text-slate-600'
                }`}
              >
                3. Control y Entrega
              </p>
              <p
                className={`text-[11px] ${
                  isCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-400'
                }`}
              >
                {isCompleted ? 'Listo para entrega' : 'Pendiente de reparación'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <User className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold">Cliente Propietario</h2>
            </div>
            {orden.cliente && (
              <span className="text-xs font-mono font-medium text-slate-400">
                ID #{orden.cliente.clienteId}
              </span>
            )}
          </div>

          {orden.cliente ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {getClientInitials()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {orden.cliente.nombre} {orden.cliente.apellido}
                  </h3>
                  <p className="text-xs text-slate-500">Cliente titular registrado</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${orden.cliente.telefono}`}
                    className="font-mono text-blue-700 hover:underline"
                  >
                    {orden.cliente.telefono}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${orden.cliente.correo}`}
                    className="text-blue-700 hover:underline break-all"
                  >
                    {orden.cliente.correo}
                  </a>
                </div>
                {orden.cliente.direccion && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{orden.cliente.direccion}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Cliente ID #{orden.clienteId}</p>
          )}
        </div>

        {/* Vehiculo Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Car className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold">Vehículo Ingresado</h2>
            </div>
            {orden.vehiculo && (
              <span className="text-xs font-mono font-medium text-slate-400">
                ID #{orden.vehiculo.vehiculoId}
              </span>
            )}
          </div>

          {orden.vehiculo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block mb-1">
                    Placa Patente Única (PPU)
                  </span>
                  <span className="patente-chip text-base tracking-widest">
                    {orden.vehiculo.patente}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block mb-1">
                    Año / Color
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {orden.vehiculo.color} {orden.vehiculo.anio ? `(${orden.vehiculo.anio})` : ''}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-sm space-y-1">
                <p className="font-semibold text-slate-800">
                  {orden.vehiculo.modelo?.nombre || `Modelo #${orden.vehiculo.modeloId}`}
                </p>
                {orden.vehiculo.modelo?.marca && (
                  <p className="text-xs text-slate-500">
                    Marca:{' '}
                    <strong className="text-slate-700">
                      {orden.vehiculo.modelo.marca.nombre}
                    </strong>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Vehículo ID #{orden.vehiculoId}</p>
          )}
        </div>

        {/* Mecanico Asignado Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Wrench className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold">Mecánico Asignado</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Técnico a cargo
            </span>
          </div>

          {orden.mecanico ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center">
                  <Wrench className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {orden.mecanico.nombre} {orden.mecanico.apellido}
                  </h3>
                  <p className="text-xs text-slate-500">Mecánico Especialista</p>
                </div>
              </div>

              {orden.mecanico.telefono && (
                <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <a
                    href={`tel:${orden.mecanico.telefono}`}
                    className="font-mono text-purple-700 hover:underline"
                  >
                    {orden.mecanico.telefono}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Mecánico ID #{orden.mecanicoId} (Sin detalles adicionales)
            </p>
          )}
        </div>

        {/* Informacion de Pago Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <CreditCard className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold">Información de Pago</h2>
            </div>
            {orden.pago && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {orden.pago.estado || 'Al día'}
              </span>
            )}
          </div>

          {orden.pago ? (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Monto Total
                </span>
                <p className="text-2xl font-extrabold text-slate-900 font-mono">
                  ${Number(orden.pago.montoTotal).toLocaleString('es-CL')}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span>Método registrado:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {orden.pago.metodoPago || 'Efectivo / Transferencia'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 italic py-2">
              No hay comprobante de pago emitido aún para esta orden de trabajo.
            </div>
          )}
        </div>
      </div>

      {/* Observaciones y Diagnóstico */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold pb-3 border-b border-slate-100">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <FileText className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold">Observaciones, Síntomas y Diagnóstico Técnico</h2>
        </div>
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/60">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {orden.observaciones || 'No se registraron observaciones adicionales para esta orden.'}
          </p>
        </div>
      </div>
    </div>
  );
};
