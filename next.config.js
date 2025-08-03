/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: [
      'images.unsplash.com',
      '4millones.com',
      'catalogo.4millones.com',
      'oportunidad.4millones.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.4millones.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CATALOG_URL: process.env.NEXT_PUBLIC_CATALOG_URL,
    NEXT_PUBLIC_BUSINESS_URL: process.env.NEXT_PUBLIC_BUSINESS_URL,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/nexus',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
