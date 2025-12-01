import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClienteForm from '@/components/ClienteForm';

// Mock de fetch
global.fetch = jest.fn();

describe('ClienteForm Component', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockClear();
  });

  it('debería renderizar el formulario con todos los campos', () => {
    render(<ClienteForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/dni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
  });

  it('debería mostrar los valores del cliente cuando se edita', () => {
    const cliente = {
      identificador: '12345678',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('12345678')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
    expect(screen.getByDisplayValue('juan@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
  });

  it('debería deshabilitar el campo DNI cuando se edita', () => {
    const cliente = {
      identificador: '12345678',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} />);

    const dniInput = screen.getByLabelText(/dni/i);
    expect(dniInput).toBeDisabled();
  });

  it('debería llamar onSubmit con los datos del formulario al crear', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        identificador: '12345678',
        nombre: 'Juan Pérez',
        telefono: '123456789',
        mail: 'juan@example.com',
      });
    });
  });

  it('debería mostrar error cuando onSubmit falla', async () => {
    const user = userEvent.setup();
    const errorMessage = 'El DNI ya existe';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('debería mostrar estado de carga durante el envío', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(screen.getByText('Guardando...')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /guardando/i });
    expect(submitButton).toBeDisabled();
  });

  it('debería resetear el formulario después de crear exitosamente', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');
    await user.click(screen.getByRole('button', { name: /crear/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/dni/i)).toHaveValue('');
      expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
      expect(screen.getByLabelText(/teléfono/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });
  });

  it('debería mostrar botón cancelar cuando se edita', () => {
    const cliente = {
      identificador: '12345678',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    const mockOnCancel = jest.fn();

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('debería llamar onCancel cuando se hace clic en cancelar', async () => {
    const user = userEvent.setup();
    const cliente = {
      identificador: '12345678',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    const mockOnCancel = jest.fn();

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

