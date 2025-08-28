import { createClient } from '@sanity/client'
import { slugify } from '@sanity/client'

// Configure Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-27',
  token: process.env.SANITY_TOKEN, // You'll need to create a token with write permissions
  useCdn: false,
})

async function migratePublications() {
  try {
    console.log('Starting publication migration...')

    // 1. Fetch the home document
    const homeDoc = await client.getDocument('home')
    
    if (!homeDoc || !homeDoc.publications || homeDoc.publications.length === 0) {
      console.log('No publications found in home document')
      return
    }

    console.log(`Found ${homeDoc.publications.length} publications to migrate`)

    // 2. Create individual publication documents
    const createdPublications = []
    
    for (const publication of homeDoc.publications) {
      try {
        // Generate a slug from the title
        const slug = publication.title 
          ? slugify(publication.title, { lower: true, strict: true })
          : `publication-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Create the publication document
        const newPublication = await client.create({
          _type: 'publication',
          title: publication.title,
          slug: {
            _type: 'slug',
            current: slug
          },
          publicationTypes: publication.publicationTypes || [],
          image: publication.image,
          year: publication.year,
          description: publication.description,
          file: publication.file,
          link: publication.link,
        })

        createdPublications.push(newPublication)
        console.log(`Created publication: ${publication.title}`)
      } catch (error) {
        console.error(`Error creating publication "${publication.title}":`, error)
      }
    }

    // 3. Update the home document to remove the publications array
    await client.patch('home').unset(['publications']).commit()
    console.log('Removed publications array from home document')

    console.log(`Migration completed! Created ${createdPublications.length} publication documents`)
    console.log('Created publications:', createdPublications.map(p => p.title))

  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration
migratePublications() 