'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { authService, UserProfile } from '@/lib/supabase'

interface MobileHeaderProps {
  userProfile: UserProfile | null
}

export default function MobileHeader({ userProfile }: MobileHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de que quieres desconectar tu sesión?')) {
      await authService.signOut()
      setShowDropdown(false)
    }
  }

  // ✅ NUEVA FUNCIÓN: Compartir vía WhatsApp con mensajes estratégicos
  const shareViaWhatsApp = (type: 'catalog' | 'business') => {
    const catalogUrl = userProfile
      ? `https://catalogo.4millones.com?socio=${userProfile.id}`
      : 'https://catalogo.4millones.com'

    const businessUrl = userProfile
      ? `https://oportunidad.4millones.com?socio=${userProfile.id}`
      : 'https://oportunidad.4millones.com'

    const whatsappNumber = userProfile?.whatsapp || '310 2066593'

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

  const displayName = userProfile?.full_name || userProfile?.correo_electronico?.split('@')[0] || 'Constructor'

  return (
    <header className={`lg:hidden sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
        : 'bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900'
    }`}>
      <div className="flex items-center justify-between p-4">
        {/* Logo y Branding NEXUS */}
        <Link href="/nexus" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-lg font-black text-white">N</span>
            </div>
            {/* Indicator dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-black bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
              NEXUS
            </h1>
            <span className="text-xs text-white/60 font-medium -mt-1">Centro de Comando</span>
          </div>
        </Link>

        {/* Usuario autenticado */}
        {userProfile ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-2 transition-all duration-300 group"
            >
              {/* Avatar del Constructor */}
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-sm font-bold text-white">
                  {userProfile?.full_name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>

              {/* Info del usuario */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-xs text-green-300 font-medium">Constructor Activo</span>
              </div>

              {/* Chevron */}
              <svg
                className={`w-4 h-4 text-white/70 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50 animate-slideDown">
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
                      <div className="text-xs text-white/60 truncate">{userProfile.correo_electronico}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs text-green-300 font-medium">Estado: Activo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navegación */}
                <div className="py-2">
                  <Link
                    href="/nexus"
                    className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="p-2 bg-cyan-500/20 rounded-lg mr-3 group-hover:bg-cyan-500/30 transition-colors">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Centro de Comando</div>
                      <div className="text-xs text-white/50">Dashboard Principal</div>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-colors group"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="p-2 bg-blue-500/20 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Centro de Configuración</div>
                      <div className="text-xs text-white/50">Datos Personales</div>
                    </div>
                  </Link>
                </div>

                {/* ✅ HERRAMIENTAS ACTIVAS ARREGLADAS */}
                <div className="border-t border-white/10 py-2">
                  <div className="px-4 py-2">
                    <span className="text-xs text-white/50 font-semibold uppercase tracking-wide">Herramientas Activas</span>
                  </div>

                  {/* ✅ CATÁLOGO DIGITAL - Botones funcionales */}
                  <div className="px-4 py-2">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Catálogo Digital</div>
                          <div className="text-xs text-white/50">Compartir Productos</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`https://catalogo.4millones.com${userProfile?.id ? `?socio=${userProfile.id}` : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          👀 Ver Catálogo
                        </a>
                        <button
                          onClick={() => {
                            shareViaWhatsApp('catalog')
                            setShowDropdown(false)
                          }}
                          className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                        >
                          📱 Compartir
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ✅ OPORTUNIDAD DE NEGOCIO - Botones funcionales */}
                  <div className="px-4 py-2">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">Oportunidad de Negocio</div>
                          <div className="text-xs text-white/50">Presentar Visión</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`https://oportunidad.4millones.com${userProfile?.id ? `?socio=${userProfile.id}` : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          👀 Ver Oportunidad
                        </a>
                        <button
                          onClick={() => {
                            shareViaWhatsApp('business')
                            setShowDropdown(false)
                          }}
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-center py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                        >
                          📱 Compartir
                        </button>
                      </div>
                    </div>
                  </div>
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
                    <div className="text-sm font-medium">Desconectar Sesión</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Usuario no autenticado */
          <div className="flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
            >
              Activar Acceso
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
