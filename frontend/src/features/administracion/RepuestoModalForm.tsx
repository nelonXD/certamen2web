import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Repuesto, RepuestoDTO } from '../../types/catalogo.types';
import { X, Save, Package, DollarSign, Layers, FileText } from 'lucide-react';

const repuestoSchema = z.object({
  nombre: z.string().min(2, 'El nombre del repuesto debe tener al menos 2 caracteres.').max(100),
  descripcion: z.string().min(2, 'La descripción debe tener al menos 2 caracteres.').max(255),
  precio: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo.'),
});

type RepuestoFormData = z.infer<typeof repuestoSchema>;

interface RepuestoModalFormProps {
  isOpen: boolean;
  repuestoToEdit: Repuesto | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (dto: RepuestoDTO) => void;
}

export const RepuestoModalForm: React.FC<RepuestoModalFormProps> = ({
  isOpen,
  repuestoToEdit,
  isLoading,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(repuestoToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepuestoFormData>({
    resolver: zodResolver(repuestoSchema),
  });

  useEffect(() => {
    if (repuestoToEdit) {
      reset({
        nombre: repuestoToEdit.nombre,
        descripcion: repuestoToEdit.descripcion,
        precio: repuestoToEdit.precio,
        stock: repuestoToEdit.stock,
      });
    } else {
      reset({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 1,
      });
    }
  }, [repuestoToEdit, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="repuesto-modal-title"
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Package className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="repuesto-modal-title" className="text-lg font-extrabold text-slate-900">
                {isEditing ? `Editar Repuesto` : 'Registrar Nuevo Repuesto'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? `Actualizando inventario de ${repuestoToEdit?.nombre}` : 'Añade una pieza o insumo al almacén'}
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
            <label htmlFor="rep-nombre" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre de la Pieza o Insumo <span className="text-red-500">*</span>
            </label>
            <input
              id="rep-nombre"
              type="text"
              aria-invalid={!!errors.nombre}
              aria-describedby={errors.nombre ? 'rep-nombre-error' : undefined}
              {...register('nombre')}
              className={`block w-full py-2.5 px-3.5 text-sm rounded-xl border ${
                errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
              } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
              placeholder="Filtro de Aceite Sintético Bosch"
            />
            {errors.nombre && (
              <p id="rep-nombre-error" className="mt-1 text-xs text-red-600 font-medium">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rep-precio" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Precio Unitario ($ CLP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <DollarSign className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="rep-precio"
                  type="number"
                  aria-invalid={!!errors.precio}
                  aria-describedby={errors.precio ? 'rep-precio-error' : undefined}
                  {...register('precio')}
                  className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border font-mono font-bold ${
                    errors.precio ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                  } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                  placeholder="12500"
                />
              </div>
              {errors.precio && (
                <p id="rep-precio-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.precio.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="rep-stock" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Disponible <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Layers className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="rep-stock"
                  type="number"
                  aria-invalid={!!errors.stock}
                  aria-describedby={errors.stock ? 'rep-stock-error' : undefined}
                  {...register('stock')}
                  className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border font-mono font-bold ${
                    errors.stock ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                  } focus:outline-hidden focus:ring-2 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50`}
                  placeholder="15"
                />
              </div>
              {errors.stock && (
                <p id="rep-stock-error" className="mt-1 text-xs text-red-600 font-medium">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="rep-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Descripción y Compatibilidad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" aria-hidden="true" />
              </div>
              <textarea
                id="rep-desc"
                rows={3}
                aria-invalid={!!errors.descripcion}
                aria-describedby={errors.descripcion ? 'rep-desc-error' : undefined}
                {...register('descripcion')}
                className={`block w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border ${
                  errors.descripcion ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-600'
                } focus:outline-hidden focus:ring-2 focus:border-transparent transition-all bg-slate-50/50 resize-none`}
                placeholder="Compatible con motores 1.6L y 2.0L gasolina."
              />
            </div>
            {errors.descripcion && (
              <p id="rep-desc-error" className="mt-1 text-xs text-red-600 font-medium">
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
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-900/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-50 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Repuesto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
