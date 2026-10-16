import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForbiddenPage: React.FC = () => {
  const { role } = useAuth();

  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="inline-flex p-4 bg-red-100 text-red-700 rounded-full mb-4">
        <ShieldAlert className="w-12 h-12" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">403 - Acceso Denegado</h1>
      <p className="text-slate-600 mb-6 text-sm">
        Tu usuario con rol <span className="font-semibold text-slate-800">"{role || 'Invitado'}"</span> no
        tiene los permisos necesarios para acceder a este recurso. Esta restricción está
        protegida tanto en el cliente como en la API backend.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Volver al Inicio</span>
      </Link>
    </div>
  );
};
