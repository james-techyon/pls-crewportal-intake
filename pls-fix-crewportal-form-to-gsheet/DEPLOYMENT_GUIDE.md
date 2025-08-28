# Quick Deployment Guide

## Step 1: Google Apps Script Setup (5 minutes)

1. Go to https://script.google.com
2. Click "New Project"
3. Delete the default code
4. Copy ALL contents from `Code.gs` and paste
5. Find this line: `const SHEET_ID = '1ewAK9DN4ZkW9uo4AZ5aXytIi9iihg4oP7ogkV5ht9hQ';`
   - This is already your sheet ID, no change needed!
6. Click the 💾 save icon
7. Name your project: "Crew Portal Form Handler"

## Step 2: Deploy the Script (2 minutes)

1. Click "Deploy" button (top right) → "New Deployment"
2. Click the ⚙️ gear → "Web app"
3. Fill in:
   - Description: "Crew Portal Form v1"
   - Execute as: "Me"
   - Who has access: "Anyone" ⚠️ Important!
4. Click "Deploy"
5. Click "Authorize access" and approve
6. **COPY THE WEB APP URL** - It looks like:
   ```
   https://script.google.com/macros/s/AKfycbw.../exec
   ```

## Step 3: Update Form Configuration (1 minute)

1. Open `script.js` in a text editor
2. Find line 3:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_DEPLOYED_WEB_APP_URL_HERE';
   ```
3. Replace with your URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw.../exec';
   ```
4. Save the file

## Step 4: Test Locally (2 minutes)

1. Open terminal in the project folder
2. Run: `python -m http.server 8000`
3. Open browser: http://localhost:8000
4. Fill out form with test data
5. Submit and check your Google Sheet!

## Step 5: Deploy to Production

### Option A: Upload to Your Web Server
- Upload all files via FTP/cPanel
- Access at: `yourwebsite.com/crew-form/`

### Option B: GitHub Pages (Free)
1. Push to GitHub
2. Settings → Pages → Deploy from branch
3. Access at: `yourusername.github.io/repository-name`

### Option C: Embed in WordPress
1. Create new page in WordPress
2. Add Custom HTML block
3. Paste the form HTML
4. Add CSS/JS to theme

## Verification Checklist

- [ ] Google Apps Script deployed as "Anyone can access"
- [ ] Web App URL copied correctly to script.js
- [ ] Test submission appears in Google Sheet
- [ ] Email confirmation received (if email provided)
- [ ] Form accessible from production URL

## Need Help?

Common issues:
- **"Server Error"**: Check Apps Script URL is correct
- **No data in sheet**: Verify sheet name is "Form Responses"
- **Permission denied**: Redeploy as "Anyone can access"

## Your Specific Setup

- Sheet ID: `1ewAK9DN4ZkW9uo4AZ5aXytIi9iihg4oP7ogkV5ht9hQ` ✅
- Sheet URL: https://docs.google.com/spreadsheets/d/1ewAK9DN4ZkW9uo4AZ5aXytIi9iihg4oP7ogkV5ht9hQ/edit
- Form replaces: https://prestigelaborsolutions.com/freelancerapplication/