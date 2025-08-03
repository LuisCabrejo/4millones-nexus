'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService, type UserProfile } from '@/lib/supabase'
import { ArrowLeft, Save, User, Mail, Phone, Link, Loader2 } from 'lucide-react'

interface ValidationState {
  isValid: boolean
  message: string
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    whatsapp: '',
    affiliate_link: ''
  })

  // Validation states
  const [validations, setValidations] = useState({
    full_name: { isValid: true, message: '' },
    whatsapp: { isValid: true, message: '' },
    affiliate_link: { isValid: true, message: '' }
  })

  // Utilidades de validación (basadas en el código de producción)
  const validateName = (name: string): boolean => {
    return name.trim().length >= 2
  }

  const validateWhatsApp = (phone: string): boolean => {
    if (!phone.trim()) return true // Opcional
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone.trim())
  }

  const validateURL = (url: string): boolean => {
    if (!url.trim()) return true // Opcional
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const formatWhatsApp = (phone: string): string => {
    if (!phone) return ''
    // Limpiar y formatear el número
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('57')) {
      return `+${cleaned}`
    } else if (cleaned.startsWith('3')) {
      return `+57${cleaned}`
    }
    return phone
  }

  // Cargar perfil del usuario
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const profile = await authService.getUserProfile()

        if (!profile) {
          router.push('/auth/login')
          return
        }

        setUserProfile(profile)
        setFormData({
          full_name: profile.full_name || '',
          whatsapp: profile.whatsapp || '',
          affiliate_link: (profile as any).affiliate_link || ''
        })
      } catch (error) {
        console.error('Error al cargar perfil:', error)
        setMessage({ text: 'Error al cargar el perfil', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [router])

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Validación en tiempo real
    let validation: ValidationState = { isValid: true, message: '' }

    switch (field) {
      case 'full_name':
        if (value.length > 0 && !validateName(value)) {
          validation = { isValid: false, message: 'El nombre debe tener al menos 2 caracteres' }
        } else if (value.length > 0) {
          validation = { isValid: true, message: '✓ Nombre válido' }
        }
        break

      case 'whatsapp':
        if (value.length > 0 && !validateWhatsApp(value)) {
          validation = { isValid: false, message: 'Formato inválido (ej: +57 300 123 4567)' }
        } else if (value.length > 0) {
          validation = { isValid: true, message: '✓ Número válido' }
        }
        break

      case 'affiliate_link':
        if (value.length > 0 && !validateURL(value)) {
          validation = { isValid: false, message: 'URL inválida (ej: https://tu-enlace-gano.com)' }
        } else if (value.length > 0) {
          validation = { isValid: true, message: '✓ URL válida' }
        }
        break
    }

    setValidations(prev => ({
      ...prev,
      [field]: validation
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos los campos
    const isNameValid = validateName(formData.full_name)
    const isWhatsAppValid = validateWhatsApp(formData.whatsapp)
    const isAffiliateValid = validateURL(formData.affiliate_link)

    if (!isNameValid) {
      setMessage({ text: 'Por favor, ingresa un nombre válido', type: 'error' })
      return
    }

    if (!isWhatsAppValid) {
      setMessage({ text: 'Por favor, ingresa un número de WhatsApp válido', type: 'error' })
      return
    }

    if (!isAffiliateValid) {
      setMessage({ text: 'Por favor, ingresa una URL válida para tu enlace de afiliación', type: 'error' })
      return
    }

    setIsSaving(true)
    setMessage(null)

    try {
      await authService.updateProfile({
        full_name: formData.full_name.trim(),
        whatsapp: formatWhatsApp(formData.whatsapp.trim()),
        affiliate_link: formData.affiliate_link.trim()
      })

      setMessage({ text: '✅ Perfil actualizado exitosamente', type: 'success' })

      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        router.push('/profile')
      }, 1500)

    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      setMessage({
        text: 'Error al actualizar el perfil. Inténtalo de nuevo.',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 text-lg">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header con navegación */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/profile')}
            className="inline-flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group mb-4"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm">NEXUS</span>
            <span className="text-blue-400">|</span>
            <span className="text-sm">MI LABORATORIO PERSONAL</span>
          </button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Actualizar Datos
            </h1>
            <p className="text-gray-400 text-lg">
              Modifica la información de tu reino digital
            </p>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg backdrop-blur-xl border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulario principal */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200 text-white placeholder-gray-400"
                placeholder="Tu nombre completo"
                required
              />
              {validations.full_name.message && (
                <p className={`text-sm ${validations.full_name.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {validations.full_name.message}
                </p>
              )}
            </div>

            {/* Email (solo lectura) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={userProfile?.email || ''}
                className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-lg text-gray-400 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500">
                El email no se puede modificar por seguridad
              </p>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Número de WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200 text-white placeholder-gray-400"
                placeholder="+57 300 123 4567"
              />
              {validations.whatsapp.message && (
                <p className={`text-sm ${validations.whatsapp.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {validations.whatsapp.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Este número se usará para que los clientes te contacten directamente
              </p>
            </div>

            {/* Enlace de Afiliación */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Link className="w-4 h-4 inline mr-2" />
                Enlace de Afiliación de Gano Excel
              </label>
              <input
                type="url"
                value={formData.affiliate_link}
                onChange={(e) => handleInputChange('affiliate_link', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200 text-white placeholder-gray-400"
                placeholder="https://tu-enlace-gano.com"
              />
              {validations.affiliate_link.message && (
                <p className={`text-sm ${validations.affiliate_link.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {validations.affiliate_link.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Tu enlace personalizado de Gano Excel para referencias
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-200 border border-white/10 hover:border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Laboratorio
              </button>
            </div>
          </form>
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Los cambios se aplicarán inmediatamente a tu centro de comando NEXUS
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(120deg); }
          66% { transform: translateY(30px) rotate(240deg); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
