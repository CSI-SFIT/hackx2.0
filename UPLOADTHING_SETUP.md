# Uploadthing Setup Guide

This project now uses [Uploadthing](https://uploadthing.com) for project image uploads.

## Setup Steps

### 1. Create an Uploadthing Account
- Go to [uploadthing.com](https://uploadthing.com)
- Sign up for a free account
- Create a new project/app

### 2. Get Your App ID
- In the Uploadthing dashboard, copy your **App ID**
- Add it to your `.env.local`:
  ```
  NEXT_PUBLIC_UPLOADTHING_APP_ID="your_app_id_here"
  ```

### 3. Configure File Router
The file router is already configured in `libs/uploadthing/index.ts` with the following settings:
- **Endpoint**: `projectImageUploader`
- **Max File Size**: 4MB per image
- **Max File Count**: 4 images per upload
- **Allowed Types**: PNG, JPEG, WEBP

### 4. API Route
The uploadthing API route is configured at:
- `app/api/uploadthing/route.ts`

This handles all upload requests automatically.

## Features

✅ Drag-and-drop image upload  
✅ Multiple file selection  
✅ 4-image maximum limit  
✅ 4MB max size per image  
✅ Preview and remove functionality  
✅ Toast notifications for upload status  
✅ Automatic URL generation after upload  

## Usage

The image uploader is used in the project submission form at `app/submit/page.tsx`.

### Component Props:
- `existingImages` - Already uploaded images (URLs)
- `newImages` - Newly uploaded images (URLs)  
- `onAddImages` - Callback when new images are uploaded
- `onRemoveExistingImage` - Remove existing image by index
- `onRemoveNewImage` - Remove new image by index
- `isLightMode` - Theme preference
- `maxImages` - Maximum images allowed (default: 4)

## Testing Locally

After setting your `NEXT_PUBLIC_UPLOADTHING_APP_ID`, run:
```bash
npm run dev
```

Navigate to the submit page at `/submit` and test the image upload functionality.

## Troubleshooting

**"Missing NEXT_PUBLIC_UPLOADTHING_APP_ID"** error:
- Ensure the environment variable is set in `.env.local`
- Restart the dev server after adding the variable

**Upload fails silently:**
- Check browser console for error messages
- Verify your Uploadthing app ID is correct
- Ensure images are under 4MB in size

## Database Storage

Image URLs returned from Uploadthing are stored in the Supabase database under:
- Table: `projects`
- Column: `image_urls` (array of URLs)

The URLs are permanent and can be used indefinitely.
