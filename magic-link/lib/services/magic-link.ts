import { SignJWT, jwtVerify } from 'jose';
import { connectToDatabase } from '@/lib/db/connection';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TOKEN_EXPIRATION_MINUTES = 30;

// Convertir el secret a Uint8Array para jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

export interface MagicLinkDocument {
  _id?: ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

/**
 * Genera un magic link para el email proporcionado
 */
export async function generateMagicLink(email: string): Promise<string> {
  const db = await connectToDatabase();
  const collection = db.collection<MagicLinkDocument>('magic_links');

  // Generar token JWT
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRATION_MINUTES);

  const payload = {
    email,
    type: 'magic-link',
  };

  const secretKey = getSecretKey();
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${TOKEN_EXPIRATION_MINUTES}m`)
    .setIssuedAt()
    .sign(secretKey);

  // Guardar en la base de datos
  await collection.insertOne({
    email,
    token,
    expiresAt,
    used: false,
    createdAt: new Date(),
  });

  // Generar URL del magic link
  const magicLinkUrl = `${APP_URL}/api/auth/verify-magic-link?token=${token}`;

  return magicLinkUrl;
}

/**
 * Valida un magic link token
 */
export async function validateMagicLink(
  token: string
): Promise<{ email: string } | null> {
  try {
    // Verificar JWT
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    
    const decoded = payload as {
      email: string;
      type: string;
    };

    if (decoded.type !== 'magic-link') {
      return null;
    }

    const db = await connectToDatabase();
    const collection = db.collection<MagicLinkDocument>('magic_links');

    // Buscar el token en la base de datos
    const magicLink = await collection.findOne({
      token,
      email: decoded.email,
    });

    if (!magicLink) {
      return null;
    }

    // Verificar si ya fue usado
    if (magicLink.used) {
      return null;
    }

    // Verificar si expiró
    if (new Date() > magicLink.expiresAt) {
      return null;
    }

    // Marcar como usado
    await collection.updateOne(
      { _id: magicLink._id },
      { $set: { used: true } }
    );

    return { email: decoded.email };
  } catch (error) {
    console.error('Error validating magic link:', error);
    return null;
  }
}

/**
 * Limpia tokens expirados de la base de datos
 */
export async function cleanupExpiredTokens(): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection<MagicLinkDocument>('magic_links');

  await collection.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { used: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Eliminar tokens usados hace más de 24 horas
    ],
  });
}
