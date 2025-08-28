# Sanity Import/Export Migration Method

This is the **recommended approach** for migrating publications using Sanity's built-in import/export functionality.

## Method 1: Using Sanity CLI (Recommended)

### Step 1: Export Publications

```bash
npm run export-publications
```

This will create a `publications-export.json` file with all your publications formatted for import.

### Step 2: Import Publications

```bash
sanity dataset import publications-export.json production
```

### Step 3: Clean Up Home Document

1. Go to your Sanity Studio
2. Open the Home document
3. Remove the `publications` array field
4. Save the document

## Method 2: Manual Export/Import

### Step 1: Export Current Dataset

```bash
sanity dataset export production
```

This creates a `production.tar.gz` file with all your data.

### Step 2: Extract and Modify

```bash
tar -xzf production.tar.gz
```

### Step 3: Transform Publications

1. Open the extracted JSON files
2. Find the home document
3. Extract the `publications` array
4. Create new publication documents with the same structure
5. Remove the `publications` array from the home document

### Step 4: Import Modified Data

```bash
sanity dataset import production production
```

## Method 3: Using Sanity Studio Export

### Step 1: Export from Studio

1. Go to your Sanity Studio
2. Navigate to the Home document
3. Copy the `publications` array content
4. Save it as a JSON file

### Step 2: Transform Data

Use the provided `export-publications.js` script to transform the data:

```bash
npm run export-publications
```

### Step 3: Import

```bash
sanity dataset import publications-export.json production
```

## Advantages of Import/Export Method

✅ **Safer** - No direct API calls that could fail
✅ **Reversible** - Easy to rollback by re-importing original data
✅ **Visual** - You can inspect the data before importing
✅ **Batch processing** - Handles all publications at once
✅ **Built-in validation** - Sanity CLI validates the import data

## Troubleshooting

### Import Fails

- Check that your publication schema is deployed
- Verify the JSON format is correct
- Ensure you have write permissions

### Missing Data

- Check the export file contains all publications
- Verify all required fields are present
- Look for any validation errors in the import

### Rollback

If something goes wrong:

```bash
# Restore from backup
sanity dataset import backup.tar.gz production
```

## Next Steps After Import

1. **Verify** in Sanity Studio that publication documents were created
2. **Update frontend code** to fetch publications as individual documents
3. **Test** that everything works correctly
4. **Remove** the publications array from the home document

## File Structure After Import

Your publications will be available as individual documents:

- `publication-1` (with slug, title, image, etc.)
- `publication-2` (with slug, title, image, etc.)
- etc.

Each will have all the same fields as your original publications array.
