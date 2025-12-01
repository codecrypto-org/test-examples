'use client';

import { useState } from 'react';
import { Cliente } from '@/lib/types/cliente';

interface ClienteListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => void;
  onDelete: (identificador: string) => Promise<void>;
  loading?: boolean;
}

export default function ClienteList({ clientes, onEdit, onDelete, loading }: ClienteListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (identificador: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      return;
    }

    setDeletingId(identificador);
    try {
      await onDelete(identificador);
    } catch (error) {
      alert('Error al eliminar cliente');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando clientes...</div>;
  }

  if (clientes.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay clientes registrados</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DNI
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Teléfono
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clientes.map((cliente) => (
            <tr key={cliente.identificador}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cliente.identificador}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cliente.nombre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cliente.telefono}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {cliente.mail}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(cliente)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cliente.identificador)}
                  disabled={deletingId === cliente.identificador}
                  className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                >
                  {deletingId === cliente.identificador ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

