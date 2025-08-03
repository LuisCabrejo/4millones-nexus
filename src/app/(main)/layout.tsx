'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import MobileHeader from '@/components/MobileHeader'
import { authService, UserProfile } from '@/lib/supabase'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession()

        if (!session?.user) {
          router.push('/auth/login')
          return
        }

        const profile = await authService.getUserProfile()
        setUserProfile(profile)
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Detector de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          {/* Logo animado */}
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <span className="text-3xl font-black text-white">N</span>
          </div>

          {/* Texto de carga */}
          <h2 className="text-2xl font-bold text-white mb-2">Inicializando NEXUS</h2>
          <p className="text-white/70 mb-6">Estableciendo conexión segura...</p>

          {/* Barra de progreso animada */}
          <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-gradient-shift"></div>
          </div>

          {/* Loading dots */}
          <div className="mt-4 flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 particles-bg">
      {/* Indicador de conexión */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 text-sm font-medium">
          ⚠️ Sin conexión a internet • Los datos pueden no estar actualizados
        </div>
      )}

      {/* Header móvil */}
      <MobileHeader userProfile={userProfile} />

      <div className="flex">
        {/* Sidebar desktop */}
        <Sidebar userProfile={userProfile} />

        {/* Contenido principal */}
        <main className="flex-1 min-h-screen">
          <div className="lg:p-8 p-4">
            {/* Container con máximo ancho */}
            <div className="max-w-7xl mx-auto">
              {/* Breadcrumb navigation (opcional) */}
              <nav className="mb-6 lg:block hidden">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-white/60">NEXUS</span>
                  <svg className="w-4 h-4 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white/80 font-medium">Centro de Comando</span>
                </div>
              </nav>

              {/* Contenido de la página */}
              <div className="animate-fadeIn">
                {children}
              </div>
            </div>
          </div>

          {/* Footer informativo */}
          <footer className="mt-auto border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                {/* Info del sistema */}
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Sistema Operativo</span>
                  </div>
                  <div className="w-px h-4 bg-white/20" />
                  <span>NEXUS v2.0</span>
                  <div className="w-px h-4 bg-white/20" />
                  <span>Última actualización: {new Date().toLocaleDateString('es-ES')}</span>
                </div>

                {/* Links de soporte */}
                <div className="flex items-center space-x-6 text-sm">
                  <button className="text-white/60 hover:text-white/80 transition-colors">
                    Centro de Ayuda
                  </button>
                  <button className="text-white/60 hover:text-white/80 transition-colors">
                    Reportar Problema
                  </button>
                  <div className="flex items-center space-x-2 text-white/50">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>&copy; 2025 4millones.com</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Notifications Toast Container */}
      <div id="toast-container" className="fixed bottom-4 right-4 z-50 space-y-2">
        {/* Los toasts se insertarán aquí dinámicamente */}
      </div>

      {/* Shortcuts de teclado (opcional) */}
      <div className="hidden">
        <div data-keyboard-shortcut="cmd+k" data-action="search" />
        <div data-keyboard-shortcut="cmd+/" data-action="help" />
      </div>
    </div>
  )
}
