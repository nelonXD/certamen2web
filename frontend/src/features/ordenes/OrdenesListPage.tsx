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
  Filter,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Car,
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
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
    if (norm === 'en proceso' || norm === 'reparacion') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Órdenes de Trabajo
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Gestión integral del ciclo de reparación y mantenimiento en taller.
          </p>
        </div>
        <Link
          to="/ordenes/nueva"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
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

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <label htmlFor="search-ordenes" className="sr-only">
            Buscar órdenes por código, cliente o patente
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            id="search-ordenes"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID, cliente, patente u observaciones..."
            className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2 sm:w-64">
          <label htmlFor="status-filter" className="text-xs font-semibold text-slate-600 shrink-0">
            <Filter className="w-4 h-4 inline mr-1" aria-hidden="true" />
            Estado:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full py-2 px-3 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en proceso">En Proceso</option>
            <option value="completado">Completado</option>
          </select>
        </div>
      </div>

      {/* Main Content: Loading, Error, Empty, List */}
      {isLoading ? (
        <LoadingSpinner message="Cargando órdenes de trabajo..." size="lg" />
      ) : isError ? (
        <div className="bg-white p-8 rounded-xl border border-red-200 text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">No se pudieron cargar las órdenes</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4">{error?.message || 'Error de conexión'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] min-w-[44px]"
          >
            Reintentar
          </button>
        </div>
      ) : filteredOrdenes.length === 0 ? (
        <EmptyState
          title="No se encontraron órdenes de trabajo"
          description={
            searchTerm || statusFilter !== 'todos'
              ? 'Prueba modificando los criterios de búsqueda o filtros.'
              : 'Aún no se han registrado órdenes en el taller.'
          }
        />
      ) : (
        <>
          {/* Responsive presentation: Table on md+ screens */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <caption className="sr-only">Listado de órdenes de trabajo</caption>
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-3.5">ID</th>
                  <th scope="col" className="px-4 py-3.5">Fecha</th>
                  <th scope="col" className="px-4 py-3.5">Cliente</th>
                  <th scope="col" className="px-4 py-3.5">Vehículo</th>
                  <th scope="col" className="px-4 py-3.5">Estado</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredOrdenes.map((orden) => (
                  <tr key={orden.ordenId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      #{orden.ordenId}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {orden.fechaIngreso
                        ? new Date(orden.fechaIngreso).toLocaleDateString('es-CL')
                        : '—'}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      {orden.cliente
                        ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                        : `Cliente #${orden.clienteId}`}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono">
                      {orden.vehiculo
                        ? `${orden.vehiculo.patente} (${orden.vehiculo.color})`
                        : `Vehículo #${orden.vehiculoId}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                          orden.estado
                        )}`}
                      >
                        {orden.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/ordenes/${orden.ordenId}`}
                          className="p-2 text-slate-600 hover:text-blue-700 rounded-md hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600"
                          aria-label={`Ver detalles de orden #${orden.ordenId}`}
                        >
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <Link
                          to={`/ordenes/${orden.ordenId}/editar`}
                          className="p-2 text-slate-600 hover:text-amber-700 rounded-md hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-600"
                          aria-label={`Editar orden #${orden.ordenId}`}
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        {role === 'Admin' && (
                          <button
                            type="button"
                            onClick={() => setOrderToDelete(orden)}
                            className="p-2 text-slate-600 hover:text-red-700 rounded-md hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Eliminar orden #${orden.ordenId}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile-first cards on mobile screens (avoids horizontal scrolling) */}
          <div className="md:hidden space-y-4" role="region" aria-label="Tarjetas de órdenes de trabajo">
            {filteredOrdenes.map((orden) => (
              <div
                key={orden.ordenId}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-slate-900">
                    Orden #{orden.ordenId}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                      orden.estado
                    )}`}
                  >
                    {orden.estado}
                  </span>
                </div>

                <div className="text-sm space-y-1.5 text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="font-medium text-slate-900">
                      {orden.cliente
                        ? `${orden.cliente.nombre} ${orden.cliente.apellido}`
                        : `Cliente #${orden.clienteId}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>
                      {orden.vehiculo
                        ? `${orden.vehiculo.patente} (${orden.vehiculo.color})`
                        : `Vehículo #${orden.vehiculoId}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>
                      {orden.fechaIngreso
                        ? new Date(orden.fechaIngreso).toLocaleDateString('es-CL')
                        : 'Sin fecha'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <Link
                    to={`/ordenes/${orden.ordenId}`}
                    className="flex-1 text-center py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg min-h-[44px] flex items-center justify-center"
                  >
                    Ver Detalle
                  </Link>
                  <Link
                    to={`/ordenes/${orden.ordenId}/editar`}
                    className="flex-1 text-center py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg min-h-[44px] flex items-center justify-center"
                  >
                    Editar
                  </Link>
                  {role === 'Admin' && (
                    <button
                      type="button"
                      onClick={() => setOrderToDelete(orden)}
                      className="py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg min-h-[44px] flex items-center justify-center"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
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
