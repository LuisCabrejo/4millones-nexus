'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
  gradient: string
}

const MetricCard = ({ title, value, change, trend, icon, gradient }: MetricCardProps) => {
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

export default function NexusPublicPage() {
  const [currentTime, setCurrentTime] = useState('')

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 particles-bg">
      {/* Header Público */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo NEXUS */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-black text-white">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
                  NEXUS
                </h1>
                <p className="text-white/60 text-sm -mt-1">Centro de Comando Digital</p>
              </div>
            </div>

            {/* CTA Header */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-white/80 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all transform hover:scale-105"
              >
                Activar Acceso
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

        {/* Hero Section - Demo */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4">
              👋 {currentTime}, Constructor de Activos
            </h1>
            <p className="text-xl text-white/80 mb-2">
              🎯 Bienvenido al futuro del emprendimiento inteligente
            </p>
            <p className="text-white/60 mb-8 max-w-3xl mx-auto">
              Esta es una demostración de NEXUS, el centro de comando digital más avanzado para constructores de activos.
              Regístrate para acceder a tus datos reales y herramientas completas.
            </p>

            {/* Métricas Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <MetricCard
                title="VOLUMEN DE RED"
                value="$45,230"
                change="+12%"
                trend="up"
                gradient="linear-gradient(135deg, #10B981 0%, #3B82F6 100%)"
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                }
              />
              <MetricCard
                title="INGRESOS PROYECTADOS"
                value="$2,847"
                change="+8%"
                trend="up"
                gradient="linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                }
              />
              <MetricCard
                title="SOCIOS ESTRATÉGICOS"
                value="23"
                change="+3"
                trend="up"
                gradient="linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)"
                icon={
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                }
              />
            </div>

            <div className="mt-8 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-300 text-sm font-medium">
                📊 Datos demostrativos • Regístrate para ver tus métricas reales
              </p>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <RegistrationCTA />

        {/* Herramientas Disponibles Ahora */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            ⚡ Herramientas Disponibles Ahora
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href={process.env.NEXT_PUBLIC_CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">📱 Catálogo Digital</h3>
                  <p className="text-white/70 text-sm">Comparte productos con un toque profesional</p>
                </div>
              </div>
            </a>

            <a
              href={process.env.NEXT_PUBLIC_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">🚀 Presentación de Oportunidad</h3>
                  <p className="text-white/70 text-sm">Comparte la visión empresarial completa</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Estado del Ecosistema */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white font-semibold">ECOSISTEMA NEXUS - EN CONSTRUCCIÓN</span>
          </div>
          <p className="text-white/70 text-sm mb-4">
            Los constructores de activos están obteniendo acceso temprano al futuro del emprendimiento inteligente
          </p>
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
            <span className="text-blue-300 text-sm font-medium">
              🎯 Pre-lanzamiento activo • 4 herramientas en desarrollo • Q4 2025 launch completo
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
