'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Schema de validación con Zod
const loginSchema = z.object({
  usuario: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setError(null);
      } else {
        setError(result.message || 'Error al iniciar sesión');
        setSuccess(false);
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta de nuevo.');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Iniciar Sesión</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="usuario" style={{ display: 'block', marginBottom: '5px' }}>
            Usuario:
          </label>
          <input
            id="usuario"
            type="text"
            {...register('usuario')}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.usuario ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
            aria-invalid={errors.usuario ? 'true' : 'false'}
          />
          {errors.usuario && (
            <span style={{ color: 'red', fontSize: '14px' }} role="alert">
              {errors.usuario.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Contraseña:
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            style={{
              width: '100%',
              padding: '8px',
              border: errors.password ? '1px solid red' : '1px solid #ccc',
              borderRadius: '4px',
            }}
            aria-invalid={errors.password ? 'true' : 'false'}
          />
          {errors.password && (
            <span style={{ color: 'red', fontSize: '14px' }} role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px', 
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '4px'
          }} role="alert">
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            color: 'green', 
            marginBottom: '15px', 
            padding: '10px',
            backgroundColor: '#e6ffe6',
            borderRadius: '4px'
          }} role="alert">
            ¡Inicio de sesión exitoso!
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

