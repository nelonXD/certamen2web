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
      <div className="space-y-4 max-w-2xl mx-auto">
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top navigation & action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/ordenes"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs"
            aria-label="Volver al listado de órdenes"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Orden de Trabajo #{orden.ordenId}
            </h1>
            <p className="text-xs text-slate-500">
              Registrada el{' '}
              {orden.fechaIngreso
                ? new Date(orden.fechaIngreso).toLocaleString('es-CL')
                : 'Fecha no especificada'}
            </p>
          </div>
        </div>

        <Link
          to={`/ordenes/${orden.ordenId}/editar`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-xs min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Edit2 className="w-4 h-4" aria-hidden="true" />
          <span>Editar Orden</span>
        </Link>
      </div>

      {/* Status banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estado Actual
            </span>
            <p className="text-lg font-bold text-slate-900">{orden.estado}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
          ID #{orden.ordenId}
        </span>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cliente Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h2 className="text-base">Datos del Cliente</h2>
          </div>
          {orden.cliente ? (
            <div className="text-sm space-y-2 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Nombre: </span>
                {orden.cliente.nombre} {orden.cliente.apellido}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Teléfono: </span>
                {orden.cliente.telefono}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Correo: </span>
                {orden.cliente.correo}
              </p>
              {orden.cliente.direccion && (
                <p>
                  <span className="font-semibold text-slate-800">Dirección: </span>
                  {orden.cliente.direccion}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Cliente ID #{orden.clienteId}</p>
          )}
        </div>

        {/* Vehiculo Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
            <Car className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <h2 className="text-base">Datos del Vehículo</h2>
          </div>
          {orden.vehiculo ? (
            <div className="text-sm space-y-2 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Patente: </span>
                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded">
                  {orden.vehiculo.patente}
                </span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">Color: </span>
                {orden.vehiculo.color}
              </p>
              {orden.vehiculo.anio && (
                <p>
                  <span className="font-semibold text-slate-800">Año: </span>
                  {orden.vehiculo.anio}
                </p>
              )}
              {orden.vehiculo.modelo && (
                <p>
                  <span className="font-semibold text-slate-800">Modelo: </span>
                  {orden.vehiculo.modelo.nombre}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Vehículo ID #{orden.vehiculoId}</p>
          )}
        </div>

        {/* Mecanico Asignado */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
            <Wrench className="w-5 h-5 text-purple-600" aria-hidden="true" />
            <h2 className="text-base">Mecánico Asignado</h2>
          </div>
          {orden.mecanico ? (
            <div className="text-sm space-y-2 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Profesional: </span>
                {orden.mecanico.nombre} {orden.mecanico.apellido}
              </p>
              {orden.mecanico.telefono && (
                <p>
                  <span className="font-semibold text-slate-800">Contacto: </span>
                  {orden.mecanico.telefono}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">Mecánico ID #{orden.mecanicoId}</p>
          )}
        </div>

        {/* Pago Asignado */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
            <CreditCard className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <h2 className="text-base">Información de Pago</h2>
          </div>
          {orden.pago ? (
            <div className="text-sm space-y-2 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Total a pagar: </span>
                <span className="font-bold text-slate-900 text-base">
                  ${Number(orden.pago.montoTotal).toLocaleString('es-CL')}
                </span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">Método de pago: </span>
                {orden.pago.metodoPago}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Estado de pago: </span>
                <span className="font-medium text-emerald-700">{orden.pago.estado}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No hay registros de pago asociados aún.</p>
          )}
        </div>
      </div>

      {/* Observaciones */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
          <FileText className="w-5 h-5 text-slate-600" aria-hidden="true" />
          <h2 className="text-base">Observaciones y Diagnóstico</h2>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {orden.observaciones || 'No se registraron observaciones adicionales para esta orden.'}
        </p>
      </div>
    </div>
  );
};
