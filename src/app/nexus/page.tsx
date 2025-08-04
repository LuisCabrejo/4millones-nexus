'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { authService, UserProfile } from '@/lib/supabase'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  gradient: string
  isDemo?: boolean
}

const MetricCard = ({ title, value, change, trend, icon, gradient, isDemo = false }: MetricCardProps) => {
  const [animatedValue, setAnimatedValue] = useState('0')

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 500)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ background: gradient }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-white/10 rounded-lg">
            {icon}
          </div>
          <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/20 text-green-300' :
            trend === 'down' ? 'bg-red-500/20 text-red-300' :
            'bg-blue-500/20 text-blue-300'
          }`}>
            {trend === 'up' && '↗'} {trend === 'down' && '↙'} {change}
          </div>
        </div>

        <div className="text-2xl font-bold text-white mb-1 transition-all duration-500">
          {animatedValue}
        </div>

        <div className="text-white/70 text-sm font-medium">
          {title}
        </div>

        {isDemo && (
          <div className="mt-2 text-yellow-300 text-xs font-medium">
            📊 Datos demo
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ NUEVA FUNCIÓN: Compartir vía WhatsApp para usuarios NO registrados
const shareViaWhatsAppPublic = (type: 'catalog' | 'business') => {
  const catalogUrl = 'https://catalogo.4millones.com'
  const businessUrl = 'https://oportunidad.4millones.com'
  const defaultWhatsApp = '57310 2066593' // Número por defecto

  const messages = {
    catalog: `🌿 *Catálogo Premium Gano Excel*
Experimenta productos únicos con Ganoderma Lucidum de las 6 variedades más potentes del mundo.
Descubre el bienestar auténtico:
${catalogUrl}`,

    business: `🏗️ *Arquitectura Empresarial 4M*
El sistema que transforma el consumo diario en un activo empresarial heredable.
Conoce la plataforma:
${businessUrl}`
  }

  const whatsappUrl = `https://wa.me/${defaultWhatsApp}?text=${encodeURIComponent(messages[type])}`
  window.open(whatsappUrl, '_blank')
}

