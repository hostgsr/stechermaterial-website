import type {PortableTextBlock} from 'next-sanity'
import type {Image} from 'sanity'

export interface MilestoneItem {
  _key: string
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface ShowcaseProject {
  _id: string
  _type: string
  coverImage?: Image
  overview?: PortableTextBlock[]
  slug?: string
  tags?: string[]
  title?: string
}

export interface Exhibition {
  _id: string
  _type: string
  title: string | null
  slug: string | null
  date: string | null
  isCurrent?: boolean
  isSolo?: boolean
  shortDescription: string | null
  location: string | null
  exhibitionPhotos: any[] | any | null
}

export interface Collection {
  _id: string
  _type: string
  title: string | null
  slug: string | null
  date: string | null
  isPrivate?: boolean
  shortDescription: string | null
  location: string | null
  collectionPhotos: any[] | any | null
}

export interface Publication {
  _key?: string
  title?: string
  publicationTypes?: string[]
  image?: {
    asset?: {
      _ref: string
      _type: 'reference'
      _weak?: boolean
    }
    media?: unknown
    hotspot?: any
    crop?: any
    _type: 'image'
    imageData?: any
  }
  year?: string
  description?: string
  file?: {
    asset?: {
      _ref: string
      _type: 'reference'
      _weak?: boolean
    }
    media?: unknown
    _type: 'file'
  }
  link?: string
}
