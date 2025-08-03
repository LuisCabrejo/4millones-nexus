'use client'

import { useState } from 'react'
import { ExternalLink, Share } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  whatsapp?: string
  affiliate_link?: string
}

interface ToolCardProps {
  id: string
  name: string
  description: string
  url: string
  buttonText: string
  whatsappMessage: string
  imageUrl?: string
  status?: 'available' | 'coming-soon'
  userProfile: UserProfile | null
}

export default function ToolCard({
  id,
  name,
  description,
  url,
  buttonText,
  whatsappMessage,
  imageUrl,
  status = 'available',
  userProfile
}: ToolCardProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [message, setMessage] = useState('')

  // Generar slug amigable desde nombre completo
  const generateDistributorSlug = (fullName: string) => {
    if (!fullName || typeof fullName !== 'string') {
      return null
    }

    try {
      const parts = fullName.trim().split(' ')
      const nombreApellido = parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0]

      const slug = nombreApellido
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      return slug
    } catch (error) {
      console.error('Error al generar slug:', error)
      return null
    }
  }

  // Generar URL personalizada
  const generatePersonalizedUrl = (baseUrl: string, userProfile: UserProfile | null) => {
    if (!baseUrl || !userProfile) return baseUrl

    try {
      const url = new URL(baseUrl)
      const slug = generateDistributorSlug(userProfile.full_name)

      if (slug && slug.length > 0) {
        url.searchParams.set('distribuidor', slug)
      } else {
        url.searchParams.set('socio', userProfile.id)
      }

      return url.toString()
    } catch (error) {
      console.error('Error al generar URL personalizada:', error)
      return baseUrl
    }
  }

  // Generar URL de WhatsApp
  const generateWhatsAppShareUrl = (message: string, toolUrl: string) => {
    try {
      const fullMessage = message + toolUrl
      const encodedMessage = encodeURIComponent(fullMessage)
      return `https://api.whatsapp.com/send?text=${encodedMessage}`
    } catch (error) {
      console.error('Error al generar URL de WhatsApp:', error)
      return '#'
    }
  }

  // Manejar clic en abrir herramienta
  const handleOpenTool = () => {
    if (status !== 'available') return

    const personalizedUrl = generatePersonalizedUrl(url, userProfile)
    window.open(personalizedUrl, '_blank')

    setMessage('✅ Abriendo herramienta')
    setTimeout(() => setMessage(''), 3000)
  }

  // Manejar compartir en WhatsApp
  const handleWhatsAppShare = async () => {
    if (isSharing || status !== 'available') return

    setIsSharing(true)

    try {
      const personalizedUrl = generatePersonalizedUrl(url, userProfile)
      const whatsappUrl = generateWhatsAppShareUrl(whatsappMessage, personalizedUrl)

      window.open(whatsappUrl, '_blank')
      setMessage('✅ Listo para compartir')

    } catch (error) {
      console.error('Error al compartir:', error)
      setMessage('❌ Error al generar enlace')
    } finally {
      setIsSharing(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="tool-card">
      {/* Imagen de la herramienta */}
      <div
        className="tool-card-image"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className={`status-badge ${status}`}>
          {status === 'available' ? 'Disponible' : 'Próximamente'}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="tool-card-content">
        <h3>{name}</h3>
        <p>{description}</p>

        {/* Mensaje de estado */}
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Botones de acción */}
        <div className="tool-actions">
          <button
            onClick={handleOpenTool}
            disabled={status !== 'available'}
            className="btn tool-btn-primary"
          >
            <span>{buttonText}</span>
            <ExternalLink size={16} />
          </button>

          {status === 'available' && (
            <button
              onClick={handleWhatsAppShare}
              disabled={isSharing}
              className="btn tool-btn-whatsapp"
              title="Compartir en WhatsApp"
            >
              {isSharing ? (
                <>
                  <span className="loading-spinner small" />
                  <span>Compartir</span>
                </>
              ) : (
                <>
                  <Share size={16} />
                  <span>WhatsApp</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .tool-card {
          background: white;
          border-radius: 24px;
          box-shadow: var(--shadow-soft);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          border: 1px solid rgba(13, 27, 42, 0.05);
        }

        .tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--gradient-accent);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .tool-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: var(--shadow-strong);
        }

        .tool-card:hover::before {
          transform: scaleX(1);
        }

        .tool-card-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
        }

        .tool-card-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%);
          transition: opacity 0.3s ease;
        }

        .tool-card:hover .tool-card-image::after {
          opacity: 0.7;
        }

        .status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(224, 177, 203, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .status-badge.available {
          background: rgba(40, 167, 69, 0.9);
        }

        .status-badge.coming-soon {
          background: rgba(255, 193, 7, 0.9);
        }

        .tool-card-content {
          padding: 30px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .tool-card-content h3 {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--dark-text);
          margin: 0 0 15px 0;
          letter-spacing: -0.01em;
        }

        .tool-card-content p {
          color: var(--text-secondary);
          font-size: 1.05rem;
          flex-grow: 1;
          margin: 0 0 25px 0;
          line-height: 1.6;
        }

        .message {
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
        }

        .message.success {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: var(--success);
          border: 1px solid #9ae6b4;
        }

        .message.error {
          background: linear-gradient(135deg, #f8d7da 0%, #f1b0b7 100%);
          color: var(--error);
          border: 1px solid #f5c6cb;
        }

        .tool-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .tool-btn-primary {
          flex: 1;
          text-align: center;
          border-radius: 16px;
          background: var(--gradient-primary);
          gap: 8px;
        }

        .tool-btn-primary:hover {
          background: var(--gradient-accent);
        }

        .tool-btn-primary:disabled {
          background: #a0aec0;
          cursor: not-allowed;
          transform: none;
        }

        .tool-btn-whatsapp {
          background: #25D366;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          gap: 6px;
          flex-shrink: 0;
          font-size: 0.85rem;
        }

        .tool-btn-whatsapp:hover {
          background: #1a9e52;
          transform: translateY(-2px);
        }

        .tool-btn-whatsapp:disabled {
          background: #a0aec0;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner.small {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .tool-card-content {
            padding: 25px;
          }

          .tool-actions {
            flex-direction: column;
            gap: 12px;
          }

          .tool-btn-whatsapp {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
