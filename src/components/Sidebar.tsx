'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService, UserProfile } from '../lib/supabase'
import { formatUserName } from '../lib/utils'

interface SidebarProps {
  userProfile: UserProfile | null
}

// ✅ NUEVA FUNCIÓN: Crear slug amigable para URLs
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

export default function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Función para logout
  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres desconectar tu sesión?')) {
      setLoading(true)
      try {
        await authService.signOut()
        router.push('/auth/login')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  // ✅ FUNCIÓN CORREGIDA: URLs con distribuidor y slugs amigables
  const shareViaWhatsApp = (type: 'catalog' | 'business') => {
    if (!userProfile) return

    let message = ''
    let url = ''
    const whatsappNumber = userProfile.whatsapp || '3102066593'

    // URLs personalizadas para usuario registrado con slug amigable
    const userSlug = createSlug(userProfile.full_name || 'socio')
    url = type === 'catalog'
      ? `https://catalogo.4millones.com/?distribuidor=${userSlug}`
      : `https://oportunidad.4millones.com/?distribuidor=${userSlug}`

    // Mensajes estratégicos acordados
    if (type === 'catalog') {
      message = `🌿 *Catálogo Premium Gano Excel*

Experimenta productos únicos con Ganoderma Lucidum de las 6 variedades más potentes del mundo.

Descubre el bienestar auténtico:
${url}`
    } else {
      message = `🏗️ *Arquitectura Empresarial 4M*

El sistema que transforma el consumo diario en un activo empresarial heredable.

Conoce la plataforma:
${url}`
    }

    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  // ✅ FUNCIÓN NUEVA: URLs directas para botones "Ver"
  const getDirectUrl = (type: 'catalog' | 'business') => {
    if (!userProfile) return ''

    // Usuario registrado - slug amigable
    const userSlug = createSlug(userProfile.full_name || 'socio')
    return type === 'catalog'
      ? `https://catalogo.4millones.com/?distribuidor=${userSlug}`
      : `https://oportunidad.4millones.com/?distribuidor=${userSlug}`
  }

  if (!userProfile) {
    return null // No mostrar sidebar si no hay usuario autenticado
  }

  const displayName = formatUserName(userProfile.full_name || '') || 'Constructor'

  return (
    <aside className="hidden md:flex w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white flex-col relative overflow-hidden">
      {/* Efectos de fondo mejorados */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradiente de profundidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900/30" />

        {/* Partículas flotantes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${(i + 1) * 8}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${Math.random() * 3 + 4}s`
            }}
          />
        ))}

        {/* Líneas de circuito */}
        <div className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        <div className="absolute bottom-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      </div>

      {/* Línea decorativa derecha con efecto tech */}
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />

      <div className="relative z-10 flex flex-col h-full p-8">
        {/* Header del sidebar - NEXUS Branding */}
        <div className="text-center mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group relative overflow-hidden">
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <div className="relative z-10">
              {/* Logo NEXUS */}
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg font-black text-white">N</span>
              </div>

              <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-cyan-200 transition-all duration-300">
                NEXUS
              </h2>
              <p className="text-white/80 text-sm font-medium">
                Centro de Comando Digital
              </p>
              <div className="mt-2 text-xs text-cyan-300/80 font-mono">
                v2.0 • Ecosystem Active
              </div>
            </div>
          </div>
        </div>

        {/* Información del Constructor de Activos */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-5 mb-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 relative overflow-hidden group">
          {/* Efecto de profundidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            {/* Avatar del usuario */}
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl font-bold text-white">
                {userProfile?.full_name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>

            <div className="mb-1">
              <span className="text-white/90 text-sm uppercase tracking-wide font-semibold">Constructor de Activos</span>
            </div>
            <div className="text-white font-bold text-lg mb-1">{displayName}</div>
            <div className="text-white/60 text-sm mb-4 font-mono">{userProfile.correo_electronico}</div>

            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs font-semibold">ACTIVO</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto min-w-[140px] group/btn"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Desconectando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Desconectar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-grow">
          <div className="space-y-3">
            {/* Centro de Comando */}
            <Link
              href="/nexus"
              className={`flex items-center px-5 py-4 rounded-xl font-semibold transition-all duration-300 group relative overflow-hidden ${
                pathname === '/nexus'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/20'
                  : 'text-white/80 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-purple-500/10 hover:text-white hover:border hover:border-cyan-400/20'
              }`}
            >
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

              <div className={`p-2 rounded-lg mr-4 transition-all duration-300 ${
                pathname === '/nexus'
                  ? 'bg-cyan-500/30'
                  : 'bg-white/10 group-hover:bg-cyan-500/20'
              }`}>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>

              <div className="flex-1">
                <span className="block text-sm">Centro de Comando</span>
                <span className="block text-xs text-white/50">Dashboard Principal</span>
              </div>

              {pathname === '/nexus' && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse ml-2" />
              )}
            </Link>

            {/* Mi Perfil */}
            <Link
              href="/profile"
              className={`flex items-center px-5 py-4 rounded-xl font-semibold transition-all duration-300 group relative overflow-hidden ${
                pathname === '/profile'
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg shadow-blue-500/20'
                  : 'text-white/80 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-white hover:border hover:border-blue-400/20'
              }`}
            >
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />

              <div className={`p-2 rounded-lg mr-4 transition-all duration-300 ${
                pathname === '/profile'
                  ? 'bg-blue-500/30'
                  : 'bg-white/10 group-hover:bg-blue-500/20'
              }`}>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>

              <div className="flex-1">
                <span className="block text-sm">Centro de Configuración</span>
                <span className="block text-xs text-white/50">Datos Personales</span>
              </div>

              {pathname === '/profile' && (
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse ml-2" />
              )}
            </Link>

            {/* Arsenal en Desarrollo */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4 px-5 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Arsenal en Desarrollo
              </p>

              <div className="space-y-2">
                {/* Herramientas futuras */}
                {[
                  { name: "Generador de Mensajes IA", status: "Alpha Testing", icon: "💬" },
                  { name: "Simulador de Ingresos", status: "Beta Q4", icon: "📊" },
                  { name: "Academia de Riqueza", status: "Próximamente", icon: "🎓" },
                  { name: "Analytics de Red", status: "En Desarrollo", icon: "📈" }
                ].map((tool, index) => (
                  <div key={index} className="flex items-center px-5 py-3 rounded-xl text-white/40 relative group">
                    <div className="p-2 bg-white/5 rounded-lg mr-4">
                      <span className="text-sm">{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm">{tool.name}</span>
                      <span className="block text-xs text-white/30">{tool.status}</span>
                    </div>
                    <div className="w-2 h-2 bg-yellow-400/50 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ HERRAMIENTAS ACTIVAS - CORREGIDAS CON NUEVAS URLs */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-4 px-5 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                Herramientas Activas
              </p>

              <div className="space-y-3">
                {/* ✅ CATÁLOGO PREMIUM - CON BOTONES FUNCIONALES CORREGIDOS */}
                <div className="px-5">
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm text-white font-medium">Catálogo Premium</span>
                        <span className="block text-xs text-white/50">Bienestar auténtico</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={getDirectUrl('catalog')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        👀 Ver Catálogo
                      </a>
                      <button
                        onClick={() => shareViaWhatsApp('catalog')}
                        className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        📱 Compartir
                      </button>
                    </div>
                  </div>
                </div>

                {/* ✅ ARQUITECTURA EMPRESARIAL - CON BOTONES FUNCIONALES CORREGIDOS */}
                <div className="px-5">
                  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm text-white font-medium">Arquitectura Empresarial</span>
                        <span className="block text-xs text-white/50">Construir activos</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={getDirectUrl('business')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        👀 Ver Plataforma
                      </a>
                      <button
                        onClick={() => shareViaWhatsApp('business')}
                        className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                      >
                        📱 Compartir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer con branding */}
        <div className="mt-auto pt-8 border-t border-white/10 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-white/60 text-sm font-medium">Ecosistema 4M</span>
            </div>
          </div>
          <div className="text-white/60 text-sm font-semibold">
            &copy; 2025 • 4millones.com
          </div>
          <div className="text-white/40 text-xs mt-1 font-mono">
            NEXUS v2.0 • Constructor Edition
          </div>
        </div>
      </div>
    </aside>
  )
}
