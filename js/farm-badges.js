/**
 * Farm Badges System
 * Implements a comprehensive grading and badge system for farm parameters
 */

// Badge colors
const BADGE_COLORS = {
    GREEN: 'green',
    YELLOW: 'yellow',
    RED: 'red',
    BLACK: 'black'
};

// Badge icons
const BADGE_ICONS = {
    GREEN: 'fa-award',
    YELLOW: 'fa-star-half-alt',
    RED: 'fa-exclamation-triangle',
    BLACK: 'fa-skull-crossbones'
};

// Badge titles
const BADGE_TITLES = {
    GREEN: 'Excellent',
    YELLOW: 'Average',
    RED: 'Needs Attention',
    BLACK: 'Critical'
};

// Parameter grading rules
const PARAMETER_GRADING = {
    // Soil Type grading
    soilType: {
        good: ['loam', 'clay_loam', 'silt_loam'],
        average: ['clay', 'silt', 'sandy_loam'],
        poor: ['sandy', 'rocky', 'chalky'],
        explanations: {
            loam: 'Loam soil is ideal for most crops as it has good water retention and drainage.',
            clay_loam: 'Clay loam has good nutrient content and water retention.',
            silt_loam: 'Silt loam has good fertility and moderate drainage.',
            clay: 'Clay soil has high nutrient content but poor drainage.',
            silt: 'Silt soil has good fertility but may compact easily.',
            sandy_loam: 'Sandy loam has good drainage but may need more fertilizer.',
            sandy: 'Sandy soil drains quickly but has poor nutrient retention.',
            rocky: 'Rocky soil has poor water retention and limited growing area.',
            chalky: 'Chalky soil can be nutrient deficient and dries out quickly.'
        }
    },
    
    // Water Access grading
    waterAccess: {
        good: ['regular', 'irrigation'],
        average: ['seasonal', 'partial'],
        poor: ['limited', 'rainfed'],
        explanations: {
            regular: 'Regular water access ensures consistent crop growth throughout the season.',
            irrigation: 'Irrigation systems provide reliable water supply when needed.',
            seasonal: 'Seasonal water access may limit crop choices to those suitable for your season.',
            partial: 'Partial water access requires careful water management.',
            limited: 'Limited water access restricts crop options and may reduce yields.',
            rainfed: 'Rainfed farming depends entirely on rainfall, increasing risk during dry periods.'
        }
    },
    
    // Fertilizer Usage grading
    fertilizerUsage: {
        good: ['organic', 'balanced'],
        average: ['chemical', 'mixed'],
        poor: ['excessive', 'none'],
        explanations: {
            organic: 'Organic fertilizers improve soil health and provide sustainable nutrition.',
            balanced: 'Balanced fertilizer application meets crop needs without excess.',
            chemical: 'Chemical fertilizers provide quick nutrients but may affect soil health long-term.',
            mixed: 'Mixed fertilizer approach combines benefits of different types.',
            excessive: 'Excessive fertilizer use can harm soil health and cause pollution.',
            none: 'No fertilizer use may lead to nutrient deficiencies and lower yields.'
        }
    },
    
    // Pest Management grading
    pestManagement: {
        good: ['organic', 'integrated'],
        average: ['minimal', 'targeted'],
        poor: ['chemical', 'none'],
        explanations: {
            organic: 'Organic pest management is environmentally friendly and sustainable.',
            integrated: 'Integrated pest management combines multiple strategies effectively.',
            minimal: 'Minimal pest control uses pesticides only when necessary.',
            targeted: 'Targeted application focuses on specific pests to minimize impact.',
            chemical: 'Chemical pest control may harm beneficial insects and the environment.',
            none: 'No pest management can lead to significant crop damage and yield loss.'
        }
    },
    
    // Crop Rotation grading
    cropRotation: {
        good: ['yes', 'planned'],
        average: ['occasional', 'partial'],
        poor: ['no', 'never'],
        explanations: {
            yes: 'Regular crop rotation improves soil health and reduces pest problems.',
            planned: 'Planned rotation schedules maximize benefits for soil and crops.',
            occasional: 'Occasional rotation provides some benefits but could be improved.',
            partial: 'Partial rotation on some fields is better than none.',
            no: 'No crop rotation can lead to soil depletion and increased pest issues.',
            never: 'Never rotating crops increases disease risk and reduces soil fertility.'
        }
    }
};

