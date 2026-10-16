import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 Taller Mecánico - Sistema de Gestión Operativa.</p>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
            API v1.0 Conectada
          </span>
          <span>WCAG 2.2 Nivel AA</span>
        </div>
      </div>
    </footer>
  );
};
