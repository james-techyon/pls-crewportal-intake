# Fix Google Sheet Format - Quick Steps

The Google Apps Script only creates headers when making a NEW sheet. To apply the new format:

## Option 1: Delete and Recreate Sheet (Easiest)

1. **Open your Google Sheet**: 
   https://docs.google.com/spreadsheets/d/1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI/

2. **Delete the existing "Form Responses" sheet**:
   - Right-click on the "Form Responses" tab at the bottom
   - Select "Delete"
   - Confirm deletion

3. **Submit a test entry** from the form
   - The Apps Script will create a new sheet with the correct headers
   - Your data will now be in the proper format

## Option 2: Manually Update Headers (Keep Existing Data)

If you have data you want to keep, manually update the headers:

1. **Open your Google Sheet**

2. **Replace Row 1 with these headers** (copy and paste):
   ```
   Submitted on	Full Name	Company Name if any	Phone	Email	Direct Deposit ACH Request Form	W - 9 form	PLS Independent Contractor Agreement Rev	Notes	General	Audio	Video	Lighting	LED	Projection	Scenic	Camera	Information Technology	Breakout	Computer	Leadership	Equipment Operator	Years of Experience	Billing Address	What State Do You Live In?	Major Cities You Work As A Local	How did you hear about us	Rates	Onboarding Docs Status	Quickbooks Singup Status	Chase Vendor Status	Organized in Contacts & by State	covid vaccination card	Onsite Ranking	Lead Proformance	select	checkbox	Docusign	GOOGLE review
   ```

3. **Delete all old data rows** (Row 2 and below) since they won't match the new format

4. **Submit a new test entry** to verify it works

## Option 3: Create a New Sheet Tab

1. **Rename the existing sheet**:
   - Right-click "Form Responses" tab
   - Select "Rename"
   - Change to "Old Form Responses"

2. **Update the Apps Script** to use a different sheet name:
   - Go to https://script.google.com
   - Open your project
   - Change line 6 from:
     ```javascript
     const SHEET_NAME = 'Form Responses';
     ```
     To:
     ```javascript
     const SHEET_NAME = 'New Form Responses';
     ```
   - Save and redeploy

3. **Submit a test entry**
   - A new sheet "New Form Responses" will be created with correct format

## Verify the New Format

After fixing, your sheet should have these columns:
- Submitted on
- Full Name (combined first + last)
- Company Name if any
- Phone
- Email
- Document columns (Direct Deposit, W-9, etc.)
- Skill categories (General, Audio, Video, Lighting, etc.)
- Years of Experience
- Billing Address (combined)
- What State Do You Live In?
- And more...

Total: 39 columns matching your existing table structure.