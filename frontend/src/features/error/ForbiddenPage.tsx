import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-red-200 shadow-xl shadow-red-950/5 relative overflow-hidden">
        <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-2xl mb-5 ring-8 ring-red-50/50">
          <ShieldAlert className="w-12 h-12" aria-hidden="true" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 inline-block mb-3">
          Error 403 • Restricción de Seguridad
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Acceso Denegado
        </h1>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          Tu usuario con rol{' '}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            {role || 'Invitado'}
          </span>{' '}
          no posee los privilegios requeridos para ver o modificar este recurso. Esta regla de
          autorización está garantizada por el token JWT tanto en la interfaz como en la API backend.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-900/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Volver al Panel Principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
