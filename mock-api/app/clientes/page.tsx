'use client';

import { useState, useEffect } from 'react';
import ClienteForm from '@/components/ClienteForm';
import ClienteList from '@/components/ClienteList';
import { Cliente } from '@/lib/types/cliente';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clientes');
      if (!response.ok) {
        throw new Error('Error al cargar clientes');
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (clienteData: Omit<Cliente, 'identificador'> & { identificador?: string }) => {
    if (!clienteData.identificador) {
      throw new Error('El DNI es requerido');
    }

    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear cliente');
    }

    const nuevoCliente = await response.json();
    setClientes([...clientes, nuevoCliente]);
    setSuccessMessage('Cliente creado exitosamente');
    setTimeout(() => setSuccessMessage(null), 3000);
    await loadClientes();
  };

  const handleUpdate = async (clienteData: Omit<Cliente, 'identificador'> & { identificador?: string }) => {
    if (!editingCliente || !clienteData.identificador) {
      throw new Error('Cliente no válido');
    }

    // Crear objeto sin identificador (se usa en la URL)
    const updateData = {
      nombre: clienteData.nombre,
      telefono: clienteData.telefono,
      mail: clienteData.mail,
    };
    const response = await fetch(`/api/clientes/${editingCliente.identificador}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar cliente');
    }

    setEditingCliente(null);
    setSuccessMessage('Cliente actualizado exitosamente');
    setTimeout(() => setSuccessMessage(null), 3000);
    await loadClientes();
  };

  const handleDelete = async (identificador: string) => {
    const response = await fetch(`/api/clientes/${identificador}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar cliente');
    }

    setClientes(clientes.filter(c => c.identificador !== identificador));
    setSuccessMessage('Cliente eliminado exitosamente');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
  };

  const handleCancelEdit = () => {
    setEditingCliente(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Clientes</h1>

          {successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <ClienteForm
              cliente={editingCliente || undefined}
              onSubmit={editingCliente ? handleUpdate : handleCreate}
              onCancel={editingCliente ? handleCancelEdit : undefined}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Clientes</h2>
            <ClienteList
              clientes={clientes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

