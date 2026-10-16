import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordenesService } from '../../api/ordenes.service';
import { clientesService } from '../../api/clientes.service';
import { vehiculosService } from '../../api/vehiculos.service';
import { catalogosService } from '../../api/catalogos.service';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';
import { NormalizedError } from '../../types/api.types';
import {
  ArrowLeft,
  Save,
  User,
  Car,
  Wrench,
  Clock,
  Calendar,
  FileText,
  Info,
} from 'lucide-react';

const ordenSchema = z.object({
  clienteId: z.coerce.number().min(1, 'Debe seleccionar un cliente.'),
  vehiculoId: z.coerce.number().min(1, 'Debe seleccionar un vehículo.'),
  mecanicoId: z.coerce.number().min(1, 'Debe seleccionar un mecánico.'),
  estado: z.string().min(1, 'El estado de la orden es obligatorio.'),
  observaciones: z.string().max(500, 'Las observaciones no pueden superar 500 caracteres.').optional(),
  fechaIngreso: z.string().optional(),
});

type OrdenFormData = z.infer<typeof ordenSchema>;

export const OrdenFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const ordenId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [apiError, setApiError] = useState<NormalizedError | null>(null);

  // Cargar catálogos para los selectores
  const { data: clientes = [], isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
  });

  const { data: vehiculos = [], isLoading: loadingVehiculos } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosService.getAll,
  });

  const { data: mecanicos = [], isLoading: loadingMecanicos } = useQuery({
    queryKey: ['mecanicos'],
    queryFn: catalogosService.getMecanicos,
  });

  // Si es edición, cargar la orden existente
  const { data: existingOrden, isLoading: loadingOrden } = useQuery({
    queryKey: ['orden', ordenId],
    queryFn: () => ordenesService.getById(ordenId),
    enabled: isEditing && !isNaN(ordenId),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema),
    defaultValues: {
      estado: 'Pendiente',
      observaciones: '',
      fechaIngreso: new Date().toISOString().substring(0, 10),
    },
  });

  const selectedClienteId = watch('clienteId');

  useEffect(() => {
    if (existingOrden) {
      reset({
        clienteId: existingOrden.clienteId,
        vehiculoId: existingOrden.vehiculoId,
        mecanicoId: existingOrden.mecanicoId,
        estado: existingOrden.estado,
        observaciones: existingOrden.observaciones || '',
        fechaIngreso: existingOrden.fechaIngreso
          ? new Date(existingOrden.fechaIngreso).toISOString().substring(0, 10)
          : '',
      });
    }
  }, [existingOrden, reset]);

  // Mutación para Guardar
  const saveMutation = useMutation({
    mutationFn: async (data: OrdenFormData) => {
      const payload = {
        clienteId: Number(data.clienteId),
        vehiculoId: Number(data.vehiculoId),
        mecanicoId: Number(data.mecanicoId),
        estado: data.estado,
        observaciones: data.observaciones || '',
        fechaIngreso: data.fechaIngreso ? new Date(data.fechaIngreso).toISOString() : new Date().toISOString(),
      };

      if (isEditing) {
        await ordenesService.update(ordenId, payload);
      } else {
        await ordenesService.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] });
      navigate('/ordenes');
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
    },
  });

  const onSubmit = (data: OrdenFormData) => {
    setApiError(null);
    saveMutation.mutate(data);
  };

  const isDataLoading = loadingClientes || loadingVehiculos || loadingMecanicos || (isEditing && loadingOrden);

  if (isDataLoading) {
    return <LoadingSpinner message="Preparando formulario de orden de trabajo..." size="lg" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-4 pb-2 border-b border-slate-200/80">
        <Link
          to="/ordenes"
          className="p-2.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs transition-colors"
          aria-label="Volver al listado de órdenes"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? `Editar Orden de Trabajo #${ordenId}` : 'Crear Nueva Orden de Trabajo'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ingresa los antecedentes del vehículo, propietario y mecánico asignado.
          </p>
        </div>
      </div>

      {apiError && (
        <Alert
          type="error"
          title="Error al guardar orden"
          message={apiError.message}
          fieldErrors={apiError.fieldErrors}
          onClose={() => setApiError(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Card 1: Vehiculo y Cliente */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Car className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold">1. Cliente y Vehículo</h2>
              <p className="text-xs text-slate-400 font-normal">Identificación del propietario y el móvil a intervenir</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Cliente selector */}
            <div>
              <label htmlFor="clienteId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Cliente Propietario <span className="text-red-500">*</span></span>
              </label>
              <select
                id="clienteId"
                aria-invalid={!!errors.clienteId}
                aria-describedby={errors.clienteId ? 'clienteId-error' : undefined}
                {...register('clienteId')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border bg-white ${
                  errors.clienteId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px] transition-all`}
              >
                <option value="">Seleccione el cliente...</option>
                {clientes.map((c) => (
                  <option key={c.clienteId} value={c.clienteId}>
                    {c.nombre} {c.apellido} — {c.telefono}
                  </option>
                ))}
              </select>
              {errors.clienteId && (
                <p id="clienteId-error" className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.clienteId.message}
                </p>
              )}
            </div>

            {/* Vehiculo selector */}
            <div>
              <label htmlFor="vehiculoId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span>Vehículo en Reparación <span className="text-red-500">*</span></span>
              </label>
              <select
                id="vehiculoId"
                aria-invalid={!!errors.vehiculoId}
                aria-describedby={errors.vehiculoId ? 'vehiculoId-error' : undefined}
                {...register('vehiculoId')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border bg-white font-mono text-xs sm:text-sm ${
                  errors.vehiculoId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px] transition-all`}
              >
                <option value="">Seleccione la patente del vehículo...</option>
                {vehiculos.map((v) => (
                  <option key={v.vehiculoId} value={v.vehiculoId}>
                    [{v.patente}] — {v.color} {v.anio ? `(${v.anio})` : ''} {v.modelo?.nombre || ''}
                  </option>
                ))}
              </select>
              {errors.vehiculoId && (
                <p id="vehiculoId-error" className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.vehiculoId.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Asignación y Estado */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Wrench className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold">2. Asignación Técnica y Estado</h2>
              <p className="text-xs text-slate-400 font-normal">Mecánico responsable y seguimiento del proceso</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Mecánico selector */}
            <div>
              <label htmlFor="mecanicoId" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mecánico Responsable <span className="text-red-500">*</span>
              </label>
              <select
                id="mecanicoId"
                aria-invalid={!!errors.mecanicoId}
                aria-describedby={errors.mecanicoId ? 'mecanicoId-error' : undefined}
                {...register('mecanicoId')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border bg-white ${
                  errors.mecanicoId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px] transition-all`}
              >
                <option value="">Seleccione mecánico...</option>
                {mecanicos.map((m) => (
                  <option key={m.mecanicoId} value={m.mecanicoId}>
                    {m.nombre} {m.apellido}
                  </option>
                ))}
              </select>
              {errors.mecanicoId && (
                <p id="mecanicoId-error" className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.mecanicoId.message}
                </p>
              )}
            </div>

            {/* Estado de la orden */}
            <div>
              <label htmlFor="estado" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Estado Operativo <span className="text-red-500">*</span>
              </label>
              <select
                id="estado"
                aria-invalid={!!errors.estado}
                aria-describedby={errors.estado ? 'estado-error' : undefined}
                {...register('estado')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border bg-white font-semibold ${
                  errors.estado ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px] transition-all`}
              >
                <option value="Pendiente">🟡 Pendiente</option>
                <option value="En Proceso">🔵 En Proceso</option>
                <option value="Completado">🟢 Completado</option>
              </select>
              {errors.estado && (
                <p id="estado-error" className="mt-1.5 text-xs font-semibold text-red-600">
                  {errors.estado.message}
                </p>
              )}
            </div>

            {/* Fecha de ingreso */}
            <div>
              <label htmlFor="fechaIngreso" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Fecha de Ingreso
              </label>
              <input
                id="fechaIngreso"
                type="date"
                {...register('fechaIngreso')}
                className="block w-full py-2 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Observaciones y Diagnóstico */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900 font-bold">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold">3. Diagnóstico y Observaciones</h2>
              <p className="text-xs text-slate-400 font-normal">Síntomas reportados, cotizaciones o detalles del trabajo</p>
            </div>
          </div>

          <div>
            <label htmlFor="observaciones" className="sr-only">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              rows={4}
              aria-invalid={!!errors.observaciones}
              aria-describedby={errors.observaciones ? 'observaciones-error' : undefined}
              {...register('observaciones')}
              className="block w-full p-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-400"
              placeholder="Ejemplo: Cliente indica ruido al frenar en rueda delantera derecha. Se solicita revisión de pastillas y discos..."
            />
            {errors.observaciones && (
              <p id="observaciones-error" className="mt-1.5 text-xs font-semibold text-red-600">
                {errors.observaciones.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions Bar */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <Link
            to="/ordenes"
            className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || saveMutation.isPending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-900/30 transition-all min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>{isSubmitting || saveMutation.isPending ? 'Guardando en Servidor...' : 'Guardar Orden de Trabajo'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
