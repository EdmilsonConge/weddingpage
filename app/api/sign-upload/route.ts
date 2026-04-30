import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const { guestName } = await request.json()

    if (!guestName?.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }

    const safeName = guestName.trim().replace(/[=|&]/g, ' ')
    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'wedding_photos'
    const context = `guestName=${safeName}`

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder, context },
      process.env.CLOUDINARY_API_SECRET!,
    )

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      folder,
      context,
    })
  } catch (error) {
    console.error('Error signing upload:', error)
    return NextResponse.json({ error: 'Falha ao assinar upload' }, { status: 500 })
  }
}
