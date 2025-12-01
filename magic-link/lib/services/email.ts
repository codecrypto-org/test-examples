import nodemailer from 'nodemailer';

const MAILHOG_HOST = process.env.MAILHOG_HOST || 'localhost';
const MAILHOG_PORT = parseInt(process.env.MAILHOG_PORT || '1025', 10);

// Configuración de transporte para MailHog
const transporter = nodemailer.createTransport({
  host: MAILHOG_HOST,
  port: MAILHOG_PORT,
  secure: false, // MailHog no usa TLS
  ignoreTLS: true,
});

/**
 * Envía un correo con el magic link
 */
export async function sendMagicLinkEmail(
  email: string,
  magicLinkUrl: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const mailOptions = {
    from: 'noreply@magic-link.app',
    to: email,
    subject: 'Inicia sesión con Magic Link',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h1 style="color: #333; margin-top: 0;">Inicia sesión</h1>
            <p>Haz clic en el siguiente enlace para iniciar sesión:</p>
            <p style="margin: 30px 0;">
              <a href="${magicLinkUrl}" 
                 style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Iniciar sesión
              </a>
            </p>
            <p style="font-size: 12px; color: #666;">
              O copia y pega este enlace en tu navegador:<br>
              <a href="${magicLinkUrl}" style="color: #0070f3; word-break: break-all;">${magicLinkUrl}</a>
            </p>
            <p style="font-size: 12px; color: #666; margin-top: 30px;">
              Este enlace expirará en 30 minutos. Si no solicitaste este enlace, puedes ignorar este correo.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Inicia sesión

      Haz clic en el siguiente enlace para iniciar sesión:
      ${magicLinkUrl}

      Este enlace expirará en 30 minutos. Si no solicitaste este enlace, puedes ignorar este correo.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Magic link email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send magic link email');
  }
}

