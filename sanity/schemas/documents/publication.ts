import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: DocumentIcon,

  fields: [
    defineField({
      name: 'publicationTypes',
      title: 'Publication Types',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: 'Press', value: 'press'},
              {title: 'Books', value: 'books'},
              {title: 'Interviews', value: 'interviews'},
              {title: 'Video', value: 'video'},
              {title: 'Talks', value: 'talks'},
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      publicationTypes: 'publicationTypes',
      media: 'image.asset',
    },
    prepare(selection) {
      const {title, year, publicationTypes, media} = selection
      const types = publicationTypes?.join(', ') || 'No type'
      return {
        title: title,
        subtitle: `${year} • ${types}`,
        media: media,
      }
    },
  },
})
