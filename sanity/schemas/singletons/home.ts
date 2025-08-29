import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: HomeIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageGallery',
      title: 'Image Gallery',
      description: 'Gallery of images for the home page',
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
        },
      ],
    }),
    defineField({
      name: 'imageGalleryMobile',
      title: 'Image Gallery Mobile',
      description: 'Gallery of images for the home page mobile',
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
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        subtitle: 'Home',
        title,
      }
    },
  },
})
