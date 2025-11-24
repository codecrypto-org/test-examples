import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/components/Login';

// Mock de fetch
global.fetch = jest.fn();

describe('Login Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('debería renderizar el formulario de login', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería mostrar error cuando el usuario está vacío', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(passwordInput, 'test123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El usuario es requerido')).toBeInTheDocument();
    });
  });

  it('debería mostrar error cuando la contraseña está vacía', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const usuarioInput = screen.getByLabelText(/usuario/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(usuarioInput, 'test');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
    });
  });

  it('debería mostrar mensaje de éxito cuando las credenciales son correctas', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Login exitoso', usuario: 'admin' }),
    });

    render(<Login />);

    const usuarioInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(usuarioInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('¡Inicio de sesión exitoso!')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: 'admin',
        password: 'admin123',
      }),
    });
  });

  it('debería mostrar error cuando las credenciales son incorrectas', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Usuario o contraseña incorrectos' }),
    });

    render(<Login />);

    const usuarioInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(usuarioInput, 'admin');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
    });
  });

  it('debería mostrar estado de carga durante el envío', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100)
        )
    );

    render(<Login />);

    const usuarioInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(usuarioInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(submitButton);

    // Esperar a que aparezca el estado de carga
    await waitFor(() => {
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    });
    
    // Verificar que el botón está deshabilitado
    expect(submitButton).toBeDisabled();
  });

  it('debería manejar errores de red', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<Login />);

    const usuarioInput = screen.getByLabelText(/usuario/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

    await user.type(usuarioInput, 'admin');
    await user.type(passwordInput, 'admin123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error de conexión. Por favor, intenta de nuevo.')).toBeInTheDocument();
    });
  });
});

