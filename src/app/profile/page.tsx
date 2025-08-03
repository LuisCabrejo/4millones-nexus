'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { authService, UserProfile } from '@/lib/supabase'

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('')
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const session = await authService.getSession()
        if (session?.user) {
          const profile = await authService.getUserProfile()
          setUserProfile(profile)
        } else {
          // Redirigir si no está autenticado
          window.location.href = '/auth/login'
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        window.location.href = '/auth/login'
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
      setCurrentTime(greeting)
    }

    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-black text-white">
              {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'C'}
            </span>
          </div>
          <p className="text-white/70 text-lg">Inicializando tu laboratorio personal...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  const displayName = userProfile.full_name || userProfile.email?.split('@')[0] || 'Constructor'

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(label)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Error copiando:', err)
    }
  }

  // Función para compartir por WhatsApp
  const shareViaWhatsApp = (title: string, url: string) => {
    const message = `🚀 *${title}*\n\n${url}\n\n*Construyamos juntos nuestro futuro empresarial* 💪\n\n- ${displayName}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // Enlaces personalizados (esto debería venir del perfil del usuario)
  const personalizedLinks = {
    catalogo: `https://catalogo.4millones.com/?distribuidor=${userProfile.email?.split('@')[0] || 'usuario'}`,
    oportunidad: `https://oportunidad.4millones.com/?distribuidor=${userProfile.email?.split('@')[0] || 'usuario'}`,
    afiliacion: `https://colombia.ganoexcel.com/membresias`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Fondo dinámico premium */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,rgba(6,182,212,0.2),transparent_50%)]" />

      {/* Partículas flotantes especiales */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Header premium */}
      <header className="relative z-10 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo y breadcrumb */}
            <div className="flex items-center space-x-4">
              <Link href="/nexus" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-black text-white">N</span>
                </div>
                <span className="text-white/60 text-sm">← NEXUS</span>
              </Link>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <h1 className="text-xl font-bold text-white">MI LABORATORIO PERSONAL</h1>
                <p className="text-white/60 text-sm">Centro de comando exclusivo</p>
              </div>
            </div>

            {/* Usuario y acciones */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm">{displayName}</span>
              </div>
              <Link
                href="/profile/edit"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                ⚙️ Actualizar Datos
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* Hero personalizado */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />

          <div className="relative z-10 text-center">
            {/* Avatar personalizado */}
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
              <span className="text-4xl font-black text-white">
                {userProfile.full_name?.charAt(0)?.toUpperCase() || userProfile.email?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent mb-4">
              👋 {currentTime}, {displayName}
            </h1>
            <p className="text-xl text-white/80 mb-2">
              🚀 Bienvenido a tu laboratorio personal NEXUS
            </p>
            <p className="text-white/60 max-w-2xl mx-auto">
              Este es tu centro de comando exclusivo donde controlas tu imperio digital.
              Aquí tienes acceso completo a tus herramientas personalizadas y enlaces únicos.
            </p>

            {/* Estado premium */}
            <div className="mt-6 inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full px-6 py-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 font-semibold">Constructor de Activos Activo</span>
            </div>
          </div>
        </div>

        {/* Enlaces Personalizados */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🔗 TUS ENLACES PERSONALIZADOS
          </h2>
          <p className="text-white/70 text-center mb-8">
            Comparte estas herramientas con tu nombre personalizado y construye tu red
          </p>

          <div className="space-y-6">
            {/* Catálogo */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">📱 Catálogo Digital</h3>
                    <p className="text-white/60 text-sm">Tu catálogo personalizado de productos premium</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 mb-4 font-mono text-sm text-white/80 break-all">
                {personalizedLinks.catalogo}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(personalizedLinks.catalogo, 'Catálogo')}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  {copiedItem === 'Catálogo' ? '✓ Copiado' : '📋 Copiar'}
                </button>
                <button
                  onClick={() => shareViaWhatsApp('Catálogo Digital 4M', personalizedLinks.catalogo)}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  📱 Compartir
                </button>
              </div>
            </div>

            {/* Modelo de Negocio */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">🚀 Modelo de Negocio</h3>
                    <p className="text-white/60 text-sm">Presenta la oportunidad empresarial completa</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 mb-4 font-mono text-sm text-white/80 break-all">
                {personalizedLinks.oportunidad}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(personalizedLinks.oportunidad, 'Oportunidad')}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  {copiedItem === 'Oportunidad' ? '✓ Copiado' : '📋 Copiar'}
                </button>
                <button
                  onClick={() => shareViaWhatsApp('Oportunidad de Negocio 4M', personalizedLinks.oportunidad)}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  📱 Compartir
                </button>
              </div>
            </div>

            {/* Enlace de Afiliación */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">🔗 Enlace de Afiliación</h3>
                    <p className="text-white/60 text-sm">Tu enlace directo para registro de nuevos socios</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 mb-4 font-mono text-sm text-white/80 break-all">
                {personalizedLinks.afiliacion}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => copyToClipboard(personalizedLinks.afiliacion, 'Afiliación')}
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  {copiedItem === 'Afiliación' ? '✓ Copiado' : '📋 Copiar'}
                </button>
                <button
                  onClick={() => shareViaWhatsApp('Únete a 4 Millones', personalizedLinks.afiliacion)}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  📱 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Arsenal Exclusivo */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            ⚡ TU ARSENAL EXCLUSIVO
          </h2>
          <p className="text-white/70 text-center mb-8">
            Herramientas avanzadas diseñadas específicamente para constructores de activos como tú
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "💬 Generador de Mensajes IA",
                description: "IA personalizada para crear conversaciones estratégicas con tu estilo único",
                gradient: "from-blue-500 to-cyan-500",
                status: "Acceso VIP Q4 2025",
                icon: "🧠"
              },
              {
                title: "📊 Simulador de Ingresos Avanzado",
                description: "Proyecciones financieras inteligentes basadas en tu red y progreso real",
                gradient: "from-purple-500 to-pink-500",
                status: "Exclusivo Constructores",
                icon: "📈"
              },
              {
                title: "🎯 Panel de Análisis Elite",
                description: "Inteligencia avanzada de tu organización con métricas en tiempo real",
                gradient: "from-green-500 to-emerald-500",
                status: "Laboratorio Personal",
                icon: "🔬"
              },
              {
                title: "🎓 Academia de Riqueza Premium",
                description: "Formación personalizada y mentoría exclusiva para tu crecimiento",
                gradient: "from-orange-500 to-red-500",
                status: "Mentor Personal",
                icon: "👨‍🎓"
              }
            ].map((tool, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${tool.gradient}`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${tool.gradient} rounded-lg text-2xl`}>
                      {tool.icon}
                    </div>
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {tool.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-white/70 text-sm">{tool.description}</p>

                  <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                    <span>Próximamente en tu laboratorio</span>
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceso Rápido */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🚀 ACCESO RÁPIDO
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/dashboard"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 group"
            >
              <div className="p-3 bg-cyan-500/20 rounded-lg mb-4 w-fit">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Centro de Comando</h3>
              <p className="text-white/70 text-sm">Dashboard con métricas en tiempo real</p>
            </Link>

            <Link
              href="/nexus"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 group"
            >
              <div className="p-3 bg-blue-500/20 rounded-lg mb-4 w-fit">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">NEXUS General</h3>
              <p className="text-white/70 text-sm">Volver al laboratorio principal</p>
            </Link>

            <Link
              href="/profile/edit"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 group"
            >
              <div className="p-3 bg-purple-500/20 rounded-lg mb-4 w-fit">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Configuración</h3>
              <p className="text-white/70 text-sm">Actualizar datos personales</p>
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}
