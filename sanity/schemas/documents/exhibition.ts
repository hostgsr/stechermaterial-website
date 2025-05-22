import {DocumentIcon, ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'exhibition',
  title: 'Exhibitions',
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
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief summary',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'assignedWorks',
      title: 'Assigned Works',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'work'}],
        },
      ],
    }),
    defineField({
      name: 'exhibitionPhotos',
      title: 'Exhibition Photos',
      type: 'array',
      of: [
        {
          type: 'image',

          //   fields: [
          //     {
          //       name: 'alt',
          //       type: 'string',
          //       title: 'Alternative text',
          //     },
          //     {
          //       name: 'caption',
          //       type: 'string',
          //       title: 'Caption',
          //     },
          //   ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      location: 'location',
      media: 'exhibitionPhotos.0',
    },
    prepare(selection) {
      const {title, date, location, media} = selection
      const formattedDate = date ? new Date(date).getFullYear() : 'No date'
      return {
        title: title,
        subtitle: `${formattedDate} • ${location || 'Location TBD'}`,
        media: media,
      }
    },
  },
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date (oldest first)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
