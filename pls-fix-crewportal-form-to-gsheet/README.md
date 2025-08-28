# Crew Portal Form to Google Sheet

A standalone web form solution for collecting contractor applications and storing them directly in Google Sheets. This replaces the WordPress/Elementor form that was experiencing server errors.

## Features

- ✅ Multi-step form with progress indicator
- ✅ All original form fields preserved
- ✅ Client-side validation
- ✅ Direct Google Sheets integration
- ✅ File upload support for profile pictures
- ✅ Email confirmation to applicants
- ✅ Mobile-responsive design
- ✅ No WordPress dependencies

## Quick Start

### 1. Deploy Google Apps Script

1. Open [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the contents of `Code.gs` into the script editor
4. Update the `SHEET_ID` constant with your Google Sheet ID (from the URL)
5. Save the project with a meaningful name

### 2. Deploy as Web App

1. In Apps Script, click "Deploy" → "New Deployment"
2. Choose type: "Web app"
3. Configure:
   - Description: "Crew Portal Form Handler"
   - Execute as: "Me"
   - Who has access: "Anyone"
4. Click "Deploy"
5. Copy the Web App URL (you'll need this)

### 3. Configure the Form

1. Open `script.js`
2. Replace `YOUR_DEPLOYED_WEB_APP_URL_HERE` with your Apps Script URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```

### 4. Host the Form

#### Option A: GitHub Pages (Recommended)
1. Push files to GitHub repository
2. Go to Settings → Pages
3. Select source branch and folder
4. Your form will be available at: `https://[username].github.io/[repository]`

#### Option B: Any Web Server
1. Upload all files to your web server
2. Ensure files maintain their structure:
   ```
   /
   ├── index.html
   ├── style.css
   ├── script.js
   └── README.md
   ```

#### Option C: Embed in Existing Site
1. Include the CSS and JS files in your page
2. Copy the form HTML into your page
3. Ensure the script URL is configured

## Google Sheet Setup

The script will automatically create columns if they don't exist. Expected columns:

1. Timestamp
2. First Name
3. Last Name
4. Street Address
5. Street Address Line 2
6. City
7. State/Province
8. Postal/Zip Code
9. Phone Number
10. Email
11. Audio Positions
12. Audio Gear Operated
13. Audio Years Experience
14. Audio Show Experience
15. Audio Strengths
16. Video Positions
17. Video Gear Operated
18. Video Years Experience
19. Video Show Experience
20. Video Strengths
21. Lighting Positions
22. Lighting Gear Operated
23. Lighting Years Experience
24. Lighting Show Experience
25. Lighting Strengths
26. Management Positions
27. Management Skillsets
28. Management Years Experience
29. Management Show Experience
30. Management Experience
31. Assist Positions
32. Assist Equipment Comfort
33. Assist Years Experience
34. Assist Show Experience
35. Assist Main Strengths
36. Companies Worked With
37. Additional Skills
38. Additional Comments
39. Worked with Prestige Before
40. Referred By
41. LinkedIn Profile
42. Profile Picture URL

## Customization

### Modify Form Fields

Edit `index.html` to add/remove fields. Make sure to:
1. Update the HTML form elements
2. Update `Code.gs` to handle new fields
3. Add validation in `script.js` if needed

### Styling

Modify `style.css` to match your brand:
- Colors: Update the color variables
- Fonts: Change the font-family
- Layout: Adjust spacing and sizes

### Email Notifications

In `Code.gs`, modify the `sendConfirmationEmail` function to customize:
- Email subject
- Email body template
- Add CC/BCC recipients

## Troubleshooting

### Form Not Submitting

1. Check browser console for errors
2. Verify Apps Script URL is correct
3. Ensure Apps Script is deployed with "Anyone" access
4. Check that Google Sheet ID is correct

### Data Not Appearing in Sheet

1. Verify sheet name in `Code.gs`
2. Check Apps Script execution logs
3. Ensure proper permissions on Google Sheet
4. Test with the `testDoPost` function in Apps Script

### File Upload Issues

1. Check file size (5MB limit)
2. Verify file type (images only)
3. Ensure Google Drive permissions
4. Check available storage in Google Drive

## Security Considerations

1. **CORS**: The form uses `no-cors` mode for Google Apps Script compatibility
2. **Validation**: Both client and server-side validation implemented
3. **File Uploads**: Stored in Google Drive with restricted access
4. **Data Privacy**: All data stored in your Google Sheet

## Testing

1. **Local Testing**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```
   Then open: http://localhost:8000

2. **Test Submission**:
   - Fill out all required fields
   - Submit form
   - Check Google Sheet for new row
   - Verify email confirmation sent

## Support

For issues or questions:
1. Check the browser console for errors
2. Review Apps Script execution logs
3. Verify all configuration steps completed
4. Test with minimal data first

## License

This project is provided as-is for Prestige Labor Solutions.