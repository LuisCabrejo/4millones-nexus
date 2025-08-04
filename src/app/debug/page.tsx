'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({
    supabaseUrl: 'Loading...',
    supabaseKey: 'Loading...',
    connectionStatus: 'Testing...',
    environment: 'Loading...',
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    const runDiagnostics = async () => {
      // 1. Verificar variables de entorno
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_FOUND'
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'NOT_FOUND'
      const env = process.env.NODE_ENV || 'unknown'

      setDebugInfo(prev => ({
        ...prev,
        supabaseUrl: url,
        supabaseKey: key ? `${key.substring(0, 30)}...${key.substring(key.length - 10)}` : 'NOT_FOUND',
        environment: env
      }))

      // 2. Test de conexión Supabase
      try {
        console.log('🔍 Testing Supabase connection...')
        console.log('URL being used:', url)
        console.log('Key preview:', key ? `${key.substring(0, 20)}...` : 'NO KEY')

        const supabase = createClientComponentClient()

        // Test básico de conexión
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('❌ Supabase connection error:', error)
          setDebugInfo(prev => ({
            ...prev,
            connectionStatus: `❌ Error: ${error.message}`
          }))
        } else {
          console.log('✅ Supabase connection successful')
          setDebugInfo(prev => ({
            ...prev,
            connectionStatus: '✅ Connection successful'
          }))
        }
      } catch (err: any) {
        console.error('💥 Connection test failed:', err)
        setDebugInfo(prev => ({
          ...prev,
          connectionStatus: `💥 Failed: ${err.message || 'Unknown error'}`
        }))
      }
    }

    runDiagnostics()
  }, [])

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'text-green-400'
    if (status.includes('❌') || status.includes('💥')) return 'text-red-400'
    if (status.includes('⚠️')) return 'text-yellow-400'
    return 'text-blue-400'
  }

  const getUrlStatus = () => {
    if (debugInfo.supabaseUrl === 'NOT_FOUND') return '❌ Variable no encontrada'
    if (debugInfo.supabaseUrl.includes('placeholder')) return '❌ Usando placeholder (PROBLEMA)'
    if (debugInfo.supabaseUrl.includes('ovsvocjvjnqfaaugwnxg')) return '✅ URL correcta'
    return '⚠️ URL inesperada'
  }

  const getKeyStatus = () => {
    if (debugInfo.supabaseKey === 'NOT_FOUND') return '❌ Key no encontrada'
    if (debugInfo.supabaseKey.length > 50) return '✅ Key configurada'
    return '⚠️ Key parece incompleta'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🔍 NEXUS Diagnostic Panel
          </h1>
          <p className="text-slate-400 mt-2">
            Environment Variables & Connection Status
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Last check: {debugInfo.timestamp}
          </p>
        </div>

        <div className="grid gap-6">
          {/* Environment Info */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">🌍 Environment</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Node Environment:</span>
                <span className="font-mono text-sm">{debugInfo.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Build Environment:</span>
                <span className="font-mono text-sm">
                  {typeof window !== 'undefined' ? 'Client' : 'Server'}
                </span>
              </div>
            </div>
          </div>

          {/* Supabase URL */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">🔗 Supabase URL</h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-300">Value:</span>
                <p className="font-mono text-sm mt-1 p-2 bg-slate-900/50 rounded break-all">
                  {debugInfo.supabaseUrl}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Status:</span>
                <span className={`text-sm font-medium ${getUrlStatus().includes('✅') ? 'text-green-400' : getUrlStatus().includes('❌') ? 'text-red-400' : 'text-yellow-400'}`}>
                  {getUrlStatus()}
                </span>
              </div>
            </div>
          </div>

          {/* Supabase Key */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">🔑 Supabase Anon Key</h2>
            <div className="space-y-3">
              <div>
                <span className="text-slate-300">Value (truncated):</span>
                <p className="font-mono text-sm mt-1 p-2 bg-slate-900/50 rounded">
                  {debugInfo.supabaseKey}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Status:</span>
                <span className={`text-sm font-medium ${getKeyStatus().includes('✅') ? 'text-green-400' : getKeyStatus().includes('❌') ? 'text-red-400' : 'text-yellow-400'}`}>
                  {getKeyStatus()}
                </span>
              </div>
            </div>
          </div>

          {/* Connection Test */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">🧪 Connection Test</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Supabase Auth:</span>
                <span className={`text-sm font-medium ${getStatusColor(debugInfo.connectionStatus)}`}>
                  {debugInfo.connectionStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">⚡ Next Steps</h2>
            <div className="space-y-2 text-sm">
              {debugInfo.supabaseUrl.includes('placeholder') && (
                <div className="text-red-300">
                  ❌ Variables not reaching app - Force redeploy needed
                </div>
              )}
              {debugInfo.supabaseUrl.includes('ovsvocjvjnqfaaugwnxg') && (
                <div className="text-green-300">
                  ✅ Variables configured correctly
                </div>
              )}
              {debugInfo.connectionStatus.includes('Error') && (
                <div className="text-yellow-300">
                  ⚠️ Connection issues detected - Check Supabase config
                </div>
              )}
              <div className="mt-4 p-3 bg-slate-800/50 rounded text-slate-300">
                <strong>Remember:</strong> Delete this debug page after fixing!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
