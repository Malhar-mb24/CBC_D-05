/**
 * Farmer Profile Management
 * Handles loading, displaying, and updating farmer profile data
 */

// Default profile image
const DEFAULT_PROFILE_IMAGE = 'images/default-profile.png';

// Database key for farmer details
const FARMER_DETAILS_KEY = 'farmerDetails';
const FARMER_PARAMETERS_KEY = 'farmParameters';

/**
 * Initialize the profile section
 */
async function initProfile() {
    console.log('Initializing profile section...');
    
    // Load profile data
    const profileData = await loadProfileData();
    
    // Render profile data
    renderProfileData(profileData);
    
    // Setup event listeners
    setupProfileEventListeners();
    
    // Setup storage event listener for real-time updates
    setupStorageEventListener();
    
    // Check if we need to create the profile from details
    await checkAndCreateProfileFromDetails();
}

/**
 * Load profile data from localStorage and/or database
 * @returns {Object} Combined profile data
 */
async function loadProfileData() {
    // Try to get data from localStorage first
    let detailsData = {};
    let parametersData = {};
    
    try {
        // Load details data
        const storedDetails = localStorage.getItem(FARMER_DETAILS_KEY);
        if (storedDetails) {
            detailsData = JSON.parse(storedDetails);
        }
        
        // Load parameters data
        const storedParameters = localStorage.getItem(FARMER_PARAMETERS_KEY);
        if (storedParameters) {
            parametersData = JSON.parse(storedParameters);
        }
    } catch (error) {
        console.error('Error loading profile data from localStorage:', error);
    }
    
    // Combine the data
    const profileData = {
        ...detailsData,
        parameters: parametersData
    };
    
    // If profile data is missing or incomplete, try to fetch from database
    if (isProfileIncomplete(profileData)) {
        try {
            // This would be replaced with actual database fetch in production
            // For now, we'll just use what we have in localStorage
            console.log('Profile data incomplete, would fetch from database in production');
            
            // If we still don't have data, push the current data to database
            if (Object.keys(detailsData).length > 0 || Object.keys(parametersData).length > 0) {
                await saveProfileToDatabase(profileData);
            }
        } catch (error) {
            console.error('Error fetching profile data from database:', error);
        }
    }
    
    return profileData;
}

/**
 * Check if profile data is incomplete
 * @param {Object} profileData - The profile data to check
 * @returns {Boolean} True if profile is incomplete
 */
function isProfileIncomplete(profileData) {
    // Required fields from details
    const requiredDetails = ['name', 'age', 'district', 'mobile', 'aadhar'];
    
    // Required fields from parameters
    const requiredParameters = ['crops', 'landSize', 'soilType'];
    
    // Check if any required details are missing
    const missingDetails = requiredDetails.filter(field => !profileData[field]);
    
    // Check if any required parameters are missing
    const missingParameters = requiredParameters.filter(field => 
        !profileData.parameters || !profileData.parameters[field]
    );
    
    return missingDetails.length > 0 || missingParameters.length > 0;
}

/**
 * Get missing fields from profile data
 * @param {Object} profileData - The profile data to check
 * @returns {Array} Array of missing field names
 */
function getMissingFields(profileData) {
    // Required fields from details
    const requiredDetails = [
        { key: 'name', label: 'Full Name' },
        { key: 'age', label: 'Age' },
        { key: 'district', label: 'District' },
        { key: 'mobile', label: 'Mobile Number' },
        { key: 'aadhar', label: 'Aadhaar Number' }
    ];
    
    // Required fields from parameters
    const requiredParameters = [
        { key: 'crops', label: 'Crops' },
        { key: 'landSize', label: 'Land Size' },
        { key: 'soilType', label: 'Soil Type' }
    ];
    
    // Check missing details
    const missingDetails = requiredDetails.filter(field => 
        !profileData[field.key]
    ).map(field => field.label);
    
    // Check missing parameters
    const missingParameters = requiredParameters.filter(field => 
        !profileData.parameters || !profileData.parameters[field.key]
    ).map(field => field.label);
    
    return [...missingDetails, ...missingParameters];
}

/**
 * Calculate profile completion percentage
 * @param {Object} profileData - The profile data to check
 * @returns {Number} Completion percentage (0-100)
 */
function calculateProfileCompletion(profileData) {
    // Required fields from details
    const requiredDetails = ['name', 'age', 'district', 'mobile', 'aadhar'];
    
    // Required fields from parameters
    const requiredParameters = ['crops', 'landSize', 'soilType'];
    
    // Count completed details
    const completedDetails = requiredDetails.filter(field => profileData[field]).length;
    
    // Count completed parameters
    const completedParameters = requiredParameters.filter(field => 
        profileData.parameters && profileData.parameters[field]
    ).length;
    
    // Calculate percentage
    const totalFields = requiredDetails.length + requiredParameters.length;
    const completedFields = completedDetails + completedParameters;
    
    return Math.round((completedFields / totalFields) * 100);
}

