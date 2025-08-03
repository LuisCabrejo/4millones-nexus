import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Configuración de herramientas
export const TOOL_CONFIG = {
  catalog: {
    name: 'Catálogo Premium',
    url: process.env.NEXT_PUBLIC_CATALOG_URL || 'https://catalogo.4millones.com/',
    description: 'Explora nuestro catálogo completo de productos Gano Excel'
  },
  business: {
    name: 'Modelo de Negocio',
    url: process.env.NEXT_PUBLIC_BUSINESS_URL || 'https://oportunidad.4millones.com/',
    description: 'Descubre la oportunidad de negocio con Gano Excel'
  }
}

// Mensajes de la aplicación
export const MESSAGES = {
  loading: 'Verificando autenticación...',
  loginSuccess: '¡Inicio de sesión exitoso! Redirigiendo al portal...',
  registerSuccess: '¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta.',
  profileUpdated: '✅ Perfil actualizado correctamente',
  authRequired: 'No se pudo cargar el sistema de autenticación',
  sessionActive: 'Ya tienes una sesión activa.',
  logoutSuccess: 'Sesión cerrada correctamente',
  errors: {
    invalidCredentials: 'Credenciales inválidas. Verifica tu email y contraseña.',
    userExists: 'Ya existe una cuenta con este correo electrónico.',
    emailNotConfirmed: 'Tu cuenta no ha sido confirmada. Revisa tu correo electrónico.',
    networkError: 'Error de conexión. Verifica tu internet e intenta de nuevo.',
    invalidEmail: 'Por favor, ingresa un correo electrónico válido.',
    shortPassword: 'La contraseña debe tener al menos 6 caracteres.',
    shortName: 'El nombre debe tener al menos 2 caracteres.',
    profileLoadError: 'Error al cargar el perfil del usuario.',
    profileUpdateError: 'Error al actualizar el perfil.'
  }
}

// Configuración de validaciones
export const VALIDATION_CONFIG = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingresa un email válido'
  },
  password: {
    minLength: 6,
    message: 'La contraseña debe tener al menos 6 caracteres'
  },
  name: {
    minLength: 2,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    message: 'El nombre debe tener al menos 2 caracteres y solo letras'
  },
  phone: {
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Ingresa un número de teléfono válido'
  }
}
