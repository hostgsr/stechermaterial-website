# Publication Migration Instructions

This guide will help you migrate publications from the home document to individual publication documents.

## Prerequisites

1. **Create a Sanity Token** (if you don't have one):

   - Go to [manage.sanity.io](https://manage.sanity.io)
   - Select your project
   - Go to API section
   - Create a new token with **Editor** permissions
   - Copy the token

2. **Set Environment Variables**:
   Create a `.env.local` file in your project root (if it doesn't exist) and add:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_TOKEN=your_sanity_token_here
   ```

## Running the Migration

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Run the migration**:
   ```bash
   npm run migrate-publications
   ```

## What the Migration Does

1. **Fetches** the home document and extracts all publications from the `publications` array
2. **Creates** individual publication documents for each publication with:
   - All the same fields (title, image, year, description, file, link, publicationTypes)
   - Auto-generated slugs from titles
   - Proper document structure
3. **Removes** the publications array from the home document
4. **Logs** the progress and results

## After Migration

1. **Verify** in Sanity Studio that:

   - New publication documents were created
   - The home document no longer has a publications array
   - All data was transferred correctly

2. **Update your frontend code** to fetch publications as individual documents instead of from the home document

## Rollback (if needed)

If something goes wrong, you can:

1. Restore from a backup
2. Manually recreate the publications array in the home document
3. Delete the individual publication documents

## Troubleshooting

- **"No publications found"**: Check that your home document has a `publications` array
- **"Permission denied"**: Make sure your Sanity token has write permissions
- **"Project not found"**: Verify your project ID is correct
- **"Dataset not found"**: Check your dataset name (usually 'production')

## Safety Notes

- **Backup your data** before running the migration
- **Test in development** first if possible
- The migration is designed to be safe and will log all actions
- Each publication creation is wrapped in try-catch to handle individual failures