/**
 * Save profile data to database
 * @param {Object} profileData - The profile data to save
 */
async function saveProfileToDatabase(profileData) {
    // In a real implementation, this would make an API call to save the data
    // For now, we'll just log it and ensure it's in localStorage
    console.log('Saving profile data to database:', profileData);
    
    try {
        // Save details data
        const detailsData = { ...profileData };
        delete detailsData.parameters;
        localStorage.setItem(FARMER_DETAILS_KEY, JSON.stringify(detailsData));
        
        // Save parameters data
        if (profileData.parameters) {
            localStorage.setItem(FARMER_PARAMETERS_KEY, JSON.stringify(profileData.parameters));
        }
        
        return true;
    } catch (error) {
        console.error('Error saving profile data to localStorage:', error);
        return false;
    }
}

/**
 * Render profile data in the UI
 * @param {Object} profileData - The profile data to render
 */
function renderProfileData(profileData) {
    // Get profile section element
    const profileSection = document.getElementById('profile-section');
    if (!profileSection) return;
    
    // Calculate profile completion
    const completionPercentage = calculateProfileCompletion(profileData);
    const missingFields = getMissingFields(profileData);
    
    // Get main profile elements
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileImage = document.getElementById('profile-image');
    const profileProgressBar = document.getElementById('profile-progress-bar');
    const profileCompletionText = document.getElementById('profile-completion-text');
    const profileMissingFields = document.getElementById('profile-missing-fields');
    
    // Update profile elements if they exist
    if (profileName) profileName.textContent = profileData.name || 'Farmer Name';
    if (profileLocation) profileLocation.textContent = profileData.district || 'Location Not Set';
    if (profileImage) profileImage.src = profileData.profileImage || DEFAULT_PROFILE_IMAGE;
    if (profileProgressBar) profileProgressBar.style.width = `${completionPercentage}%`;
    if (profileCompletionText) profileCompletionText.textContent = `${completionPercentage}%`;
    
    // Update missing fields
    if (profileMissingFields) {
        profileMissingFields.innerHTML = '';
        if (missingFields.length > 0) {
            const missingFieldsText = document.createElement('p');
            missingFieldsText.textContent = 'Missing information:';
            profileMissingFields.appendChild(missingFieldsText);
            
            missingFields.forEach(field => {
                const fieldElement = document.createElement('span');
                fieldElement.className = 'profile-missing-field';
                fieldElement.textContent = field;
                profileMissingFields.appendChild(fieldElement);
            });
        }
    }
    
    // Render profile details
    renderProfileDetails(profileData);
}

/**
 * Render profile details in the grid
 * @param {Object} profileData - The profile data to render
 */
function renderProfileDetails(profileData) {
    // Get profile grid element
    const profileGrid = document.getElementById('profile-details-grid');
    if (!profileGrid) return;
    
    // Clear existing content
    profileGrid.innerHTML = '';
    
    // Add personal details
    addProfileGridItem(profileGrid, 'Full Name', profileData.name || 'Not Set');
    addProfileGridItem(profileGrid, 'Age', profileData.age || 'Not Set');
    addProfileGridItem(profileGrid, 'District', profileData.district || 'Not Set');
    addProfileGridItem(profileGrid, 'Mobile', profileData.mobile || 'Not Set');
    
    // Add verification status for Aadhaar and Mobile
    const mobileVerified = profileData.mobileOTP ? true : false;
    const aadhaarVerified = profileData.aadharOTP ? true : false;
    
    addProfileGridItem(
        profileGrid, 
        'Mobile Verification', 
        getVerificationBadge(mobileVerified, 'Mobile')
    );
    
    addProfileGridItem(
        profileGrid, 
        'Aadhaar Verification', 
        getVerificationBadge(aadhaarVerified, 'Aadhaar')
    );
    
    // Add farming parameters if available
    if (profileData.parameters) {
        const params = profileData.parameters;
        
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
        
        // Add irrigation type
        addProfileGridItem(profileGrid, 'Irrigation', params.irrigationType || 'Not Set');
        
        // Add water source
        addProfileGridItem(profileGrid, 'Water Source', params.waterSource || 'Not Set');
    }
}

/**
 * Add an item to the profile grid
 * @param {HTMLElement} grid - The grid element
 * @param {String} label - The label for the item
 * @param {String|HTMLElement} value - The value or HTML element to display
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
 * @param {Boolean} verified - Whether the item is verified
 * @param {String} type - The type of verification
 * @returns {HTMLElement} The verification badge element
 */
