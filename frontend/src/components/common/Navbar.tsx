import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  FileText,
  Users,
  Car,
  LogOut,
  Menu,
  X,
  Shield,
  UserCheck,
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
    { to: '/', label: 'Inicio', icon: <Wrench className="w-4 h-4 mr-2" aria-hidden="true" /> },
    {
      to: '/ordenes',
      label: 'Órdenes de Trabajo',
      icon: <FileText className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
    {
      to: '/clientes',
      label: 'Clientes',
      icon: <Users className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
    {
      to: '/vehiculos',
      label: 'Vehículos',
      icon: <Car className="w-4 h-4 mr-2" aria-hidden="true" />,
    },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-white font-bold text-lg hover:text-blue-300 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md p-1 min-h-[44px] min-w-[44px]"
              aria-label="Ir al inicio - Taller Mecánico"
            >
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Wrench className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="hidden sm:inline">TallerMecánico</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Navegación principal" className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User profile & actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                {role === 'Admin' ? (
                  <Shield className="w-4 h-4 text-purple-400" aria-hidden="true" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                )}
                <div className="text-xs">
                  <p className="font-semibold text-slate-100">{user.nombre}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{role}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-400"
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
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          {user && (
            <div className="p-3 bg-slate-800 rounded-lg mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-slate-100">{user.nombre}</p>
                <p className="text-xs text-slate-400">{user.correo}</p>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
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
                  `flex items-center px-3 py-3 rounded-md text-base font-medium min-h-[44px] ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-medium text-red-300 bg-red-950/40 hover:bg-red-900/50 rounded-lg min-h-[44px] transition-colors"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
