# Crew Portal Form to Google Sheet Implementation Plan

## Problem Analysis
- Current WordPress/Elementor form is failing with server errors
- Form has complex multi-section structure with various field types
- Need reliable data collection into Google Sheets without dependency on WordPress

## Solution Overview
Create a standalone web form with Google Apps Script backend for reliable data collection.

## Implementation Steps

### 1. Google Apps Script Backend (Code.gs) ✓
- [x] Create web app to receive form submissions
- [x] Handle data validation and processing
- [x] Write data directly to Google Sheet
- [x] Handle file uploads for profile pictures
- [x] Send confirmation emails
- [x] Implement CORS handling

### 2. HTML Form Interface (index.html)
- [ ] Create responsive form layout
- [ ] Implement all form sections:
  - Personal Information
  - Audio Positions
  - Video Positions
  - Lighting Positions
  - Management Positions
  - Assist Positions
  - Additional Information
- [ ] Add file upload for profile picture
- [ ] Include progress indicator

### 3. Styling (style.css)
- [ ] Create mobile-responsive design
- [ ] Match Prestige Labor Solutions branding
- [ ] Implement form section navigation
- [ ] Add loading states and animations

### 4. Client-Side Logic (script.js)
- [ ] Form validation
- [ ] Multi-step form navigation
- [ ] AJAX submission to Google Apps Script
- [ ] Error handling and user feedback
- [ ] File upload handling

### 5. Documentation (README.md)
- [ ] Setup instructions for Google Apps Script
- [ ] Deployment guide
- [ ] Configuration options
- [ ] Troubleshooting guide

## Technical Specifications

### Form Fields Structure
1. **Personal Information**
   - First Name, Last Name
   - Street Address (Line 1 & 2)
   - City, State/Province, Postal Code
   - Phone Number, Email

2. **Position Sections** (5 sections)
   - Multi-select checkboxes for positions
   - Multi-select for gear/equipment
   - Years of experience
   - Show experience checkboxes
   - Text area for strengths/experience

3. **Additional Fields**
   - Companies worked with
   - Additional skills
   - Additional comments
   - Worked with Prestige before (Yes/No)
   - Referred by
   - LinkedIn profile
   - Profile picture upload

### Google Sheet Structure
- Sheet ID: 1ewAK9DN4ZkW9uo4AZ5aXytIi9iihg4oP7ogkV5ht9hQ
- Auto-creates headers if sheet doesn't exist
- Timestamps all submissions
- Stores file uploads in Google Drive

### Security & Validation
- Client-side validation for required fields
- Server-side validation in Apps Script
- CORS handling for cross-origin requests
- Secure file upload handling

## Deployment Steps
1. Deploy Google Apps Script as web app
2. Configure permissions (anyone can access)
3. Update form with Apps Script URL
4. Test form submission
5. Monitor Google Sheet for data

## Benefits Over Current Solution
- No WordPress/Elementor dependency
- Direct integration with Google Sheets
- Better error handling and user feedback
- Easier to maintain and debug
- Can be embedded anywhere or used standalone