function getVerificationBadge(verified, type) {
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
 * Setup event listeners for profile section
 */
function setupProfileEventListeners() {
    // Get update profile button
    const updateProfileBtn = document.getElementById('update-profile-btn');
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', openProfileUpdateModal);
    }
    
    // Get update profile button (bottom)
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
 * Setup storage event listener for real-time updates
 */
function setupStorageEventListener() {
    // Listen for changes to localStorage
    window.addEventListener('storage', async (event) => {
        console.log('Storage event detected:', event);
        
        // Check if the changed key is relevant to our profile
        if (event.key === FARMER_DETAILS_KEY || event.key === FARMER_PARAMETERS_KEY) {
            console.log('Profile data changed in another tab/window, refreshing...');
            
            // Reload profile data
            const profileData = await loadProfileData();
            
            // Re-render profile data
            renderProfileData(profileData);
        }
    });
    
    // Also check periodically for changes (as a backup)
    setInterval(async () => {
        const profileData = await loadProfileData();
        renderProfileData(profileData);
    }, 5000); // Check every 5 seconds
}

/**
 * Check if we need to create a profile from details page data
 */
async function checkAndCreateProfileFromDetails() {
    try {
        // Check if details data exists in localStorage
        const detailsData = localStorage.getItem('farmerDetails');
        
        if (detailsData) {
            console.log('Found farmer details data, ensuring it is in the profile...');
            
            // Parse the details data
            const parsedDetails = JSON.parse(detailsData);
            
            // Load current profile data
            const profileData = await loadProfileData();
            
            // Check if we need to update the profile
            let needsUpdate = false;
            
            // Compare key fields
            const keyFields = ['name', 'age', 'district', 'mobile', 'aadhar'];
            
            keyFields.forEach(field => {
                if (parsedDetails[field] && (!profileData[field] || profileData[field] !== parsedDetails[field])) {
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                console.log('Updating profile with details data...');
                
                // Merge the data
                const mergedData = {
                    ...profileData,
                    ...parsedDetails,
                    parameters: profileData.parameters || {}
                };
                
                // Save the merged data
                await saveProfileToDatabase(mergedData);
                
                // Re-render the profile
                renderProfileData(mergedData);
                
                console.log('Profile updated with details data');
            }
        }
    } catch (error) {
        console.error('Error checking and creating profile from details:', error);
    }
}

/**
 * Open the profile update modal
 */
function openProfileUpdateModal() {
    // Get modal element
    const modal = document.getElementById('profile-update-modal');
    if (!modal) return;
    
    // Show modal
    modal.classList.add('active');
    
    // Load current data into form
    loadProfileDataIntoForm();
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
async function loadProfileDataIntoForm() {
    // Get profile data
    const profileData = await loadProfileData();
    
    // Get form elements
    const nameInput = document.getElementById('profile-name-input');
    const ageInput = document.getElementById('profile-age-input');
    const districtInput = document.getElementById('profile-district-input');
    const mobileInput = document.getElementById('profile-mobile-input');
    const landSizeInput = document.getElementById('profile-land-size-input');
    const soilTypeSelect = document.getElementById('profile-soil-type-select');
    
    // Set form values if elements exist
    if (nameInput) nameInput.value = profileData.name || '';
    if (ageInput) ageInput.value = profileData.age || '';
    if (districtInput) districtInput.value = profileData.district || '';
    if (mobileInput) mobileInput.value = profileData.mobile || '';
    
    // Set parameter values if available
    if (profileData.parameters) {
        if (landSizeInput) landSizeInput.value = profileData.parameters.landSize || '';
        if (soilTypeSelect && profileData.parameters.soilType) {
            // Find and select the option with matching value
            const option = Array.from(soilTypeSelect.options).find(
                opt => opt.value === profileData.parameters.soilType
            );
            if (option) {
                option.selected = true;
            }
        }
    }
}

/**
 * Handle profile update form submission
 * @param {Event} event - The form submission event
 */
async function handleProfileUpdate(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const updatedData = {};
    const updatedParameters = {};
    
    // Process form data
    formData.forEach((value, key) => {
        if (key.startsWith('profile-')) {
            // Extract the actual field name from the input ID
            const fieldName = key.replace('profile-', '').replace('-input', '').replace('-select', '');
            
            // Determine if this is a parameter field
            if (['land-size', 'soil-type'].includes(fieldName)) {
                // Convert kebab-case to camelCase for parameters
                const paramName = fieldName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                updatedParameters[paramName] = value;
            } else {
                // Convert kebab-case to camelCase for details
                const detailName = fieldName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
                updatedData[detailName] = value;
            }
        }
    });
    
    // Get existing data
    const existingData = await loadProfileData();
    
    // Merge with existing data
    const mergedData = {
        ...existingData,
        ...updatedData,
        parameters: {
            ...existingData.parameters,
            ...updatedParameters
        }
    };
    
    // Save updated data
    const saved = await saveProfileToDatabase(mergedData);
    
    if (saved) {
        // Close modal
        closeProfileUpdateModal();
        
        // Refresh profile display
        renderProfileData(mergedData);
        
        // Show success message
        showNotification('Profile updated successfully', 'success');
    } else {
        // Show error message
        showNotification('Failed to update profile', 'error');
    }
}

/**
 * Show a notification message
 * @param {String} message - The message to display
 * @param {String} type - The type of notification (success, error, info)
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

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', initProfile);
