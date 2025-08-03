'use client'

interface ParticleBackgroundProps {
  count?: number
  className?: string
}

export default function ParticleBackground({
  count = 9,
  className = ''
}: ParticleBackgroundProps) {
  // Crear partículas dinámicamente
  const createParticles = () => {
    return [...Array(count)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${(i + 1) * (100 / (count + 1))}%`,
          animationDelay: `${i * 0.8}s`,
        }}
      />
    ))
  }

  return (
    <div className={`particles ${className}`}>
      {createParticles()}

      <style jsx>{`
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
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
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 0.7;
          }
        }

        /* Variante para páginas de auth */
        .particles.auth-particles .particle {
          background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
          width: 4px;
          height: 4px;
          opacity: 0.3;
        }

        /* Reducir animación en dispositivos que lo prefieran */
        @media (prefers-reduced-motion: reduce) {
          .particle {
            animation: none;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  )
}
