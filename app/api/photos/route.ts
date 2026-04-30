import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export interface Photo {
  id: string
  url: string
  width: number
  height: number
  guestName: string
  uploadedAt: string
}

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression('folder:wedding_photos')
      .with_field('context')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute()

    const photos: Photo[] = (result.resources ?? []).map((resource: Record<string, unknown>) => {
      const ctx = resource.context as Record<string, Record<string, string>> | undefined
      return {
        id: resource.public_id as string,
        url: resource.secure_url as string,
        width: resource.width as number,
        height: resource.height as number,
        guestName: ctx?.custom?.guestName ?? 'Convidado',
        uploadedAt: resource.created_at as string,
      }
    })

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ error: 'Falha ao carregar fotos' }, { status: 500 })
  }
}