// Componente para navegación de usuario NO autenticado en móvil
const PublicMobileMenu = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50">
      {/* Header del dropdown */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">Centro de Comando NEXUS</div>
            <div className="text-xs text-white/60">Ecosistema Digital Premium</div>
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-xs text-yellow-300 font-medium">Pre-lanzamiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acceso rápido */}
      <div className="py-2">
        <Link
          href="/auth/login"
          className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
          onClick={onClose}
        >
          <div className="p-2 bg-cyan-500/20 rounded-lg mr-3 group-hover:bg-cyan-500/30 transition-colors">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.293 2.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L12.586 10H5a1 1 0 110-2h7.586L10.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Iniciar Sesión</div>
            <div className="text-xs text-white/50">Accede a tu cuenta</div>
          </div>
        </Link>

        <Link
          href="/auth/register"
          className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
          onClick={onClose}
        >
          <div className="p-2 bg-purple-500/20 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Crear Cuenta</div>
            <div className="text-xs text-white/50">Únete al ecosistema</div>
          </div>
        </Link>
      </div>

      {/* ✅ HERRAMIENTAS DISPONIBLES CON BOTONES FUNCIONALES */}
      <div className="border-t border-white/10 py-2">
        <div className="px-4 py-2">
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wide">Herramientas Disponibles</span>
        </div>

        {/* ✅ CATÁLOGO DIGITAL CON BOTONES */}
        <div className="px-4 py-2">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">📱 Catálogo Digital</div>
                <div className="text-xs text-white/50">Productos premium</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href="https://catalogo.4millones.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                onClick={onClose}
              >
                👀 Ver Catálogo
              </a>
              <button
                onClick={() => {
                  shareViaWhatsAppPublic('catalog')
                  onClose()
                }}
                className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
              >
                📱 Compartir
              </button>
            </div>
          </div>
        </div>

        {/* ✅ OPORTUNIDAD DE NEGOCIO CON BOTONES */}
        <div className="px-4 py-2">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">🚀 Oportunidad de Negocio</div>
                <div className="text-xs text-white/50">Visión empresarial</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href="https://oportunidad.4millones.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                onClick={onClose}
              >
                👀 Ver Oportunidad
              </a>
              <button
                onClick={() => {
                  shareViaWhatsAppPublic('business')
                  onClose()
                }}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
              >
                📱 Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Próximamente */}
      <div className="border-t border-white/10 py-2">
        <div className="px-4 py-2">
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wide">Próximamente Q4 2025</span>
        </div>

        {[
          { name: "💬 Generador de Mensajes IA", desc: "Conversaciones inteligentes" },
          { name: "📊 Simulador de Ingresos", desc: "Proyecciones financieras" },
          { name: "🎓 Academia de Riqueza", desc: "Formación premium" },
          { name: "📈 Analytics de Red", desc: "Inteligencia de datos" }
        ].map((tool, index) => (
          <div key={index} className="flex items-center px-4 py-2 text-white/50">
            <div className="p-2 bg-white/5 rounded-lg mr-3">
              <div className="w-4 h-4 bg-white/10 rounded" />
            </div>
            <div className="flex-1">
              <div className="text-sm">{tool.name}</div>
              <div className="text-xs text-white/30">{tool.desc}</div>
            </div>
            <div className="w-2 h-2 bg-yellow-400/50 rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="border-t border-white/10 py-3 px-4">
        <Link
          href="/auth/register"
          className="block w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
          onClick={onClose}
        >
          🚀 Activar Mi Acceso NEXUS
        </Link>
      </div>
    </div>
  )
}

// ✅ MEJORADO: Componente para navegación de usuario autenticado en móvil
const AuthenticatedMobileMenu = ({ userProfile, onClose }: { userProfile: UserProfile, onClose: () => void }) => {
  const handleLogout = async () => {
    await authService.signOut()
    onClose()
    window.location.reload()
  }

  const displayName = userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Constructor'

  // ✅ FUNCIÓN COMPARTIR WHATSAPP ARREGLADA PARA USUARIOS REGISTRADOS
  const shareViaWhatsApp = (type: 'catalog' | 'business') => {
    const catalogUrl = `https://catalogo.4millones.com?socio=${userProfile.id}`
    const businessUrl = `https://oportunidad.4millones.com?socio=${userProfile.id}`
    const whatsappNumber = userProfile.whatsapp || '310 2066593'

    const messages = {
      catalog: `🌿 *Catálogo Premium Gano Excel*
Experimenta productos únicos con Ganoderma Lucidum de las 6 variedades más potentes del mundo.
Descubre el bienestar auténtico:
${catalogUrl}`,

      business: `🏗️ *Arquitectura Empresarial 4M*
El sistema que transforma el consumo diario en un activo empresarial heredable.
Conoce la plataforma:
${businessUrl}`
    }

    const cleanPhone = whatsappNumber.replace(/[^\d]/g, '')
    const finalPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`

    const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(messages[type])}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-72 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50">
      {/* Header del dropdown */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-white">
              {userProfile?.full_name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'C'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{displayName}</div>
            <div className="text-xs text-white/60 truncate">{userProfile?.email}</div>
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300 font-medium">Constructor Activo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="py-2">
        <Link
          href="/dashboard"
          className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
          onClick={onClose}
        >
          <div className="p-2 bg-cyan-500/20 rounded-lg mr-3 group-hover:bg-cyan-500/30 transition-colors">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Centro de Comando</div>
            <div className="text-xs text-white/50">Dashboard completo</div>
          </div>
        </Link>

        <Link
          href="/profile"
          className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
          onClick={onClose}
        >
          <div className="p-2 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium">Mi Perfil</div>
            <div className="text-xs text-white/50">Configuración personal</div>
          </div>
        </Link>
      </div>

      {/* ✅ HERRAMIENTAS ACTIVAS CON BOTONES FUNCIONALES */}
      <div className="border-t border-white/10 py-2">
        <div className="px-4 py-2">
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wide">Herramientas Activas</span>
        </div>

        {/* Catálogo Digital con botones FUNCIONALES */}
        <div className="px-4 py-2">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">📱 Catálogo Digital</div>
                  <div className="text-xs text-white/50">Productos premium</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href={`https://catalogo.4millones.com?socio=${userProfile.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                onClick={onClose}
              >
                👀 Ver Catálogo
              </a>
              <button
                onClick={() => {
                  shareViaWhatsApp('catalog')
                  onClose()
                }}
                className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
              >
                📱 Compartir
              </button>
            </div>
          </div>
        </div>

        {/* ✅ PRESENTACIÓN DE OPORTUNIDAD ARREGLADA */}
        <div className="px-4 py-2">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">🚀 Oportunidad de Negocio</div>
                  <div className="text-xs text-white/50">Visión empresarial</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <a
                href={`https://oportunidad.4millones.com?socio=${userProfile.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                onClick={onClose}
              >
                👀 Ver Oportunidad
              </a>
              <button
                onClick={() => {
                  shareViaWhatsApp('business')
                  onClose()
                }}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
              >
                📱 Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ RESTAURADO: Próximamente Q4 2025 para usuarios autenticados */}
      <div className="border-t border-white/10 py-2">
        <div className="px-4 py-2">
          <span className="text-xs text-white/50 font-semibold uppercase tracking-wide">Próximamente Q4 2025</span>
        </div>

        {[
          { name: "💬 Generador de Mensajes IA", desc: "Conversaciones inteligentes" },
          { name: "📊 Simulador de Ingresos", desc: "Proyecciones financieras" },
          { name: "🎓 Academia de Riqueza", desc: "Formación premium" },
          { name: "📈 Analytics de Red", desc: "Inteligencia de datos" }
        ].map((tool, index) => (
          <div key={index} className="flex items-center px-4 py-2 text-white/50">
            <div className="p-2 bg-white/5 rounded-lg mr-3">
              <div className="w-4 h-4 bg-white/10 rounded" />
            </div>
            <div className="flex-1">
              <div className="text-sm">{tool.name}</div>
              <div className="text-xs text-white/30">{tool.desc}</div>
            </div>
            <div className="w-2 h-2 bg-yellow-400/50 rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 py-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors group"
        >
          <div className="p-2 bg-red-500/20 rounded-lg mr-3 group-hover:bg-red-500/30 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm font-medium">Cerrar Sesión</div>
        </button>
      </div>
    </div>
  )
}

const RegistrationCTA = () => {
  return (
    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-cyan-300/20 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
        <span className="text-2xl font-black text-white">N</span>
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">
        ¿Listo para construir tu activo?
      </h2>
      <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
        Únete a los constructores de activos que están transformando su futuro financiero con las herramientas más avanzadas de la industria.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/auth/register"
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
        >
          🚀 Activar Mi Acceso NEXUS
        </Link>
        <Link
          href="/auth/login"
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105"
        >
          Ya tengo cuenta
        </Link>
      </div>

      <div className="mt-6 text-white/60 text-sm">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Acceso inmediato</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <span>Sin compromisos</span>
          <div className="w-px h-4 bg-white/20" />
          <span>Herramientas profesionales</span>
        </div>
      </div>
    </div>
  )
}

export default function NexusIntelligentPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authService.getSession()
        if (session?.user) {
          const profile = await authService.getUserProfile()
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-2xl font-black text-white">N</span>
          </div>
          <p className="text-white/70 text-lg">Inicializando NEXUS...</p>
        </div>
      </div>
    )
  }

  const displayName = userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Constructor de Activos'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 particles-bg">

      {/* Header Inteligente - Cambia según autenticación */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo NEXUS */}
            <div className="flex items-center space-x-3">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-lg lg:text-xl font-black text-white">N</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-black bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
                  NEXUS
                </h1>
                <p className="text-white/60 text-xs lg:text-sm -mt-1">Centro de Comando Digital</p>
              </div>
            </div>

            {/* Navegación según estado de autenticación */}
            {userProfile ? (
              /* Usuario Autenticado */
              <div className="flex items-center space-x-4">
                {/* Desktop - Enlaces directos + Cerrar Sesión */}
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    href="/dashboard"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-white/80 hover:text-white transition-colors font-medium"
                  >
                    Perfil
                  </Link>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="flex items-center space-x-2 text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">{displayName}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await authService.signOut()
                      window.location.reload()
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors font-medium text-sm"
                  >
                    Cerrar Sesión
                  </button>
                </div>

                {/* Mobile - Hamburguesa */}
                <div className="lg:hidden relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {userProfile?.full_name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMobileMenu && (
                    <AuthenticatedMobileMenu
                      userProfile={userProfile}
                      onClose={() => setShowMobileMenu(false)}
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Usuario No Autenticado */
              <div className="flex items-center space-x-3 lg:space-x-4">
                {/* Desktop - Enlaces tradicionales */}
                <div className="hidden lg:flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-white/80 hover:text-white transition-colors text-sm lg:text-base"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-4 lg:px-6 py-2 rounded-lg transition-all transform hover:scale-105 text-sm lg:text-base"
                  >
                    Activar Acceso
                  </Link>
                </div>

                {/* Mobile - Hamburguesa para usuarios NO autenticados */}
                <div className="lg:hidden relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-white">N</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showMobileMenu && (
                    <PublicMobileMenu onClose={() => setShowMobileMenu(false)} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* Hero Section - Personalizado o Demo */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/20 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

          <div className="relative z-10">
            {userProfile ? (
              /* Usuario Autenticado - Contenido Personalizado */
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4">
                  👋 {currentTime}, {displayName}
                </h1>
                <p className="text-lg lg:text-xl text-white/80 mb-2">
                  🎯 Tu Reino Digital está creciendo
                </p>
                <p className="text-white/60 mb-6 lg:mb-8 max-w-3xl mx-auto text-sm lg:text-base">
                  Bienvenido de vuelta a tu centro de comando NEXUS. Aquí tienes el resumen de tu actividad empresarial.
                </p>
              </>
            ) : (
              /* Usuario No Autenticado - Demo */
              <>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4">
                  👋 {currentTime}, Constructor de Activos
                </h1>
                <p className="text-lg lg:text-xl text-white/80 mb-2">
                  🎯 Bienvenido al futuro del emprendimiento inteligente
                </p>
                <p className="text-white/60 mb-6 lg:mb-8 max-w-3xl mx-auto text-sm lg:text-base">
                  Esta es una demostración de NEXUS, el centro de comando digital más avanzado para constructores de activos.
                  Regístrate para acceder a tus datos reales y herramientas completas.
                </p>
              </>
            )}

            {/* Métricas - Reales o Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
              <MetricCard
                title="VOLUMEN DE RED"
                value={userProfile ? "$0" : "$45,230"}
                change={userProfile ? "+0%" : "+12%"}
                trend="up"
                gradient="linear-gradient(135deg, #10B981 0%, #3B82F6 100%)"
                isDemo={!userProfile}
                icon={
                  <svg className="w-5 lg:w-6 h-5 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                }
              />
              <MetricCard
                title="INGRESOS PROYECTADOS"
                value={userProfile ? "$0" : "$2,847"}
                change={userProfile ? "+0%" : "+8%"}
                trend="up"
                gradient="linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
                isDemo={!userProfile}
                icon={
                  <svg className="w-5 lg:w-6 h-5 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                }
              />
              <MetricCard
                title="SOCIOS ESTRATÉGICOS"
                value={userProfile ? "0" : "23"}
                change={userProfile ? "+0" : "+3"}
                trend="up"
                gradient="linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
                isDemo={!userProfile}
                icon={
                  <svg className="w-5 lg:w-6 h-5 lg:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                }
              />
            </div>

            {/* Mensaje específico según usuario */}
            {userProfile ? (
              <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-green-500/20 border border-green-400/30 rounded-lg">
                <p className="text-green-300 text-xs lg:text-sm font-medium">
                  ✅ Sesión activa • Datos reales en tiempo real • <Link href="/dashboard" className="underline hover:text-green-200">Ver dashboard completo</Link>
                </p>
              </div>
            ) : (
              <div className="mt-6 lg:mt-8 p-3 lg:p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                <p className="text-yellow-300 text-xs lg:text-sm font-medium">
                  📊 Datos demostrativos • Regístrate para ver tus métricas reales
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ✅ MANTENER: Arsenal de Herramientas Demo */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/20">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 text-center">
            🔧 TU ARSENAL TECNOLÓGICO
          </h2>
          <p className="text-white/70 text-center mb-6 lg:mb-8 text-sm lg:text-base">
            {userProfile ? 'Herramientas disponibles para construir tu activo' : 'Vista previa de las herramientas que transformarán tu negocio'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* ✅ MANTENER: Herramientas en desarrollo - SIEMPRE VISIBLES */}
            {[
              {
                title: "💬 Generador de Mensajes",
                description: "IA que crea conversaciones estratégicas",
                gradient: "from-blue-500 to-purple-600"
              },
              {
                title: "📊 Simulador de Ingresos",
                description: "Proyecciones financieras inteligentes",
                gradient: "from-purple-600 to-pink-500"
              },
              {
                title: "📱 Presentaciones por Niveles",
                description: "Comparte la visión estratégicamente",
                gradient: "from-green-500 to-blue-500"
              },
              {
                title: "🎯 Panel de Análisis",
                description: "Inteligencia de tu organización",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((tool, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group relative overflow-hidden opacity-75">
                <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${tool.gradient}`} />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 lg:space-x-4 mb-3">
                    <div className={`p-2 lg:p-3 bg-gradient-to-br ${tool.gradient} rounded-lg`}>
                      <div className="w-5 lg:w-6 h-5 lg:h-6 bg-white/20 rounded" />
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2 py-1 rounded-full">
                      Q4 2025
                    </span>
                  </div>

                  <h3 className="text-base lg:text-lg font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-white/70 text-sm">{tool.description}</p>

                  <div className="mt-3 lg:mt-4 flex items-center text-white/60 text-sm">
                    <span>Vista previa</span>
                    <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA o Acciones según usuario */}
        {!userProfile && <RegistrationCTA />}

        {/* ✅ HERRAMIENTAS DISPONIBLES AHORA CON BOTONES WHATSAPP */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 lg:p-8 border border-white/20">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 text-center">
            ⚡ Herramientas Disponibles Ahora
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* ✅ CATÁLOGO CON BOTONES WHATSAPP */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center space-x-3 lg:space-x-4 mb-4">
                <div className="p-2 lg:p-3 bg-green-500/20 rounded-lg">
                  <svg className="w-5 lg:w-6 h-5 lg:h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white mb-1 lg:mb-2">📱 Catálogo Digital</h3>
                  <p className="text-white/70 text-sm">Comparte productos con un toque profesional</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <a
                  href="https://catalogo.4millones.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  👀 Ver Catálogo
                </a>
                <button
                  onClick={() => shareViaWhatsAppPublic('catalog')}
                  className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  📱 Compartir
                </button>
              </div>
            </div>

            {/* ✅ OPORTUNIDAD CON BOTONES WHATSAPP */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center space-x-3 lg:space-x-4 mb-4">
                <div className="p-2 lg:p-3 bg-blue-500/20 rounded-lg">
                  <svg className="w-5 lg:w-6 h-5 lg:h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-white mb-1 lg:mb-2">🚀 Presentación de Oportunidad</h3>
                  <p className="text-white/70 text-sm">Comparte la visión empresarial completa</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <a
                  href="https://oportunidad.4millones.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  👀 Ver Oportunidad
                </a>
                <button
                  onClick={() => shareViaWhatsAppPublic('business')}
                  className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  📱 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estado del Ecosistema */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 lg:mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white font-semibold text-sm lg:text-base">ECOSISTEMA NEXUS - EN CONSTRUCCIÓN</span>
          </div>
          <p className="text-white/70 text-xs lg:text-sm mb-3 lg:mb-4">
            {userProfile ?
              'Tienes acceso exclusivo como constructor de activos al futuro del emprendimiento inteligente' :
              'Los constructores de activos están obteniendo acceso temprano al futuro del emprendimiento inteligente'
            }
          </p>
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-2 lg:p-3">
            <span className="text-blue-300 text-xs lg:text-sm font-medium">
              🎯 Pre-lanzamiento activo • 4 herramientas en desarrollo • Q4 2025 launch completo
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
// Sync env vars: Mon Aug  4 13:07:19 -05 2025
