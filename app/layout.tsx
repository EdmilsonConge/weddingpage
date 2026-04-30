import type { Metadata, Viewport } from 'next'
import { Great_Vibes, Cormorant_Garamond, Lato } from 'next/font/google'
import './globals.css'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Keyla & Jesus — Galeria do Casamento',
  description: 'Partilhe e veja fotos do nosso dia especial',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt">
      <body
        className={`${greatVibes.variable} ${cormorant.variable} ${lato.variable} font-sans bg-cream-50 text-charcoal min-h-screen`}
      >
        {children}
      </body>
    </html>
  )
}
