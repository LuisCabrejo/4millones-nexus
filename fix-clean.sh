#!/bin/bash

echo "🧹 Limpiando errores e imports duplicados"

# 1. Limpiar y recrear MobileHeader.tsx completamente
echo "📝 Recreando MobileHeader.tsx sin conflictos..."
cat > src/components/MobileHeader.tsx << 'EOF'
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { authService, UserProfile } from '@/lib/supabase'

interface MobileHeaderProps {
  userProfile: UserProfile | null
}

export default function MobileHeader({ userProfile }: MobileHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)
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

  const handleLogout = async () => {
    await authService.signOut()
    setShowDropdown(false)
  }

  return (
    <header className="lg:hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-white">4M</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Portal 4 Millones
          </h1>
        </div>

        {userProfile ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {userProfile?.full_name?.charAt(0)?.toUpperCase() || userProfile?.email?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>
              <span className="text-sm font-medium">{userProfile.full_name || userProfile.correo_electronico}</span>
              <svg
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  Mi Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              href="/auth/login"
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
            >
              Registro
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
EOF

# 2. Limpiar y recrear layout principal
echo "📝 Recreando layout principal sin imports duplicados..."
cat > src/app/\(main\)/layout.tsx << 'EOF'
'use client'
import { useState, useEffect } from 'react'
import { authService, UserProfile } from '@/lib/supabase'
import Sidebar from '@/components/Sidebar'
import MobileHeader from '@/components/MobileHeader'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const session = await authService.getSession()
        if (session?.user) {
          const profile = await authService.getUserProfile(session.user.id)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Sidebar userProfile={userProfile} />
      <MobileHeader userProfile={userProfile} />

      <div className="lg:pl-64">
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
EOF

echo "✅ Archivos limpiados y recreados sin conflictos"
echo "🎯 Verificando resultado final..."

