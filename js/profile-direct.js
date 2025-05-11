/**
 * Direct Profile Integration
 * A simplified and direct approach to ensure profile data is properly displayed
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile Direct: Initializing...');
    
    // Check if we're on the dashboard page with profile section
    const profileSection = document.getElementById('profile');
    if (!profileSection) {
        console.log('Profile Direct: Not on dashboard page, exiting');
        return;
    }
    
    console.log('Profile Direct: Dashboard detected, loading profile data');
    
    // Load and display profile data immediately
    loadAndDisplayProfileData();
    
    // Set up periodic refresh
    setInterval(loadAndDisplayProfileData, 2000);
    
    // Set up event listeners for profile update
    setupProfileUpdateListeners();
});

/**
 * Load farmer details from localStorage and display in profile
 */
function loadAndDisplayProfileData() {
    try {
        // Get farmer details from localStorage
        const farmerDetailsStr = localStorage.getItem('farmerDetails');
        if (!farmerDetailsStr) {
            console.log('Profile Direct: No farmer details found in localStorage');
            return;
        }
        
        // Parse the data
        const farmerDetails = JSON.parse(farmerDetailsStr);
        console.log('Profile Direct: Loaded farmer details:', farmerDetails);
        
        // Update profile elements
        updateProfileElements(farmerDetails);
        
    } catch (error) {
        console.error('Profile Direct: Error loading profile data:', error);
    }
}

/**
 * Update profile elements with farmer details
 */
function updateProfileElements(farmerDetails) {
    // Update profile name
    const profileName = document.getElementById('profile-name');
    if (profileName && farmerDetails.name) {
        profileName.textContent = farmerDetails.name;
    }
    
    // Update profile location
    const profileLocation = document.getElementById('profile-location');
    if (profileLocation && farmerDetails.district) {
        profileLocation.textContent = farmerDetails.district;
    }
    
    // Update profile details grid
    updateProfileDetailsGrid(farmerDetails);
    
    // Update profile completion
    updateProfileCompletion(farmerDetails);
}

/**
 * Update the profile details grid
 */
function updateProfileDetailsGrid(farmerDetails) {
    const profileGrid = document.getElementById('profile-details-grid');
    if (!profileGrid) return;
    
    // Clear existing content
    profileGrid.innerHTML = '';
    
    // Add personal details
    addProfileGridItem(profileGrid, 'Full Name', farmerDetails.name || 'Not Set');
    addProfileGridItem(profileGrid, 'Age', farmerDetails.age || 'Not Set');
    addProfileGridItem(profileGrid, 'District', farmerDetails.district || 'Not Set');
    addProfileGridItem(profileGrid, 'Mobile', farmerDetails.mobile || 'Not Set');
    
    // Add verification status
    const mobileVerified = farmerDetails.mobileOTP ? true : false;
    const aadhaarVerified = farmerDetails.aadharOTP ? true : false;
    
    addProfileGridItem(
        profileGrid, 
        'Mobile Verification', 
        getVerificationBadge(mobileVerified)
    );
    
    addProfileGridItem(
        profileGrid, 
        'Aadhaar Verification', 
        getVerificationBadge(aadhaarVerified)
    );
    
    // Try to get parameters data
    try {
        const paramsStr = localStorage.getItem('farmParameters');
        if (paramsStr) {
            const params = JSON.parse(paramsStr);
            
            // Add crops
            if (params.crops && params.crops.length > 0) {
                addProfileGridItem(profileGrid, 'Crops', params.crops.join(', '));
            } else {
                addProfileGridItem(profileGrid, 'Crops', 'Not Set');
            }
            
            // Add land size
            addProfileGridItem(profileGrid, 'Land Size', params.landSize ? `${params.landSize} acres` : 'Not Set');
            
            // Add soil type
            addProfileGridItem(profileGrid, 'Soil Type', params.soilType || 'Not Set');
        }
    } catch (error) {
        console.error('Profile Direct: Error loading parameters:', error);
    }
}

/**
 * Add an item to the profile grid
 */
