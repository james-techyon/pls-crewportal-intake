# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Web-based contractor application form for Prestige Labor Solutions that replaces a WordPress/Elementor solution. Features dual-deployment (production/staging) and integrates with Google Sheets via Google Apps Script for data storage and email notifications.

## Architecture

### Deployment Structure
- **Production**: `/pls-fix-crewportal-form-to-gsheet/` - Live at `https://james-techyon.github.io/pls-crewportal-intake/pls-fix-crewportal-form-to-gsheet/`
- **Staging**: `/review/` - Testing at `https://james-techyon.github.io/pls-crewportal-intake/review/`
- Both directories contain identical codebases - test in `/review/` before copying to production

### Tech Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework dependencies)
- **Backend**: Google Apps Script (serverless)
- **Storage**: Google Sheets with dual-sheet structure (Raw Submissions + Operations Ready)
- **Hosting**: GitHub Pages (deploys from `main` branch)

## Development Commands

```bash
# Local development server
python -m http.server 8000
# or
npx http-server

# No build process required - static files only
# Deploy by pushing to main branch (GitHub Pages auto-deploys)
```

## Critical Configuration

### Google Apps Script (in script.js)
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtpezLrqs8aIVN0hj62zduP3OPO5NX7kLIBUmkrfE4n_l8Jo68rua9mHEUdByqNEi3/exec';
```

### Google Sheets (in Code.gs)
```javascript
const SHEET_ID = '1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI';
const EMAIL_CONFIG = {
  to: 'rosie@prestigelaborsolutions.com',  // Update for production
  sendToApplicant: false,
  sendToAdmins: true
};
```

## Core Files

### Frontend
- `index.html` - Multi-section form with ~200 fields for contractor applications
- `script.js` - Form validation, eligibility checking, file upload handling, submission to Google Apps Script
- `style.css` - Responsive styling with progress indicators

### Backend (Google Apps Script)
- `Code.gs` - Handles POST requests, writes to Google Sheets, sends emails, manages file uploads to Google Drive
- Processes W-9 forms (mandatory) and profile pictures (optional)
- Creates two sheet entries per submission: raw data and operations-ready format

## Development Workflow

1. Always test changes in `/review/` directory first
2. Use empty `test-connection.html` file to verify Google Sheets connectivity
3. Check browser console for errors during form submission
4. Once validated, copy changes to `/pls-fix-crewportal-form-to-gsheet/`

## Form Data Flow

1. User fills multi-section form with eligibility checks
2. JavaScript validates required fields and calculates eligibility status
3. Files converted to base64 for transmission
4. POST request sent to Google Apps Script (using `no-cors` mode)
5. Apps Script stores files in Google Drive, writes to both sheets
6. Email notifications sent based on configuration
7. Success/error message displayed to user

## Troubleshooting

### Common Issues
- **Form not submitting**: Check Google Apps Script URL in script.js
- **CORS errors**: Ensure using `mode: 'no-cors'` in fetch request
- **Missing data**: Verify field mappings between HTML form and Code.gs
- **W-9 required**: Form enforces W-9 upload for IRS compliance

### Google Apps Script Debugging
- Check execution logs at script.google.com
- Ensure web app is deployed with "Anyone" access
- Verify Sheet ID matches target spreadsheet
- Test with minimal data first