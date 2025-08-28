// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

// Configure Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-02-27',
  useCdn: false,
})

async function exportPublications() {
  try {
    console.log('Exporting publications from home document...')

    // Fetch the home document
    const homeDoc = await client.getDocument('home')
    
    if (!homeDoc || !homeDoc.publications || homeDoc.publications.length === 0) {
      console.log('No publications found in home document')
      return
    }

    console.log(`Found ${homeDoc.publications.length} publications`)

    // Transform publications to the format needed for import
    const publicationsForImport = homeDoc.publications.map((pub, index) => ({
      _type: 'publication',
      _id: `publication-${Date.now()}-${index}`,
      title: pub.title,
      slug: {
        _type: 'slug',
        current: pub.title 
          ? pub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
          : `publication-${Date.now()}-${index}`
      },
      publicationTypes: pub.publicationTypes || [],
      image: pub.image,
      year: pub.year,
      description: pub.description,
      file: pub.file,
      link: pub.link,
    }))

    // Create the export data
    const exportData = {
      documents: publicationsForImport
    }

    // Write to file
    const outputPath = path.join(process.cwd(), 'publications-export.json')
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2))

    console.log(`✅ Exported ${publicationsForImport.length} publications to publications-export.json`)
    console.log('📁 File location:', outputPath)
    console.log('\n📋 Next steps:')
    console.log('1. Import this file using: sanity dataset import publications-export.json production')
    console.log('2. Remove the publications array from your home document in Sanity Studio')
    console.log('3. Update your frontend code to fetch publications as individual documents')

  } catch (error) {
    console.error('Export failed:', error)
  }
}

// Run the export
exportPublications() 