function addProfileGridItem(grid, label, value) {
    const item = document.createElement('div');
    item.className = 'profile-item';
    
    const labelElement = document.createElement('div');
    labelElement.className = 'profile-item-label';
    labelElement.textContent = label;
    
    const valueElement = document.createElement('div');
    valueElement.className = 'profile-item-value';
    
    if (typeof value === 'string') {
        valueElement.textContent = value;
    } else {
        valueElement.appendChild(value);
    }
    
    item.appendChild(labelElement);
    item.appendChild(valueElement);
    
    grid.appendChild(item);
}

/**
 * Get a verification badge element
 */
function getVerificationBadge(verified) {
    const badge = document.createElement('div');
    
    if (verified) {
        badge.className = 'verification-badge verified';
        badge.innerHTML = '<i class="fas fa-check-circle"></i> Verified';
    } else {
        badge.className = 'verification-badge not-verified';
        badge.innerHTML = '<i class="fas fa-times-circle"></i> Not Verified';
    }
    
    return badge;
}

/**
 * Update profile completion status
 */
function updateProfileCompletion(farmerDetails) {
    // Required fields from details
    const requiredFields = ['name', 'age', 'district', 'mobile', 'aadhar'];
    
    // Count completed fields
    const completedFields = requiredFields.filter(field => 
        farmerDetails[field] && farmerDetails[field].toString().trim() !== ''
    ).length;
    
    // Calculate percentage
    const percentage = Math.round((completedFields / requiredFields.length) * 100);
    
    // Update progress bar
    const progressBar = document.getElementById('profile-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    
    // Update completion text
    const completionText = document.getElementById('profile-completion-text');
    if (completionText) {
        completionText.textContent = `${percentage}%`;
    }
    
    // Update missing fields
    updateMissingFields(farmerDetails, requiredFields);
}

/**
 * Update missing fields section
 */
function updateMissingFields(farmerDetails, requiredFields) {
    const missingFieldsContainer = document.getElementById('profile-missing-fields');
    if (!missingFieldsContainer) return;
    
    // Clear existing content
    missingFieldsContainer.innerHTML = '';
    
    // Get missing fields
    const missingFields = requiredFields.filter(field => 
        !farmerDetails[field] || farmerDetails[field].toString().trim() === ''
    );
    
    // If no missing fields, show success message
    if (missingFields.length === 0) {
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Your profile is complete!';
        successMessage.style.color = '#34c759';
        missingFieldsContainer.appendChild(successMessage);
        return;
    }
    
    // Show missing fields
    const missingFieldsText = document.createElement('p');
    missingFieldsText.textContent = 'Missing information:';
    missingFieldsContainer.appendChild(missingFieldsText);
    
    // Create field labels map
    const fieldLabels = {
        'name': 'Full Name',
        'age': 'Age',
        'district': 'District',
        'mobile': 'Mobile Number',
        'aadhar': 'Aadhaar Number'
    };
    
    // Add each missing field
    missingFields.forEach(field => {
        const fieldElement = document.createElement('span');
        fieldElement.className = 'profile-missing-field';
        fieldElement.textContent = fieldLabels[field] || field;
        missingFieldsContainer.appendChild(fieldElement);
    });
}

/**
 * Set up event listeners for profile update
 */
function setupProfileUpdateListeners() {
    // Get update profile buttons
    const updateProfileBtn = document.getElementById('update-profile-btn');
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', openProfileUpdateModal);
    }
    
    const updateProfileBtnBottom = document.getElementById('update-profile-btn-bottom');
    if (updateProfileBtnBottom) {
        updateProfileBtnBottom.addEventListener('click', openProfileUpdateModal);
    }
    
    // Get close modal button
    const closeModalBtn = document.getElementById('profile-modal-close');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProfileUpdateModal);
    }
    
    // Get cancel button
    const cancelBtn = document.getElementById('profile-modal-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeProfileUpdateModal);
    }
    
    // Get profile form
    const profileForm = document.getElementById('profile-update-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
}

/**
 * Open the profile update modal
 */
function openProfileUpdateModal() {
    // Get modal element
    const modal = document.getElementById('profile-update-modal');
    if (!modal) return;
    
    // Load current data into form
    loadProfileDataIntoForm();
    
    // Show modal
    modal.classList.add('active');
}

/**
 * Close the profile update modal
 */
function closeProfileUpdateModal() {
    // Get modal element
    const modal = document.getElementById('profile-update-modal');
    if (!modal) return;
    
    // Hide modal
    modal.classList.remove('active');
}

