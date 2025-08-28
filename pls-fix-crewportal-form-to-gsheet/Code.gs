// Google Apps Script for Crew Portal Form Submission
// This script handles form submissions and writes data to Google Sheets

// Configuration
const SHEET_ID = '1Z1NTy7di7Xx4M5j1Ji4dKdjMymwcwOOnYbMxUWa4SMI';
const RAW_SHEET_NAME = 'Raw Submissions';
const OPS_SHEET_NAME = 'Operations Ready';

// Email notification configuration
const EMAIL_CONFIG = {
  to: 'kyle@prestigelaborsolutions.com, ray@prestigelaborsolutions.com',  // Primary recipients (comma-separated)
  cc: 'rosie@prestigelaborsolutions.com',                                 // CC recipient(s) - can be comma-separated list
  sendToApplicant: true,                                                  // Whether to also send confirmation to applicant
  sendToAdmins: true                                                      // Whether to send notification to admin emails above
};

// Main function to handle POST requests
function doPost(e) {
  try {
    // Parse the form data
    const formData = JSON.parse(e.postData.contents);
    
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    // Get or create both sheets
    let rawSheet = spreadsheet.getSheetByName(RAW_SHEET_NAME);
    if (!rawSheet) {
      rawSheet = createRawSheet(spreadsheet);
    }
    
    let opsSheet = spreadsheet.getSheetByName(OPS_SHEET_NAME);
    if (!opsSheet) {
      opsSheet = createOpsSheet(spreadsheet);
    }
    
    // Handle file uploads
    let profilePictureUrl = '';
    if (formData.profilePictureData) {
      profilePictureUrl = uploadFile(
        formData.profilePictureData,
        formData.profilePictureName || 'profile.jpg',
        formData.profilePictureMimeType || 'image/jpeg'
      );
    }
    
    let w9FileUrl = '';
    if (formData.w9FileData) {
      w9FileUrl = uploadFile(
        formData.w9FileData,
        formData.w9FileName || 'w9-form.pdf',
        formData.w9FileMimeType || 'application/pdf'
      );
    }
    
    // Append raw data to Raw Submissions sheet
    const rawRow = appendRawData(rawSheet, formData, profilePictureUrl, w9FileUrl);
    
    // Transform and append to Operations Ready sheet
    const opsRow = appendTransformedData(opsSheet, formData, profilePictureUrl, w9FileUrl);
    
    // Send email notifications
    sendEmailNotifications(formData, rawRow, opsRow);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Form submitted successfully',
      rawRow: rawRow,
      opsRow: opsRow
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to create Raw Submissions sheet with headers
function createRawSheet(spreadsheet) {
  // Create new sheet
  const sheet = spreadsheet.insertSheet(RAW_SHEET_NAME);
  
  // Define raw headers (unchanged form data)
  const headers = [
    'Timestamp',
    'First Name',
    'Last Name', 
    'Street Address',
    'Street Address Line 2',
    'City',
    'State / Province',
    'Postal / Zip Code',
    'Phone Number',
    'Email',
    // Audio Section
    'Audio Positions',
    'Audio Gear Operated',
    'Audio Years Experience',
    'Audio Shows',
    'Audio Main Strengths',
    // Video Section  
    'Video Positions',
    'Video Gear Operated',
    'Video Years Experience',
    'Video Shows',
    'Video Main Strengths',
    // Lighting Section
    'Lighting Positions',
    'Lighting Gear Operated',
    'Lighting Years Experience',
    'Lighting Shows',
    'Lighting Main Strengths',
    // Management Section
    'Management Positions',
    'Management Skillsets',
    'Management Years Experience',
    'Management Shows',
    'Management Experience',
    // Assist Positions Section
    'Assist Positions',
    'Equipment Comfort Level',
    'Assist Years Experience',
    'Assist Shows',
    'Assist Main Strengths',
    // Additional Info
    'Companies Worked With',
    'Additional Skills',
    'Additional Comments',
    'Worked With Prestige Before',
    'Referred By',
    'LinkedIn Profile',
    'Profile Picture URL',
    // Tax Information
    'Tax Method',
    'W-9 File URL',
    'Legal Business Name',
    'Business Type',
    'Tax ID',
    // Banking Details
    'Bank Name',
    'Account Type',
    'Routing Number',
    'Account Number',
    // Terms & Conditions
    'Terms Accepted',
    'Electronic Signature',
    'Signature Date',
    // Eligibility Tracking
    'Eligibility Status',
    'Is Eligible',
    'Missing Requirements'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  
  return sheet;
}

// Function to create Operations Ready sheet with transformed headers
function createOpsSheet(spreadsheet) {
  // Create new sheet
  const sheet = spreadsheet.insertSheet(OPS_SHEET_NAME);
  
  // Define operations headers (matching reference table structure)
  const headers = [
    'Submitted on',
    'Full Name',
    'Company Name if any',
    'Phone',
    'Email',
    'Direct Deposit ACH Request Form',
    'W - 9 form',
    'PLS Independent Contractor Agreement Rev',
    'Notes',
    'General',
    'Audio',
    'Video',
    'Lighting',
    'LED',
    'Projection',
    'Scenic',
    'Camera',
    'Information Technology',
    'Breakout',
    'Computer',
    'Leadership',
    'Equipment Operator',
    'Years of Experience',
    'Billing Address',
    'What State Do You Live In?',
    'Major Cities You Work As A Local',
    'How did you hear about us',
    'Rates',
    'Onboarding Docs Status',
    'Quickbooks Singup Status',
    'Chase Vendor Status',
    'Organized in Contacts & by State',
    'covid vaccination card',
    'Onsite Ranking',
    'Lead Proformance',
    'select',
    'checkbox',
    'Docusign',
    'GOOGLE review',
    // New eligibility tracking columns
    'Work Eligibility Status',
    'Payment Setup Status',
    'Missing Requirements'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  
  return sheet;
}

// Function to append raw data to Raw Submissions sheet
function appendRawData(sheet, formData, profilePictureUrl, w9FileUrl) {
  const timestamp = new Date();
  
  // Direct mapping of form data without transformation
  const rowData = [
    timestamp,
    formData.firstName || '',
    formData.lastName || '',
    formData.streetAddress || '',
    formData.streetAddress2 || '',
    formData.city || '',
    formData.state || '',
    formData.postalCode || '',
    formData.phoneNumber || '',
    formData.email || '',
    // Audio Section
    arrayToString(formData.audioPositions),
    arrayToString(formData.audioGearOperated),
    formData.audioYearsExperience || '',
    arrayToString(formData.audioShowExperience),
    formData.audioStrengths || '',
    // Video Section
    arrayToString(formData.videoPositions),
    arrayToString(formData.videoGearOperated),
    formData.videoYearsExperience || '',
    arrayToString(formData.videoShowExperience),
    formData.videoStrengths || '',
    // Lighting Section
    arrayToString(formData.lightingPositions),
    arrayToString(formData.lightingGearOperated),
    formData.lightingYearsExperience || '',
    arrayToString(formData.lightingShowExperience),
    formData.lightingStrengths || '',
    // Management Section
    arrayToString(formData.managementPositions),
    arrayToString(formData.managementSkillsets),
    formData.managementYearsExperience || '',
    arrayToString(formData.managementShowExperience),
    formData.managementExperience || '',
    // Assist Positions Section
    arrayToString(formData.assistPositions),
    formData.assistEquipmentComfort || '',
    formData.assistYearsExperience || '',
    arrayToString(formData.assistShowExperience),
    formData.assistMainStrengths || '',
    // Additional Info
    formData.companiesWorkedWith || '',
    formData.additionalSkills || '',
    formData.additionalComments || '',
    formData.workedWithPrestige || '',
    formData.referredBy || '',
    formData.linkedinProfile || '',
    profilePictureUrl,
    // Tax Information
    formData.taxMethod || '',
    w9FileUrl || '',
    formData.legalBusinessName || '',
    formData.businessType || '',
    formData.taxId || '',
    // Banking Details
    formData.bankName || '',
    formData.accountType || '',
    formData.routingNumber || '',
    formData.accountNumber || '',
    // Terms & Conditions
    arrayToString(formData.termsAccepted),
    formData.electronicSignature || '',
    formData.signatureDate || '',
    // Eligibility Tracking
    formData.eligibilityStatus || '',
    formData.isEligible || false,
    formData.missingRequirements || ''
  ];
  
  sheet.appendRow(rowData);
  return sheet.getLastRow();
}

// Function to append transformed data to Operations Ready sheet
function appendTransformedData(sheet, formData, profilePictureUrl, w9FileUrl) {
  const timestamp = new Date();
  
  // Combine first and last name
  const fullName = ((formData.firstName || '') + ' ' + (formData.lastName || '')).trim();
  
  // Combine address fields
  const billingAddress = [
    formData.streetAddress,
    formData.streetAddress2,
    formData.city,
    formData.state,
    formData.postalCode
  ].filter(Boolean).join(', ');
  
  // Get highest experience level
  const yearsOfExperience = getHighestExperience([
    formData.audioYearsExperience,
    formData.videoYearsExperience,
    formData.lightingYearsExperience,
    formData.managementYearsExperience,
    formData.assistYearsExperience
  ]);
  
  // Map skills to categories
  const skills = mapSkillCategories(formData);
  
  // Combine notes from all strength/experience fields
  const notes = [
    formData.additionalComments,
    formData.audioStrengths ? 'Audio: ' + formData.audioStrengths : '',
    formData.videoStrengths ? 'Video: ' + formData.videoStrengths : '',
    formData.lightingStrengths ? 'Lighting: ' + formData.lightingStrengths : '',
    formData.managementExperience ? 'Management: ' + formData.managementExperience : '',
    formData.assistMainStrengths ? 'Assist: ' + formData.assistMainStrengths : ''
  ].filter(Boolean).join(' | ');
  
  // Determine document status
  const hasDirectDeposit = formData.bankName && formData.accountNumber && formData.routingNumber ? 'Yes' : 'No';
  const hasW9 = w9FileUrl || (formData.taxId && formData.businessType) ? 'Yes' : 'No';
  const hasAgreement = formData.termsAccepted && formData.electronicSignature ? 'Yes' : 'No';
  
  // Determine payment setup status
  const paymentSetupStatus = hasDirectDeposit === 'Yes' ? 'COMPLETE' : 'INCOMPLETE';
  
  // Transformed row data
  const rowData = [
    timestamp,                                    // Submitted on
    fullName,                                     // Full Name
    formData.companiesWorkedWith || '',          // Company Name if any
    formData.phoneNumber || '',                  // Phone
    formData.email || '',                        // Email
    hasDirectDeposit,                            // Direct Deposit ACH Request Form
    hasW9,                                        // W - 9 form
    hasAgreement,                                // PLS Independent Contractor Agreement Rev
    notes,                                        // Notes
    skills.general || '',                        // General
    skills.audio || '',                          // Audio
    skills.video || '',                          // Video
    skills.lighting || '',                       // Lighting
    skills.led || '',                            // LED
    skills.projection || '',                     // Projection
    skills.scenic || '',                         // Scenic
    skills.camera || '',                         // Camera
    skills.it || '',                             // Information Technology
    skills.breakout || '',                       // Breakout
    skills.computer || '',                       // Computer
    skills.leadership || '',                     // Leadership
    skills.equipment || '',                      // Equipment Operator
    yearsOfExperience,                           // Years of Experience
    billingAddress,                              // Billing Address
    formData.state || '',                        // What State Do You Live In?
    formData.city || '',                         // Major Cities You Work As A Local
    formData.referredBy || '',                   // How did you hear about us
    '',                                           // Rates
    '',                                           // Onboarding Docs Status
    '',                                           // Quickbooks Singup Status
    '',                                           // Chase Vendor Status
    '',                                           // Organized in Contacts & by State
    profilePictureUrl,                           // covid vaccination card (using profile pic)
    '',                                           // Onsite Ranking
    '',                                           // Lead Proformance
    '',                                           // select
    '',                                           // checkbox
    '',                                           // Docusign
    '',                                           // GOOGLE review
    formData.eligibilityStatus || '',           // Work Eligibility Status
    paymentSetupStatus,                          // Payment Setup Status
    formData.missingRequirements || ''          // Missing Requirements
  ];
  
  sheet.appendRow(rowData);
  return sheet.getLastRow();
}

// Helper function to get highest experience level
function getHighestExperience(experienceFields) {
  const experienceOrder = ['10+ Years', '5 - 10 Years', '2 - 4 Years', '0 - 1 Years'];
  
  for (let level of experienceOrder) {
    for (let field of experienceFields) {
      if (field && field.includes(level)) {
        return level;
      }
    }
  }
  
  // Return first non-empty experience if pattern doesn't match
  for (let field of experienceFields) {
    if (field) return field;
  }
  
  return '';
}

// Helper function to map skills to categories
function mapSkillCategories(formData) {
  const categories = {
    general: [],
    audio: [],
    video: [],
    lighting: [],
    led: [],
    projection: [],
    scenic: [],
    camera: [],
    it: [],
    breakout: [],
    computer: [],
    leadership: [],
    equipment: []
  };
  
  // Add general categories
  categories.general.push('Stagehand', 'AV Technician');
  
  // Map audio positions
  if (formData.audioPositions && formData.audioPositions.length > 0) {
    categories.audio = formData.audioPositions.map(pos => {
      if (pos.includes('A1')) return 'Audio Engineer (A1)';
      if (pos.includes('A2')) return 'Audio Engineer (A2)';
      if (pos.includes('RF')) return 'Wireless Frequency Coordinator';
      return 'Audio Technician';
    });
  }
  
  // Map video positions
  if (formData.videoPositions && formData.videoPositions.length > 0) {
    categories.video = formData.videoPositions.map(pos => {
      if (pos.includes('V1')) return 'Video Engineer (V1)';
      if (pos.includes('Shader')) return 'Video Shader Operator';
      if (pos.includes('Engineer')) return 'Video Technician';
      return 'Video Technician';
    });
  }
  
  // Map lighting positions
  if (formData.lightingPositions && formData.lightingPositions.length > 0) {
    categories.lighting = formData.lightingPositions.map(pos => {
      if (pos.includes('L1')) return 'Lighting Engineer (L1)';
      if (pos.includes('Programmer')) return 'Lighting Programmer';
      if (pos.includes('Designer')) return 'Lighting Designer (LD)';
      if (pos.includes('Spot')) return 'Spot Operator';
      return 'Lighting Technician';
    });
  }
  
  // Map management to leadership
  if (formData.managementPositions && formData.managementPositions.length > 0) {
    categories.leadership = formData.managementPositions.map(pos => {
      if (pos.includes('Producer')) return 'Project Manager';
      if (pos.includes('Director')) return 'Technical Director';
      if (pos.includes('Coordinator')) return 'Steward';
      return 'Project Manager';
    });
  }
  
  // Map assist positions to breakout
  if (formData.assistPositions && formData.assistPositions.length > 0) {
    categories.breakout = formData.assistPositions.map(pos => {
      if (pos.includes('Audio')) return 'Breakout A1';
      if (pos.includes('Video')) return 'Breakout V1';
      if (pos.includes('Lighting')) return 'Breakout L1';
      if (pos.includes('Operator')) return 'Breakout Operator';
      return 'Breakout Technician';
    });
  }
  
  // Map equipment skills
  const equipmentSkills = [];
  [formData.audioGearOperated, formData.videoGearOperated, formData.lightingGearOperated].forEach(gear => {
    if (gear && Array.isArray(gear)) {
      gear.forEach(item => {
        if (item && (item.toLowerCase().includes('forklift') || 
                     item.toLowerCase().includes('scissor') || 
                     item.toLowerCase().includes('boom') ||
                     item.toLowerCase().includes('lull'))) {
          equipmentSkills.push(item);
        }
      });
    }
  });
  
  if (equipmentSkills.length > 0) {
    categories.equipment = [...new Set(equipmentSkills)]; // Remove duplicates
  }
  
  // Convert arrays to comma-separated strings
  Object.keys(categories).forEach(key => {
    categories[key] = arrayToString(categories[key]);
  });
  
  return categories;
}

// Helper function to convert array to comma-separated string
function arrayToString(arr) {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(', ');
}

// Function to send email notifications
function sendEmailNotifications(formData, rawRow, opsRow) {
  // Send confirmation to applicant if configured
  if (EMAIL_CONFIG.sendToApplicant && formData.email) {
    sendApplicantConfirmation(formData);
  }
  
  // Send notification to admins if configured
  if (EMAIL_CONFIG.sendToAdmins && EMAIL_CONFIG.to) {
    sendAdminNotification(formData, rawRow, opsRow);
  }
}

// Function to send confirmation email to applicant
function sendApplicantConfirmation(formData) {
  const subject = 'Prestige Labor Solutions - Application Received';
  const body = `
Dear ${formData.firstName} ${formData.lastName},

Thank you for submitting your application to Prestige Labor Solutions.

We have received your information and will review it shortly. If your qualifications match our current needs, a member of our team will contact you.

Application Summary:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phoneNumber}
- Location: ${formData.city}, ${formData.state}

Best regards,
Prestige Labor Solutions Team
  `;
  
  try {
    MailApp.sendEmail(formData.email, subject, body);
  } catch (error) {
    console.error('Error sending applicant email:', error);
  }
}

// Function to send notification email to admins
function sendAdminNotification(formData, rawRow, opsRow) {
  const fullName = (formData.firstName || '') + ' ' + (formData.lastName || '');
  const timestamp = new Date().toLocaleString();
  
  // Collect key skills
  const skills = [];
  if (formData.audioPositions && formData.audioPositions.length > 0) {
    skills.push('Audio: ' + arrayToString(formData.audioPositions));
  }
  if (formData.videoPositions && formData.videoPositions.length > 0) {
    skills.push('Video: ' + arrayToString(formData.videoPositions));
  }
  if (formData.lightingPositions && formData.lightingPositions.length > 0) {
    skills.push('Lighting: ' + arrayToString(formData.lightingPositions));
  }
  if (formData.managementPositions && formData.managementPositions.length > 0) {
    skills.push('Management: ' + arrayToString(formData.managementPositions));
  }
  
  // Determine experience level
  const experience = getHighestExperience([
    formData.audioYearsExperience,
    formData.videoYearsExperience,
    formData.lightingYearsExperience,
    formData.managementYearsExperience,
    formData.assistYearsExperience
  ]);
  
  const subject = `New Freelancer Application: ${fullName} - ${formData.isEligible ? 'ELIGIBLE' : 'INELIGIBLE'}`;
  
  // Determine eligibility styling
  const eligibilityColor = formData.isEligible ? '#27ae60' : '#e74c3c';
  const eligibilityText = formData.isEligible ? 'ELIGIBLE' : 'INELIGIBLE';
  
  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background-color: #f39c12; color: white; padding: 20px; border-radius: 5px; }
    .section { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #555; }
    .value { color: #000; }
    .skills { background-color: #e8f4f8; padding: 10px; border-left: 4px solid #3498db; margin: 10px 0; }
    .footer { margin-top: 30px; padding: 15px; background-color: #2c3e50; color: white; border-radius: 5px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    .eligibility-status { font-size: 18px; font-weight: bold; padding: 10px; background-color: ${eligibilityColor}; color: white; border-radius: 5px; text-align: center; margin: 20px 0; }
    .warning { background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 10px; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Freelancer Application Received</h2>
    <p>Submitted: ${timestamp}</p>
  </div>
  
  <div class="eligibility-status">
    Work Eligibility Status: ${eligibilityText}
  </div>
  
  <div class="section">
    <h3>Applicant Information</h3>
    <div class="field">
      <span class="label">Name:</span> <span class="value">${fullName}</span>
    </div>
    <div class="field">
      <span class="label">Email:</span> <span class="value">${formData.email || 'Not provided'}</span>
    </div>
    <div class="field">
      <span class="label">Phone:</span> <span class="value">${formData.phoneNumber || 'Not provided'}</span>
    </div>
    <div class="field">
      <span class="label">Location:</span> <span class="value">${formData.city || 'N/A'}, ${formData.state || 'N/A'}</span>
    </div>
    <div class="field">
      <span class="label">Years of Experience:</span> <span class="value">${experience || 'Not specified'}</span>
    </div>
  </div>
  
  <div class="section">
    <h3>Skills & Positions</h3>
    <div class="skills">
      ${skills.length > 0 ? skills.map(skill => `<div>• ${skill}</div>`).join('') : '<div>No specific positions selected</div>'}
    </div>
  </div>
  
  <div class="section">
    <h3>Additional Information</h3>
    <div class="field">
      <span class="label">Companies Worked With:</span> <span class="value">${formData.companiesWorkedWith || 'Not specified'}</span>
    </div>
    <div class="field">
      <span class="label">Worked with Prestige Before:</span> <span class="value">${formData.workedWithPrestige || 'No'}</span>
    </div>
    <div class="field">
      <span class="label">Referred By:</span> <span class="value">${formData.referredBy || 'Not specified'}</span>
    </div>
    <div class="field">
      <span class="label">LinkedIn:</span> <span class="value">${formData.linkedinProfile || 'Not provided'}</span>
    </div>
  </div>
  
  ${formData.additionalComments ? `
  <div class="section">
    <h3>Additional Comments</h3>
    <p>${formData.additionalComments}</p>
  </div>
  ` : ''}
  
  ${formData.missingRequirements ? `
  <div class="warning">
    <h3>Missing Requirements</h3>
    <p><strong>The following items are required for this contractor to be eligible for work/payment:</strong></p>
    <ul>
      ${formData.missingRequirements.split(', ').map(req => `<li>${req}</li>`).join('')}
    </ul>
  </div>
  ` : ''}
  
  <div class="footer">
    <h3>Quick Actions</h3>
    <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=0" class="button">View in Google Sheets</a>
    <p style="margin-top: 15px; font-size: 12px;">
      Raw data saved in row ${rawRow} of "Raw Submissions" sheet<br>
      Processed data saved in row ${opsRow} of "Operations Ready" sheet
    </p>
  </div>
</body>
</html>
  `;
  
  const plainBody = `
New Freelancer Application Received

Applicant: ${fullName}
Email: ${formData.email || 'Not provided'}
Phone: ${formData.phoneNumber || 'Not provided'}
Location: ${formData.city || 'N/A'}, ${formData.state || 'N/A'}
Experience: ${experience || 'Not specified'}

Skills:
${skills.length > 0 ? skills.join('\n') : 'No specific positions selected'}

Companies Worked With: ${formData.companiesWorkedWith || 'Not specified'}
Worked with Prestige Before: ${formData.workedWithPrestige || 'No'}
Referred By: ${formData.referredBy || 'Not specified'}

View in Google Sheets: https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit

Raw data: Row ${rawRow} of "Raw Submissions" sheet
Processed data: Row ${opsRow} of "Operations Ready" sheet
  `;
  
  try {
    // Prepare email options
    const emailOptions = {
      to: EMAIL_CONFIG.to,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    };
    
    // Add CC if configured
    if (EMAIL_CONFIG.cc) {
      emailOptions.cc = EMAIL_CONFIG.cc;
    }
    
    // Send the email
    MailApp.sendEmail(emailOptions);
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
}

// Handle file uploads
function uploadFile(base64Data, fileName, mimeType) {
  try {
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, fileName);
    const folder = getOrCreateFolder('Crew Portal Uploads');
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (error) {
    console.error('Error uploading file:', error);
    return '';
  }
}

// Get or create folder for uploads
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Test function for debugging
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phoneNumber: '123-456-7890',
        city: 'Test City',
        state: 'TS',
        audioPositions: ['A1', 'A2'],
        audioYearsExperience: '5',
        workedWithPrestige: 'No'
      })
    }
  };
  
  const result = doPost(testData);
  console.log(result.getContent());
}

// CORS handling for web app
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ready',
    message: 'Crew Portal Form API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}