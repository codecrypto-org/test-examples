# Magic Link

Proyecto Next.js con TypeScript y MongoDB para autenticación mediante magic links.

## Configuración de Base de Datos

Este proyecto utiliza MongoDB con el driver nativo (sin Mongoose).

### Configuración

- **Base de datos**: `magic-link-db`
- **URI por defecto**: `mongodb://localhost:27017`

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DB_NAME=magic-link-db

# JWT Secret (cambiar en producción)
JWT_SECRET=your-secret-key-change-in-production

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MailHog Configuration (opcional, valores por defecto)
MAILHOG_HOST=localhost
MAILHOG_PORT=1025
```

## Configuración de MailHog

Este proyecto utiliza MailHog para el envío de correos en desarrollo. Asegúrate de tener MailHog instalado y ejecutándose:

```bash
# Instalar MailHog (macOS con Homebrew)
brew install mailhog

# Ejecutar MailHog
mailhog
```

MailHog estará disponible en:
- **SMTP**: `localhost:1025`
- **Web UI**: `http://localhost:8025`

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Flujo de Autenticación

1. El usuario accede a la página principal (`/`)
2. Ingresa su email en el formulario
3. El sistema genera un magic link (JWT válido por 30 minutos) y lo guarda en MongoDB
4. Se envía un correo con el magic link a través de MailHog
5. El usuario hace clic en el enlace del correo
6. El sistema valida el token y crea una sesión
7. El usuario es redirigido al dashboard (`/dashboard`)

## Estructura del Proyecto

```
magic-link/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── request-magic-link/route.ts
│   │       ├── verify-magic-link/route.ts
│   │       └── logout/route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── MagicLinkForm.tsx
│   ├── EmailSent.tsx
│   └── LogoutButton.tsx
├── lib/
│   ├── auth/
│   │   └── session.ts
│   ├── db/
│   │   └── connection.ts
│   └── services/
│       ├── email.ts
│       └── magic-link.ts
└── middleware.ts
```

## Build

```bash
npm run build
npm start
```

## Uso de la Conexión a MongoDB

```typescript
import { connectToDatabase } from '@/lib/db/connection';

// En una API route o server component
const db = await connectToDatabase();
const collection = db.collection('tu-coleccion');
```

## Notas Importantes

- Los magic links expiran después de 30 minutos
- Los tokens usados se marcan en la base de datos y no pueden reutilizarse
- La sesión del usuario dura 7 días
- En producción, asegúrate de cambiar el `JWT_SECRET` por un valor seguro
