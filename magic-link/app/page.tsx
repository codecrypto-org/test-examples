'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MagicLinkForm from '@/components/MagicLinkForm';
import EmailSent from '@/components/EmailSent';

function LoginContent() {
  const searchParams = useSearchParams();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'token-missing':
          setError('Token de acceso no proporcionado');
          break;
        case 'invalid-token':
          setError('El enlace de acceso es inválido o ha expirado');
          break;
        case 'verification-failed':
          setError('Error al verificar el enlace de acceso');
          break;
        default:
          setError('Ha ocurrido un error');
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-md flex-col items-center justify-center py-16 px-8">
        <div className="w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 mb-2">
              Inicia sesión
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Ingresa tu email para recibir un enlace de acceso
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {emailSent ? (
            <EmailSent />
          ) : (
            <MagicLinkForm onSuccess={() => setEmailSent(true)} />
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Cargando...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
