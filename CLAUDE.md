# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dual-deployment web form system for Prestige Labor Solutions' contractor applications. The form replaces a WordPress/Elementor solution and integrates directly with Google Sheets through Google Apps Script.

## Architecture

### Dual Deployment Structure
- **Production**: `/pls-fix-crewportal-form-to-gsheet/` - Live production form
- **Review/Staging**: `/review/` - Testing environment for changes
- Both environments share identical codebase but allow safe testing before production deployment

### Backend Integration
- **Google Apps Script**: Serverless backend handling form submissions
- **Google Sheets**: Data storage with dual-sheet structure:
  - `Raw Submissions` - Unprocessed form data
  - `Operations Ready` - Transformed data for business operations
- **Email Integration**: Automatic notifications to applicants and administrators

### Form Components
- **Multi-step form** with progress indicators
- **File uploads** (profile pictures, W-9 forms) stored in Google Drive
- **Client-side validation** with eligibility checking
- **Mobile-responsive** vanilla HTML/CSS/JavaScript

## Key Configuration

### Google Apps Script URLs
- Production: `https://script.google.com/macros/s/AKfycbxtpezLrqs8aIVN0hj62zduP3OPO5NX7kLIBUmkrfE4n_l8Jo68rua9mHEUdByqNEi3/exec`
- Google Sheet ID: `1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI`

### Email Configuration (in Code.gs)
```javascript
const EMAIL_CONFIG = {
  to: 'kyle@prestigelaborsolutions.com, ray@prestigelaborsolutions.com',
  cc: 'rosie@prestigelaborsolutions.com',
  sendToApplicant: true,
  sendToAdmins: true
};
```

## Development Workflow

### Testing Changes
1. Make changes in `/review/` directory first
2. Test using `test-connection.html` file to verify Google Sheets integration
3. Deploy review version to GitHub Pages: `https://james-techyon.github.io/pls-crewportal-intake/review/`
4. Once validated, copy changes to `/pls-fix-crewportal-form-to-gsheet/`

### Local Testing
```bash
# Serve locally for testing
python -m http.server 8000
# or
npx http-server

# Access at http://localhost:8000
```

### Deployment
- **GitHub Pages**: Automatically deploys from `main` branch
- **Production URL**: `https://james-techyon.github.io/pls-crewportal-intake/pls-fix-crewportal-form-to-gsheet/`
- **Review URL**: `https://james-techyon.github.io/pls-crewportal-intake/review/`

## Critical Files

### Form Frontend
- `index.html` - Main form structure with all contractor application fields
- `script.js` - Form handling, validation, eligibility checking, and submission logic
- `style.css` - Responsive styling and form progression UI

### Backend (Google Apps Script)
- `Code.gs` - Main Apps Script file handling form submissions and Google Sheets operations
- `Code_CORRECTED.gs` - Backup/alternative version

### Configuration & Testing
- `config.md` - Contains deployment URLs and configuration notes
- `test-connection.html` - Standalone testing tool for Google Sheets connectivity

## Data Flow

1. **Form Submission**: Client-side JavaScript collects and validates form data
2. **File Processing**: Profile pictures and W-9 forms converted to base64 and uploaded to Google Drive
3. **Backend Processing**: Google Apps Script receives JSON data via POST request
4. **Dual Storage**: Data written to both "Raw Submissions" and "Operations Ready" sheets
5. **Email Notifications**: Confirmations sent to applicant and admin team

## Security Considerations

- **CORS Handling**: Uses `no-cors` mode for Google Apps Script compatibility
- **File Upload Limits**: 5MB maximum file size
- **Data Privacy**: All data stored within client's Google environment
- **Access Control**: Google Apps Script deployed with "Anyone" access for form submissions

## Form Fields Structure

The form captures comprehensive contractor information including:
- Personal/contact information
- Audio/video/lighting technical experience
- Management and assistant roles experience
- Equipment proficiency ratings
- Previous work history and references
- File uploads (profile picture, W-9)

## Troubleshooting

### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify Google Apps Script URL in `script.js`
3. Test connection using `test-connection.html`
4. Ensure Google Apps Script has proper deployment permissions

### Google Sheets Issues
1. Verify Sheet ID in `Code.gs` matches target spreadsheet
2. Check Google Apps Script execution logs
3. Ensure proper Google Drive/Sheets permissions
4. Test with minimal data using test functions

## Emergency Procedures

### Rollback Production
If production issues occur, immediately update the production directory with known-good files from `/review/` or previous commits.

### Backend Issues
If Google Apps Script fails:
1. Check execution logs in Apps Script console
2. Redeploy the web app if needed
3. Update Sheet ID or email configurations if changed
4. Test with `test-connection.html` before going live