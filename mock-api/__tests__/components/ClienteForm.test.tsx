import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClienteForm from '@/components/ClienteForm';
import { Cliente } from '@/lib/types/cliente';

describe('ClienteForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('debería renderizar el formulario de creación correctamente', () => {
    render(<ClienteForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/dni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument();
  });

  it('debería renderizar el formulario de edición con datos del cliente', () => {
    const cliente: Cliente = {
      identificador: '12345678A',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByDisplayValue('12345678A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123456789')).toBeInTheDocument();
    expect(screen.getByDisplayValue('juan@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /actualizar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('debería deshabilitar el campo DNI en modo edición', () => {
    const cliente: Cliente = {
      identificador: '12345678A',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} />);

    const dniInput = screen.getByLabelText(/dni/i);
    expect(dniInput).toBeDisabled();
  });

  it('debería permitir editar el campo DNI en modo creación', () => {
    render(<ClienteForm onSubmit={mockOnSubmit} />);

    const dniInput = screen.getByLabelText(/DNI/i);
    expect(dniInput).not.toBeDisabled();
  });

  it('debería actualizar los valores de los campos cuando el usuario escribe', async () => {
    const user = userEvent.setup();
    render(<ClienteForm onSubmit={mockOnSubmit} />);

    const dniInput = screen.getByLabelText(/dni/i);
    const nombreInput = screen.getByLabelText(/nombre/i);
    const telefonoInput = screen.getByLabelText(/teléfono/i);
    const mailInput = screen.getByLabelText(/email/i);

    await user.type(dniInput, '12345678A');
    await user.type(nombreInput, 'Juan Pérez');
    await user.type(telefonoInput, '123456789');
    await user.type(mailInput, 'juan@example.com');

    expect(dniInput).toHaveValue('12345678A');
    expect(nombreInput).toHaveValue('Juan Pérez');
    expect(telefonoInput).toHaveValue('123456789');
    expect(mailInput).toHaveValue('juan@example.com');
  });

  it('debería llamar a onSubmit con los datos correctos al enviar el formulario', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678A');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');

    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        identificador: '12345678A',
        nombre: 'Juan Pérez',
        telefono: '123456789',
        mail: 'juan@example.com',
      });
    });
  });

  it('debería resetear el formulario después de crear un cliente exitosamente', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    const dniInput = screen.getByLabelText(/dni/i);
    const nombreInput = screen.getByLabelText(/nombre/i);
    const telefonoInput = screen.getByLabelText(/teléfono/i);
    const mailInput = screen.getByLabelText(/email/i);

    await user.type(dniInput, '12345678A');
    await user.type(nombreInput, 'Juan Pérez');
    await user.type(telefonoInput, '123456789');
    await user.type(mailInput, 'juan@example.com');

    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(dniInput).toHaveValue('');
      expect(nombreInput).toHaveValue('');
      expect(telefonoInput).toHaveValue('');
      expect(mailInput).toHaveValue('');
    });
  });

  it('no debería resetear el formulario después de actualizar un cliente', async () => {
    const user = userEvent.setup();
    const cliente: Cliente = {
      identificador: '12345678A',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    mockOnSubmit.mockResolvedValueOnce(undefined);

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} />);

    const nombreInput = screen.getByLabelText(/nombre/i);
    await user.clear(nombreInput);
    await user.type(nombreInput, 'Juan Carlos Pérez');

    const submitButton = screen.getByRole('button', { name: /actualizar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // El formulario debería mantener los valores después de actualizar
    expect(nombreInput).toHaveValue('Juan Carlos Pérez');
  });

  it('debería mostrar un error cuando onSubmit falla', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Error al guardar cliente';
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage));

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678A');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');

    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('debería mostrar un mensaje de error genérico cuando el error no es una instancia de Error', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValueOnce('Error desconocido');

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678A');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');

    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al guardar cliente')).toBeInTheDocument();
    });
  });

  it('debería mostrar estado de carga durante el envío', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(undefined), 100))
    );

    render(<ClienteForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/dni/i), '12345678A');
    await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/teléfono/i), '123456789');
    await user.type(screen.getByLabelText(/email/i), 'juan@example.com');

    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Guardando...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('debería llamar a onCancel cuando se hace clic en el botón cancelar', async () => {
    const user = userEvent.setup();
    const cliente: Cliente = {
      identificador: '12345678A',
      nombre: 'Juan Pérez',
      telefono: '123456789',
      mail: 'juan@example.com',
    };

    render(<ClienteForm cliente={cliente} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('no debería mostrar el botón cancelar cuando onCancel no está definido', () => {
    render(<ClienteForm onSubmit={mockOnSubmit} />);

    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
  });

  it('debería validar que los campos son requeridos', async () => {
    const user = userEvent.setup();
    render(<ClienteForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    // Los campos HTML5 required deberían prevenir el envío
    const dniInput = screen.getByLabelText(/dni/i);
    expect(dniInput).toBeInvalid();
  });
});