/**
 * Initialize the farm badges system
 */
function initFarmBadges() {
    console.log('Initializing farm badges system...');
    
    // Check if we're on the parameters page
    const parameterForm = document.getElementById('parameterForm');
    if (parameterForm) {
        // Set up event listeners for parameter changes
        setupParameterListeners();
        
        // Add form submission handler
        parameterForm.addEventListener('submit', handleParameterSubmit);
    }
    
    // Check if we're on the dashboard page
    const profileSection = document.getElementById('profile');
    if (profileSection) {
        // Load and display badges in the profile
        loadAndDisplayProfileBadges();
    }
}

/**
 * Set up event listeners for parameter changes
 */
function setupParameterListeners() {
    console.log('Setting up parameter listeners for badge system...');
    
    // Get all parameter inputs that affect grading
    const gradingParameters = [
        'soilType',
        'waterAccess',
        'fertilizerUsage',
        'pestManagement',
        'cropRotation'
    ];
    
    // Add change event listeners to hidden inputs
    gradingParameters.forEach(param => {
        const input = document.getElementById(param);
        if (input) {
            console.log(`Adding change listener to ${param}`);
            input.addEventListener('change', updateGrading);
        }
    });
    
    // Also monitor selection items clicks
    document.querySelectorAll('.selection-item').forEach(item => {
        item.addEventListener('click', function() {
            // Give a small delay to allow the hidden input to update
            setTimeout(updateGrading, 100);
        });
    });
    
    // Check if we already have values and show grading immediately
    setTimeout(updateGrading, 500);
}

/**
 * Update the grading based on current parameter values
 */
function updateGrading() {
    console.log('Updating farm grading...');
    
    // Get all parameter values
    const paramValues = getParameterValues();
    console.log('Parameter values:', paramValues);
    
    // Check if we have at least some parameters set
    const filledParams = Object.values(paramValues).filter(val => val !== '').length;
    
    if (filledParams === 0) {
        console.log('No parameters set yet');
        return;
    }
    
    // Calculate grades for each parameter that is set
    const parameterGrades = calculateParameterGrades(paramValues);
    console.log('Parameter grades:', parameterGrades);
    
    // Calculate overall farm health grade
    const overallGrade = calculateOverallGrade(parameterGrades);
    console.log('Overall grade:', overallGrade);
    
    // Display the grades
    displayGrades(parameterGrades, overallGrade, paramValues);
    
    // Save the assessment even if not all parameters are set
    if (filledParams > 0) {
        saveFarmAssessment(overallGrade, parameterGrades, paramValues);
    }
}

/**
 * Get current parameter values
 * @returns {Object} Parameter values
 */
function getParameterValues() {
    return {
        soilType: document.getElementById('soilType')?.value || '',
        waterAccess: document.getElementById('waterAccess')?.value || '',
        fertilizerUsage: document.getElementById('fertilizerUsage')?.value || '',
        pestManagement: document.getElementById('pestManagement')?.value || '',
        cropRotation: document.getElementById('cropRotation')?.value || ''
    };
}

/**
 * Check if all required parameters are set
 * @param {Object} paramValues - Parameter values
 * @returns {Boolean} True if all parameters are set
 */
function areAllParametersSet(paramValues) {
    return Object.values(paramValues).every(value => value !== '');
}

/**
 * Calculate grades for each parameter
 * @param {Object} paramValues - Parameter values
 * @returns {Object} Parameter grades
 */
function calculateParameterGrades(paramValues) {
    const grades = {};
    
    // Evaluate each parameter
    Object.keys(paramValues).forEach(param => {
        const value = paramValues[param];
        const grading = PARAMETER_GRADING[param];
        
        if (grading) {
            if (grading.good.includes(value)) {
                grades[param] = 'good';
            } else if (grading.average.includes(value)) {
                grades[param] = 'average';
            } else {
                grades[param] = 'poor';
            }
        }
    });
    
    return grades;
}

/**
 * Calculate overall farm health grade
 * @param {Object} parameterGrades - Grades for each parameter
 * @returns {Object} Overall grade object with color, title, and icon
 */