/**
 * Load profile data into the update form
 */
function loadProfileDataIntoForm() {
    try {
        // Get farmer details from localStorage
        const farmerDetailsStr = localStorage.getItem('farmerDetails');
        if (!farmerDetailsStr) return;
        
        // Parse the data
        const farmerDetails = JSON.parse(farmerDetailsStr);
        
        // Get form elements
        const nameInput = document.getElementById('profile-name-input');
        const ageInput = document.getElementById('profile-age-input');
        const districtInput = document.getElementById('profile-district-input');
        const mobileInput = document.getElementById('profile-mobile-input');
        
        // Set form values if elements exist
        if (nameInput) nameInput.value = farmerDetails.name || '';
        if (ageInput) ageInput.value = farmerDetails.age || '';
        if (districtInput) districtInput.value = farmerDetails.district || '';
        if (mobileInput) mobileInput.value = farmerDetails.mobile || '';
        
        // Try to get parameters data for land size and soil type
        try {
            const paramsStr = localStorage.getItem('farmParameters');
            if (paramsStr) {
                const params = JSON.parse(paramsStr);
                
                const landSizeInput = document.getElementById('profile-land-size-input');
                const soilTypeSelect = document.getElementById('profile-soil-type-select');
                
                if (landSizeInput) landSizeInput.value = params.landSize || '';
                
                if (soilTypeSelect && params.soilType) {
                    // Find and select the option with matching value
                    const option = Array.from(soilTypeSelect.options).find(
                        opt => opt.value === params.soilType
                    );
                    if (option) {
                        option.selected = true;
                    }
                }
            }
        } catch (error) {
            console.error('Profile Direct: Error loading parameters for form:', error);
        }
    } catch (error) {
        console.error('Profile Direct: Error loading profile data into form:', error);
    }
}

/**
 * Handle profile update form submission
 */
function handleProfileUpdate(event) {
    // Prevent default form submission
    event.preventDefault();
    
    try {
        // Get existing farmer details
        let farmerDetails = {};
        const farmerDetailsStr = localStorage.getItem('farmerDetails');
        if (farmerDetailsStr) {
            farmerDetails = JSON.parse(farmerDetailsStr);
        }
        
        // Get form data
        const nameInput = document.getElementById('profile-name-input');
        const ageInput = document.getElementById('profile-age-input');
        const districtInput = document.getElementById('profile-district-input');
        const mobileInput = document.getElementById('profile-mobile-input');
        
        // Update farmer details
        if (nameInput) farmerDetails.name = nameInput.value;
        if (ageInput) farmerDetails.age = ageInput.value;
        if (districtInput) farmerDetails.district = districtInput.value;
        if (mobileInput) farmerDetails.mobile = mobileInput.value;
        
        // Save updated farmer details
        localStorage.setItem('farmerDetails', JSON.stringify(farmerDetails));
        
        // Get parameters data
        let params = {};
        const paramsStr = localStorage.getItem('farmParameters');
        if (paramsStr) {
            params = JSON.parse(paramsStr);
        }
        
        // Update parameters
        const landSizeInput = document.getElementById('profile-land-size-input');
        const soilTypeSelect = document.getElementById('profile-soil-type-select');
        
        if (landSizeInput) params.landSize = landSizeInput.value;
        if (soilTypeSelect) params.soilType = soilTypeSelect.value;
        
        // Save updated parameters
        localStorage.setItem('farmParameters', JSON.stringify(params));
        
        // Close modal
        closeProfileUpdateModal();
        
        // Refresh profile display
        loadAndDisplayProfileData();
        
        // Show success notification
        showNotification('Profile updated successfully', 'success');
    } catch (error) {
        console.error('Profile Direct: Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    }
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '1rem';
        notificationContainer.style.right = '1rem';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.backgroundColor = type === 'success' ? '#34c759' : 
                                         type === 'error' ? '#ff3b30' : '#007aff';
    notification.style.color = 'white';
    notification.style.padding = '0.75rem 1rem';
    notification.style.borderRadius = '0.5rem';
    notification.style.marginBottom = '0.5rem';
    notification.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    
    // Add message
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        
        // Remove from DOM after animation
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
