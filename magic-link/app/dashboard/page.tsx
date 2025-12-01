import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import LogoutButton from '@/components/LogoutButton';

export default async function Dashboard() {
  const session = await getSession();

  console.log('Dashboard - Session:', session ? 'exists' : 'null');

  if (!session) {
    console.log('Dashboard - No session, redirecting to home');
    redirect('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-16 px-8">
        <div className="w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 mb-2">
              Dashboard
            </h1>
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Bienvenido, {session.email}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
              Información de sesión
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <span className="font-medium">Email:</span> {session.email}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Has iniciado sesión correctamente con magic link.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  );
}

