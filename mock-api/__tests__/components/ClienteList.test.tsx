import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClienteList from '@/components/ClienteList';
import { Cliente } from '@/lib/types/cliente';

// Mock de window.confirm
const mockConfirm = jest.fn();
window.confirm = mockConfirm;

// Mock de window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

describe('ClienteList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockClientes: Cliente[] = [
    {
      identificador: '12345678A',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    },
    {
      identificador: '87654321B',
      nombre: 'María García',
      telefono: '987654321',
      mail: 'maria@example.com',
    },
  ];

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
    mockConfirm.mockClear();
    mockAlert.mockClear();
  });

  it('debería renderizar la lista de clientes correctamente', () => {
    // arrange
    const clientes = mockClientes;
    //act
    render(<ClienteList clientes={clientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    // assert
    expect(screen.getByText('12345678A')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();

    expect(screen.getByText('87654321B')).toBeInTheDocument();
    expect(screen.getByText('María García')).toBeInTheDocument();
    expect(screen.getByText('987654321')).toBeInTheDocument();
    expect(screen.getByText('maria@example.com')).toBeInTheDocument();
  });

  it('debería mostrar los encabezados de la tabla', () => {
    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('DNI')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('debería mostrar un mensaje cuando no hay clientes', () => {
    render(<ClienteList clientes={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('No hay clientes registrados')).toBeInTheDocument();
  });

  it('debería mostrar un mensaje de carga cuando loading es true', () => {
    render(<ClienteList clientes={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} loading={true} />);

    expect(screen.getByText('Cargando clientes...')).toBeInTheDocument();
  });

  it('no debería mostrar la tabla cuando loading es true', () => {
    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} loading={true} />);

    expect(screen.queryByText('12345678A')).not.toBeInTheDocument();
    expect(screen.getByText('Cargando clientes...')).toBeInTheDocument();
  });

  it('debería llamar a onEdit cuando se hace clic en el botón editar', async () => {
    const user = userEvent.setup();
    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByText('Editar');
    await user.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockClientes[0]);
  });

  it('debería llamar a onDelete cuando se confirma la eliminación', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    mockOnDelete.mockResolvedValueOnce(undefined);

    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('¿Estás seguro de que quieres eliminar este cliente?');
      expect(mockOnDelete).toHaveBeenCalledWith('12345678A');
    });
  });

  it('no debería llamar a onDelete cuando se cancela la confirmación', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(false);

    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('debería mostrar estado de eliminación durante el proceso', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    mockOnDelete.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );

    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Eliminando...')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Eliminando...');
    expect(deleteButton).toBeDisabled();
  });

  it('debería mostrar alerta cuando onDelete falla', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    mockOnDelete.mockRejectedValueOnce(new Error('Error al eliminar'));

    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error al eliminar cliente');
    });
  });

  it('debería mostrar múltiples botones de editar y eliminar para múltiples clientes', () => {
    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByText('Editar');
    const deleteButtons = screen.getAllByText('Eliminar');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('debería llamar a onDelete con el identificador correcto para cada cliente', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    mockOnDelete.mockResolvedValue(undefined);

    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    
    // Eliminar el primer cliente
    await user.click(deleteButtons[0]);
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('12345678A');
    });

    // Eliminar el segundo cliente
    await user.click(deleteButtons[1]);
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('87654321B');
    });
  });

  it('debería restaurar el botón después de completar la eliminación', async () => {
    const user = userEvent.setup();
    mockConfirm.mockReturnValue(true);
    mockOnDelete.mockResolvedValueOnce(undefined);

    render(<ClienteList clientes={mockClientes} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalled();
    });

    // Esperar a que termine la eliminación
    await waitFor(() => {
      const buttons = screen.getAllByText('Eliminar');
      expect(buttons.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  it('debería renderizar correctamente con un solo cliente', () => {
    const singleCliente = [mockClientes[0]];
    render(<ClienteList clientes={singleCliente} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('12345678A')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getAllByText('Editar')).toHaveLength(1);
    expect(screen.getAllByText('Eliminar')).toHaveLength(1);
  });
});

