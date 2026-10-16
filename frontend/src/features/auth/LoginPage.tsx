import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/common/Alert';
import { NormalizedError } from '../../types/api.types';
import {
  Wrench,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
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

  const handleFillDemo = (username: string, pass: string = 'admin123') => {
    setValue('nombreUsuario', username, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 rounded-2xl text-white mb-4 shadow-xl shadow-blue-900/30 ring-4 ring-blue-500/20">
            <Wrench className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AutoPro <span className="text-blue-400 font-normal">Taller Mecánico</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Inicia sesión para acceder a la gestión de órdenes y clientes
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
          {apiError && (
            <Alert
              type="error"
              title="Error al Iniciar Sesión"
              message={apiError.message}
              fieldErrors={apiError.fieldErrors}
              onClose={() => setApiError(null)}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="nombreUsuario"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Nombre de Usuario
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="nombreUsuario"
                  type="text"
                  autoComplete="username"
                  aria-invalid={!!errors.nombreUsuario}
                  aria-describedby={errors.nombreUsuario ? 'nombreUsuario-error' : undefined}
                  {...register('nombreUsuario')}
                  className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-950/80 text-white placeholder:text-slate-500 border ${
                    errors.nombreUsuario ? 'border-red-500 focus:ring-red-500' : 'border-slate-800'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] transition-all`}
                  placeholder="ej: admin o tu usuario"
                />
              </div>
              {errors.nombreUsuario && (
                <p id="nombreUsuario-error" className="mt-1.5 text-xs font-semibold text-red-400">
                  {errors.nombreUsuario.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  className={`block w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-950/80 text-white placeholder:text-slate-500 border ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-800'
                  } focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar clave de acceso' : 'Mostrar clave de acceso'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 min-h-[44px] min-w-[44px] justify-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs font-semibold text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 hover:from-blue-600 hover:to-indigo-500 shadow-lg shadow-blue-900/40 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-blue-500 disabled:opacity-50 min-h-[44px] transition-all active:scale-[0.99]"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          {/* Demo Users Helper for Exam Demonstration */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Acceso Rápido para Demostración:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo('admin', 'admin123')}
                className="py-2 px-3 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-center font-medium transition-colors min-h-[44px] flex flex-col justify-center items-center"
              >
                <span className="font-bold text-white">Rol Admin</span>
                <span className="text-[10px] text-slate-400">admin / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('tomas', 'admin123')}
                className="py-2 px-3 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-center font-medium transition-colors min-h-[44px] flex flex-col justify-center items-center"
              >
                <span className="font-bold text-emerald-400">Rol Mecánico</span>
                <span className="text-[10px] text-slate-400">tomas / admin123</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400">
              ¿No tienes cuenta de mecánico?{' '}
              <Link
                to="/registro"
                className="font-bold text-blue-400 hover:text-blue-300 underline focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm ml-1"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          <span>Autenticación JWT Bearer segura y Rate Limiting activo</span>
        </div>
      </div>
    </div>
  );
};