function calculateOverallGrade(parameterGrades) {
    // Count grades by type
    const gradeCounts = {
        good: 0,
        average: 0,
        poor: 0
    };
    
    Object.values(parameterGrades).forEach(grade => {
        gradeCounts[grade]++;
    });
    
    // Determine overall grade
    let badgeColor, badgeTitle, badgeIcon, badgeDescription;
    
    if (gradeCounts.poor >= 2) {
        // If 2 or more parameters are poor, assign RED badge
        badgeColor = BADGE_COLORS.RED;
        badgeTitle = BADGE_TITLES.RED;
        badgeIcon = BADGE_ICONS.RED;
        badgeDescription = 'Your farm has several areas that need immediate attention. Focus on improving these critical factors to enhance productivity.';
    } else if (gradeCounts.poor === 1 && gradeCounts.average >= 2) {
        // If 1 parameter is poor and 2+ are average, assign YELLOW badge
        badgeColor = BADGE_COLORS.YELLOW;
        badgeTitle = BADGE_TITLES.YELLOW;
        badgeIcon = BADGE_ICONS.YELLOW;
        badgeDescription = 'Your farm is performing adequately but has room for improvement. Address the areas marked for attention to reach optimal productivity.';
    } else if (gradeCounts.good >= 3 && gradeCounts.poor === 0) {
        // If 3+ parameters are good and none are poor, assign GREEN badge
        badgeColor = BADGE_COLORS.GREEN;
        badgeTitle = BADGE_TITLES.GREEN;
        badgeIcon = BADGE_ICONS.GREEN;
        badgeDescription = 'Your farm is in excellent condition! You are following best practices in most areas, which should lead to optimal productivity.';
    } else {
        // Otherwise, assign YELLOW badge
        badgeColor = BADGE_COLORS.YELLOW;
        badgeTitle = BADGE_TITLES.YELLOW;
        badgeIcon = BADGE_ICONS.YELLOW;
        badgeDescription = 'Your farm is performing adequately but has room for improvement. Focus on the areas marked for attention to enhance productivity.';
    }
    
    // Special case: If all parameters are poor, assign BLACK badge
    if (gradeCounts.poor === Object.keys(parameterGrades).length) {
        badgeColor = BADGE_COLORS.BLACK;
        badgeTitle = BADGE_TITLES.BLACK;
        badgeIcon = BADGE_ICONS.BLACK;
        badgeDescription = 'Your farm is in critical condition and needs immediate intervention. Consider consulting with an agricultural expert as soon as possible.';
    }
    
    return {
        color: badgeColor,
        title: badgeTitle,
        icon: badgeIcon,
        description: badgeDescription
    };
}

/**
 * Display the grades in the UI
 * @param {Object} parameterGrades - Grades for each parameter
 * @param {Object} overallGrade - Overall grade
 * @param {Object} paramValues - Parameter values
 */
function displayGrades(parameterGrades, overallGrade, paramValues) {
    // Check if the grading section exists, create if not
    let gradingSection = document.querySelector('.farm-grading-section');
    
    if (!gradingSection) {
        gradingSection = createGradingSection();
    }
    
    // Update the farm health summary
    updateFarmHealthSummary(gradingSection, overallGrade);
    
    // Update parameter badges
    updateParameterBadges(gradingSection, parameterGrades, paramValues);
    
    // Show the grading section
    gradingSection.style.display = 'block';
}

/**
 * Create the grading section
 * @returns {HTMLElement} The created grading section
 */
function createGradingSection() {
    const parameterForm = document.getElementById('parameterForm');
    
    // Create grading section
    const gradingSection = document.createElement('section');
    gradingSection.className = 'farm-grading-section';
    
    // Create section title
    const title = document.createElement('h2');
    title.className = 'farm-grading-title';
    title.innerHTML = '<i class="fas fa-leaf"></i> Farm Health Assessment';
    gradingSection.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'farm-grading-description';
    description.textContent = 'Based on your farm parameters, we\'ve assessed the health and potential of your farming practices. Review the badges below to understand your strengths and areas for improvement.';
    gradingSection.appendChild(description);
    
    // Create badges container
    const badgesContainer = document.createElement('div');
    badgesContainer.className = 'farm-badges-container';
    gradingSection.appendChild(badgesContainer);
    
    // Create farm health summary
    const healthSummary = document.createElement('div');
    healthSummary.className = 'farm-health-summary';
    gradingSection.appendChild(healthSummary);
    
    // Insert before the form actions
    const formActions = document.querySelector('.form-actions');
    if (formActions) {
        parameterForm.insertBefore(gradingSection, formActions);
    } else {
        parameterForm.appendChild(gradingSection);
    }
    
    return gradingSection;
}

