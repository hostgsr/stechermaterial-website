import {DocumentIcon, ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  icon: DocumentIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'descriptionMedium',
      title: 'Description | Medium',
      description: 'e.g., "Mixed media on wood"',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g., "100 x 80 cm" or "24 x 18 inches"',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'classification',
      title: 'Classification',
      type: 'string',
      options: {
        list: [
          {title: 'Paintings', value: 'paintings'},
          {title: 'Object Images', value: 'object-images'},
          {title: 'Drawings', value: 'drawings'},
          {title: 'Sculptures', value: 'sculptures'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      classification: 'classification',
      media: 'images.0',
    },
    prepare(selection) {
      const {title, year, classification, media} = selection
      return {
        title: title,
        subtitle: `${year} • ${classification}`,
        media: media,
      }
    },
  },
})
