'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface FilePreview {
  file: File
  preview: string
}

export default function UploadForm() {
  const router = useRouter()
  const [guestName, setGuestName] = useState('')
  const [files, setFiles] = useState<FilePreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (incoming: File[]) => {
      const slots = 3 - files.length
      if (slots <= 0) return
      const toAdd = incoming.filter((f) => f.type.startsWith('image/')).slice(0, slots)
      const previews: FilePreview[] = toAdd.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setFiles((prev) => [...prev, ...previews])
      setError('')
    },
    [files.length],
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleUpload = async () => {
    if (!guestName.trim()) {
      setError('Por favor, insira o seu nome.')
      return
    }
    if (files.length === 0) {
      setError('Seleccione pelo menos uma foto.')
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    try {
      const signRes = await fetch('/api/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: guestName.trim() }),
      })

      if (!signRes.ok) {
        const errData = await signRes.json().catch(() => ({}))
        throw new Error(errData.error ?? 'Falha ao obter credenciais de upload')
      }

      const { signature, timestamp, apiKey, cloudName, folder, context } = await signRes.json()

      if (!cloudName || !apiKey) {
        throw new Error('Credenciais Cloudinary não configuradas. Configure o ficheiro .env.local.')
      }

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData()
        formData.append('file', files[i].file)
        formData.append('api_key', apiKey)
        formData.append('timestamp', String(timestamp))
        formData.append('signature', signature)
        formData.append('folder', folder)
        formData.append('context', context)

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData },
        )

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}))
          throw new Error(errData.error?.message ?? 'Falha no upload da foto')
        }

        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      files.forEach((f) => URL.revokeObjectURL(f.preview))
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setError('Erro ao enviar fotos. Verifique a sua ligação e tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-gold mb-2">Fotos enviadas!</h3>
        <p className="text-muted text-sm mb-8">
          Obrigado por partilhar os seus momentos connosco.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3.5 bg-gold text-white rounded-full font-medium tracking-wide hover:bg-gold-dark transition-colors"
          >
            Ver Galeria
          </button>
          <button
            onClick={() => {
              setSuccess(false)
              setFiles([])
              setGuestName('')
              setProgress(0)
            }}
            className="w-full py-3.5 border border-gold/40 text-gold rounded-full font-medium tracking-wide hover:bg-gold/5 transition-colors"
          >
            Enviar mais fotos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pb-28 space-y-6 animate-slide-up">
      {/* Name Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal/70 tracking-wide">
          O seu nome <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Ex: Maria Silva"
          className="w-full border border-gold/30 rounded-xl px-4 py-3.5 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-muted/60 text-charcoal"
          disabled={uploading}
        />
      </div>

      {/* File Picker */}
      <div className="space-y-2">
        <label className="flex items-center justify-between text-sm font-medium text-charcoal/70 tracking-wide">
          <span>
            Fotos <span className="text-gold">*</span>
          </span>
          <span className="text-xs text-muted font-normal">
            {files.length}/3 seleccionadas
          </span>
        </label>

        {files.length < 3 && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragOver
                ? 'border-gold bg-gold/5'
                : 'border-gold/30 hover:border-gold/60 hover:bg-gold/3'
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gold font-medium text-sm">Toque para seleccionar</p>
              <p className="text-muted text-xs mt-1">
                Pode adicionar até {3 - files.length} foto{3 - files.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gold/10">
              <Image
                src={f.preview}
                alt={`Preview ${i + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                disabled={uploading}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-sm leading-none hover:bg-black/80 transition-colors disabled:opacity-50"
                aria-label="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Progress */}
      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>A enviar...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gold/10 rounded-full h-1.5">
            <div
              className="bg-gold h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading || files.length === 0 || !guestName.trim()}
        className="w-full py-4 bg-gold text-white rounded-full font-medium text-base tracking-wide shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-dark transition-colors active:scale-[0.98]"
      >
        {uploading ? `A enviar... ${progress}%` : 'Partilhar Fotos'}
      </button>
    </div>
  )
}
