import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiculosService } from '../../api/vehiculos.service';
import { clientesService } from '../../api/clientes.service';
import { catalogosService } from '../../api/catalogos.service';
import { useAuth } from '../../context/AuthContext';
import { Vehiculo, VehiculoDTO } from '../../types/vehiculo.types';
import { VehiculoModalForm } from './VehiculoModalForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { NormalizedError } from '../../types/api.types';
import { Car, Plus, Search, Edit2, Trash2, AlertCircle, User, X } from 'lucide-react';

export const VehiculosListPage: React.FC = () => {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [vehiculoToDelete, setVehiculoToDelete] = useState<Vehiculo | null>(null);
  const [apiError, setApiError] = useState<NormalizedError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Consultas de datos
  const {
    data: vehiculos = [],
    isLoading: loadingVehiculos,
    isError,
    error,
    refetch,
  } = useQuery<Vehiculo[], NormalizedError>({
    queryKey: ['vehiculos'],
    queryFn: vehiculosService.getAll,
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
  });

  const { data: modelos = [] } = useQuery({
    queryKey: ['modelos'],
    queryFn: catalogosService.getModelos,
  });

  // Mutación para Crear/Editar
  const saveMutation = useMutation({
    mutationFn: async (dto: VehiculoDTO) => {
      if (editingVehiculo) {
        await vehiculosService.update(editingVehiculo.vehiculoId, dto);
      } else {
        await vehiculosService.create(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      setSuccessMessage(
        editingVehiculo
          ? 'Datos del vehículo actualizados correctamente.'
          : 'Nuevo vehículo registrado con éxito.'
      );
      setModalOpen(false);
      setEditingVehiculo(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
    },
  });

  // Mutación para Eliminar (Admin)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => vehiculosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      setSuccessMessage('Vehículo eliminado del sistema.');
      setVehiculoToDelete(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
      setVehiculoToDelete(null);
    },
  });

  const filteredVehiculos = useMemo(() => {
    return vehiculos.filter((v) => {
      const term = searchTerm.toLowerCase();
      const matchPatente = v.patente.toLowerCase().includes(term);
      const matchColor = v.color.toLowerCase().includes(term);
      const matchCliente =
        v.cliente &&
        `${v.cliente.nombre} ${v.cliente.apellido}`.toLowerCase().includes(term);
      const matchModelo = v.modelo && v.modelo.nombre.toLowerCase().includes(term);

      return matchPatente || matchColor || matchCliente || matchModelo;
    });
  }, [vehiculos, searchTerm]);

  const handleOpenCreate = () => {
    setEditingVehiculo(null);
    setApiError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (vehiculo: Vehiculo) => {
    setEditingVehiculo(vehiculo);
    setApiError(null);
    setModalOpen(true);
  };

  const getClientInitials = (v: Vehiculo) => {
    if (!v.cliente) return 'CL';
    const first = v.cliente.nombre ? v.cliente.nombre[0].toUpperCase() : '';
    const last = v.cliente.apellido ? v.cliente.apellido[0].toUpperCase() : '';
    return `${first}${last}` || 'CL';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Gestión de Vehículos</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {vehiculos.length} {vehiculos.length === 1 ? 'vehículo' : 'vehículos'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Parque automotriz ingresado para mantenimiento, revisión y órdenes de servicio técnico.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-900/20 active:scale-95 min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nuevo Vehículo</span>
        </button>
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

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <label htmlFor="search-vehiculos" className="sr-only">
          Buscar vehículos por patente, color o cliente
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="search-vehiculos"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patente vehicular (ej: ABCD12), modelo, color o cliente..."
            className="block w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-[44px] transition-all bg-slate-50/50"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 min-h-[44px] min-w-[44px] justify-center"
              aria-label="Limpiar búsqueda de vehículos"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      {loadingVehiculos ? (
        <LoadingSpinner message="Cargando catálogo de vehículos..." size="lg" />
      ) : isError ? (
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">No se pudieron cargar los vehículos</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4">{error?.message || 'Error de conexión'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-xs min-h-[44px] min-w-[44px]"
          >
            Reintentar
          </button>
        </div>
      ) : filteredVehiculos.length === 0 ? (
        <EmptyState
          title="No se encontraron vehículos"
          description={
            searchTerm
              ? 'No hay vehículos coincidentes con los términos de búsqueda ingresados.'
              : 'Aún no se han registrado vehículos en la base de datos.'
          }
          action={{
            label: 'Registrar primer vehículo',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <>
          {/* Table View (Desktop) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200/80 text-left text-sm">
              <caption className="sr-only">Listado de vehículos</caption>
              <thead className="bg-slate-50/80 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-4">Patente</th>
                  <th scope="col" className="px-5 py-4">Modelo / Marca</th>
                  <th scope="col" className="px-5 py-4">Color y Año</th>
                  <th scope="col" className="px-5 py-4">Propietario</th>
                  <th scope="col" className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredVehiculos.map((v) => (
                  <tr key={v.vehiculoId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <span className="patente-chip text-sm tracking-wider">
                        {v.patente}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900 leading-tight">
                        {v.modelo?.nombre || `Modelo #${v.modeloId}`}
                      </p>
                      {v.modelo?.marca && (
                        <span className="text-xs text-slate-500 block">
                          Marca: <strong className="text-slate-600">{v.modelo.marca.nombre}</strong>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {v.color}
                        </span>
                        {v.anio && (
                          <span className="text-xs text-slate-500 font-mono">
                            {v.anio}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getClientInitials(v)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-xs">
                            {v.cliente
                              ? `${v.cliente.nombre} ${v.cliente.apellido}`
                              : `Cliente #${v.clienteId}`}
                          </p>
                          {v.cliente?.telefono && (
                            <span className="text-[11px] font-mono text-slate-400">
                              {v.cliente.telefono}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(v)}
                          className="p-2 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-amber-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-amber-600"
                          aria-label={`Editar vehículo ${v.patente}`}
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        {role === 'Admin' && (
                          <button
                            type="button"
                            onClick={() => setVehiculoToDelete(v)}
                            className="p-2 text-slate-500 hover:text-red-700 rounded-lg hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Eliminar vehículo ${v.patente}`}
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

          {/* Cards View (Mobile) */}
          <div className="md:hidden space-y-4" role="region" aria-label="Tarjetas de vehículos">
            {filteredVehiculos.map((v) => (
              <div
                key={v.vehiculoId}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="patente-chip text-sm tracking-wider">
                    {v.patente}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {v.color} {v.anio ? `(${v.anio})` : ''}
                  </span>
                </div>

                <div className="text-xs space-y-2 text-slate-600 border-t border-slate-100 pt-3">
                  <p>
                    <span className="font-bold text-slate-800">Modelo: </span>
                    {v.modelo?.nombre || `ID #${v.modeloId}`}
                    {v.modelo?.marca && ` (${v.modelo.marca.nombre})`}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    <span>
                      {v.cliente
                        ? `${v.cliente.nombre} ${v.cliente.apellido}`
                        : `Cliente #${v.clienteId}`}
                    </span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(v)}
                    className="flex-1 py-2.5 px-3 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl min-h-[44px] flex items-center justify-center transition-colors"
                  >
                    Editar Vehículo
                  </button>
                  {role === 'Admin' && (
                    <button
                      type="button"
                      onClick={() => setVehiculoToDelete(v)}
                      className="py-2.5 px-3 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl min-h-[44px] flex items-center justify-center transition-colors"
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

      {/* Form Modal */}
      <VehiculoModalForm
        isOpen={modalOpen}
        vehiculoToEdit={editingVehiculo}
        clientes={clientes}
        modelos={modelos}
        isLoading={saveMutation.isPending}
        onClose={() => setModalOpen(false)}
        onSubmit={(dto) => saveMutation.mutate(dto)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!vehiculoToDelete}
        title="¿Eliminar Vehículo?"
        message={`¿Estás seguro de que deseas eliminar el vehículo con patente "${vehiculoToDelete?.patente}"? Esta acción solo está permitida para Administradores.`}
        confirmText="Sí, Eliminar"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={() => vehiculoToDelete && deleteMutation.mutate(vehiculoToDelete.vehiculoId)}
        onCancel={() => setVehiculoToDelete(null)}
      />
    </div>
  );
};
