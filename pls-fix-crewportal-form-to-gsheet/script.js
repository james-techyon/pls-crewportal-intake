// Crew Portal Form JavaScript - Simplified Version
// Replace this with your deployed Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtpezLrqs8aIVN0hj62zduP3OPO5NX7kLIBUmkrfE4n_l8Jo68rua9mHEUdByqNEi3/exec';

// Initialize form on page load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('freelancerForm');
    form.addEventListener('submit', handleSubmit);
    
    // Set today's date for signature field
    const today = new Date().toLocaleDateString('en-US');
    const signatureDateField = document.getElementById('form-field-field_signature_date');
    if (signatureDateField) {
        signatureDateField.value = today;
    }
    
    // Check eligibility on form change
    form.addEventListener('change', checkEligibilityStatus);
});

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    // Clear any previous errors
    clearAllErrors();
    
    // Validate required fields
    if (!validateForm()) {
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Calculate eligibility
    const eligibility = calculateEligibility(formData);
    formData.eligibilityStatus = eligibility.status;
    formData.isEligible = eligibility.isEligible;
    formData.missingRequirements = eligibility.missingRequirements.join(', ');
    
    // Show loading state
    showLoading(true);
    
    try {
        // Handle profile picture upload if present
        const fileInput = document.getElementById('form-field-field_04f88ef');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const base64 = await fileToBase64(file);
            formData.profilePictureData = base64;
            formData.profilePictureName = file.name;
            formData.profilePictureMimeType = file.type;
        }
        
        // Handle W-9 upload if present
        const w9Input = document.getElementById('form-field-field_w9_upload');
        if (w9Input && w9Input.files.length > 0) {
            const file = w9Input.files[0];
            const base64 = await fileToBase64(file);
            formData.w9FileData = base64;
            formData.w9FileName = file.name;
            formData.w9FileMimeType = file.type;
        }
        
        // Log form data for debugging
        console.log('Submitting form data:', formData);
        console.log('Eligibility status:', eligibility);
        
        // Submit to Google Apps Script
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        // Since we're using no-cors, we can't read the response
        // Assume success if no error is thrown
        console.log('Form submitted successfully');
        showSuccessWithEligibility(eligibility);
        
    } catch (error) {
        console.error('Submission error:', error);
        showError('Your submission failed because of a server error. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Check required text fields
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            // Handle radio buttons separately
            const radioGroup = document.getElementsByName(field.name);
            const checked = Array.from(radioGroup).some(radio => radio.checked);
            if (!checked) {
                showFieldError(field.closest('.elementor-field-group'), 'This field is required');
                isValid = false;
            }
        } else if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate email
    const emailField = document.getElementById('form-field-field_57a293b');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate account numbers match
    const accountNum = document.getElementById('form-field-field_account_number');
    const accountConfirm = document.getElementById('form-field-field_account_number_confirm');
    if (accountNum.value && accountConfirm.value && accountNum.value !== accountConfirm.value) {
        showFieldError(accountConfirm, 'Account numbers do not match');
        isValid = false;
    }
    
    // Validate routing number
    const routingNum = document.getElementById('form-field-field_routing_number');
    if (routingNum.value && routingNum.value.length !== 9) {
        showFieldError(routingNum, 'Routing number must be 9 digits');
        isValid = false;
    }
    
    return isValid;
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('freelancerForm');
    const formData = {};
    
    // Get all text inputs, textareas, and selects
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="password"], textarea, select');
    inputs.forEach(input => {
        const fieldName = getFieldName(input.name);
        if (fieldName) {
            formData[fieldName] = input.value.trim();
        }
    });
    
    // Get radio buttons
    const radioGroups = {};
    const radios = form.querySelectorAll('input[type="radio"]:checked');
    radios.forEach(radio => {
        const fieldName = getFieldName(radio.name);
        if (fieldName) {
            formData[fieldName] = radio.value;
        }
    });
    
    // Get checkboxes
    const checkboxGroups = {};
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        const fieldName = getFieldName(checkbox.name);
        if (fieldName) {
            if (!checkboxGroups[fieldName]) {
                checkboxGroups[fieldName] = [];
            }
            checkboxGroups[fieldName].push(checkbox.value);
        }
    });
    
    // Add checkbox arrays to formData
    Object.keys(checkboxGroups).forEach(key => {
        formData[key] = checkboxGroups[key];
    });
    
    return formData;
}

