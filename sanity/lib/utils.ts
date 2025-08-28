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
