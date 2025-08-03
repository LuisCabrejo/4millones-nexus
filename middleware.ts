// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verificar sesión
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // RUTAS PÚBLICAS - No requieren autenticación
  const publicRoutes = [
    '/',
    '/nexus',  // NEXUS público para efecto WOW
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/api/auth/callback'
  ]

  // RUTAS PROTEGIDAS - Requieren autenticación
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/tools',
    '/analytics',
    '/academy'
  ]

  // Si está en ruta protegida y NO tiene sesión -> redirect a login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Si está en rutas de auth y YA tiene sesión -> redirect a nexus
  if (pathname.startsWith('/auth/') && session) {
    // Excepto reset-password que necesita completar el flujo
    if (!pathname.includes('reset-password')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/nexus'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
