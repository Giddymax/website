import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import InstallPrompt from '@/components/InstallPrompt'
import JsonLd from '@/components/JsonLd'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'K.K. Danny Enterprise | Building Materials Supplier in Adeiso, Ghana',
    template: '%s | K.K. Danny Enterprise',
  },
  description: 'K.K. Danny Enterprise in Adeiso supplies quality cement, steel rebar, roofing sheets, paint, tiles, timber, tools, and more at affordable prices. Fast same-day delivery.',
  keywords: ['building materials', 'cement', 'rebar', 'roofing sheets', 'paint', 'tiles', 'timber', 'hardware', 'Adeiso', 'Ghana', 'Eastern Region'],
  authors: [{ name: 'K.K. Danny Enterprise' }],
  creator: 'K.K. Danny Enterprise',
  metadataBase: new URL('https://kkdannyenterprise.com'),
  alternates: { canonical: '/' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KK Danny',
  },
  openGraph: {
    title: 'K.K. Danny Enterprise | Building Materials Supplier in Adeiso',
    description: 'Quality & Affordable Building Materials in Adeiso, Eastern Region, Ghana. Cement, steel, roofing, paint, tiles, timber, hardware & same-day delivery.',
    type: 'website',
    url: 'https://kkdannyenterprise.com',
    siteName: 'K.K. Danny Enterprise',
    locale: 'en_GH',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'K.K. Danny Enterprise' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K.K. Danny Enterprise | Building Materials Supplier in Adeiso',
    description: 'Quality & Affordable Building Materials in Adeiso, Eastern Region, Ghana.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#C8960C" />
        <JsonLd />
      </head>
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <ServiceWorkerRegistration />
        <InstallPrompt />
      </body>
    </html>
  )
}
