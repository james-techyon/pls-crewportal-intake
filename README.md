# PLS Crew Portal Intake Form

This repository contains the Crew Portal intake form for Prestige Labor Solutions.

## Directory Structure

- `/pls-fix-crewportal-form-to-gsheet/` - Production version
- `/review/` - Review/staging version for testing

## Deployment URLs

### Production
- **URL**: https://james-techyon.github.io/pls-crewportal-intake/pls-fix-crewportal-form-to-gsheet/
- **Purpose**: Live production form

### Review/Staging  
- **URL**: https://james-techyon.github.io/pls-crewportal-intake/review/
- **Purpose**: Testing and review before production deployment

## Setup Instructions

1. Fork or clone this repository
2. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
3. The forms will be available at the URLs above

## Google Apps Script Configuration

Both instances use the same Google Apps Script backend:
- **Script URL**: `https://script.google.com/macros/s/AKfycbxtpezLrqs8aIVN0hj62zduP3OPO5NX7kLIBUmkrfE4n_l8Jo68rua9mHEUdByqNEi3/exec`
- **Sheet ID**: `1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI`

## Testing

Use the `test-connection.html` file in either directory to test the Google Sheets connection before going live.

## Support

For issues or questions, contact the development team.