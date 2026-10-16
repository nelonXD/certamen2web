import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Vehiculo, VehiculoDTO } from '../../types/vehiculo.types';
import { Cliente } from '../../types/cliente.types';
import { Modelo } from '../../types/catalogo.types';
import { X, Save, Car, Tag } from 'lucide-react';

const vehiculoSchema = z.object({
  patente: z
    .string()
    .min(4, 'La patente debe tener al menos 4 caracteres.')
    .max(20, 'La patente no puede superar 20 caracteres.')
    .toUpperCase(),
  color: z.string().min(2, 'El color es obligatorio.'),
  anio: z.coerce.number().min(1900, 'Año no válido').max(new Date().getFullYear() + 1, 'Año no válido').optional(),
  clienteId: z.coerce.number().min(1, 'Debe asignar un cliente válido.'),
  modeloId: z.coerce.number().min(1, 'Debe asignar un modelo válido.'),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

interface VehiculoModalFormProps {
  isOpen: boolean;
  vehiculoToEdit: Vehiculo | null;
  clientes: Cliente[];
  modelos: Modelo[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: VehiculoDTO) => void;
}

export const VehiculoModalForm: React.FC<VehiculoModalFormProps> = ({
  isOpen,
  vehiculoToEdit,
  clientes,
  modelos,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(vehiculoToEdit);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
  });

  const livePatente = watch('patente');

  useEffect(() => {
    if (vehiculoToEdit) {
      reset({
        patente: vehiculoToEdit.patente,
        color: vehiculoToEdit.color,
        anio: vehiculoToEdit.anio || undefined,
        clienteId: vehiculoToEdit.clienteId,
        modeloId: vehiculoToEdit.modeloId,
      });
    } else {
      reset({
        patente: '',
        color: '',
        anio: new Date().getFullYear(),
        clienteId: undefined,
        modeloId: undefined,
      });
    }
  }, [vehiculoToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehiculo-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Car className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="vehiculo-modal-title" className="text-lg font-extrabold text-slate-900">
                {isEditing ? `Editar Vehículo` : 'Registrar Nuevo Vehículo'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Modificando especificaciones de ${vehiculoToEdit?.patente}`
                  : 'Ingresa los datos del móvil y asocia su propietario'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Live License Plate Preview */}
        {livePatente && livePatente.trim().length > 0 && (
          <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vista previa placa:</span>
            <span className="patente-chip text-sm">{livePatente}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patente" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Placa Patente (PPU) <span className="text-red-500">*</span>
              </label>
              <input
                id="patente"
                type="text"
                aria-invalid={!!errors.patente}
                aria-describedby={errors.patente ? 'patente-error' : undefined}
                {...register('patente')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border font-mono uppercase font-bold tracking-wider ${
                  errors.patente ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="ABCD12"
              />
              {errors.patente && (
                <p id="patente-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.patente.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Color Carrocería <span className="text-red-500">*</span>
              </label>
              <input
                id="color"
                type="text"
                aria-invalid={!!errors.color}
                aria-describedby={errors.color ? 'color-error' : undefined}
                {...register('color')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                  errors.color ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="Gris Titanio"
              />
              {errors.color && (
                <p id="color-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="anio" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Año de Fabricación
            </label>
            <input
              id="anio"
              type="number"
              aria-invalid={!!errors.anio}
              aria-describedby={errors.anio ? 'anio-error' : undefined}
              {...register('anio')}
              className="block w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50 font-mono"
              placeholder="2022"
            />
            {errors.anio && (
              <p id="anio-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.anio.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehiculo-clienteId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Cliente Propietario <span className="text-red-500">*</span>
            </label>
            <select
              id="vehiculo-clienteId"
              aria-invalid={!!errors.clienteId}
              aria-describedby={errors.clienteId ? 'v-cliente-error' : undefined}
              {...register('clienteId')}
              className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border bg-slate-50/50 ${
                errors.clienteId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
              } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all`}
            >
              <option value="">Seleccione el propietario del vehículo...</option>
              {clientes.map((c) => (
                <option key={c.clienteId} value={c.clienteId}>
                  {c.nombre} {c.apellido} ({c.telefono})
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p id="v-cliente-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.clienteId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehiculo-modeloId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Modelo y Marca <span className="text-red-500">*</span>
            </label>
            <select
              id="vehiculo-modeloId"
              aria-invalid={!!errors.modeloId}
              aria-describedby={errors.modeloId ? 'v-modelo-error' : undefined}
              {...register('modeloId')}
              className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border bg-slate-50/50 ${
                errors.modeloId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
              } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all`}
            >
              <option value="">Seleccione el modelo correspondiente...</option>
              {modelos.map((m) => (
                <option key={m.modeloId} value={m.modeloId}>
                  {m.nombre} {m.marca ? `(${m.marca.nombre})` : ''}
                </option>
              ))}
            </select>
            {errors.modeloId && (
              <p id="v-modelo-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.modeloId.message}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl min-h-[44px] focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-900/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Vehículo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
