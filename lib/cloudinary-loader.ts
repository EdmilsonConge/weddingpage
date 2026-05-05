import type { ImageLoaderProps } from 'next/image'

const CLOUDINARY_UPLOAD_RE =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/

export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('blob:') || src.startsWith('data:')) {
    return src
  }

  const match = src.match(CLOUDINARY_UPLOAD_RE)
  if (!match) return src

  const baseUrl = match[1]
  const rest    = match[2]

  // Strip any existing transformation segment to prevent double-transforms
  const transformRe = /^(?:[a-z][a-z0-9]*_[^/,]+(?:,[a-z][a-z0-9]*_[^/,]+)*)\//
  const cleanRest = transformRe.test(rest) ? rest.replace(transformRe, '') : rest

  const q = quality ?? 'auto'
  return `${baseUrl}c_limit,w_${width},q_${q},f_auto/${cleanRest}`
}
