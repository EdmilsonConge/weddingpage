import Gallery from '@/components/Gallery'
import Navigation from '@/components/Navigation'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream-50 pb-20">
      {/* Hero Header */}
      <header className="bg-white border-b border-gold/15 py-8 px-4 text-center">
        <p className="font-script text-6xl sm:text-7xl text-gold leading-none">
          Keyla &amp; Jesus
        </p>

        <div className="flex items-center justify-center gap-3 my-4">
          <div className="gold-divider w-20" />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C">
            <path d="M12 2l2.09 6.26L20 10l-5 4.73L16.18 22 12 18.77 7.82 22 9 14.73 4 10l5.91-1.74L12 2z" />
          </svg>
          <div className="gold-divider w-20" />
        </div>

        <p className="font-serif text-sm text-muted tracking-[0.25em] uppercase">
          Galeria de Fotos
        </p>
      </header>

      {/* Gallery */}
      <Gallery />

      {/* Bottom Navigation */}
      <Navigation />
    </main>
  )
}