/**
 * Update the farm health summary
 * @param {HTMLElement} gradingSection - The grading section element
 * @param {Object} overallGrade - The overall grade
 */
function updateFarmHealthSummary(gradingSection, overallGrade) {
    const healthSummary = gradingSection.querySelector('.farm-health-summary');
    
    if (!healthSummary) return;
    
    // Clear existing content
    healthSummary.innerHTML = '';
    
    // Create badge element
    const badge = document.createElement('div');
    badge.className = `farm-health-badge ${overallGrade.color}`;
    badge.innerHTML = `<i class="fas ${overallGrade.icon}"></i>`;
    healthSummary.appendChild(badge);
    
    // Create info container
    const info = document.createElement('div');
    info.className = 'farm-health-info';
    
    // Create title
    const title = document.createElement('h3');
    title.className = 'farm-health-title';
    title.textContent = `Overall Farm Health: ${overallGrade.title}`;
    info.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'farm-health-description';
    description.textContent = overallGrade.description;
    info.appendChild(description);
    
    // Create actions
    const actions = document.createElement('div');
    actions.className = 'farm-health-actions';
    
    // Create save button
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'farm-health-action-btn primary';
    saveButton.innerHTML = '<i class="fas fa-save"></i> Save Assessment';
    saveButton.addEventListener('click', () => saveFarmAssessment(overallGrade));
    actions.appendChild(saveButton);
    
    // Create details button
    const detailsButton = document.createElement('button');
    detailsButton.type = 'button';
    detailsButton.className = 'farm-health-action-btn secondary';
    detailsButton.innerHTML = '<i class="fas fa-info-circle"></i> Learn More';
    detailsButton.addEventListener('click', showFarmHealthDetails);
    actions.appendChild(detailsButton);
    
    info.appendChild(actions);
    healthSummary.appendChild(info);
}

/**
 * Update parameter badges
 * @param {HTMLElement} gradingSection - The grading section element
 * @param {Object} parameterGrades - Grades for each parameter
 * @param {Object} paramValues - Parameter values
 */
function updateParameterBadges(gradingSection, parameterGrades, paramValues) {
    const badgesContainer = gradingSection.querySelector('.farm-badges-container');
    
    if (!badgesContainer) return;
    
    // Clear existing badges
    badgesContainer.innerHTML = '';
    
    // Parameter display names
    const paramNames = {
        soilType: 'Soil Type',
        waterAccess: 'Water Access',
        fertilizerUsage: 'Fertilizer Usage',
        pestManagement: 'Pest Management',
        cropRotation: 'Crop Rotation'
    };
    
    // Parameter icons
    const paramIcons = {
        soilType: 'fa-mountain',
        waterAccess: 'fa-tint',
        fertilizerUsage: 'fa-seedling',
        pestManagement: 'fa-bug',
        cropRotation: 'fa-sync-alt'
    };
    
    // Create badge for each parameter
    Object.keys(parameterGrades).forEach(param => {
        const grade = parameterGrades[param];
        const value = paramValues[param];
        
        // Skip if no grade or value
        if (!grade || !value) return;
        
        // Create badge element
        const badge = document.createElement('div');
        badge.className = 'farm-badge';
        
        // Create badge header
        const header = document.createElement('div');
        header.className = `farm-badge-header ${getBadgeColorForGrade(grade)}`;
        
        // Create badge title
        const title = document.createElement('h3');
        title.className = 'farm-badge-title';
        title.textContent = paramNames[param] || param;
        header.appendChild(title);
        
        // Create badge icon
        const icon = document.createElement('div');
        icon.className = 'farm-badge-icon';
        icon.innerHTML = `<i class="fas ${paramIcons[param] || 'fa-check'}"></i>`;
        header.appendChild(icon);
        
        badge.appendChild(header);
        
        // Create badge content
        const content = document.createElement('div');
        content.className = 'farm-badge-content';
        
        // Create parameter value display
        const paramValue = document.createElement('div');
        paramValue.className = `farm-badge-parameter ${grade}`;
        paramValue.innerHTML = `<i class="fas ${getIconForGrade(grade)}"></i> ${formatParameterValue(value)}`;
        content.appendChild(paramValue);
        
        // Create explanation
        const explanation = document.createElement('div');
        explanation.className = 'farm-badge-explanation';
        explanation.textContent = getParameterExplanation(param, value);
        content.appendChild(explanation);
        
        badge.appendChild(content);
        badgesContainer.appendChild(badge);
    });
}

