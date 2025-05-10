/**
 * Government Schemes Integration
 * Handles the display and interaction with government schemes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the schemes section
    initSchemesSection();
});

/**
 * Initialize the government schemes section
 */
async function initSchemesSection() {
    // Get farmer profile data from localStorage and parameters
    const farmerProfile = getFarmerProfile();
    
    // Update farmer profile display
    updateFarmerProfileDisplay();
    
    // Set up event listeners
    setupSchemeFilters();
    
    // Load schemes
    await loadSchemes();
    
    // Check eligibility for all schemes and update stats
    await updateEligibilityStats();
}

/**
 * Update eligibility statistics
 */
async function updateEligibilityStats() {
    // Get all scheme cards
    const schemeCards = document.querySelectorAll('.scheme-card');
    
    // Count eligible schemes
    let eligibleCount = 0;
    schemeCards.forEach(card => {
        if (card.dataset.eligible === 'true') {
            eligibleCount++;
        }
    });
    
    // Update eligibility stats
    const eligibleCountEl = document.getElementById('eligible-schemes-count');
    const pendingCountEl = document.getElementById('pending-applications-count');
    const activeCountEl = document.getElementById('active-schemes-count');
    
    if (eligibleCountEl) eligibleCountEl.textContent = eligibleCount;
    
    // For demo purposes, set pending and active counts
    // In a real app, these would come from the API
    if (pendingCountEl) pendingCountEl.textContent = Math.floor(Math.random() * 3);
    if (activeCountEl) activeCountEl.textContent = Math.floor(Math.random() * 2);
}

/**
 * Get farmer profile data from localStorage and parameters
 */
function getFarmerProfile() {
    // Try to get profile data from localStorage
    const profileData = localStorage.getItem('farmerProfile');
    let profile = null;
    
    if (profileData) {
        try {
            profile = JSON.parse(profileData);
        } catch (e) {
            console.error('Error parsing farmer profile data:', e);
        }
    }
    
    // Get parameters from localStorage
    const selectedCrops = localStorage.getItem('selectedCrops');
    const cropArea = localStorage.getItem('cropArea');
    const soilType = localStorage.getItem('soilType');
    const irrigationType = localStorage.getItem('irrigationType');
    const waterSource = localStorage.getItem('waterSource');
    const fertilizerType = localStorage.getItem('fertilizerType');
    const pestControl = localStorage.getItem('pestControl');
    const cropRotation = localStorage.getItem('cropRotation');
    const targetPrice = localStorage.getItem('targetPrice');
    const marketDistance = localStorage.getItem('marketDistance');
    
    // Default profile if none exists
    const defaultProfile = {
        name: 'Rajesh Kumar',
        location: 'Amritsar, Punjab',
        landSize: cropArea ? parseFloat(cropArea) : 5.0, // acres
        cropType: selectedCrops ? selectedCrops.split(',')[0] : 'wheat',
        soilType: soilType || 'loamy',
        irrigationType: irrigationType || 'drip',
        waterSource: waterSource || 'canal',
        fertilizerType: fertilizerType || 'organic',
        pestControl: pestControl || 'biological',
        cropRotation: cropRotation || 'yes',
        targetPrice: targetPrice || '2500',
        marketDistance: marketDistance || '15'
    };
    
    // Merge existing profile with parameters or use default
    const mergedProfile = profile ? { ...defaultProfile, ...profile } : defaultProfile;
    
    // Save merged profile
    localStorage.setItem('farmerProfile', JSON.stringify(mergedProfile));
    
    return mergedProfile;
}

/**
 * Update the farmer profile display
 */
function updateFarmerProfileDisplay() {
    const profile = getFarmerProfile();
    
    // Update profile display
    const locationEl = document.getElementById('farmer-location');
    const landSizeEl = document.getElementById('farmer-land-size');
    const cropTypeEl = document.getElementById('farmer-crop-type');
    const soilTypeEl = document.getElementById('farmer-soil-type');
    
    if (locationEl) locationEl.textContent = profile.location;
    if (landSizeEl) landSizeEl.textContent = `${profile.landSize} acres`;
    if (cropTypeEl) cropTypeEl.textContent = capitalizeFirstLetter(profile.cropType);
    if (soilTypeEl) soilTypeEl.textContent = capitalizeFirstLetter(profile.soilType);
    
    // Set up profile update button
    const updateProfileBtn = document.getElementById('update-profile-btn');
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', showProfileUpdateModal);
    }
}