// Extract field name from form field name
function getFieldName(formFieldName) {
    // Convert form_fields[name] to name
    // Convert form_fields[field_xxx] to corresponding field name
    const match = formFieldName.match(/form_fields\[(.*?)\]/);
    if (match) {
        const fieldId = match[1];
        return fieldIdToName[fieldId] || fieldId;
    }
    return null;
}

// Map field IDs to readable names
const fieldIdToName = {
    'name': 'firstName',
    'field_6e1a849': 'lastName',
    'field_5277720': 'streetAddress',
    'field_02c39d0': 'streetAddress2',
    'field_ca2a1e3': 'city',
    'field_6011bd5': 'state',
    'field_21417d1': 'postalCode',
    'field_ae34a7d': 'phoneNumber',
    'field_57a293b': 'email',
    'field_199cb01': 'audioPositions',
    'field_a586cdf': 'audioGearOperated',
    'field_2364333': 'audioYearsExperience',
    'field_d384eaa': 'audioShowExperience',
    'field_500e0f4': 'audioStrengths',
    'field_94c5c80': 'videoPositions',
    'field_ce5acae': 'videoGearOperated',
    'field_f120dd5': 'videoYearsExperience',
    'field_a2fd373': 'videoShowExperience',
    'field_508b820': 'videoStrengths',
    'field_2c48fd5': 'lightingPositions',
    'field_098d5be': 'lightingGearOperated',
    'field_3a8dac3': 'lightingYearsExperience',
    'field_fe3d8b9': 'lightingShowExperience',
    'field_2565b9c': 'lightingStrengths',
    'field_0184d7d': 'managementPositions',
    'field_c8197c0': 'managementSkillsets',
    'field_9a163ea': 'managementYearsExperience',
    'field_86c97da': 'managementShowExperience',
    'field_a3b6557': 'managementExperience',
    'field_e2e8603': 'assistPositions',
    'field_4cb15ea': 'assistEquipmentComfort',
    'field_8ee1d31': 'assistYearsExperience',
    'field_69b7f75': 'assistShowExperience',
    'field_297d1d9': 'assistMainStrengths',
    'field_c1a020e': 'companiesWorkedWith',
    'field_025c58b': 'additionalSkills',
    'field_2e7849d': 'additionalComments',
    'field_1ca2066': 'workedWithPrestige',
    'field_dde637d': 'referredBy',
    'field_a3996a1': 'linkedinProfile',
    // Tax Information
    'field_tax_method': 'taxMethod',
    'field_w9_upload': 'w9Upload',
    'field_legal_business_name': 'legalBusinessName',
    'field_business_type': 'businessType',
    'field_tax_id': 'taxId',
    // Banking Details
    'field_bank_name': 'bankName',
    'field_account_type': 'accountType',
    'field_routing_number': 'routingNumber',
    'field_account_number': 'accountNumber',
    'field_account_number_confirm': 'accountNumberConfirm',
    // Terms & Conditions
    'field_terms_accepted': 'termsAccepted',
    'field_electronic_signature': 'electronicSignature',
    'field_signature_date': 'signatureDate'
};

