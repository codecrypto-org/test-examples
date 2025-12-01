import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SESSION_COOKIE_NAME = 'magic-link-session';

// Convertir el secret a Uint8Array para jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    console.log('Middleware - Checking dashboard access, token exists:', !!token);

    if (!token) {
      // Redirigir a login si no hay token
      console.log('Middleware - No token, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verificar que el token sea válido usando jose (compatible con Edge Runtime)
      const secretKey = getSecretKey();
      await jwtVerify(token, secretKey);
      console.log('Middleware - Token valid, allowing access');
    } catch (error) {
      // Token inválido, redirigir a login
      console.log('Middleware - Token invalid:', error);
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
