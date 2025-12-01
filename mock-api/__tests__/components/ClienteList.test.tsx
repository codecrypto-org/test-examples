import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClienteList from '@/components/ClienteList';
import { Cliente } from '@/lib/types/cliente';

// Mock de window.confirm
global.confirm = jest.fn(() => true);

describe('ClienteList Component', () => {
  const mockClientes = [
    {
      identificador: '12345678',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    },
    {
      identificador: '87654321',
      nombre: 'María García',
      telefono: '987654321',
      mail: 'maria@example.com',
    },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    const confirmMock = global.confirm as jest.Mock;
    confirmMock.mockReturnValue(true);
  });

  it('debería renderizar la lista de clientes', () => {
    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();

    expect(screen.getByText('87654321')).toBeInTheDocument();
    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  it('debería mostrar mensaje cuando no hay clientes', () => {
    render(
      <ClienteList
        clientes={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No hay clientes registrados')).toBeInTheDocument();
  });

  it('debería mostrar estado de carga', () => {
    render(
      <ClienteList
        clientes={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        loading={true}
      />
    );

    expect(screen.getByText('Cargando clientes...')).toBeInTheDocument();
  });

  it('debería llamar onEdit cuando se hace clic en editar', async () => {
    const user = userEvent.setup();

    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockClientes[0]);
  });

  it('debería llamar onDelete cuando se hace clic en eliminar y se confirma', async () => {
    const user = userEvent.setup();
    mockOnDelete.mockResolvedValue(undefined);

    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(global.confirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar este cliente?');
      expect(mockOnDelete).toHaveBeenCalledWith('12345678');
    });
  });

  it('no debería llamar onDelete cuando se cancela la confirmación', async () => {
    const user = userEvent.setup();
    const confirmMock = global.confirm as jest.Mock;
    confirmMock.mockReturnValue(false);

    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('debería mostrar estado de eliminación durante el proceso', async () => {
    const user = userEvent.setup();
    mockOnDelete.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );

    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Eliminando...')).toBeInTheDocument();
    });

    const deletingButton = screen.getByText('Eliminando...');
    expect(deletingButton).toBeDisabled();
  });

  it('debería manejar errores al eliminar', async () => {
    const user = userEvent.setup();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockOnDelete.mockRejectedValue(new Error('Error al eliminar'));

    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error al eliminar cliente');
    });

    alertSpy.mockRestore();
  });

  it('debería renderizar todos los encabezados de la tabla', () => {
    render(
      <ClienteList
        clientes={mockClientes}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('DNI')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Teléfono')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });
});

