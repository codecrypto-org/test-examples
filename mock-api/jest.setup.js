require('@testing-library/jest-dom')

// Polyfills para APIs web de Next.js en el entorno de pruebas
// Next.js ya debería proporcionar estos, pero los agregamos por si acaso
if (typeof globalThis.Request === 'undefined') {
  try {
    const { Request, Response, Headers } = require('undici');
    globalThis.Request = Request;
    globalThis.Response = Response;
    globalThis.Headers = Headers;
  } catch (e) {
    // Si undici no está disponible, Next.js debería proporcionar estos
    console.warn('No se pudieron cargar polyfills de undici');
  }
}
