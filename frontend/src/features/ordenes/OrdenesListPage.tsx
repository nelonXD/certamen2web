import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ordenesService } from '../../api/ordenes.service';
import { useAuth } from '../../context/AuthContext';
import { OrdenTrabajo } from '../../types/orden.types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { NormalizedError } from '../../types/api.types';
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  AlertCircle,
  Calendar,
  User,
  Wrench,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const OrdenesListPage: React.FC = () => {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [orderToDelete, setOrderToDelete] = useState<OrdenTrabajo | null>(null);
  const [actionError, setActionError] = useState<NormalizedError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Consulta de órdenes de trabajo
  const {
    data: ordenes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<OrdenTrabajo[], NormalizedError>({
    queryKey: ['ordenes'],
    queryFn: ordenesService.getAll,
  });

  // Mutación para eliminación (Solo Admin permitido en backend)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => ordenesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenes'] });
      setSuccessMessage('La orden de trabajo fue eliminada exitosamente.');
      setOrderToDelete(null);
    },
    onError: (err: NormalizedError) => {
      setActionError(err);
      setOrderToDelete(null);
    },
  });

  // Conteo por estado para los botones rápidos
  const counts = useMemo(() => {
    return {
      todos: ordenes.length,
      pendiente: ordenes.filter((o) => o.estado?.toLowerCase() === 'pendiente' || o.estado?.toLowerCase() === 'ingresada').length,
      proceso: ordenes.filter((o) => o.estado?.toLowerCase() === 'en proceso' || o.estado?.toLowerCase() === 'reparacion').length,
      completado: ordenes.filter((o) => o.estado?.toLowerCase() === 'completado' || o.estado?.toLowerCase() === 'finalizado').length,
    };
  }, [ordenes]);

  // Filtrado reactivo en cliente
  const filteredOrdenes = useMemo(() => {
    return ordenes.filter((orden) => {
      const matchSearch =
        orden.ordenId.toString().includes(searchTerm) ||
        (orden.observaciones && orden.observaciones.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orden.cliente && `${orden.cliente.nombre} ${orden.cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (orden.vehiculo && orden.vehiculo.patente.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === 'todos' ||
        orden.estado?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [ordenes, searchTerm, statusFilter]);

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      deleteMutation.mutate(orderToDelete.ordenId);
    }
  };

  const getStatusBadge = (estado: string) => {
    const norm = estado.toLowerCase();
    if (norm === 'completado' || norm === 'finalizado') {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />,
      };
    }
    if (norm === 'en proceso' || norm === 'reparacion') {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500 animate-pulse',
        icon: <Clock className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />,
      };
    }
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Órdenes de Trabajo</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {filteredOrdenes.length} {filteredOrdenes.length === 1 ? 'orden' : 'órdenes'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Control de ingresos a taller, estado de reparaciones y asignación de mecánicos.
          </p>
        </div>
        <Link
          to="/ordenes/nueva"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-900/20 active:scale-95 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nueva Orden</span>
        </Link>
      </div>

      {/* Action alerts */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {actionError && (
        <Alert
          type="error"
          title="Error en la operación"
          message={actionError.message}
          onClose={() => setActionError(null)}
        />
      )}

      {/* Search & Quick Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setStatusFilter('todos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              statusFilter === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Todos</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'todos' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {counts.todos}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pendiente')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              statusFilter === 'pendiente'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Pendientes</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'pendiente' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-800'}`}>
              {counts.pendiente}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('en proceso')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              statusFilter === 'en proceso'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>En Proceso</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'en proceso' ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800'}`}>
              {counts.proceso}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('completado')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[44px] flex items-center gap-2 ${
              statusFilter === 'completado'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Completadas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'completado' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-800'}`}>
              {counts.completado}
            </span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <label htmlFor="search-ordenes" className="sr-only">
            Buscar órdenes por código, cliente o patente
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="search-ordenes"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, cliente, patente o diagnóstico..."
            className="block w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner message="Consultando órdenes registradas en el taller..." size="lg" />
      ) : isError ? (
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">Error al consultar órdenes de trabajo</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4">{error?.message || 'Error de conexión'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors min-h-[44px] min-w-[44px]"
          >
            Reintentar Conexión
          </button>
        </div>
      ) : filteredOrdenes.length === 0 ? (
        <EmptyState
          title="No se encontraron órdenes de trabajo"
          description={
            searchTerm || statusFilter !== 'todos'
              ? 'No hay registros que coincidan con la búsqueda o filtro seleccionado.'
              : 'Aún no se han registrado órdenes de trabajo en el taller.'
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <caption className="sr-only">Listado de órdenes de trabajo</caption>
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-4">Orden</th>
                  <th scope="col" className="px-5 py-4">Fecha Ingreso</th>
                  <th scope="col" className="px-5 py-4">Cliente</th>
                  <th scope="col" className="px-5 py-4">Vehículo</th>
                  <th scope="col" className="px-5 py-4">Mecánico</th>
                  <th scope="col" className="px-5 py-4">Estado</th>
                  <th scope="col" className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredOrdenes.map((orden) => {
                  const badge = getStatusBadge(orden.estado);
                  return (
                    <tr key={orden.ordenId} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                          #{orden.ordenId}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs whitespace-nowrap">
                        {orden.fechaIngreso
                          ? new Date(orden.fechaIngreso).toLocaleDateString('es-CL', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {orden.cliente
                            ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                            : `Cliente #${orden.clienteId}`}
                        </div>
                        {orden.cliente?.telefono && (
                          <div className="text-xs text-slate-400 font-mono mt-0.5">
                            {orden.cliente.telefono}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {orden.vehiculo ? (
                          <div className="space-y-0.5">
                            <span className="patente-chip text-xs">
                              {orden.vehiculo.patente}
                            </span>
                            <span className="text-xs text-slate-500 block">
                              {orden.vehiculo.color} {orden.vehiculo.modelo?.nombre || ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">ID #{orden.vehiculoId}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-700">
                        {orden.mecanico ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            {orden.mecanico.nombre} {orden.mecanico.apellido}
                          </span>
                        ) : (
                          <span className="text-slate-400">ID #{orden.mecanicoId}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {orden.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/ordenes/${orden.ordenId}`}
                            className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                            aria-label={`Ver detalles de orden #${orden.ordenId}`}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          </Link>
                          <Link
                            to={`/ordenes/${orden.ordenId}/editar`}
                            className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-600"
                            aria-label={`Editar orden #${orden.ordenId}`}
                            title="Editar orden"
                          >
                            <Edit3 className="w-4 h-4" aria-hidden="true" />
                          </Link>
                          {role === 'Admin' && (
                            <button
                              type="button"
                              onClick={() => setOrderToDelete(orden)}
                              className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                              aria-label={`Eliminar orden #${orden.ordenId}`}
                              title="Eliminar (Admin)"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile-first cards on mobile screens */}
          <div className="md:hidden space-y-4" role="region" aria-label="Tarjetas de órdenes de trabajo">
            {filteredOrdenes.map((orden) => {
              const badge = getStatusBadge(orden.estado);
              return (
                <div
                  key={orden.ordenId}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      Orden #{orden.ordenId}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {orden.estado}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="font-bold text-slate-900">
                        {orden.cliente
                          ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                          : `Cliente #${orden.clienteId}`}
                      </span>
                    </div>

                    {orden.vehiculo && (
                      <div className="flex items-center gap-2">
                        <span className="patente-chip text-xs">
                          {orden.vehiculo.patente}
                        </span>
                        <span className="text-xs text-slate-500">
                          {orden.vehiculo.color} {orden.vehiculo.modelo?.nombre || ''}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>
                        {orden.fechaIngreso
                          ? new Date(orden.fechaIngreso).toLocaleDateString('es-CL')
                          : 'Sin fecha'}
                      </span>
                    </div>

                    {orden.observaciones && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg italic">
                        "{orden.observaciones}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Link
                      to={`/ordenes/${orden.ordenId}`}
                      className="flex-1 text-center py-2.5 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl min-h-[44px] flex items-center justify-center transition-colors"
                    >
                      Ver Detalle
                    </Link>
                    <Link
                      to={`/ordenes/${orden.ordenId}/editar`}
                      className="flex-1 text-center py-2.5 px-3 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl min-h-[44px] flex items-center justify-center transition-colors"
                    >
                      Editar
                    </Link>
                    {role === 'Admin' && (
                      <button
                        type="button"
                        onClick={() => setOrderToDelete(orden)}
                        className="py-2.5 px-3 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl min-h-[44px] flex items-center justify-center transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Confirmation modal for delete */}
      <ConfirmModal
        isOpen={!!orderToDelete}
        title="¿Eliminar orden de trabajo?"
        message={`Estás a punto de eliminar la Orden #${orderToDelete?.ordenId}. Esta acción requiere rol de Administrador y no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
};