/**
 * Show profile update modal
 */
function showProfileUpdateModal() {
    const profile = getFarmerProfile();
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('profile-update-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profile-update-modal';
        modal.className = 'profile-update-modal';
        
        modal.innerHTML = `
            <div class="profile-update-modal-content">
                <div class="profile-update-modal-header">
                    <h3>Update Your Profile</h3>
                    <button class="profile-update-modal-close">×</button>
                </div>
                <div class="profile-update-modal-body">
                    <form id="profile-form" class="profile-form">
                        <div class="profile-form-field">
                            <label for="profile-name">Full Name</label>
                            <input type="text" id="profile-name" value="${profile.name}" required>
                        </div>
                        <div class="profile-form-field">
                            <label for="profile-location">Location</label>
                            <input type="text" id="profile-location" value="${profile.location}" required>
                        </div>
                        <div class="profile-form-field">
                            <label for="profile-land-size">Land Size (acres)</label>
                            <input type="number" id="profile-land-size" value="${profile.landSize}" min="0" step="0.5" required>
                        </div>
                        <div class="profile-form-field">
                            <label for="profile-crop-type">Primary Crop</label>
                            <select id="profile-crop-type" required>
                                <option value="wheat" ${profile.cropType === 'wheat' ? 'selected' : ''}>Wheat</option>
                                <option value="rice" ${profile.cropType === 'rice' ? 'selected' : ''}>Rice</option>
                                <option value="maize" ${profile.cropType === 'maize' ? 'selected' : ''}>Maize</option>
                                <option value="cotton" ${profile.cropType === 'cotton' ? 'selected' : ''}>Cotton</option>
                                <option value="sugarcane" ${profile.cropType === 'sugarcane' ? 'selected' : ''}>Sugarcane</option>
                                <option value="pulses" ${profile.cropType === 'pulses' ? 'selected' : ''}>Pulses</option>
                            </select>
                        </div>
                        <div class="profile-form-field">
                            <label for="profile-soil-type">Soil Type</label>
                            <select id="profile-soil-type" required>
                                <option value="loamy" ${profile.soilType === 'loamy' ? 'selected' : ''}>Loamy</option>
                                <option value="clay" ${profile.soilType === 'clay' ? 'selected' : ''}>Clay</option>
                                <option value="sandy" ${profile.soilType === 'sandy' ? 'selected' : ''}>Sandy</option>
                                <option value="silty" ${profile.soilType === 'silty' ? 'selected' : ''}>Silty</option>
                            </select>
                        </div>
                        <div class="profile-form-field">
                            <label for="profile-irrigation-type">Irrigation Type</label>
                            <select id="profile-irrigation-type" required>
                                <option value="drip" ${profile.irrigationType === 'drip' ? 'selected' : ''}>Drip Irrigation</option>
                                <option value="sprinkler" ${profile.irrigationType === 'sprinkler' ? 'selected' : ''}>Sprinkler System</option>
                                <option value="flood" ${profile.irrigationType === 'flood' ? 'selected' : ''}>Flood Irrigation</option>
                                <option value="none" ${profile.irrigationType === 'none' ? 'selected' : ''}>No Irrigation</option>
                            </select>
                        </div>
                        <div class="profile-form-field">
                            <label for="profile-water-source">Water Source</label>
                            <select id="profile-water-source" required>
                                <option value="canal" ${profile.waterSource === 'canal' ? 'selected' : ''}>Canal</option>
                                <option value="well" ${profile.waterSource === 'well' ? 'selected' : ''}>Well</option>
                                <option value="pond" ${profile.waterSource === 'pond' ? 'selected' : ''}>Pond</option>
                                <option value="rain" ${profile.waterSource === 'rain' ? 'selected' : ''}>Rainwater</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="profile-update-modal-footer">
                    <button class="scheme-btn secondary" id="profile-cancel-btn">Cancel</button>
                    <button class="scheme-btn primary" id="profile-save-btn">Save Changes</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.profile-update-modal-close');
        const cancelBtn = modal.querySelector('#profile-cancel-btn');
        const saveBtn = modal.querySelector('#profile-save-btn');
        
        closeBtn.addEventListener('click', function() {
            closeProfileUpdateModal();
        });
        
        cancelBtn.addEventListener('click', function() {
            closeProfileUpdateModal();
        });
        
        saveBtn.addEventListener('click', function() {
            saveProfileChanges();
        });
    }
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

/**
 * Close profile update modal
 */
function closeProfileUpdateModal() {
    const modal = document.getElementById('profile-update-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
}

/**
 * Save profile changes
 */
function saveProfileChanges() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    
    // Get form values
    const name = document.getElementById('profile-name').value;
    const location = document.getElementById('profile-location').value;
    const landSize = parseFloat(document.getElementById('profile-land-size').value);
    const cropType = document.getElementById('profile-crop-type').value;
    const soilType = document.getElementById('profile-soil-type').value;
    const irrigationType = document.getElementById('profile-irrigation-type').value;
    const waterSource = document.getElementById('profile-water-source').value;
    
    // Validate form
    if (!name || !location || isNaN(landSize) || !cropType || !soilType || !irrigationType || !waterSource) {
        alert('Please fill in all fields');
        return;
    }
    
    // Get existing profile
    const profile = getFarmerProfile();
    
    // Update profile
    const updatedProfile = {
        ...profile,
        name,
        location,
        landSize,
        cropType,
        soilType,
        irrigationType,
        waterSource
    };
    
    // Save updated profile
    localStorage.setItem('farmerProfile', JSON.stringify(updatedProfile));
    
    // Update display
    updateFarmerProfileDisplay();
    
    // Close modal
    closeProfileUpdateModal();
    
    // Reload schemes to update eligibility
    loadSchemes();
    updateEligibilityStats();
}

/**
 * Set up event listeners for scheme filters
 */
function setupSchemeFilters() {
    const searchInput = document.getElementById('scheme-search');
    const categoryFilter = document.getElementById('category-filter');
    const eligibilityFilter = document.getElementById('eligibility-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            filterSchemes();
        }, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            loadSchemes(this.value);
        });
    }
    
    if (eligibilityFilter) {
        eligibilityFilter.addEventListener('change', function() {
            filterSchemesByEligibility(this.value);
        });
    }
    
    // Populate category filter
    populateCategoryFilter();
}

/**
 * Populate the category filter dropdown
 */
async function populateCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    try {
        const categories = await fetchCategories();
        
        // Clear existing options except "All Categories"
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Add categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = capitalizeFirstLetter(category);
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating category filter:', error);
    }
}

/**
 * Load schemes with optional category filter
 */
async function loadSchemes(category = null) {
    const schemesList = document.getElementById('schemes-list');
    if (!schemesList) return;
    
    // Show loading state
    schemesList.innerHTML = `
        <div class="schemes-loading">
            <div class="spinner"></div>
            <p>Loading government schemes...</p>
        </div>
    `;
    
    try {
        const schemes = await fetchSchemes(null, category === 'all' ? null : category);
        
        if (schemes.length === 0) {
            // Show empty state
            schemesList.innerHTML = `
                <div class="schemes-empty">
                    <i class="fas fa-file-alt"></i>
                    <h3>No schemes found</h3>
                    <p>Try changing your search or filter criteria.</p>
                </div>
            `;
            return;
        }
        
        // Clear schemes list
        schemesList.innerHTML = '';
        
        // Add each scheme
        schemes.forEach(scheme => {
            const schemeCard = createSchemeCard(scheme);
            schemesList.appendChild(schemeCard);
        });
        
        // Add event listeners to scheme cards
        addSchemeCardListeners();
    } catch (error) {
        console.error('Error loading schemes:', error);
        
        // Show error state
        schemesList.innerHTML = `
            <div class="schemes-empty">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading schemes</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

/**
 * Create a scheme card element
 */
function createSchemeCard(scheme) {
    const card = document.createElement('div');
    card.className = 'scheme-card';
    card.dataset.id = scheme.id;
    card.dataset.category = scheme.category;
    
    // Check eligibility status
    const farmerProfile = getFarmerProfile();
    let eligibilityStatus = 'unknown';
    
    // Simple eligibility check based on scheme category and farmer profile
    if (scheme.category === 'subsidy') {
        eligibilityStatus = 'eligible';
    } else if (scheme.category === 'loan' && farmerProfile.landSize > 1.0) {
        eligibilityStatus = 'eligible';
    } else if (scheme.category === 'insurance' && ['wheat', 'rice', 'maize', 'corn', 'cotton', 'sugarcane'].includes(farmerProfile.cropType.toLowerCase())) {
        eligibilityStatus = 'eligible';
    } else {
        eligibilityStatus = 'ineligible';
    }
    
    card.dataset.eligible = eligibilityStatus === 'eligible' ? 'true' : 'false';
    
    // Add eligibility badge
    const eligibilityBadge = eligibilityStatus === 'eligible' 
        ? `<div class="eligibility-badge eligible"><i class="fas fa-check-circle"></i> Eligible</div>`
        : `<div class="eligibility-badge ineligible"><i class="fas fa-info-circle"></i> Check Eligibility</div>`;
    
    card.innerHTML = `
        <div class="scheme-header">
            <div class="scheme-icon ${scheme.category}">
                <i class="fas fa-${scheme.icon || getCategoryIcon(scheme.category)}"></i>
            </div>
            <div class="scheme-title-container">
                <h3>${scheme.title}</h3>
                <div class="scheme-ministry">${scheme.ministry}</div>
            </div>
            ${eligibilityBadge}
        </div>
        <div class="scheme-content">
            <p class="scheme-description">${scheme.description}</p>
            <div class="scheme-details">
                <div class="scheme-detail-item">
                    <div class="scheme-detail-label">Category:</div>
                    <div class="scheme-detail-value">${capitalizeFirstLetter(scheme.category)}</div>
                </div>
                <div class="scheme-detail-item">
                    <div class="scheme-detail-label">Eligibility:</div>
                    <div class="scheme-detail-value">${scheme.eligibility}</div>
                </div>
                <div class="scheme-detail-item">
                    <div class="scheme-detail-label">Deadline:</div>
                    <div class="scheme-detail-value">${scheme.deadline}</div>
                </div>
            </div>
        </div>
        <div class="scheme-actions">
            <button class="scheme-btn secondary check-eligibility-btn" data-id="${scheme.id}">
                <i class="fas fa-check-circle"></i> Check Eligibility
            </button>
            <a href="${scheme.apply_url}" target="_blank" class="scheme-btn primary">
                <i class="fas fa-external-link-alt"></i> Apply Now
            </a>
        </div>
    `;
    
    return card;
}

/**
 * Add event listeners to scheme cards
 */
function addSchemeCardListeners() {
    const eligibilityButtons = document.querySelectorAll('.check-eligibility-btn');
    
    eligibilityButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const schemeId = parseInt(this.dataset.id);
            await checkSchemeEligibility(schemeId);
        });
    });
}