// Show field error
function showFieldError(field, message) {
    const element = field.nodeType ? field : field.querySelector('input, textarea');
    if (element) {
        element.classList.add('field-error');
    }
    
    const formGroup = field.nodeType ? field.closest('.elementor-field-group') : field;
    
    // Remove existing error
    const existingError = formGroup.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error
    const errorElement = document.createElement('span');
    errorElement.className = 'error-text';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

// Clear all errors
function clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(field => {
        field.classList.remove('field-error');
    });
    document.querySelectorAll('.error-text').forEach(error => {
        error.remove();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data URL prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

// Show loading state
function showLoading(show) {
    const form = document.getElementById('freelancerForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn.querySelector('.elementor-button-text');
    
    if (show) {
        form.classList.add('loading');
        submitBtn.disabled = true;
        submitText.textContent = 'Submitting...';
    } else {
        form.classList.remove('loading');
        submitBtn.disabled = false;
        submitText.textContent = 'Submit';
    }
}

// Show success message
function showSuccess() {
    // Get the form element
    const form = document.getElementById('freelancerForm');
    const successMessage = document.getElementById('successMessage');
    
    // Insert success message after the form
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Hide the form
    form.style.display = 'none';
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Scroll success message into view smoothly
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show success message with eligibility status
function showSuccessWithEligibility(eligibility) {
    // Get the form element
    const form = document.getElementById('freelancerForm');
    const successMessage = document.getElementById('successMessage');
    
    // Update success message based on eligibility
    const h2 = successMessage.querySelector('h2');
    const p = successMessage.querySelectorAll('p')[1]; // Second paragraph
    
    if (eligibility.isEligible) {
        h2.innerHTML = '✓ Application Submitted Successfully!';
        if (eligibility.missingRequirements.length > 0) {
            p.innerHTML = `Thank you for submitting your application to Prestige Labor Solutions.<br><br>
                          <strong style="color: #f39c12;">⚠️ You are ELIGIBLE for work assignments!</strong><br>
                          However, to receive payments, please complete:<br>
                          <ul style="text-align: left; display: inline-block;">
                          ${eligibility.missingRequirements.map(req => `<li>${req}</li>`).join('')}
                          </ul>`;
        } else {
            p.innerHTML = `Thank you for submitting your application to Prestige Labor Solutions.<br><br>
                          <strong style="color: #27ae60;">✅ You are FULLY ELIGIBLE for work assignments and payments!</strong>`;
        }
    } else {
        h2.innerHTML = '⚠️ Application Submitted - Action Required';
        p.innerHTML = `Thank you for submitting your application to Prestige Labor Solutions.<br><br>
                      <strong style="color: #e74c3c;">❌ You are currently INELIGIBLE for work assignments.</strong><br><br>
                      To become eligible, please complete the following:<br>
                      <ul style="text-align: left; display: inline-block;">
                      ${eligibility.missingRequirements.map(req => `<li>${req}</li>`).join('')}
                      </ul><br>
                      You can update your application at any time through the Crew Portal.`;
    }
    
    // Insert success message after the form
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Hide the form
    form.style.display = 'none';
    
    // Show success message
    successMessage.style.display = 'block';
    
    // Scroll success message into view smoothly
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Show error message
function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle tax fields based on selection
function toggleTaxFields(value) {
    const w9Field = document.getElementById('w9UploadField');
    const taxFields = document.getElementById('taxInfoFields');
    
    if (value === 'Upload W-9') {
        w9Field.style.display = 'block';
        taxFields.style.display = 'none';
    } else if (value === 'Enter Information') {
        w9Field.style.display = 'none';
        taxFields.style.display = 'block';
    } else {
        w9Field.style.display = 'none';
        taxFields.style.display = 'none';
    }
}

// Calculate eligibility status
function calculateEligibility(formData) {
    const eligibility = {
        isEligible: true,
        missingRequirements: [],
        status: 'ELIGIBLE'
    };
    
    // Check tax info
    const hasW9 = formData.w9FileUrl || (formData.w9Upload && formData.w9Upload !== '');
    const hasTaxInfo = formData.taxId && formData.businessType && formData.legalBusinessName;
    
    if (!hasW9 && !hasTaxInfo) {
        eligibility.isEligible = false;
        eligibility.missingRequirements.push('Tax Information (W-9 or Tax ID)');
    }
    
    // Check banking (required for payment but not eligibility)
    if (!formData.routingNumber || !formData.accountNumber) {
        eligibility.missingRequirements.push('Banking Details (Required for Payment)');
    }
    
    // Check terms acceptance
    if (!formData.termsAccepted || formData.termsAccepted.length === 0) {
        eligibility.isEligible = false;
        eligibility.missingRequirements.push('Terms & Conditions Agreement');
    }
    
    // Check e-signature
    if (!formData.electronicSignature) {
        eligibility.isEligible = false;
        eligibility.missingRequirements.push('Electronic Signature');
    }
    
    // Set status
    if (!eligibility.isEligible) {
        eligibility.status = 'INELIGIBLE - Missing: ' + eligibility.missingRequirements.join(', ');
    } else if (eligibility.missingRequirements.length > 0) {
        eligibility.status = 'ELIGIBLE - Payment Pending: ' + eligibility.missingRequirements.join(', ');
    }
    
    return eligibility;
}

// Check eligibility status and show warning if needed
function checkEligibilityStatus() {
    const formData = collectFormData();
    const eligibility = calculateEligibility(formData);
    
    const warningDiv = document.getElementById('eligibilityWarning');
    const requirementsList = document.getElementById('missingRequirementsList');
    
    if (eligibility.missingRequirements.length > 0) {
        // Show warning
        warningDiv.style.display = 'block';
        
        // Clear and populate requirements list
        requirementsList.innerHTML = '';
        eligibility.missingRequirements.forEach(req => {
            const li = document.createElement('li');
            li.textContent = req;
            requirementsList.appendChild(li);
        });
    } else {
        // Hide warning
        warningDiv.style.display = 'none';
    }
}