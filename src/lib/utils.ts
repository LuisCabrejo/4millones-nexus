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
