// lib/supabase.ts - AuthService Completo
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipo para el perfil de usuario
export interface UserProfile {
  id?: string
  email: string
  full_name?: string
  whatsapp?: string
  affiliate_link?: string  // ✅ AGREGADO: Campo faltante
  created_at?: string
  // Alias para compatibilidad
  correo_electronico?: string
}

export const authService = {
  // Registro de usuario
  async signUp(email: string, password: string, fullName: string, whatsapp: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          whatsapp: whatsapp
        },
        emailRedirectTo: `${window.location.origin}/auth/login`
      }
    })

    if (error) throw error

    // Notificar al admin sobre el nuevo registro
    if (data.user) {
      try {
        await this.notifyAdminNewUser(data.user, fullName, whatsapp)
      } catch (notifyError) {
        console.error('Error notificando al admin:', notifyError)
        // No fallar el registro por error de notificación
      }
    }

    return data
  },

  // Inicio de sesión
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Recuperar contraseña - enviar email
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
    return data
  },

  // Actualizar contraseña (para el reset)
  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return data
  },

  // Establecer sesión con tokens (para el reset)
  async setSession(accessToken: string, refreshToken: string) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (error) throw error
    return data
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // ARREGLO: Ambas funciones para compatibilidad
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // ARREGLO: Alias para getSession (función que falta)
  async getSession() {
    return this.getCurrentSession()
  },

  // ARREGLO: Función getUserProfile que faltaba
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) return null

      // Intentar obtener datos adicionales de la tabla profiles
      let profileData = null
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!error && data) {
          profileData = data
        }
      } catch (profileError) {
        console.log('No profile data found in table, using auth metadata')
      }

      // Formatear el perfil con alias para compatibilidad
      const profile: UserProfile = {
        id: user.id,
        email: user.email!,
        full_name: profileData?.full_name || user.user_metadata?.full_name || user.user_metadata?.name,
        whatsapp: profileData?.whatsapp || user.user_metadata?.whatsapp,
        affiliate_link: profileData?.affiliate_link || '', // ✅ AGREGADO: Campo affiliate_link
        created_at: user.created_at,
        // Alias para compatibilidad con código existente
        correo_electronico: user.email!
      }

      return profile
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  },

  // ✅ NUEVA FUNCIÓN: Actualizar perfil de usuario
  async updateProfile(profileData: {
    full_name?: string
    whatsapp?: string
    affiliate_link?: string
  }): Promise<UserProfile | null> {
    try {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('No user authenticated')

      // Primero, actualizar user_metadata en auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.full_name,
          whatsapp: profileData.whatsapp
        }
      })

      if (authError) {
        console.error('Error updating auth metadata:', authError)
      }

      // Luego, actualizar/crear registro en tabla profiles
      const updateData = {
        id: user.id,
        email: user.email!,
        full_name: profileData.full_name || '',
        whatsapp: profileData.whatsapp || '',
        affiliate_link: profileData.affiliate_link || '',
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData, { onConflict: 'id' })
        .select()
        .single()

      if (error) {
        console.error('Error updating profile table:', error)
        // Si falla la tabla, al menos devolvemos los datos actualizados
        return {
          id: user.id,
          email: user.email!,
          full_name: profileData.full_name || '',
          whatsapp: profileData.whatsapp || '',
          affiliate_link: profileData.affiliate_link || '',
          created_at: user.created_at
        }
      }

      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Verificar si el usuario está autenticado
  async isAuthenticated() {
    try {
      const session = await this.getSession()
      return !!session
    } catch (error) {
      return false
    }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Notificar al admin sobre nuevo usuario (email automático)
  async notifyAdminNewUser(user: any, fullName: string, whatsapp: string) {
    // Esta función enviaría un email al admin
    // Por ahora, solo logging - después configurar con webhook o función edge
    console.log('Nuevo usuario registrado:', {
      email: user.email,
      fullName,
      whatsapp,
      timestamp: new Date().toISOString()
    })

    // TODO: Implementar webhook o función edge para enviar email a admin@4millones.com
    // Ejemplo de estructura para el futuro:
    /*
    const response = await fetch('/api/notify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'new_user_registration',
        user: {
          email: user.email,
          fullName,
          whatsapp,
          userId: user.id,
          timestamp: new Date().toISOString()
        }
      })
    })
    */
  }
}

// Configurar redirect URLs en Supabase Dashboard:
// Authentication > URL Configuration > Redirect URLs:
// - https://4millones.com/auth/reset-password
// - http://localhost:3000/auth/reset-password (para desarrollo)

export default authService
