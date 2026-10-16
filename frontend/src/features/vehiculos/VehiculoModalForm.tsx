import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Vehiculo, VehiculoDTO } from '../../types/vehiculo.types';
import { Cliente } from '../../types/cliente.types';
import { Modelo } from '../../types/catalogo.types';
import { X, Save, Car } from 'lucide-react';

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
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
  });

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehiculo-modal-title"
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <Car className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id="vehiculo-modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? `Editar Vehículo: ${vehiculoToEdit?.patente}` : 'Registrar Nuevo Vehículo'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="patente" className="block text-xs font-semibold text-slate-700 mb-1">
                Patente <span className="text-red-500">*</span>
              </label>
              <input
                id="patente"
                type="text"
                aria-invalid={!!errors.patente}
                aria-describedby={errors.patente ? 'patente-error' : undefined}
                {...register('patente')}
                className={`block w-full py-2 px-3 text-sm rounded-lg border font-mono uppercase ${
                  errors.patente ? 'border-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="ABCD12"
              />
              {errors.patente && (
                <p id="patente-error" className="mt-1 text-xs text-red-600">
                  {errors.patente.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="color" className="block text-xs font-semibold text-slate-700 mb-1">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                id="color"
                type="text"
                aria-invalid={!!errors.color}
                aria-describedby={errors.color ? 'color-error' : undefined}
                {...register('color')}
                className={`block w-full py-2 px-3 text-sm rounded-lg border ${
                  errors.color ? 'border-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="Rojo"
              />
              {errors.color && (
                <p id="color-error" className="mt-1 text-xs text-red-600">
                  {errors.color.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="anio" className="block text-xs font-semibold text-slate-700 mb-1">
              Año de Fabricación
            </label>
            <input
              id="anio"
              type="number"
              aria-invalid={!!errors.anio}
              aria-describedby={errors.anio ? 'anio-error' : undefined}
              {...register('anio')}
              className="block w-full py-2 px-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
              placeholder="2022"
            />
            {errors.anio && (
              <p id="anio-error" className="mt-1 text-xs text-red-600">
                {errors.anio.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehiculo-clienteId" className="block text-xs font-semibold text-slate-700 mb-1">
              Cliente Propietario <span className="text-red-500">*</span>
            </label>
            <select
              id="vehiculo-clienteId"
              aria-invalid={!!errors.clienteId}
              aria-describedby={errors.clienteId ? 'v-cliente-error' : undefined}
              {...register('clienteId')}
              className={`block w-full py-2 px-3 text-sm rounded-lg border bg-white ${
                errors.clienteId ? 'border-red-500' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
            >
              <option value="">Seleccione el propietario...</option>
              {clientes.map((c) => (
                <option key={c.clienteId} value={c.clienteId}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
            {errors.clienteId && (
              <p id="v-cliente-error" className="mt-1 text-xs text-red-600">
                {errors.clienteId.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vehiculo-modeloId" className="block text-xs font-semibold text-slate-700 mb-1">
              Modelo del Vehículo <span className="text-red-500">*</span>
            </label>
            <select
              id="vehiculo-modeloId"
              aria-invalid={!!errors.modeloId}
              aria-describedby={errors.modeloId ? 'v-modelo-error' : undefined}
              {...register('modeloId')}
              className={`block w-full py-2 px-3 text-sm rounded-lg border bg-white ${
                errors.modeloId ? 'border-red-500' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
            >
              <option value="">Seleccione el modelo...</option>
              {modelos.map((m) => (
                <option key={m.modeloId} value={m.modeloId}>
                  {m.nombre} {m.marca ? `(${m.marca.nombre})` : ''}
                </option>
              ))}
            </select>
            {errors.modeloId && (
              <p id="v-modelo-error" className="mt-1 text-xs text-red-600">
                {errors.modeloId.message}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg min-h-[44px] focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50"
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
