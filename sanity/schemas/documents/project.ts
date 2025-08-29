import {DocumentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'artNumber',
      title: 'Art Nr.',
      description: 'Unique art number for this project',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      description: 'Project/Title - The main title of your project.',
      title: 'Project/Title',
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
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'technique',
      title: 'Technique',
      description: 'The technique used for this project',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'Where this project is located or was created',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      description: 'Materials used in this project',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      description: 'Array of photos for this project',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/*',
            sources: [
              {
                name: 'webp',
                format: 'webp',
                options: {quality: 100},
              },
              {
                name: 'png',
                format: 'png',
                options: {quality: 100},
              },
            ],
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              description: 'Alternative text for accessibility',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      artNumber: 'artNumber',
      year: 'year',
      media: 'photos.0',
    },
    prepare({title, artNumber, year, media}) {
      return {
        title: `${artNumber} - ${title}`,
        subtitle: year,
        media: media,
      }
    },
  },
})
