import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mecanico, MecanicoDTO } from '../../types/orden.types';
import { Especialidad } from '../../types/catalogo.types';
import { X, Save, Wrench, Phone, Award } from 'lucide-react';

const mecanicoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.').max(100),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos.'),
  especialidadId: z.coerce.number().min(1, 'Debe seleccionar una especialidad técnica válida.'),
});

type MecanicoFormData = z.infer<typeof mecanicoSchema>;

interface MecanicoModalFormProps {
  isOpen: boolean;
  mecanicoToEdit: Mecanico | null;
  especialidades: Especialidad[];
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: MecanicoDTO) => void;
}

export const MecanicoModalForm: React.FC<MecanicoModalFormProps> = ({
  isOpen,
  mecanicoToEdit,
  especialidades,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(mecanicoToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MecanicoFormData>({
    resolver: zodResolver(mecanicoSchema),
  });

  useEffect(() => {
    if (mecanicoToEdit) {
      reset({
        nombre: mecanicoToEdit.nombre,
        apellido: mecanicoToEdit.apellido,
        telefono: mecanicoToEdit.telefono || '',
        especialidadId: mecanicoToEdit.especialidadId,
      });
    } else {
      reset({
        nombre: '',
        apellido: '',
        telefono: '',
        especialidadId: undefined,
      });
    }
  }, [mecanicoToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mecanico-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
              <Wrench className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="mecanico-modal-title" className="text-lg font-extrabold text-slate-900">
                {isEditing ? `Editar Mecánico` : 'Registrar Nuevo Mecánico'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? `Actualizando ficha de ${mecanicoToEdit?.nombre}` : 'Asigna un profesional técnico al taller'}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mec-nombre" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                id="mec-nombre"
                type="text"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'mec-nombre-error' : undefined}
                {...register('nombre')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                  errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="Carlos"
              />
              {errors.nombre && (
                <p id="mec-nombre-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="mec-apellido" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                id="mec-apellido"
                type="text"
                aria-invalid={!!errors.apellido}
                aria-describedby={errors.apellido ? 'mec-apellido-error' : undefined}
                {...register('apellido')}
                className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                  errors.apellido ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="González"
              />
              {errors.apellido && (
                <p id="mec-apellido-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.apellido.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="mec-telefono" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teléfono de Contacto <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="mec-telefono"
                type="tel"
                aria-invalid={!!errors.telefono}
                aria-describedby={errors.telefono ? 'mec-tel-error' : undefined}
                {...register('telefono')}
                className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border font-mono ${
                  errors.telefono ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="+56 9 9876 5432"
              />
            </div>
            {errors.telefono && (
              <p id="mec-tel-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.telefono.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mec-especialidadId" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Especialidad Técnica <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Award className="w-4 h-4" aria-hidden="true" />
              </div>
              <select
                id="mec-especialidadId"
                aria-invalid={!!errors.especialidadId}
                aria-describedby={errors.especialidadId ? 'mec-esp-error' : undefined}
                {...register('especialidadId')}
                className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 ${
                  errors.especialidadId ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all`}
              >
                <option value="">Seleccione una especialidad técnica...</option>
                {especialidades.map((e) => (
                  <option key={e.especialidadId} value={e.especialidadId}>
                    {e.nombre} ({e.descripcion})
                  </option>
                ))}
              </select>
            </div>
            {errors.especialidadId && (
              <p id="mec-esp-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.especialidadId.message}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 rounded-xl shadow-md shadow-purple-900/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-purple-600 disabled:opacity-50 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Mecánico'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
