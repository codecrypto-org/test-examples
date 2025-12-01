'use client';

export default function EmailSent() {
  return (
    <div className="w-full max-w-md space-y-4">
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900 dark:border-green-700">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
              Email enviado
            </h3>
            <div className="mt-2 text-sm text-green-700 dark:text-green-300">
              <p>
                Hemos enviado un magic link a tu correo electrónico. Por favor,
                revisa tu bandeja de entrada y haz clic en el enlace para
                iniciar sesión.
              </p>
              <p className="mt-2">
                El enlace expirará en 30 minutos. Si no lo recibes, verifica tu
                carpeta de spam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

