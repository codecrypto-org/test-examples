import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Test Next.js Login',
  description: 'Login form with tests',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