/**
 * Get badge color for grade
 * @param {String} grade - The grade (good, average, poor)
 * @returns {String} Badge color
 */
function getBadgeColorForGrade(grade) {
    switch (grade) {
        case 'good':
            return BADGE_COLORS.GREEN;
        case 'average':
            return BADGE_COLORS.YELLOW;
        case 'poor':
            return BADGE_COLORS.RED;
        default:
            return BADGE_COLORS.YELLOW;
    }
}

/**
 * Get icon for grade
 * @param {String} grade - The grade (good, average, poor)
 * @returns {String} Icon class
 */
function getIconForGrade(grade) {
    switch (grade) {
        case 'good':
            return 'fa-check-circle';
        case 'average':
            return 'fa-exclamation-circle';
        case 'poor':
            return 'fa-times-circle';
        default:
            return 'fa-question-circle';
    }
}

/**
 * Format parameter value for display
 * @param {String} value - The parameter value
 * @returns {String} Formatted value
 */
function formatParameterValue(value) {
    // Replace underscores with spaces and capitalize
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get explanation for parameter value
 * @param {String} param - The parameter name
 * @param {String} value - The parameter value
 * @returns {String} Explanation
 */
function getParameterExplanation(param, value) {
    const grading = PARAMETER_GRADING[param];
    
    if (grading && grading.explanations && grading.explanations[value]) {
        return grading.explanations[value];
    }
    
    return '';
}

/**
 * Save farm assessment to localStorage
 * @param {Object} overallGrade - The overall grade
 * @param {Object} parameterGrades - The parameter grades (optional)
 * @param {Object} paramValues - The parameter values (optional)
 */
function saveFarmAssessment(overallGrade, parameterGrades = null, paramValues = null) {
    try {
        // If parameter grades and values are not provided, get them
        if (!parameterGrades) {
            paramValues = getParameterValues();
            parameterGrades = calculateParameterGrades(paramValues);
        } else if (!paramValues) {
            paramValues = getParameterValues();
        }
        
        // Create assessment object
        const assessment = {
            overallGrade,
            parameterGrades,
            paramValues,
            timestamp: new Date().toISOString()
        };
        
        console.log('Saving farm assessment:', assessment);
        
        // Save to localStorage
        localStorage.setItem('farmAssessment', JSON.stringify(assessment));
        
        // Don't show alert for automatic saves
        if (arguments.length === 1) {
            // Only show alert if this was called directly (e.g. from button click)
            console.log('Farm assessment saved successfully!');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving farm assessment:', error);
        return false;
    }
}

/**
 * Show farm health details
 */
function showFarmHealthDetails() {
    // This would typically open a modal with detailed information
    // For now, just show an alert
    alert('Farm health details would be shown here in a modal.');
}

/**
 * Handle parameter form submission
 * @param {Event} event - The form submission event
 */
function handleParameterSubmit(event) {
    // The original form handler will still run
    
    // Get parameter values
    const paramValues = getParameterValues();
    
    // Check if all required parameters are set
    if (areAllParametersSet(paramValues)) {
        // Calculate grades
        const parameterGrades = calculateParameterGrades(paramValues);
        const overallGrade = calculateOverallGrade(parameterGrades);
        
        // Save assessment
        saveFarmAssessment(overallGrade);
    }
}

/**
 * Load and display badges in the profile section
 */
function loadAndDisplayProfileBadges() {
    console.log('Loading and displaying farm badges in profile...');
    try {
        // Get farm assessment from localStorage
        const assessmentStr = localStorage.getItem('farmAssessment');
        if (!assessmentStr) {
            console.log('No farm assessment found in localStorage');
            return;
        }
        
        // Parse assessment
        const assessment = JSON.parse(assessmentStr);
        console.log('Loaded farm assessment:', assessment);
        
        // Find badges container in profile
        const badgesContainer = document.querySelector('.profile-badges');
        if (badgesContainer) {
            // Clear any existing farm badges
            const existingBadges = badgesContainer.querySelectorAll('.profile-farm-badge');
            existingBadges.forEach(badge => badge.remove());
            
            // Create farm health badge
            const badge = document.createElement('div');
            badge.className = `profile-farm-badge ${assessment.overallGrade.color}`;
            badge.innerHTML = `<i class="fas ${assessment.overallGrade.icon}"></i> ${assessment.overallGrade.title}`;
            
            // Add to badges container
            badgesContainer.appendChild(badge);
            console.log('Added farm badge to profile badges container');
        }
        
        // Add to dashboard farm badges section if it exists
        const dashboardBadges = document.getElementById('dashboard-farm-badges');
        if (dashboardBadges) {
            // Clear any existing badges
            dashboardBadges.innerHTML = '';
            
            // Create main farm health badge
            const dashBadge = document.createElement('div');
            dashBadge.className = `dashboard-farm-badge ${assessment.overallGrade.color}`;
            dashBadge.innerHTML = `<i class="fas ${assessment.overallGrade.icon}"></i> Farm Health: ${assessment.overallGrade.title}`;
            dashboardBadges.appendChild(dashBadge);
            
            // Add individual parameter badges if they exist
            if (assessment.parameterGrades) {
                const paramNames = {
                    soilType: 'Soil',
                    waterAccess: 'Water',
                    fertilizerUsage: 'Fertilizer',
                    pestManagement: 'Pest Control',
                    cropRotation: 'Crop Rotation'
                };
                
                const paramIcons = {
                    soilType: 'fa-mountain',
                    waterAccess: 'fa-tint',
                    fertilizerUsage: 'fa-seedling',
                    pestManagement: 'fa-bug',
                    cropRotation: 'fa-sync-alt'
                };
                
                // Add badges for each parameter that has a grade
                Object.entries(assessment.parameterGrades).forEach(([param, grade]) => {
                    if (!grade) return;
                    
                    const paramBadge = document.createElement('div');
                    paramBadge.className = `dashboard-farm-badge ${getBadgeColorForGrade(grade)}`;
                    paramBadge.innerHTML = `<i class="fas ${paramIcons[param] || 'fa-check'}"></i> ${paramNames[param] || param}: ${formatGrade(grade)}`;
                    dashboardBadges.appendChild(paramBadge);
                });
            }
            
            console.log('Added farm badges to dashboard badges container');
        }
        
        // Add to profile details grid if it exists
        const profileGrid = document.getElementById('profile-details-grid');
        if (profileGrid) {
            // Remove any existing farm health items
            const existingItems = profileGrid.querySelectorAll('.profile-item[data-type="farm-health"]');
            existingItems.forEach(item => item.remove());
            
            // Create farm health item
            const farmHealthItem = document.createElement('div');
            farmHealthItem.className = 'profile-item';
            farmHealthItem.setAttribute('data-type', 'farm-health');
            
            // Create label
            const label = document.createElement('div');
            label.className = 'profile-item-label';
            label.textContent = 'Farm Health';
            farmHealthItem.appendChild(label);
            
            // Create value
            const value = document.createElement('div');
            value.className = 'profile-item-value';
            
            // Create badge
            const gridBadge = document.createElement('span');
            gridBadge.className = `verification-badge ${getVerificationClassForBadge(assessment.overallGrade.color)}`;
            gridBadge.innerHTML = `<i class="fas ${assessment.overallGrade.icon}"></i> ${assessment.overallGrade.title}`;
            
            value.appendChild(gridBadge);
            farmHealthItem.appendChild(value);
            
            // Add to grid
            profileGrid.appendChild(farmHealthItem);
            console.log('Added farm health item to profile details grid');
        }
        
    } catch (error) {
        console.error('Error loading farm badges:', error);
    }
}

/**
 * Format grade for display
 * @param {String} grade - The grade (good, average, poor)
 * @returns {String} Formatted grade
 */
function formatGrade(grade) {
    switch (grade) {
        case 'good':
            return 'Excellent';
        case 'average':
            return 'Average';
        case 'poor':
            return 'Needs Attention';
        default:
            return grade.charAt(0).toUpperCase() + grade.slice(1);
    }
}

/**
 * Get verification class for badge color
 * @param {String} badgeColor - The badge color
 * @returns {String} Verification class
 */
function getVerificationClassForBadge(badgeColor) {
    switch (badgeColor) {
        case BADGE_COLORS.GREEN:
            return 'verified';
        case BADGE_COLORS.YELLOW:
            return 'pending';
        case BADGE_COLORS.RED:
        case BADGE_COLORS.BLACK:
            return 'not-verified';
        default:
            return 'pending';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initFarmBadges);
