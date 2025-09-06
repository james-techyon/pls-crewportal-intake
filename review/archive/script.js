// Crew Portal Form JavaScript
// Replace this with your deployed Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxVwN3YWvxoXmYh1Qt34-wgzuF9HKVCDYa80jv0dct_-Cfej0Lt9-yA7LiwMr0KGCs5/exec';

let currentSection = 1;
const totalSections = 7;

// Initialize form on page load
document.addEventListener('DOMContentLoaded', function() {
    updateProgressBar();
    updateNavigationButtons();
    
    // Add form submit handler
    document.getElementById('crewForm').addEventListener('submit', handleSubmit);
    
    // Add enter key navigation
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'textarea') {
            e.preventDefault();
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn.style.display !== 'none') {
                changeSection(1);
            }
        }
    });
});

// Change form section
function changeSection(direction) {
    // Validate current section before moving forward
    if (direction > 0 && !validateSection(currentSection)) {
        return;
    }
    
    // Hide current section
    document.querySelector(`[data-section="${currentSection}"]`).classList.remove('active');
    
    // Update section number
    currentSection += direction;
    
    // Show new section
    document.querySelector(`[data-section="${currentSection}"]`).classList.add('active');
    
    // Update UI
    updateProgressBar();
    updateNavigationButtons();
    
    // Scroll to top of form
    document.querySelector('.crew-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Update progress bar
function updateProgressBar() {
    const progress = (currentSection / totalSections) * 100;
    document.getElementById('progress').style.width = progress + '%';
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Show/hide previous button
    if (currentSection === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    // Show/hide next/submit buttons
    if (currentSection === totalSections) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

// Validate section
function validateSection(sectionNum) {
    const section = document.querySelector(`[data-section="${sectionNum}"]`);
    const requiredFields = section.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    // Check for radio button groups
    const radioGroups = section.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        if (radios.length > 0 && radios[0].hasAttribute('required')) {
            const checked = group.querySelector('input[type="radio"]:checked');
            if (!checked) {
                showFieldError(group, 'Please select an option');
                isValid = false;
            } else {
                clearFieldError(group);
            }
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group') || field.closest('.radio-group');
    if (!formGroup) return;
    
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-text';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.closest('.form-group') || field.closest('.radio-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('error');
    const errorElement = formGroup.querySelector('.error-text');
    if (errorElement) {
        errorElement.remove();
    }
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate all sections
    for (let i = 1; i <= totalSections; i++) {
        if (!validateSection(i)) {
            // Navigate to first section with errors
            if (i !== currentSection) {
                document.querySelector(`[data-section="${currentSection}"]`).classList.remove('active');
                currentSection = i;
                document.querySelector(`[data-section="${currentSection}"]`).classList.add('active');
                updateProgressBar();
                updateNavigationButtons();
            }
            return;
        }
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Show loading state
    showLoading(true);
    
    try {
        // Handle file upload if present
        const fileInput = document.getElementById('profilePicture');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const base64 = await fileToBase64(file);
            formData.profilePictureData = base64;
            formData.profilePictureName = file.name;
            formData.profilePictureMimeType = file.type;
        }
        
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
        showSuccess();
        
    } catch (error) {
        console.error('Submission error:', error);
        showError('There was an error submitting your application. Please try again.');
    } finally {
        showLoading(false);
    }
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('crewForm');
    const formData = {};
    
    // Text inputs
    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea');
    textInputs.forEach(input => {
        formData[input.name] = input.value.trim();
    });
    
    // Radio buttons
    const radioGroups = form.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const checked = group.querySelector('input[type="radio"]:checked');
        if (checked) {
            formData[checked.name] = checked.value;
        }
    });
    
    // Checkboxes (collect as arrays)
    const checkboxGroups = {};
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        if (!checkboxGroups[checkbox.name]) {
            checkboxGroups[checkbox.name] = [];
        }
        checkboxGroups[checkbox.name].push(checkbox.value);
    });
    
    // Add checkbox arrays to formData
    Object.assign(formData, checkboxGroups);
    
    return formData;
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
    const form = document.getElementById('crewForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (show) {
        form.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Add spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.id = 'formSpinner';
        form.appendChild(spinner);
    } else {
        form.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
        
        // Remove spinner
        const spinner = document.getElementById('formSpinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Show success message
function showSuccess() {
    document.getElementById('crewForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset form for potential resubmission
    setTimeout(() => {
        document.getElementById('crewForm').reset();
        currentSection = 1;
        updateProgressBar();
        updateNavigationButtons();
    }, 1000);
}

// Show error message
function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('crewForm').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Allow retry after 3 seconds
    setTimeout(() => {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('crewForm').style.display = 'block';
    }, 3000);
}

// Add smooth transitions for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add input focus animations
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            // Clear error on blur if field is now valid
            if (this.value.trim()) {
                clearFieldError(this);
            }
        });
    });
    
    // File input preview
    const fileInput = document.getElementById('profilePicture');
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showFieldError(this, 'File size must be less than 5MB');
                this.value = '';
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showFieldError(this, 'Please upload an image file');
                this.value = '';
                return;
            }
            
            clearFieldError(this);
        }
    });
});