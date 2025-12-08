'use client';

import { useState, FormEvent } from 'react';
import { Cliente } from '@/lib/types/cliente';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (cliente: Omit<Cliente, 'identificador'> & { identificador?: string }) => Promise<void>;
  onCancel?: () => void;
}

export default function ClienteForm({ cliente, onSubmit, onCancel }: ClienteFormProps) {
  const [formData, setFormData] = useState({
    identificador: cliente?.identificador || '',
    nombre: cliente?.nombre || '',
    telefono: cliente?.telefono || '',
    mail: cliente?.mail || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      if (!cliente) {
        // Reset form after successful creation
        setFormData({
          identificador: '',
          nombre: '',
          telefono: '',
          mail: '',
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="identificador" className="block text-sm font-medium text-gray-900 mb-1">
          Dni *
        </label>
        <input
          type="text" 
          id="identificador"
          value={formData.identificador}
          onChange={(e) => setFormData({ ...formData, identificador: e.target.value })}
          required
          disabled={!!cliente}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-900 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          id="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-gray-900 mb-1">
          Teléfono *
        </label>
        <input
          type="tel"
          id="telefono"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          required
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="mail" className="block text-sm font-medium text-gray-900 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="mail"
          value={formData.mail}
          onChange={(e) => setFormData({ ...formData, mail: e.target.value })}
          required
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : cliente ? 'Actualizar' : 'Crear'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

