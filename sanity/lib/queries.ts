import {defineQuery} from 'next-sanity'

export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    _type,
    title,
    overview,
    bio,
    bioImages[]{
      ...,
      "imageData": asset->metadata
    },
    showcaseWorks[]{
      _key,
      ...@->{
        _id,
        _type,
        title,
        year,
        classification,
        "slug": slug.current,
        images[]{
          ...,
          "imageData": asset->metadata
        }
      }
    },
    publicationText,
    publications[]{
      title,
      image{
        ...,
        "imageData": asset->metadata
      },
      year,
      description,
      file,
      link
    },
    studioText,
    studios[]{
      title,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      location,
      description
    }
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    client,
    coverImage{
      ...,
      "imageData": asset->metadata
    },
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
  }
`)

export const workBySlugQuery = defineQuery(`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    images[]{
      ...,
      "imageData": asset->metadata
    },
    descriptionMedium,
    description,
    year,
    size,
    location,
    classification,
    publications[]{
      title,
      year,
      description,
      file,
      link
    }
  }
`)

export const allWorksQuery = defineQuery(`
  *[_type == "work"] | order(year desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    images[0]{
      ...,
      "imageData": asset->metadata
    },
    year,
    classification,
    size,
    location
  }
`)

export const exhibitionBySlugQuery = defineQuery(`
  *[_type == "exhibition" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    date,
    shortDescription,
    description,
    location,
    assignedWorks[]->{
      _id,
      title,
      "slug": slug.current,
      images[0]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification
    },
    exhibitionPhotos[]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const allExhibitionsQuery = defineQuery(`
  *[_type == "exhibition"] | order(date desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    date,
    shortDescription,
    location,
    exhibitionPhotos[0]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const collectionBySlugQuery = defineQuery(`
  *[_type == "collection" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    date,
    shortDescription,
    description,
    location,
    assignedWorks[]->{
      _id,
      title,
      "slug": slug.current,
      images[0]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification
    },
    collectionPhotos[]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const allCollectionsQuery = defineQuery(`
  *[_type == "collection"] | order(date desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    date,
    shortDescription,
    location,
    collectionPhotos[0]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    },
    ogImage{
      ...,
      "imageData": asset->metadata
    },
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current}
`)
