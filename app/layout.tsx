import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'

export const metadata: Metadata = {
  title: 'K.K. Danny Enterprise | Building Materials Supplier in Adeiso, Ghana',
  description: 'K.K. Danny Enterprise in Adeiso supplies quality cement, steel rebar, roofing sheets, paint, tiles, timber, tools, and more at affordable prices. Fast delivery.',
  keywords: 'building materials, cement, rebar, roofing sheets, paint, tiles, timber, hardware, Adeiso, Ghana',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KK Danny',
  },
  openGraph: {
    title: 'K.K. Danny Enterprise',
    description: 'Quality & Affordable Building Materials in Adeiso, Eastern Region, Ghana',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#C8960C" />
      </head>
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
