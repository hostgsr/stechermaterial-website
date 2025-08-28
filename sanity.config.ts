'use client'

/**
 * This config is used to set up Sanity Studio that's mounted on the `app/studio/[[...index]]/page.tsx` route
 */
import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import * as resolve from '@/sanity/plugins/resolve'
import {pageStructure, singletonPlugin} from '@/sanity/plugins/settings'
import project from '@/sanity/schemas/documents/project'
import home from '@/sanity/schemas/singletons/home'
import {visionTool} from '@sanity/vision'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

const title = 'CMS'

// Create a white theme
const whiteTheme = buildLegacyTheme({
  '--black': '#1a1a1a',
  '--white': '#ffffff',
  '--gray': '#666',
  '--gray-base': '#666',
  '--component-bg': '#ffffff',
  '--component-text-color': '#1a1a1a',
  '--brand-primary': '#1a1a1a',
  '--default-button-color': '#666',
  '--default-button-primary-color': '#1a1a1a',
  '--main-navigation-color': '#ffffff',
  '--main-navigation-color--inverted': '#1a1a1a',
  '--focus-color': '#1a1a1a',
})

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || '',
  dataset: dataset || '',
  title,
  theme: whiteTheme,
  schema: {
    // Only include home and project types
    types: [
      // Singletons
      home,
      // Documents
      project,
    ],
  },
  plugins: [
    structureTool({
      structure: pageStructure([home]),
    }),
    presentationTool({
      resolve,
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([home.name]),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
