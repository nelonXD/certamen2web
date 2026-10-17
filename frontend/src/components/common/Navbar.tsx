import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  ClipboardList,
  Users,
  Car,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Settings,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/',
      label: 'Panel General',
      icon: <Wrench className="w-4 h-4 mr-2 text-blue-400" aria-hidden="true" />,
    },
    {
      to: '/ordenes',
      label: 'Órdenes de Trabajo',
      icon: <ClipboardList className="w-4 h-4 mr-2 text-indigo-400" aria-hidden="true" />,
    },
    {
      to: '/clientes',
      label: 'Clientes',
      icon: <Users className="w-4 h-4 mr-2 text-emerald-400" aria-hidden="true" />,
    },
    {
      to: '/vehiculos',
      label: 'Vehículos',
      icon: <Car className="w-4 h-4 mr-2 text-amber-400" aria-hidden="true" />,
    },
  ];

  if (role === 'Admin') {
    navLinks.push({
      to: '/administracion',
      label: 'Gestión Taller',
      icon: <Settings className="w-4 h-4 mr-2 text-purple-400" aria-hidden="true" />,
    });
  }

  return (
    <header className="bg-slate-950/95 backdrop-blur-md text-white border-b border-slate-800/80 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl p-1 min-h-[44px] min-w-[44px]"
              aria-label="Ir al inicio - Taller Mecánico"
            >
              <div className="p-2.5 bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 rounded-xl shadow-md shadow-blue-900/40 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white block leading-tight">
                  AutoPro <span className="text-blue-400 font-light text-base">Taller</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase block">
                  Gestión Operativa
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center space-x-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-950/50'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User profile & actions */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3 bg-slate-900/90 pl-3.5 pr-4 py-2 rounded-xl border border-slate-800 shadow-inner">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs ${
                    role === 'Admin'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-700 ring-2 ring-purple-500/30'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700 ring-2 ring-emerald-500/30'
                  }`}
                >
                  {user.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-bold text-xs text-slate-100 leading-tight">{user.nombre}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {role === 'Admin' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-800/60">
                        <ShieldCheck className="w-3 h-3 text-purple-400" aria-hidden="true" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                        <UserCheck className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                        Mecánico
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-all border border-transparent hover:border-red-900/60 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-400 border border-slate-800"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950 px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {user && (
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white ${
                    role === 'Admin'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-700'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  }`}
                >
                  {user.nombre.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-100">{user.nombre}</p>
                  <p className="text-xs text-slate-400">{user.correo}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                {role}
              </span>
            </div>
          )}

          <nav aria-label="Navegación móvil" className="space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl text-sm font-semibold min-h-[44px] transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-900">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-300 bg-red-950/50 hover:bg-red-900/60 rounded-xl min-h-[44px] transition-colors border border-red-900/60"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
