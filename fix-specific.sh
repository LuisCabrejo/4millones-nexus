#!/bin/bash

echo "🔧 Corrigiendo errores específicos finales"

# 1. Instalar dependencias faltantes
echo "📦 Instalando dependencias faltantes..."
npm install clsx tailwind-merge

# 2. Corregir utils.ts completamente
echo "📝 Corrigiendo utils.ts con todas las funciones..."
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUserName(fullName: string | null): string {
  return fullName || 'Usuario'
}

export function generateDistributorSlug(fullName: string | null): string {
  if (!fullName) return ''
  
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15)
}

export function formatWhatsAppNumber(whatsapp: string | null): string {
  if (!whatsapp) return ''
  
  const numbers = whatsapp.replace(/\D/g, '')
  
  if (!numbers.startsWith('57')) {
    return `57${numbers}`
  }
  
  return numbers
}

export function generateWhatsAppLink(whatsapp: string | null, message: string): string {
  if (!whatsapp) return ''
  
  const formattedNumber = formatWhatsAppNumber(whatsapp)
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`
}

// Funciones de validación
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2
}

// Funciones para herramientas
export function getInitials(name: string | null): string {
  if (!name) return 'U'
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function getDisplayName(userProfile: any): string {
  return userProfile?.full_name || userProfile?.correo_electronico || 'Usuario'
}

// Configuración de herramientas
export const TOOL_CONFIG = {
  catalog: {
    name: 'Catálogo Digital',
    description: 'Comparte nuestro catálogo completo',
    url: process.env.NEXT_PUBLIC_CATALOG_URL || 'https://catalogo.4millones.com/'
  },
  business: {
    name: 'Oportunidad de Negocio',
    description: 'Invita a conocer la oportunidad',
    url: process.env.NEXT_PUBLIC_BUSINESS_URL || 'https://oportunidad.4millones.com/'
  }
}

export function shareToolWithWhatsApp(tool: string, userProfile: any): void {
  const toolConfig = TOOL_CONFIG[tool as keyof typeof TOOL_CONFIG]
  if (!toolConfig || !userProfile?.whatsapp) return
  
  const message = `¡Hola! 👋 Te comparto ${toolConfig.name}: ${toolConfig.url}`
  const whatsappUrl = generateWhatsAppLink(userProfile.whatsapp, message)
  
  if (whatsappUrl) {
    window.open(whatsappUrl, '_blank')
  }
}

export function openTool(tool: string): void {
  const toolConfig = TOOL_CONFIG[tool as keyof typeof TOOL_CONFIG]
  if (!toolConfig) return
  
  window.open(toolConfig.url, '_blank')
}
EOF

echo "✅ utils.ts completamente corregido"

# 3. Corregir layout principal
echo "📝 Corrigiendo layout principal..."
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

echo "✅ Layout principal corregido"

# 4. Corregir nexus page
echo "📝 Corrigiendo nexus page..."
cat > src/app/\(main\)/nexus/page.tsx << 'EOF'
'use client'
import { useState, useEffect } from 'react'
import { authService, UserProfile } from '@/lib/supabase'
import { shareToolWithWhatsApp, openTool, getDisplayName, TOOL_CONFIG } from '@/lib/utils'

export default function NexusPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const session = await authService.getSession()
        if (session?.user) {
          const profile = await authService.getUserProfile(session.user.id)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          ¡Bienvenido, {getDisplayName(userProfile)}! 👋
        </h1>
        <p className="text-blue-200 text-lg">
          Tu portal de herramientas digitales está listo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-3">
            {TOOL_CONFIG.catalog.name}
          </h3>
          <p className="text-blue-200 mb-4">
            {TOOL_CONFIG.catalog.description}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => shareToolWithWhatsApp('catalog', userProfile)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📱 Compartir
            </button>
            <button
              onClick={() => openTool('catalog')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              👁️ Ver
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-3">
            {TOOL_CONFIG.business.name}
          </h3>
          <p className="text-blue-200 mb-4">
            {TOOL_CONFIG.business.description}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => shareToolWithWhatsApp('business', userProfile)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              📱 Compartir
            </button>
            <button
              onClick={() => openTool('business')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              👁️ Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
EOF

echo "✅ Nexus page corregido"

echo "🎯 CORRECCIONES ESPECÍFICAS COMPLETADAS"
echo "======================================"
echo "✅ Dependencias instaladas"
echo "✅ utils.ts con todas las funciones"
echo "✅ Layout principal corregido"
echo "✅ Nexus page corregido"
