import {dataset, projectId} from '@/sanity/lib/api'
import createImageUrlBuilder from '@sanity/image-url'
import type {Image} from 'sanity'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image | null | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max').quality(85)
}

export const urlForFullQualityImage = (source: Image | null | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max').quality(100)
}

export const urlForUltraQualityImage = (source: Image | null | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  // No format conversion, no quality compression - original file
  return imageBuilder?.image(source).fit('max')
}

export function urlForOpenGraphImage(image: Image | null | undefined) {
  return urlForImage(image)?.width(1200).height(627).fit('crop').url()
}

// Utility function to generate URLs for file assets (like audio files)
export function urlForFile(file: any) {
  if (!file?.asset?._ref) {
    return undefined
  }

  try {
    const ref = file.asset._ref
    const parts = ref.split('-')

    if (parts.length < 3) {
      console.warn('Invalid file reference format:', ref)
      return undefined
    }

    const [, id, extension] = parts

    if (!id || !extension) {
      console.warn('Missing id or extension in file reference:', ref)
      return undefined
    }

    return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`
  } catch (error) {
    console.error('Error generating file URL:', error)
    return undefined
  }
}

export function resolveHref(documentType?: string, slug?: string | null): string | undefined {
  switch (documentType) {
    case 'home':
      return '/'
    case 'page':
      return slug ? `/${slug}` : undefined
    case 'project':
      return slug ? `/projects/${slug}` : undefined
    case 'work':
      return slug ? `/works/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
