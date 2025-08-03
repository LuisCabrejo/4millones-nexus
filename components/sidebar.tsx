'use client'

import { useState, useEffect } from 'react'
import { Home, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  full_name: string
  whatsapp?: string
  affiliate_link?: string
}

interface SidebarProps {
  userProfile: UserProfile | null
  onLogout: () => void
}

export default function Sidebar({ userProfile, onLogout }: SidebarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await onLogout()
    } catch (error) {
      console.error('Error during logout:', error)
      setIsLoggingOut(false)
    }
  }

  // Generar iniciales del usuario
  const getUserInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return parts[0][0].toUpperCase()
  }

  return (
    <div className="sidebar">
      {/* Partículas de fondo */}
      <div className="particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i + 1) * (100 / 7)}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Header del sidebar */}
      <div className="sidebar-header">
        <div className="logo-container">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <rect width="100" height="100" rx="20" fill="url(#gradient)" />
            <text
              x="50"
              y="65"
              textAnchor="middle"
              fill="white"
              fontSize="36"
              fontWeight="900"
              fontFamily="Inter"
            >
              4M
            </text>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0b1cb" />
                <stop offset="100%" stopColor="#c497b2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2>Proyecto 4 Millones</h2>
        <p>Centro de Herramientas</p>
      </div>

      {/* Información del usuario o botón de login */}
      {userProfile ? (
        <div className="user-info">
          <div className="user-email">{userProfile.email}</div>
          <div className="user-name">{userProfile.full_name || 'Usuario'}</div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="logout-btn"
          >
            {isLoggingOut ? (
              <>
                <span className="loading-spinner" />
                Cerrando...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Cerrar Sesión
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="user-info guest-info">
          <div className="guest-message">
            <p>¡Bienvenido al Portal!</p>
            <small>Personaliza tus herramientas iniciando sesión</small>
          </div>
          <Link href="/auth/login" className="login-btn">
            <User size={16} />
            Iniciar Sesión
          </Link>
        </div>
      )}

      {/* Navegación */}
      <nav className="sidebar-nav">
        <Link href="/nexus" className="active">
          <Home size={24} />
          Portal Principal
        </Link>
        {userProfile ? (
          <Link href="/profile">
            <User size={24} />
            Mi Perfil
          </Link>
        ) : (
          <Link href="/auth/register" className="register-link">
            <User size={24} />
            Crear Cuenta
          </Link>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>© 2025 Organización 4 Millones</p>
      </div>

      <style jsx>{`
        .sidebar {
          width: 280px;
          background: var(--gradient-primary);
          color: white;
          padding: 40px 25px;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
        }

        .sidebar-header {
          text-align: center;
          margin-bottom: 50px;
          position: relative;
        }

        .logo-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .logo-container:hover {
          transform: scale(1.02);
          background: rgba(255, 255, 255, 0.15);
        }

        .sidebar-header h2 {
          font-weight: 800;
          font-size: 1.9rem;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #ffffff 0%, #e0b1cb 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }

        .sidebar-header p {
          font-size: 0.95rem;
          opacity: 0.8;
          margin: 0;
          font-weight: 500;
        }

        .user-info {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 30px;
          text-align: center;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .user-info:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .user-email {
          opacity: 0.9;
          margin-bottom: 10px;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .user-name {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 15px;
          color: var(--accent);
        }

        .logout-btn {
          background: rgba(255, 77, 87, 0.2);
          color: white;
          border: 1px solid rgba(255, 77, 87, 0.3);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          min-height: 44px;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .logout-btn:hover:not(:disabled) {
          background: rgba(255, 77, 87, 0.4);
          transform: scale(1.05);
        }

        .user-info.guest-info {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .guest-message {
          margin-bottom: 15px;
          text-align: center;
        }

        .guest-message p {
          font-weight: 600;
          font-size: 1rem;
          margin: 0 0 5px 0;
          color: var(--accent);
        }

        .guest-message small {
          opacity: 0.8;
          font-size: 0.8rem;
          line-height: 1.3;
        }

        .login-btn {
          background: rgba(224, 177, 203, 0.2);
          color: white;
          border: 1px solid rgba(224, 177, 203, 0.3);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          min-height: 44px;
          min-width: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
        }

        .login-btn:hover {
          background: rgba(224, 177, 203, 0.4);
          transform: scale(1.05);
          color: white;
        }

        .sidebar-nav {
          flex-grow: 1;
        }

        .sidebar-nav :global(a) {
          display: flex;
          align-items: center;
          padding: 18px 20px;
          color: white;
          text-decoration: none;
          border-radius: 16px;
          margin-bottom: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          overflow: hidden;
        }

        .sidebar-nav :global(a::before) {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }

        .sidebar-nav :global(a:hover::before) {
          left: 100%;
        }

        .sidebar-nav :global(a:hover),
        .sidebar-nav :global(a.active) {
          background: rgba(255, 255, 255, 0.95);
          color: var(--primary);
          transform: translateX(8px);
          box-shadow: var(--shadow-soft);
        }

        .sidebar-nav :global(a svg) {
          margin-right: 15px;
          transition: transform 0.3s ease;
        }

        .sidebar-nav :global(a.register-link) {
          background: rgba(224, 177, 203, 0.1);
          border: 1px solid rgba(224, 177, 203, 0.2);
        }

        .sidebar-nav :global(a.register-link:hover) {
          background: rgba(224, 177, 203, 0.2);
          border-color: rgba(224, 177, 203, 0.4);
        }

        .sidebar-footer {
          margin-top: auto;
          text-align: center;
          font-size: 0.8rem;
          opacity: 0.6;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: var(--accent);
          border-radius: 50%;
          opacity: 0.4;
          animation: float 6s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: 0.7; }
        }

        /* Mobile - ocultar sidebar */
        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
