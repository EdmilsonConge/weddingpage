'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  width: number
  height: number
  guestName: string
  uploadedAt: string
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function SkeletonCard() {
  return <div className="aspect-square rounded-xl bg-gold/10 animate-pulse" />
}

function RefreshIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const fetchPhotos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    try {
      const res = await fetch('/api/photos', { cache: 'no-store' })
      const data = await res.json()
      setPhotos(data.photos ?? [])
    } catch {
      // silently fail — gallery still renders with stale data
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedPhoto(null)
      if (e.key === 'ArrowRight' && selectedPhoto) {
        const idx = photos.findIndex((p) => p.id === selectedPhoto.id)
        if (idx < photos.length - 1) setSelectedPhoto(photos[idx + 1])
      }
      if (e.key === 'ArrowLeft' && selectedPhoto) {
        const idx = photos.findIndex((p) => p.id === selectedPhoto.id)
        if (idx > 0) setSelectedPhoto(photos[idx - 1])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhoto, photos])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
        <div className="text-6xl mb-4">📷</div>
        <h3 className="font-serif text-xl text-gold mb-2">Nenhuma foto ainda</h3>
        <p className="text-muted text-sm">Seja o primeiro a partilhar um momento especial!</p>
      </div>
    )
  }

  return (
    <>
      {/* Count + Refresh Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs text-muted font-medium">
          {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
        </span>
        <button
          onClick={() => fetchPhotos(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-gold font-medium py-1 px-3 rounded-full border border-gold/30 hover:bg-gold/5 transition-colors disabled:opacity-50"
        >
          <span className={refreshing ? 'animate-spin' : ''}>
            <RefreshIcon />
          </span>
          Actualizar
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 px-2 pb-2 animate-fade-in">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-square rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Image
              src={photo.url}
              alt={`Foto por ${photo.guestName}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-2.5 py-2 text-left">
              <p className="text-white text-xs font-semibold truncate leading-tight">
                {photo.guestName}
              </p>
              <p className="text-white/70 text-xs">
                {formatDate(photo.uploadedAt)} · {formatTime(photo.uploadedAt)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors z-10 p-2"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Fechar"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            className="relative max-w-full max-h-[80vh] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.url}
              alt={`Foto por ${selectedPhoto.guestName}`}
              width={selectedPhoto.width}
              height={selectedPhoto.height}
              className="max-h-[80vh] w-auto h-auto object-contain"
              style={{ maxWidth: '90vw' }}
              priority
            />
          </div>

          <div className="mt-4 text-center animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <p className="text-white font-serif text-lg">{selectedPhoto.guestName}</p>
            <p className="text-white/50 text-sm mt-0.5">
              {formatDate(selectedPhoto.uploadedAt)} às {formatTime(selectedPhoto.uploadedAt)}
            </p>
          </div>

          {/* Arrow Navigation */}
          {photos.length > 1 && (
            <>
              {photos.findIndex((p) => p.id === selectedPhoto.id) > 0 && (
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    const idx = photos.findIndex((p) => p.id === selectedPhoto.id)
                    setSelectedPhoto(photos[idx - 1])
                  }}
                  aria-label="Anterior"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}
              {photos.findIndex((p) => p.id === selectedPhoto.id) < photos.length - 1 && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    const idx = photos.findIndex((p) => p.id === selectedPhoto.id)
                    setSelectedPhoto(photos[idx + 1])
                  }}
                  aria-label="Próxima"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
