import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Cliente, ClienteDTO } from '../../types/cliente.types';
import { X, Save, User, Phone, Mail, MapPin } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <User className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cliente-modal-title" className="text-lg font-extrabold text-slate-900">
                {isEditing ? `Editar Cliente` : 'Registrar Nuevo Cliente'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? `Actualizando ficha de ${clienteToEdit?.nombre}` : 'Completa la información personal y de contacto'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                {...register('nombre')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                  errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="Juan"
              />
              {errors.nombre && (
                <p id="nombre-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                id="apellido"
                type="text"
                aria-invalid={!!errors.apellido}
                aria-describedby={errors.apellido ? 'apellido-error' : undefined}
                {...register('apellido')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                  errors.apellido ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="Pérez"
              />
              {errors.apellido && (
                <p id="apellido-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono de Contacto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="telefono"
                  type="tel"
                  aria-invalid={!!errors.telefono}
                  aria-describedby={errors.telefono ? 'telefono-error' : undefined}
                  {...register('telefono')}
                  className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border ${
                    errors.telefono ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                  } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50 font-mono`}
                  placeholder="+56 9 1234 5678"
                />
              </div>
              {errors.telefono && (
                <p id="telefono-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.telefono.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="correo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="correo"
                  type="email"
                  aria-invalid={!!errors.correo}
                  aria-describedby={errors.correo ? 'correo-error' : undefined}
                  {...register('correo')}
                  className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border ${
                    errors.correo ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                  } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                  placeholder="juan.perez@email.cl"
                />
              </div>
              {errors.correo && (
                <p id="correo-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.correo.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="direccion" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dirección Particular / Comercial
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="direccion"
                type="text"
                {...register('direccion')}
                className="block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50"
                placeholder="Av. Los Carrera 1234, Concepción"
              />
            </div>
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
              <span>{isLoading ? 'Guardando...' : 'Guardar Cliente'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
