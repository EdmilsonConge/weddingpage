'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function GalleryIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9A84C' : '#A09080'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function UploadIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? '#C9A84C' : '#A09080'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const isGallery = pathname === '/'
  const isUpload = pathname === '/upload'

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gold/20 z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto pb-safe">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 py-3 px-10 transition-colors"
        >
          <GalleryIcon active={isGallery} />
          <span
            className={`text-xs font-medium tracking-wide transition-colors ${
              isGallery ? 'text-gold' : 'text-muted'
            }`}
          >
            Galeria
          </span>
        </Link>

        <Link
          href="/upload"
          className="flex flex-col items-center gap-1 py-3 px-10 transition-colors"
        >
          <UploadIcon active={isUpload} />
          <span
            className={`text-xs font-medium tracking-wide transition-colors ${
              isUpload ? 'text-gold' : 'text-muted'
            }`}
          >
            Enviar
          </span>
        </Link>
      </div>
    </nav>
  )
}
