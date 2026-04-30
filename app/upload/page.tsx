import UploadForm from '@/components/UploadForm'
import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-cream-50 pb-20">
      {/* Page Header */}
      <header className="bg-white border-b border-gold/15 px-4 py-5 flex items-center gap-4">
        <Link
          href="/"
          className="text-muted hover:text-gold transition-colors p-1 -ml-1"
          aria-label="Voltar à galeria"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <div>
          <h1 className="font-serif text-xl text-charcoal leading-tight">Partilhar Fotos</h1>
          <p className="text-xs text-muted mt-0.5">Keyla &amp; Jesus</p>
        </div>

        <div className="ml-auto">
          <span className="font-script text-2xl text-gold/60">✦</span>
        </div>
      </header>

      {/* Intro */}
      <div className="px-4 pt-6 pb-4 text-center">
        <p className="text-sm text-muted leading-relaxed">
          Partilhe os seus momentos especiais deste dia memorável.
          <br />
          As suas fotos ficarão na galeria para todos verem.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-4 mb-6">
        <div className="gold-divider flex-1" />
        <span className="text-gold/40 text-xs">✦</span>
        <div className="gold-divider flex-1" />
      </div>

      {/* Upload Form */}
      <UploadForm />

      {/* Navigation */}
      <Navigation />
    </main>
  )
}
