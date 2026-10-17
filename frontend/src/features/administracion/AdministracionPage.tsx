import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogosService } from '../../api/catalogos.service';
import { Mecanico, MecanicoDTO } from '../../types/orden.types';
import { Servicio, ServicioDTO, Repuesto, RepuestoDTO } from '../../types/catalogo.types';
import { MecanicoModalForm } from './MecanicoModalForm';
import { ServicioModalForm } from './ServicioModalForm';
import { RepuestoModalForm } from './RepuestoModalForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { NormalizedError } from '../../types/api.types';
import {
  Wrench,
  Settings,
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Phone,
  DollarSign,
  Layers,
  Award,
  Shield,
  X,
} from 'lucide-react';

type AdminTab = 'mecanicos' | 'servicios' | 'repuestos';

export const AdministracionPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>('mecanicos');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados de Modales
  const [mecanicoModalOpen, setMecanicoModalOpen] = useState(false);
  const [editingMecanico, setEditingMecanico] = useState<Mecanico | null>(null);
  const [mecanicoToDelete, setMecanicoToDelete] = useState<Mecanico | null>(null);

  const [servicioModalOpen, setServicioModalOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [servicioToDelete, setServicioToDelete] = useState<Servicio | null>(null);

  const [repuestoModalOpen, setRepuestoModalOpen] = useState(false);
  const [editingRepuesto, setEditingRepuesto] = useState<Repuesto | null>(null);
  const [repuestoToDelete, setRepuestoToDelete] = useState<Repuesto | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<NormalizedError | null>(null);

  // Queries
  const { data: mecanicos = [], isLoading: loadingMecanicos } = useQuery({
    queryKey: ['mecanicos'],
    queryFn: catalogosService.getMecanicos,
  });

  const { data: especialidades = [] } = useQuery({
    queryKey: ['especialidades'],
    queryFn: catalogosService.getEspecialidades,
  });

  const { data: servicios = [], isLoading: loadingServicios } = useQuery({
    queryKey: ['servicios'],
    queryFn: catalogosService.getServicios,
  });

  const { data: repuestos = [], isLoading: loadingRepuestos } = useQuery({
    queryKey: ['repuestos'],
    queryFn: catalogosService.getRepuestos,
  });

  // Mutaciones Mecánicos
  const saveMecanicoMutation = useMutation({
    mutationFn: async (dto: MecanicoDTO) => {
      if (editingMecanico) {
        await catalogosService.updateMecanico(editingMecanico.mecanicoId, dto);
      } else {
        await catalogosService.createMecanico(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mecanicos'] });
      setSuccessMessage(
        editingMecanico
          ? 'Datos del mecánico actualizados exitosamente.'
          : 'Nuevo mecánico registrado con éxito.'
      );
      setMecanicoModalOpen(false);
      setEditingMecanico(null);
    },
    onError: (err: NormalizedError) => setApiError(err),
  });

  const deleteMecanicoMutation = useMutation({
    mutationFn: (id: number) => catalogosService.deleteMecanico(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mecanicos'] });
      setSuccessMessage('Mecánico eliminado del sistema.');
      setMecanicoToDelete(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
      setMecanicoToDelete(null);
    },
  });

  // Mutaciones Servicios
  const saveServicioMutation = useMutation({
    mutationFn: async (dto: ServicioDTO) => {
      if (editingServicio) {
        await catalogosService.updateServicio(editingServicio.servicioId, dto);
      } else {
        await catalogosService.createServicio(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      setSuccessMessage(
        editingServicio
          ? 'Servicio actualizado correctamente.'
          : 'Nuevo servicio registrado en el catálogo.'
      );
      setServicioModalOpen(false);
      setEditingServicio(null);
    },
    onError: (err: NormalizedError) => setApiError(err),
  });

  const deleteServicioMutation = useMutation({
    mutationFn: (id: number) => catalogosService.deleteServicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      setSuccessMessage('Servicio eliminado del catálogo.');
      setServicioToDelete(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
      setServicioToDelete(null);
    },
  });

  // Mutaciones Repuestos
  const saveRepuestoMutation = useMutation({
    mutationFn: async (dto: RepuestoDTO) => {
      if (editingRepuesto) {
        await catalogosService.updateRepuesto(editingRepuesto.repuestoId, dto);
      } else {
        await catalogosService.createRepuesto(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repuestos'] });
      setSuccessMessage(
        editingRepuesto
          ? 'Repuesto e inventario actualizados correctamente.'
          : 'Nuevo repuesto ingresado al inventario.'
      );
      setRepuestoModalOpen(false);
      setEditingRepuesto(null);
    },
    onError: (err: NormalizedError) => setApiError(err),
  });

  const deleteRepuestoMutation = useMutation({
    mutationFn: (id: number) => catalogosService.deleteRepuesto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repuestos'] });
      setSuccessMessage('Repuesto eliminado del inventario.');
      setRepuestoToDelete(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
      setRepuestoToDelete(null);
    },
  });

  // Filtrado
  const filteredMecanicos = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return mecanicos.filter(
      (m) =>
        m.nombre.toLowerCase().includes(term) ||
        m.apellido.toLowerCase().includes(term) ||
        (m.telefono && m.telefono.toLowerCase().includes(term))
    );
  }, [mecanicos, searchTerm]);

  const filteredServicios = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return servicios.filter(
      (s) =>
        s.nombre.toLowerCase().includes(term) ||
        (s.descripcion && s.descripcion.toLowerCase().includes(term))
    );
  }, [servicios, searchTerm]);

  const filteredRepuestos = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return repuestos.filter(
      (r) =>
        r.nombre.toLowerCase().includes(term) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(term))
    );
  }, [repuestos, searchTerm]);

  const getEspecialidadNombre = (id: number) => {
    const found = especialidades.find((e) => e.especialidadId === id);
    return found ? found.nombre : `Especialidad #${id}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              <Shield className="w-3 h-3" />
              Módulo de Administración
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión Integral del Taller
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Registro y administración de mecánicos técnicos, catálogo de servicios y stock de repuestos.
          </p>
        </div>

        <div>
          {activeTab === 'mecanicos' && (
            <button
              type="button"
              onClick={() => {
                setEditingMecanico(null);
                setMecanicoModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-purple-900/20 active:scale-95 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-purple-600"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Nuevo Mecánico</span>
            </button>
          )}

          {activeTab === 'servicios' && (
            <button
              type="button"
              onClick={() => {
                setEditingServicio(null);
                setServicioModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-900/20 active:scale-95 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Nuevo Servicio</span>
            </button>
          )}

          {activeTab === 'repuestos' && (
            <button
              type="button"
              onClick={() => {
                setEditingRepuesto(null);
                setRepuestoModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-900/20 active:scale-95 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Nuevo Repuesto</span>
            </button>
          )}
        </div>
      </div>

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {apiError && (
        <Alert
          type="error"
          title="Error en la operación"
          message={apiError.message}
          fieldErrors={apiError.fieldErrors}
          onClose={() => setApiError(null)}
        />
      )}

      {/* Tabs & Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Tab selection buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'mecanicos'}
            onClick={() => {
              setActiveTab('mecanicos');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              activeTab === 'mecanicos'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Mecánicos Especialistas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'mecanicos' ? 'bg-purple-900 text-white' : 'bg-purple-200 text-purple-800'}`}>
              {mecanicos.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'servicios'}
            onClick={() => {
              setActiveTab('servicios');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              activeTab === 'servicios'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Catálogo de Servicios</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'servicios' ? 'bg-blue-900 text-white' : 'bg-blue-200 text-blue-800'}`}>
              {servicios.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'repuestos'}
            onClick={() => {
              setActiveTab('repuestos');
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              activeTab === 'repuestos'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventario de Repuestos</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'repuestos' ? 'bg-emerald-900 text-white' : 'bg-emerald-200 text-emerald-800'}`}>
              {repuestos.length}
            </span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'mecanicos'
                ? 'Buscar mecánico por nombre o teléfono...'
                : activeTab === 'servicios'
                ? 'Buscar servicio por nombre o descripción...'
                : 'Buscar repuesto o insumo...'
            }
            className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] justify-center"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      {/* 1. MECÁNICOS */}
      {activeTab === 'mecanicos' && (
        <div>
          {loadingMecanicos ? (
            <LoadingSpinner message="Cargando mecánicos registrados..." size="lg" />
          ) : filteredMecanicos.length === 0 ? (
            <EmptyState
              title="No hay mecánicos registrados"
              description="Añade técnicos especialistas al taller para asignarlos a las órdenes de trabajo."
              action={{
                label: 'Registrar primer mecánico',
                onClick: () => {
                  setEditingMecanico(null);
                  setMecanicoModalOpen(true);
                },
              }}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Mecánico</th>
                    <th className="px-5 py-4">Especialidad</th>
                    <th className="px-5 py-4">Teléfono</th>
                    <th className="px-5 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredMecanicos.map((m) => (
                    <tr key={m.mecanicoId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {m.nombre} {m.apellido}
                            </p>
                            <span className="text-[11px] font-mono text-slate-400">
                              ID #{m.mecanicoId}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          <Award className="w-3.5 h-3.5" />
                          {m.especialidad?.nombre || getEspecialidadNombre(m.especialidadId)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {m.telefono ? (
                          <a
                            href={`tel:${m.telefono}`}
                            className="inline-flex items-center gap-1 font-mono text-blue-700 hover:underline text-xs"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{m.telefono}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMecanico(m);
                              setMecanicoModalOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-amber-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-600"
                            aria-label={`Editar mecánico ${m.nombre}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setMecanicoToDelete(m)}
                            className="p-2 text-slate-500 hover:text-red-700 rounded-lg hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Eliminar mecánico ${m.nombre}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 2. SERVICIOS */}
      {activeTab === 'servicios' && (
        <div>
          {loadingServicios ? (
            <LoadingSpinner message="Cargando catálogo de servicios..." size="lg" />
          ) : filteredServicios.length === 0 ? (
            <EmptyState
              title="No hay servicios registrados"
              description="Registra prestaciones técnicas como alineación, cambio de aceite o afinamiento."
              action={{
                label: 'Crear primer servicio',
                onClick: () => {
                  setEditingServicio(null);
                  setServicioModalOpen(true);
                },
              }}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Servicio</th>
                    <th className="px-5 py-4">Descripción</th>
                    <th className="px-5 py-4">Arancel Base</th>
                    <th className="px-5 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredServicios.map((s) => (
                    <tr key={s.servicioId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {s.nombre}
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs max-w-md">
                        {s.descripcion}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-slate-900 text-base">
                          ${Number(s.costo).toLocaleString('es-CL')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingServicio(s);
                              setServicioModalOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-amber-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-600"
                            aria-label={`Editar servicio ${s.nombre}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setServicioToDelete(s)}
                            className="p-2 text-slate-500 hover:text-red-700 rounded-lg hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Eliminar servicio ${s.nombre}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 3. REPUESTOS */}
      {activeTab === 'repuestos' && (
        <div>
          {loadingRepuestos ? (
            <LoadingSpinner message="Cargando stock de repuestos..." size="lg" />
          ) : filteredRepuestos.length === 0 ? (
            <EmptyState
              title="No hay repuestos registrados"
              description="Registra piezas de recambio, insumos o accesorios disponibles para reparaciones."
              action={{
                label: 'Registrar primer repuesto',
                onClick: () => {
                  setEditingRepuesto(null);
                  setRepuestoModalOpen(true);
                },
              }}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm">
                <thead className="bg-slate-50/80 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4">Pieza / Insumo</th>
                    <th className="px-5 py-4">Descripción</th>
                    <th className="px-5 py-4">Precio Unitario</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredRepuestos.map((r) => (
                    <tr key={r.repuestoId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {r.nombre}
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs max-w-md">
                        {r.descripcion}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono font-bold text-slate-900 text-base">
                          ${Number(r.precio).toLocaleString('es-CL')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            r.stock > 5
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : r.stock > 0
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>{r.stock} u.</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRepuesto(r);
                              setRepuestoModalOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-amber-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-600"
                            aria-label={`Editar repuesto ${r.nombre}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRepuestoToDelete(r)}
                            className="p-2 text-slate-500 hover:text-red-700 rounded-lg hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Eliminar repuesto ${r.nombre}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modales de Mecánicos */}
      <MecanicoModalForm
        isOpen={mecanicoModalOpen}
        mecanicoToEdit={editingMecanico}
        especialidades={especialidades}
        isLoading={saveMecanicoMutation.isPending}
        onClose={() => setMecanicoModalOpen(false)}
        onSubmit={(dto) => saveMecanicoMutation.mutate(dto)}
      />
      <ConfirmModal
        isOpen={!!mecanicoToDelete}
        title="¿Eliminar Mecánico?"
        message={`¿Estás seguro de que deseas desvincular a "${mecanicoToDelete?.nombre} ${mecanicoToDelete?.apellido}"?`}
        confirmText="Sí, Eliminar"
        isDestructive={true}
        isLoading={deleteMecanicoMutation.isPending}
        onConfirm={() => mecanicoToDelete && deleteMecanicoMutation.mutate(mecanicoToDelete.mecanicoId)}
        onCancel={() => setMecanicoToDelete(null)}
      />

      {/* Modales de Servicios */}
      <ServicioModalForm
        isOpen={servicioModalOpen}
        servicioToEdit={editingServicio}
        isLoading={saveServicioMutation.isPending}
        onClose={() => setServicioModalOpen(false)}
        onSubmit={(dto) => saveServicioMutation.mutate(dto)}
      />
      <ConfirmModal
        isOpen={!!servicioToDelete}
        title="¿Eliminar Servicio?"
        message={`¿Estás seguro de que deseas eliminar el servicio "${servicioToDelete?.nombre}"?`}
        confirmText="Sí, Eliminar"
        isDestructive={true}
        isLoading={deleteServicioMutation.isPending}
        onConfirm={() => servicioToDelete && deleteServicioMutation.mutate(servicioToDelete.servicioId)}
        onCancel={() => setServicioToDelete(null)}
      />

      {/* Modales de Repuestos */}
      <RepuestoModalForm
        isOpen={repuestoModalOpen}
        repuestoToEdit={editingRepuesto}
        isLoading={saveRepuestoMutation.isPending}
        onClose={() => setRepuestoModalOpen(false)}
        onSubmit={(dto) => saveRepuestoMutation.mutate(dto)}
      />
      <ConfirmModal
        isOpen={!!repuestoToDelete}
        title="¿Eliminar Repuesto?"
        message={`¿Estás seguro de que deseas eliminar la pieza "${repuestoToDelete?.nombre}"?`}
        confirmText="Sí, Eliminar"
        isDestructive={true}
        isLoading={deleteRepuestoMutation.isPending}
        onConfirm={() => repuestoToDelete && deleteRepuestoMutation.mutate(repuestoToDelete.repuestoId)}
        onCancel={() => setRepuestoToDelete(null)}
      />
    </div>
  );
};
