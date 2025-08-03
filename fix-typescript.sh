#!/bin/bash

echo "🔧 Corrigiendo errores específicos de TypeScript"

# 1. Actualizar authService para agregar getSession y corregir signUp
echo "📝 Actualizando authService en lib/supabase.ts..."
cat > src/lib/supabase.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'

export interface UserProfile {
  id: string
  correo_electronico: string
  full_name: string | null
  whatsapp: string | null
  affiliate_link: string | null
}

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const authService = {
  async signUp(email: string, password: string, fullName: string, whatsapp: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            correo_electronico: email,
            full_name: fullName,
            whatsapp: whatsapp,
            affiliate_link: this.generateAffiliateLink(fullName, email)
          }
        ])

      if (profileError) throw profileError
    }

    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  generateAffiliateLink(fullName: string, email: string): string {
    const cleanName = (fullName || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15)
    
    const timestamp = Date.now().toString().slice(-4)
    return `${cleanName}-${timestamp}`
  }
}
EOF

echo "✅ authService actualizado con getSession"

# 2. Corregir utils.ts para manejar tipos nullable
echo "📝 Corrigiendo utils.ts..."
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
  
  // Remove any non-numeric characters
  const numbers = whatsapp.replace(/\D/g, '')
  
  // Ensure it starts with country code
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
EOF

echo "✅ utils.ts corregido para manejar tipos nullable"

echo "🎯 CORRECCIONES DE TYPESCRIPT COMPLETADAS"
echo "============================================"
echo "✅ authService.getSession() añadido"
echo "✅ Tipos nullable manejados correctamente"
echo "✅ Funciones de utilidad actualizadas"
