import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 relative overflow-hidden">
        <div className="inline-flex p-4 bg-slate-100 text-slate-700 rounded-2xl mb-5 ring-8 ring-slate-100/50">
          <Compass className="w-12 h-12" aria-hidden="true" />
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 inline-block mb-3">
          Error 404 • Recurso no encontrado
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Página no Encontrada
        </h1>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed">
          La ruta que intentas consultar no existe o ha sido reubicada dentro del sistema del taller.
          Verifica la dirección o regresa al panel de inicio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-900/20 min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-600 active:scale-95"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Volver al Inicio</span>
          </Link>
          <Link
            to="/ordenes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Ver Órdenes</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
