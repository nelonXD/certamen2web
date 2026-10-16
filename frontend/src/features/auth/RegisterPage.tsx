import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { Alert } from '../../components/common/Alert';
import { NormalizedError } from '../../types/api.types';
import { UserPlus, User, Mail, Lock, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres.')
    .max(100, 'El nombre no puede superar 100 caracteres.'),
  correo: z
    .string()
    .email('Debe proporcionar un correo electrónico válido.'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<NormalizedError | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    setSuccessMsg(null);
    setIsSubmitting(true);
    try {
      await authService.register(data);
      setSuccessMsg('¡Usuario registrado exitosamente con rol Mecánico! Redirigiendo al login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setApiError(err as NormalizedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center">
          <div className="inline-flex p-3 bg-emerald-600 rounded-xl text-white mb-3 shadow-md">
            <UserPlus className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Registro de Mecánico
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Crea tu cuenta de taller para gestionar órdenes de trabajo
          </p>
        </div>

        {apiError && (
          <Alert
            type="error"
            title="Error en el Registro"
            message={apiError.message}
            fieldErrors={apiError.fieldErrors}
            onClose={() => setApiError(null)}
          />
        )}

        {successMsg && (
          <Alert
            type="success"
            title="Registro Completado"
            message={successMsg}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Nombre Completo / Usuario
            </label>
            <div className="relative rounded-md shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="nombre"
                type="text"
                autoComplete="name"
                aria-invalid={!!errors.nombre}
                aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                {...register('nombre')}
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${
                  errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-emerald-600 min-h-[44px]`}
                placeholder="ej: Carlos González"
              />
            </div>
            {errors.nombre && (
              <p id="nombre-error" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Correo Electrónico
            </label>
            <div className="relative rounded-md shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="correo"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.correo}
                aria-describedby={errors.correo ? 'correo-error' : undefined}
                {...register('correo')}
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${
                  errors.correo ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-emerald-600 min-h-[44px]`}
                placeholder="carlos@taller.cl"
              />
            </div>
            {errors.correo && (
              <p id="correo-error" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.correo.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Contraseña
            </label>
            <div className="relative rounded-md shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-emerald-600 min-h-[44px]`}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600 disabled:opacity-50 min-h-[44px] transition-colors"
          >
            {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-800 underline focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-sm"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
