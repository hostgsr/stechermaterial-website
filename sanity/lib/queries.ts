import {defineQuery} from 'next-sanity'

export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    _type,
    title,
    description,
    contactEmail,
    audioFile,
    imageGallery[]{
      ...,
      "imageData": asset->metadata
    },
    imageGalleryMobile[]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const marqueeTextQuery = defineQuery(`
  *[_type == "home"][0]{
    marqueeText
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
    artNumber,
    title,
    "slug": slug.current,
    technique,
    location,
    material,
    year,
    description,
    links[]{
      title,
      url
    },
    videoUrl,
    videoPoster{
      ...,
      "imageData": asset->metadata
    },
    audioFile,
    photos[]{
      ...,
      _type == 'image' => {
        ...,
        "imageData": asset->metadata,
        colSpan
      },
      _type == 'video' => {
        ...,
        poster{
          ...,
          "imageData": asset->metadata
        },
        colSpan
      },
      _type == 'descriptionBlock' => {
        ...,
        colSpan
      },
      _type == 'productBlock' => {
        ...,
        colSpan,
        product->{
          _id,
          title,
          "slug": slug.current,
          price,
          description,
          "productPhotos": photos[]{
            ...,
            "imageData": asset->metadata
          }
        }
      },
      _type == 'spacerBlock' => {
        ...,
        colSpan
      }
    }
  }
`)

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(artNumber desc) {
    _id,
    _type,
    artNumber,
    title,
    "slug": slug.current,
    technique,
    location,
    material,
    description,
    links[]{
      title,
      url
    },
    videoUrl,
    videoPoster{
      ...,
      "imageData": asset->metadata
    },
    audioFile,
    year,
    photos[]{
      ...,
      _type == 'image' => {
        ...,
        "imageData": asset->metadata,
        colSpan
      },
      _type == 'video' => {
        ...,
        poster{
          ...,
          "imageData": asset->metadata
        },
        colSpan
      },
      _type == 'descriptionBlock' => {
        ...,
        colSpan
      },
      _type == 'productBlock' => {
        ...,
        colSpan,
        product->{
          _id,
          title,
          "slug": slug.current,
          price,
          description,
          "productPhotos": photos[]{
            ...,
            "imageData": asset->metadata
          }
        }
      },
      _type == 'spacerBlock' => {
        ...,
        colSpan
      }
    }
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
    images[]{
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
    endDate,
    isSolo,
    isCurrent,  
    shortDescription,
    photoCredits,
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
    isCurrent,
    isSolo,
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
    isPrivate,
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
  *[_type == "collection" && !isPrivate] | order(date desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    date,
    isPrivate,
    shortDescription,
    location,
    collectionPhotos[0]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    price,
    description,
    photos[]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const allProductsQuery = defineQuery(`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    price,
    photos[0]{
      ...,
      "imageData": asset->metadata
    }
  }
`)

export const shopQuery = defineQuery(`
  *[_type == "shop"][0]{
    _id,
    _type,
    title,
    collections[]{
      _key,
      title,
      products[]->{
        _id,
        title,
        "slug": slug.current,
        price,
        description,
        "productPhotos": photos[]{
          ...,
          "imageData": asset->metadata
        }
      }
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

export const allPublicationsQuery = defineQuery(`
  *[_type == "publication"] | order(year desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    publicationTypes,
    image{
      ...,
      "imageData": asset->metadata
    },
    year,
    description,
    file,
    link
  }
`)

export const worksByYearQuery = defineQuery(`
  *[_type == "home"][0]{
    works2018[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2019[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2020[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2021[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2022[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2023[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2024[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    works2025[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    objectImagesWorks[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    paintingsWorks[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    drawingsWorks[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    },
    sculpturesWorks[]->{
      _id,
      _type,
      title,
      "slug": slug.current,
      images[]{
        ...,
        "imageData": asset->metadata
      },
      year,
      classification,
      size,
      location
    }
  }
`)
