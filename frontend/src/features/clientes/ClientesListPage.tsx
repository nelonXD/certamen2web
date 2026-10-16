import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '../../api/clientes.service';
import { useAuth } from '../../context/AuthContext';
import { Cliente, ClienteDTO } from '../../types/cliente.types';
import { ClienteModalForm } from './ClienteModalForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Alert } from '../../components/common/Alert';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { NormalizedError } from '../../types/api.types';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
} from 'lucide-react';

export const ClientesListPage: React.FC = () => {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [apiError, setApiError] = useState<NormalizedError | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Consulta de clientes
  const {
    data: clientes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Cliente[], NormalizedError>({
    queryKey: ['clientes'],
    queryFn: clientesService.getAll,
  });

  // Mutación para Crear/Editar
  const saveMutation = useMutation({
    mutationFn: async (dto: ClienteDTO) => {
      if (editingCliente) {
        await clientesService.update(editingCliente.clienteId, dto);
      } else {
        await clientesService.create(dto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setSuccessMessage(
        editingCliente
          ? 'Datos del cliente actualizados correctamente.'
          : 'Nuevo cliente registrado exitosamente.'
      );
      setModalOpen(false);
      setEditingCliente(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
    },
  });

  // Mutación para Eliminar (Solo Admin en backend)
  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setSuccessMessage('Cliente eliminado satisfactoriamente.');
      setClienteToDelete(null);
    },
    onError: (err: NormalizedError) => {
      setApiError(err);
      setClienteToDelete(null);
    },
  });

  const filteredClientes = useMemo(() => {
    return clientes.filter((c) => {
      const term = searchTerm.toLowerCase();
      return (
        c.nombre.toLowerCase().includes(term) ||
        c.apellido.toLowerCase().includes(term) ||
        c.correo.toLowerCase().includes(term) ||
        c.telefono.toLowerCase().includes(term)
      );
    });
  }, [clientes, searchTerm]);

  const handleOpenCreate = () => {
    setEditingCliente(null);
    setApiError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setApiError(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Directorio de Clientes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Administración de clientes del taller mecánico y datos de contacto.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Nuevo Cliente</span>
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
        <label htmlFor="search-clientes" className="sr-only">
          Buscar clientes por nombre, correo o teléfono
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" aria-hidden="true" />
          </div>
          <input
            id="search-clientes"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido, correo o teléfono..."
            className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600 min-h-[44px]"
          />
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <LoadingSpinner message="Cargando directorio de clientes..." size="lg" />
      ) : isError ? (
        <div className="bg-white p-8 rounded-xl border border-red-200 text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">No se pudieron cargar los clientes</h2>
          <p className="text-sm text-slate-600 mt-1 mb-4">{error?.message || 'Error de conexión'}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors min-h-[44px] min-w-[44px]"
          >
            Reintentar
          </button>
        </div>
      ) : filteredClientes.length === 0 ? (
        <EmptyState
          title="No se encontraron clientes"
          description={
            searchTerm
              ? 'No hay resultados que coincidan con la búsqueda.'
              : 'Aún no se han registrado clientes en el taller.'
          }
          action={{
            label: 'Registrar primer cliente',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <caption className="sr-only">Listado de clientes registrados</caption>
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th scope="col" className="px-4 py-3.5">Cliente</th>
                  <th scope="col" className="px-4 py-3.5">Teléfono</th>
                  <th scope="col" className="px-4 py-3.5">Correo</th>
                  <th scope="col" className="px-4 py-3.5">Dirección</th>
                  <th scope="col" className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredClientes.map((c) => (
                  <tr key={c.clienteId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {c.nombre} {c.apellido}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono">{c.telefono}</td>
                    <td className="px-4 py-3.5 text-slate-600">{c.correo}</td>
                    <td className="px-4 py-3.5 text-slate-500">{c.direccion || '—'}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 text-slate-600 hover:text-amber-700 rounded-md hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-600"
                          aria-label={`Editar cliente ${c.nombre} ${c.apellido}`}
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                        {role === 'Admin' && (
                          <button
                            type="button"
                            onClick={() => setClienteToDelete(c)}
                            className="p-2 text-slate-600 hover:text-red-700 rounded-md hover:bg-red-50 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Eliminar cliente ${c.nombre} ${c.apellido}`}
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4" role="region" aria-label="Tarjetas de clientes">
            {filteredClientes.map((c) => (
              <div
                key={c.clienteId}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900">
                    {c.nombre} {c.apellido}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">ID #{c.clienteId}</span>
                </div>

                <div className="text-sm space-y-2 text-slate-600 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{c.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{c.correo}</span>
                  </div>
                  {c.direccion && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{c.direccion}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="flex-1 py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg min-h-[44px] flex items-center justify-center"
                  >
                    Editar Cliente
                  </button>
                  {role === 'Admin' && (
                    <button
                      type="button"
                      onClick={() => setClienteToDelete(c)}
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
      <ClienteModalForm
        isOpen={modalOpen}
        clienteToEdit={editingCliente}
        isLoading={saveMutation.isPending}
        onClose={() => setModalOpen(false)}
        onSubmit={(dto) => saveMutation.mutate(dto)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!clienteToDelete}
        title="¿Eliminar Cliente?"
        message={`¿Estás seguro de que deseas eliminar a "${clienteToDelete?.nombre} ${clienteToDelete?.apellido}"? Esta acción no se puede deshacer y solo está permitida para Administradores.`}
        confirmText="Sí, Eliminar"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
        onConfirm={() => clienteToDelete && deleteMutation.mutate(clienteToDelete.clienteId)}
        onCancel={() => setClienteToDelete(null)}
      />
    </div>
  );
};
