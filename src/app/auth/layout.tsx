// src/app/auth/layout.tsx - Arreglar viewport warnings
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Acceso NEXUS - 4 Millones',
  description: 'Centro de Comando Digital para Constructores de Activos',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}
