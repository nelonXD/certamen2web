import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../api/auth.service';
import { Alert } from '../../components/common/Alert';
import { NormalizedError } from '../../types/api.types';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
      setSuccessMsg('¡Usuario registrado exitosamente con rol Mecánico! Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setApiError(err as NormalizedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-950 relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white mb-4 shadow-xl shadow-emerald-950/40 ring-4 ring-emerald-500/20">
            <UserPlus className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Registro de Mecánico
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Crea tu cuenta profesional para operar órdenes de trabajo y clientes
          </p>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="nombre"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Nombre Completo / Usuario
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="nombre"
                  type="text"
                  autoComplete="name"
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                  {...register('nombre')}
                  className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-950/80 text-white placeholder:text-slate-500 border ${
                    errors.nombre ? 'border-red-500 focus:ring-red-500' : 'border-slate-800'
                  } focus:outline-hidden focus:ring-2 focus:ring-emerald-500 min-h-[44px] transition-all`}
                  placeholder="ej: nelson"
                />
              </div>
              {errors.nombre && (
                <p id="nombre-error" className="mt-1.5 text-xs font-semibold text-red-400">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Correo Electrónico
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </div>
                <input
                  id="correo"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.correo}
                  aria-describedby={errors.correo ? 'correo-error' : undefined}
                  {...register('correo')}
                  className={`block w-full pl-10 pr-3.5 py-3 text-sm rounded-xl bg-slate-950/80 text-white placeholder:text-slate-500 border ${
                    errors.correo ? 'border-red-500 focus:ring-red-500' : 'border-slate-800'
                  } focus:outline-hidden focus:ring-2 focus:ring-emerald-500 min-h-[44px] transition-all`}
                  placeholder="nelson@gmail.com"
                />
              </div>
              {errors.correo && (
                <p id="correo-error" className="mt-1.5 text-xs font-semibold text-red-400">
                  {errors.correo.message}
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
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                  className={`block w-full pl-10 pr-10 py-3 text-sm rounded-xl bg-slate-950/80 text-white placeholder:text-slate-500 border ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-800'
                  } focus:outline-hidden focus:ring-2 focus:ring-emerald-500 min-h-[44px] transition-all`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
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
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-emerald-500 disabled:opacity-50 min-h-[44px] transition-all active:scale-[0.99]"
            >
              {isSubmitting ? 'Registrando...' : 'Completar Registro'}
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              ¿Ya posees una cuenta?{' '}
              <Link
                to="/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 underline focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm ml-1"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          <span>Contraseña encriptada en servidor con PasswordHasher</span>
        </div>
      </div>
    </div>
  );
};
