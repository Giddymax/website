'use client'
import { useState, useEffect, useCallback } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Check if dismissed recently
    const lastDismissed = localStorage.getItem('pwa-install-dismissed')
    if (lastDismissed && Date.now() - Number(lastDismissed) < 7 * 24 * 60 * 60 * 1000) {
      setDismissed(true)
      return
    }

    // Detect iOS (no beforeinstallprompt support)
    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(ios)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }, [deferredPrompt])

  const handleDismiss = () => {
    setDismissed(true)
    setDeferredPrompt(null)
    localStorage.setItem('pwa-install-dismissed', String(Date.now()))
  }

  // Nothing to show
  if (dismissed) return null
  if (!deferredPrompt && !isIOS) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-slide-up">
      <div className="rounded-xl p-4 shadow-2xl" style={{ background: 'var(--navy)', border: '1px solid #1e2e3c' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
            <Download size={20} style={{ color: 'var(--gold)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm mb-0.5">Install KK Danny App</div>
            <p className="text-xs" style={{ color: '#8a9ba8' }}>
              {isIOS
                ? 'Tap the Share button, then "Add to Home Screen".'
                : 'Install for quick access — works offline too.'}
            </p>
          </div>
          <button onClick={handleDismiss} className="text-gray-500 hover:text-white shrink-0 p-1" aria-label="Dismiss">
            <X size={16} />
          </button>
        </div>
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide"
            style={{ background: 'var(--gold)', color: '#000' }}
          >
            Install App
          </button>
        )}
      </div>
    </div>
  )
}
