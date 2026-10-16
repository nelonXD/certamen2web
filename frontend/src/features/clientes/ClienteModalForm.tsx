import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Cliente, ClienteDTO } from '../../types/cliente.types';
import { X, Save, User } from 'lucide-react';

const clienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.').max(100),
  telefono: z.string().min(8, 'El teléfono es obligatorio y debe tener al menos 8 dígitos.'),
  correo: z.string().email('Debe ingresar un correo electrónico válido.'),
  direccion: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteModalFormProps {
  isOpen: boolean;
  clienteToEdit: Cliente | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: ClienteDTO) => void;
}

export const ClienteModalForm: React.FC<ClienteModalFormProps> = ({
  isOpen,
  clienteToEdit,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(clienteToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });

  useEffect(() => {
    if (clienteToEdit) {
      reset({
        nombre: clienteToEdit.nombre,
        apellido: clienteToEdit.apellido,
        telefono: clienteToEdit.telefono,
        correo: clienteToEdit.correo,
        direccion: clienteToEdit.direccion || '',
      });
    } else {
      reset({
        nombre: '',
        apellido: '',
        telefono: '',
        correo: '',
        direccion: '',
      });
    }
  }, [clienteToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-title"
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <User className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2 id="cliente-modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? `Editar Cliente: ${clienteToEdit?.nombre}` : 'Registrar Nuevo Cliente'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                {...register('nombre')}
                className={`block w-full py-2 px-3 text-sm rounded-lg border ${
                  errors.nombre ? 'border-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="Juan"
              />
              {errors.nombre && (
                <p id="nombre-error" className="mt-1 text-xs text-red-600">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-xs font-semibold text-slate-700 mb-1">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                id="apellido"
                type="text"
                aria-invalid={!!errors.apellido}
                aria-describedby={errors.apellido ? 'apellido-error' : undefined}
                {...register('apellido')}
                className={`block w-full py-2 px-3 text-sm rounded-lg border ${
                  errors.apellido ? 'border-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="Pérez"
              />
              {errors.apellido && (
                <p id="apellido-error" className="mt-1 text-xs text-red-600">
                  {errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-xs font-semibold text-slate-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                id="telefono"
                type="tel"
                aria-invalid={!!errors.telefono}
                aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                {...register('telefono')}
                className={`block w-full py-2 px-3 text-sm rounded-lg border ${
                  errors.telefono ? 'border-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="+56 9 1234 5678"
              />
              {errors.telefono && (
                <p id="telefono-error" className="mt-1 text-xs text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="correo" className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                id="correo"
                type="email"
                aria-invalid={!!errors.correo}
                aria-describedby={errors.correo ? 'correo-error' : undefined}
                {...register('correo')}
                className={`block w-full py-2 px-3 text-sm rounded-lg border ${
                  errors.correo ? 'border-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="juan.perez@email.com"
              />
              {errors.correo && (
                <p id="correo-error" className="mt-1 text-xs text-red-600">
                  {errors.correo.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="direccion" className="block text-xs font-semibold text-slate-700 mb-1">
              Dirección
            </label>
            <input
              id="direccion"
              type="text"
              {...register('direccion')}
              className="block w-full py-2 px-3 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
              placeholder="Av. Los Carrera 1234, Concepción"
            />
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
              <span>{isLoading ? 'Guardando...' : 'Guardar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
