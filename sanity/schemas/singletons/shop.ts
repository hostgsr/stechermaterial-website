import {BasketIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'shop',
  title: 'Shop',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'Title of the shop page',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      description: 'Organise your products into collections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'shopCollection',
          title: 'Collection',
          fields: [
            defineField({
              name: 'title',
              title: 'Collection Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'products',
              title: 'Products',
              description: 'Add products to this collection',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'reference',
                  to: [{type: 'product'}],
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              products: 'products',
            },
            prepare({title, products}) {
              const count = Array.isArray(products) ? products.length : 0
              return {
                title: title || 'Untitled Collection',
                subtitle: `${count} product${count === 1 ? '' : 's'}`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        subtitle: 'Shop',
        title,
      }
    },
  },
})
