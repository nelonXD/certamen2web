import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Servicio, ServicioDTO } from '../../types/catalogo.types';
import { X, Save, Settings, DollarSign, FileText } from 'lucide-react';

const servicioSchema = z.object({
  nombre: z.string().min(2, 'El nombre del servicio debe tener al menos 2 caracteres.').max(100),
  descripcion: z.string().min(2, 'La descripción debe tener al menos 2 caracteres.').max(255),
  costo: z.coerce.number().min(0, 'El costo no puede ser negativo.'),
});

type ServicioFormData = z.infer<typeof servicioSchema>;

interface ServicioModalFormProps {
  isOpen: boolean;
  servicioToEdit: Servicio | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: ServicioDTO) => void;
}

export const ServicioModalForm: React.FC<ServicioModalFormProps> = ({
  isOpen,
  servicioToEdit,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(servicioToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
  });

  useEffect(() => {
    if (servicioToEdit) {
      reset({
        nombre: servicioToEdit.nombre,
        descripcion: servicioToEdit.descripcion,
        costo: servicioToEdit.costo,
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
        costo: 0,
      });
    }
  }, [servicioToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="servicio-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Settings className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="servicio-modal-title" className="text-lg font-extrabold text-slate-900">
                {isEditing ? `Editar Servicio` : 'Registrar Nuevo Servicio'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? `Modificando arancel de ${servicioToEdit?.nombre}` : 'Añade una prestación al catálogo del taller'}
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
          <div>
            <label htmlFor="serv-nombre" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre del Servicio <span className="text-red-500">*</span>
            </label>
            <input
              id="serv-nombre"
              type="text"
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? 'serv-nombre-error' : undefined}
              {...register('nombre')}
              className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
              } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
              placeholder="Alineación y Balanceo Computarizado"
            />
            {errors.nombre && (
              <p id="serv-nombre-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="serv-costo" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Costo del Servicio ($ CLP) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" aria-hidden="true" />
              </div>
              <input
                id="serv-costo"
                type="number"
                aria-invalid={!!errors.costo}
                aria-describedby={errors.costo ? 'serv-costo-error' : undefined}
                {...register('costo')}
                className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border font-mono font-bold ${
                  errors.costo ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                placeholder="25000"
              />
            </div>
            {errors.costo && (
              <p id="serv-costo-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.costo.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="serv-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descripción del Trabajo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" aria-hidden="true" />
              </div>
              <textarea
                id="serv-desc"
                rows={3}
                aria-invalid={!!errors.descripcion}
                aria-describedby={errors.descripcion ? 'serv-desc-error' : undefined}
                {...register('descripcion')}
                className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.descripcion ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent transition-all bg-slate-50/50 resize-none`}
                placeholder="Incluye revisión de tren delantero y calibración con láser en banco de prueba."
              />
            </div>
            {errors.descripcion && (
              <p id="serv-desc-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.descripcion.message}
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
              <span>{isLoading ? 'Guardando...' : 'Guardar Servicio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
