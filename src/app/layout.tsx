import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Portal 4 Millones - Centro de Socios Estratégicos',
  description: 'Tu centro de herramientas premium para construir tu propio activo empresarial con el respaldo de una organización líder.',
  keywords: 'portal, socios, negocio, herramientas, catálogo, gano excel',
  authors: [{ name: '4 Millones' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Portal 4 Millones - Centro de Socios Estratégicos',
    description: 'Tu centro de herramientas premium para construir tu propio activo empresarial.',
    type: 'website',
    locale: 'es_ES',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
