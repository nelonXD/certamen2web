import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/common/Alert';
import { NormalizedError } from '../../types/api.types';
import { Wrench, Lock, User, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  nombreUsuario: z
    .string()
    .min(1, 'El nombre de usuario es obligatorio.')
    .max(50, 'El usuario no puede superar 50 caracteres.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState<NormalizedError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      await login(data);
      navigate(from, { replace: true });
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
          <div className="inline-flex p-3 bg-blue-600 rounded-xl text-white mb-3 shadow-md">
            <Wrench className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Taller Mecánico
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {apiError && (
          <Alert
            type="error"
            title="Error de Autenticación"
            message={apiError.message}
            fieldErrors={apiError.fieldErrors}
            onClose={() => setApiError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
          <div>
            <label
              htmlFor="nombreUsuario"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Nombre de Usuario
            </label>
            <div className="relative rounded-md shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="nombreUsuario"
                type="text"
                autoComplete="username"
                aria-invalid={!!errors.nombreUsuario}
                aria-describedby={errors.nombreUsuario ? 'nombreUsuario-error' : undefined}
                {...register('nombreUsuario')}
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${
                  errors.nombreUsuario ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="ej: juan_mecanico"
              />
            </div>
            {errors.nombreUsuario && (
              <p id="nombreUsuario-error" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.nombreUsuario.message}
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
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg border ${
                  errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]`}
                placeholder="••••••••"
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
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 min-h-[44px] transition-colors"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta de mecánico?{' '}
            <Link
              to="/registro"
              className="font-semibold text-blue-700 hover:text-blue-800 underline focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
