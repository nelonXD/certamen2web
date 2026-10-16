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
import { Car, Plus, Search, Edit2, Trash2, AlertCircle, User } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Vehículos
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Parque automotriz ingresado para mantenimiento y órdenes de servicio.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
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

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <label htmlFor="search-vehiculos" className="sr-only">
          Buscar vehículos por patente, color o cliente
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            id="search-vehiculos"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por patente, modelo, color o cliente..."
            className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
          />
        </div>
      </div>

      {/* Main Content */}
      {loadingVehiculos ? (
        <LoadingSpinner message="Cargando catálogo de vehículos..." size="lg" />
      ) : isError ? (
        <div className="bg-white p-8 rounded-xl border border-red-200 text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">No se pudieron cargar los vehículos</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4">{error?.message || 'Error de conexión'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] min-w-[44px]"
          >
            Reintentar
          </button>
        </div>
      ) : filteredVehiculos.length === 0 ? (
        <EmptyState
          title="No se encontraron vehículos"
          description={
            searchTerm
              ? 'No hay vehículos coincidentes con los términos de búsqueda.'
              : 'Aún no se han registrado vehículos en el sistema.'
          }
          action={{
            label: 'Registrar primer vehículo',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <>
          {/* Table View (Desktop) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <caption className="sr-only">Listado de vehículos</caption>
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Patente</th>
                  <th scope="col" className="px-4 py-3.5">Modelo</th>
                  <th scope="col" className="px-4 py-3.5">Color / Año</th>
                  <th scope="col" className="px-4 py-3.5">Propietario</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredVehiculos.map((v) => (
                  <tr key={v.vehiculoId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-base">
                      {v.patente}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {v.modelo?.nombre || `Modelo #${v.modeloId}`}
                      {v.modelo?.marca && (
                        <span className="text-xs text-slate-500 block">
                          Marca: {v.modelo.marca.nombre}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {v.color} {v.anio ? `(${v.anio})` : ''}
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 font-medium">
                      {v.cliente
                        ? `${v.cliente.nombre} ${v.cliente.apellido}`
                        : `Cliente #${v.clienteId}`}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(v)}
                          className="p-2 text-slate-600 hover:text-amber-700 rounded-md hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-600"
                          aria-label={`Editar vehículo ${v.patente}`}
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        {role === 'Admin' && (
                          <button
                            type="button"
                            onClick={() => setVehiculoToDelete(v)}
                            className="p-2 text-slate-600 hover:text-red-700 rounded-md hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-600"
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
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-lg text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                    {v.patente}
                  </span>
                  <span className="text-xs text-slate-500">
                    {v.color} {v.anio ? `(${v.anio})` : ''}
                  </span>
                </div>

                <div className="text-sm space-y-1 text-slate-600 border-t border-slate-100 pt-2">
                  <p>
                    <span className="font-semibold text-slate-800">Modelo: </span>
                    {v.modelo?.nombre || `ID #${v.modeloId}`}
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

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(v)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg min-h-[44px] flex items-center justify-center"
                  >
                    Editar
                  </button>
                  {role === 'Admin' && (
                    <button
                      type="button"
                      onClick={() => setVehiculoToDelete(v)}
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