/**
 * Check eligibility for a scheme
 */
async function checkSchemeEligibility(schemeId) {
    // Get farmer profile
    const farmerProfile = getFarmerProfile();
    
    try {
        // Show loading modal
        showEligibilityModal('Loading...', true);
        
        // Check eligibility
        const eligibilityResult = await checkEligibility(schemeId, farmerProfile);
        
        // Update modal with results
        updateEligibilityModal(eligibilityResult);
    } catch (error) {
        console.error('Error checking eligibility:', error);
        
        // Show error in modal
        updateEligibilityModal({
            scheme_name: 'Error',
            is_eligible: false,
            eligibility_criteria: 'Could not check eligibility at this time.',
            requirements: [],
            next_steps: 'Please try again later.'
        });
    }
}

/**
 * Show eligibility modal
 */
function showEligibilityModal(schemeName, isLoading = false) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('eligibility-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eligibility-modal';
        modal.className = 'eligibility-modal';
        
        modal.innerHTML = `
            <div class="eligibility-modal-content">
                <div class="eligibility-modal-header">
                    <h3 id="eligibility-scheme-name">${schemeName}</h3>
                    <button class="eligibility-modal-close">×</button>
                </div>
                <div class="eligibility-modal-body" id="eligibility-modal-body">
                    ${isLoading ? '<div class="schemes-loading"><div class="spinner"></div><p>Checking eligibility...</p></div>' : ''}
                </div>
                <div class="eligibility-modal-footer">
                    <button class="scheme-btn secondary" id="eligibility-close-btn">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = modal.querySelector('.eligibility-modal-close');
        const footerCloseBtn = modal.querySelector('#eligibility-close-btn');
        
        closeBtn.addEventListener('click', function() {
            closeEligibilityModal();
        });
        
        footerCloseBtn.addEventListener('click', function() {
            closeEligibilityModal();
        });
    } else {
        // Update scheme name
        const schemeNameEl = modal.querySelector('#eligibility-scheme-name');
        if (schemeNameEl) schemeNameEl.textContent = schemeName;
        
        // Update body if loading
        if (isLoading) {
            const modalBody = modal.querySelector('#eligibility-modal-body');
            if (modalBody) {
                modalBody.innerHTML = '<div class="schemes-loading"><div class="spinner"></div><p>Checking eligibility...</p></div>';
            }
        }
    }
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

/**
 * Update eligibility modal with results
 */
function updateEligibilityModal(result) {
    const modal = document.getElementById('eligibility-modal');
    if (!modal) return;
    
    const modalBody = modal.querySelector('#eligibility-modal-body');
    if (!modalBody) return;
    
    const schemeNameEl = modal.querySelector('#eligibility-scheme-name');
    if (schemeNameEl) schemeNameEl.textContent = result.scheme_name;
    
    // Update modal body with results
    modalBody.innerHTML = `
        <div class="eligibility-result ${result.is_eligible ? 'eligible' : 'not-eligible'}">
            <div class="eligibility-icon">
                <i class="fas fa-${result.is_eligible ? 'check-circle' : 'times-circle'}"></i>
            </div>
            <div class="eligibility-message">
                <h4>${result.is_eligible ? 'You are eligible!' : 'Not eligible'}</h4>
                <p>${result.eligibility_criteria}</p>
            </div>
        </div>
        
        <div class="requirements-list">
            <h4>Required Documents</h4>
            ${result.requirements.length > 0 
                ? `<ul>${result.requirements.map(req => `<li>${req}</li>`).join('')}</ul>`
                : '<p>No specific documents required.</p>'
            }
        </div>
        
        <div class="next-steps">
            <h4>Next Steps</h4>
            <p>${result.next_steps}</p>
        </div>
    `;
    
    // Update footer
    const footer = modal.querySelector('.eligibility-modal-footer');
    if (footer) {
        footer.innerHTML = `
            <button class="scheme-btn secondary" id="eligibility-close-btn">Close</button>
            ${result.is_eligible 
                ? `<a href="${result.apply_url || '#'}" target="_blank" class="scheme-btn primary">
                    <i class="fas fa-external-link-alt"></i> Apply Now
                   </a>` 
                : ''
            }
        `;
        
        // Add event listener to close button
        const closeBtn = footer.querySelector('#eligibility-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeEligibilityModal();
            });
        }
    }
}

/**
 * Close eligibility modal
 */
function closeEligibilityModal() {
    const modal = document.getElementById('eligibility-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
}

/**
 * Filter schemes based on search input
 */
function filterSchemes() {
    const searchInput = document.getElementById('scheme-search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const schemeCards = document.querySelectorAll('.scheme-card');
    
    schemeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.scheme-description').textContent.toLowerCase();
        const ministry = card.querySelector('.scheme-ministry').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm) || ministry.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateEmptyState();
}

/**
 * Filter schemes based on eligibility
 */
function filterSchemesByEligibility(eligibilityFilter) {
    if (eligibilityFilter === 'all') {
        // Show all schemes
        const schemeCards = document.querySelectorAll('.scheme-card');
        schemeCards.forEach(card => {
            card.style.display = '';
        });
    } else if (eligibilityFilter === 'eligible') {
        // Show only eligible schemes
        const schemeCards = document.querySelectorAll('.scheme-card');
        schemeCards.forEach(card => {
            const isEligible = card.dataset.eligible === 'true';
            card.style.display = isEligible ? '' : 'none';
        });
    }
    
    updateEmptyState();
}

/**
 * Update empty state based on visible cards
 */
function updateEmptyState() {
    // Check if any cards are visible
    const visibleCards = document.querySelectorAll('.scheme-card[style=""]');
    const schemesList = document.getElementById('schemes-list');
    
    if (visibleCards.length === 0 && schemesList) {
        // Add empty state if no cards are visible
        const emptyState = document.querySelector('.schemes-empty');
        
        if (!emptyState) {
            const emptyStateEl = document.createElement('div');
            emptyStateEl.className = 'schemes-empty';
            emptyStateEl.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No schemes found</h3>
                <p>Try different search or filter criteria.</p>
            `;
            
            schemesList.appendChild(emptyStateEl);
        }
    } else {
        // Remove empty state if cards are visible
        const emptyState = document.querySelector('.schemes-empty');
        if (emptyState) {
            emptyState.remove();
        }
    }
}

/**
 * Get icon for scheme category
 */
function getCategoryIcon(category) {
    switch (category.toLowerCase()) {
        case 'subsidy':
            return 'hand-holding-usd';
        case 'loan':
            return 'credit-card';
        case 'insurance':
            return 'shield-alt';
        default:
            return 'file-alt';
    }
}

/**
 * Capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
