# Setup Guide for New Google Sheet

Follow these steps to deploy the form with your new Google Sheet:

## Step 1: Deploy Google Apps Script

1. **Open Google Apps Script**
   - Go to https://script.google.com
   - Click "New project"

2. **Copy the Code**
   - Delete any default code in the script editor
   - Copy ALL the code from `Code.gs` in this repository
   - Paste it into the script editor
   - The Sheet ID has already been updated to: `1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI`

3. **Save the Project**
   - Click File → Save
   - Name it "Crew Portal Form Handler" (or any name you prefer)

4. **Deploy as Web App**
   - Click "Deploy" → "New deployment"
   - Click the gear icon ⚙️ next to "Select type"
   - Choose "Web app"
   - Configure as follows:
     - Description: "Crew Portal Form Handler v1"
     - Execute as: **Me** (your email)
     - Who has access: **Anyone** (IMPORTANT: Must be "Anyone" not "Anyone with Google account")
   - Click "Deploy"

5. **Authorize the Script**
   - You'll see an authorization prompt
   - Click "Authorize access"
   - Choose your Google account
   - If you see "Google hasn't verified this app":
     - Click "Advanced"
     - Click "Go to Crew Portal Form Handler (unsafe)"
     - Click "Allow"

6. **Copy the Web App URL**
   - After deployment, you'll see a URL like:
     `https://script.google.com/macros/s/AKfycbw.../exec`
   - **COPY THIS URL** - you'll need it for the next step

## Step 2: Update the Form JavaScript

1. **Open script.js**
   - In this repository, open `script.js`

2. **Update the URL**
   - Find line 3:
     ```javascript
     const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVwN3YWvxoXmYh1Qt34-wgzuF9HKVCDYa80jv0dct_-Cfej0Lt9-yA7LiwMr0KGCs5/exec';
     ```
   - Replace the URL with your new deployment URL from Step 1.6

## Step 3: Test the Connection

1. **Open test-connection.html**
   - Open `test-connection.html` in your web browser
   - Update the Script URL field with your new deployment URL
   - Click each test button in order:
     - Test GET Request
     - Test Simple POST
     - Test Full Form POST

2. **Check Your Google Sheet**
   - Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI/
   - You should see a new sheet called "Form Responses" with headers
   - Test submissions should appear as new rows

## Step 4: Deploy the Form

1. **Host the Files**
   - Upload these files to your web server:
     - `index.html`
     - `style.css`
     - `script.js` (with updated URL)

2. **Test the Live Form**
   - Navigate to your hosted form
   - Fill out and submit a test entry
   - Verify it appears in your Google Sheet

## Troubleshooting

### If submissions aren't appearing:

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any error messages when submitting

2. **Verify Apps Script Logs**
   - In Google Apps Script, click "Executions" in the left sidebar
   - Look for any failed executions and their error messages

3. **Common Issues**:
   - **403 Error**: Apps Script not deployed with "Anyone" access
   - **No data in sheet**: Check that form field names match the mapping in script.js
   - **Script not found**: URL is incorrect or deployment failed

4. **Re-deploy if Needed**:
   - In Apps Script, click "Deploy" → "Manage deployments"
   - Click the pencil icon to edit
   - Increment the version number
   - Ensure "Anyone" access is selected
   - Click "Deploy"
   - Update script.js with new URL if it changed

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify all URLs are correct
3. Ensure Google Sheet has proper permissions
4. Check Apps Script execution logs

The form should now submit data to your new Google Sheet!