# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for the feedback system.

## Prerequisites

You need:
1. A Google Cloud Project
2. Google Sheets API enabled
3. A Service Account with credentials
4. A Google Sheet to store feedback

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown and select "NEW PROJECT"
3. Enter a project name (e.g., "Hackathon Feedback")
4. Click CREATE

## Step 2: Enable Google Sheets API

1. In the Cloud Console, go to APIs & Services > Library
2. Search for "Google Sheets API"
3. Click on it and select ENABLE

## Step 3: Create a Service Account

1. Go to APIs & Services > Credentials
2. Click "CREATE CREDENTIALS" > "Service Account"
3. Fill in the service account details:
   - Service account name: "hackathon-feedback"
   - Click CREATE AND CONTINUE
4. Grant basic roles (optional, can skip)
5. Click CONTINUE, then DONE

## Step 4: Create and Download the Service Account Key

1. In APIs & Services > Credentials, find your service account
2. Click on the service account email
3. Go to the KEYS tab
4. Click ADD KEY > Create new key
5. Choose JSON format
6. Click CREATE
7. A JSON file will download - **save this securely**

## Step 5: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "+ New" to create a new spreadsheet
3. Name it "Hackathon Feedback"
4. The sheet ID is in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

## Step 6: Share the Google Sheet with Service Account

1. In your Google Sheet, click SHARE
2. Copy the `client_email` from your service account JSON file
3. Paste it in the share dialog and give it Editor access
4. Click SHARE

## Step 7: Set Environment Variables

Add these to your `.env.local` file. Extract values from the downloaded service account JSON:

```
GOOGLE_SHEETS_PROJECT_ID=your_project_id
GOOGLE_SHEETS_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email@your_project.iam.gserviceaccount.com
GOOGLE_SHEETS_CLIENT_ID=your_client_id
GOOGLE_SHEETS_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
GOOGLE_SHEETS_ID=your_spreadsheet_id
```

## Step 8: Install Dependencies

Run:
```bash
pnpm install
```

This will install the `googleapis` package.

## Step 9: Test the Integration

1. Start your dev server: `pnpm dev`
2. Go to the feedback form at `/feedback`
3. Submit a test form
4. Check your Google Sheet - the feedback should appear as a new row

## Troubleshooting

**"GOOGLE_SHEETS_ID is not set"**
- Make sure you added the GOOGLE_SHEETS_ID to .env.local
- Restart your dev server after adding env variables

**"Permission denied" error**
- Verify you shared the Google Sheet with the service account email
- Check that the service account email has Editor access

**Feedback not syncing**
- Check browser console and server logs for errors
- Verify all environment variables are correct
- Make sure the service account has the right permissions

## Notes

- The feedback is saved to Supabase first, then synced to Google Sheets
- If Google Sheets sync fails, feedback is still saved to the database (non-blocking)
- The Google Sheet is initialized with headers automatically on first request
- Data is appended to rows starting from row 2 (row 1 has headers)
