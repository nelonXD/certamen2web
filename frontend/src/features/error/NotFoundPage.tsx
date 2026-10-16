import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-4">
      <div className="inline-flex p-4 bg-slate-100 text-slate-600 rounded-full mb-4">
        <FileQuestion className="w-12 h-12" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">404 - Página No Encontrada</h1>
      <p className="text-slate-600 mb-6 text-sm">
        La ruta solicitada no existe o ha sido movida dentro del sistema.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Ir a Inicio</span>
      </Link>
    </div>
  );
};
