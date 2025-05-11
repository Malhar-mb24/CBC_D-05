/**
 * Farmer Recommendations Module
 * Uses Gemini API to generate personalized recommendations for farmers
 * based on their profile data and farm parameters.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Farmer Recommendations module...');
    
    // Get recommendation elements
    const recommendationsSection = document.getElementById('farmer-recommendations');
    const recommendationsLoading = document.getElementById('recommendations-loading');
    const recommendationsContent = document.getElementById('recommendations-content');
    const refreshButton = document.getElementById('refresh-recommendations');
    
    // Skip if not on dashboard page or elements don't exist
    if (!recommendationsSection || !recommendationsLoading || !recommendationsContent) {
        console.log('Recommendations elements not found, skipping initialization');
        return;
    }
    
    // Initialize recommendations on page load
    generateRecommendations();
    
    // Add refresh button event listener
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            refreshButton.classList.add('loading');
            refreshButton.disabled = true;
            generateRecommendations(true);
        });
    }
    
    /**
     * Generate personalized recommendations using Gemini API
     * @param {boolean} isRefresh - Whether this is a refresh request
     */
    async function generateRecommendations(isRefresh = false) {
        console.log('Generating farmer recommendations...');
        
        // Show loading state
        recommendationsLoading.style.display = 'flex';
        recommendationsContent.style.display = 'none';
        
        try {
            // Get farmer data from localStorage
            const farmerData = collectFarmerData();
            
            // Check if we have enough data to generate recommendations
            if (!farmerData || Object.keys(farmerData).length === 0) {
                showNoDataMessage();
                return;
            }
            
            // Generate recommendations using Gemini API
            const recommendations = await getRecommendationsFromGemini(farmerData);
            
            // Display recommendations
            displayRecommendations(recommendations);
            
        } catch (error) {
            console.error('Error generating recommendations:', error);
            showErrorMessage(error.message);
        } finally {
            // Reset refresh button state
            if (refreshButton) {
                refreshButton.classList.remove('loading');
                refreshButton.disabled = false;
            }
        }
    }
    
    /**
     * Collect relevant farmer data from localStorage
     * @returns {Object} Collected farmer data
     */
    function collectFarmerData() {
        const relevantData = {};
        
        // Try to get farmer details from different possible localStorage keys
        try {
            // Get farmer details
            const farmerDetails = localStorage.getItem('farmerDetails');
            if (farmerDetails) {
                const details = JSON.parse(farmerDetails);
                Object.assign(relevantData, details);
            }
            
            // Get farm parameters
            const farmParameters = localStorage.getItem('farmParameters');
            if (farmParameters) {
                relevantData.farmParameters = JSON.parse(farmParameters);
            }
            
            // Get selected crops
            const selectedCrops = localStorage.getItem('selectedCrops');
            if (selectedCrops) {
                relevantData.crops = JSON.parse(selectedCrops);
            }
            
            // Get farm health assessment
            const farmAssessment = localStorage.getItem('farmAssessment');
            if (farmAssessment) {
                relevantData.farmAssessment = JSON.parse(farmAssessment);
            }
            
            // Get farm badges
            const farmerBadges = localStorage.getItem('farmerBadges');
            if (farmerBadges) {
                relevantData.badges = JSON.parse(farmerBadges);
            }
            
            // Get weather data if available
            const weatherData = localStorage.getItem('weatherData');
            if (weatherData) {
                relevantData.weather = JSON.parse(weatherData);
            }
        } catch (e) {
            console.error('Error parsing farmer data:', e);
            
            // Fallback to individual keys if the above fails
            const dataKeys = [
                'farmerName', 'farmerAge', 'farmerLocation', 'farmSize',
                'selectedCrops', 'soilType', 'waterSource', 'farmParameters',
                'farmGrades', 'farmHealth', 'rainfall', 'temperature',
                'irrigationSystem', 'pestManagement', 'fertilizers'
            ];
            
            // Collect data from localStorage
            dataKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) {
                    try {
                        // Try to parse JSON values
                        if (value.startsWith('{') || value.startsWith('[')) {
                            relevantData[key] = JSON.parse(value);
                        } else {
                            relevantData[key] = value;
                        }
                    } catch (e) {
                        // Use as string if parsing fails
                        relevantData[key] = value;
                    }
                }
            });
        }
        
        return relevantData;
    }
    
    /**
     * Generate recommendations using Gemini API
     * @param {Object} farmerData - Collected farmer data
     * @returns {Array} Array of recommendation objects
     */
    async function getRecommendationsFromGemini(farmerData) {
        // Ensure Gemini API is initialized
        if (!window.assistantGemini) {
            try {
                // Try to initialize from global API key
                const apiKey = window.API_KEYS?.GEMINI || localStorage.getItem('gemini_api_key') || 'AIzaSyAYU3EdLwGORlH-HDJhRgasrbhOOnrVcis';
                window.assistantGemini = new GeminiAPI(apiKey);
                console.log('Initialized Gemini API for recommendations');
            } catch (error) {
                console.error('Failed to initialize Gemini API:', error);
                throw new Error('Failed to initialize AI service. Please try again later.');
            }
        }
        
        // Prepare prompt for Gemini
        const prompt = constructRecommendationPrompt(farmerData);
        
        try {
            // Call Gemini API
            console.log('Calling Gemini API for recommendations...');
            const result = await window.assistantGemini.generateContent(prompt);
            
            if (!result || !result.text) {
                console.error('Empty response from Gemini API');
                throw new Error('Received empty response from AI service');
            }
            
            // Parse recommendations from result
            return parseRecommendations(result.text);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error('Failed to generate recommendations. Please try again later.');
        }
    }
    
    /**
     * Construct prompt for Gemini API
     * @param {Object} farmerData - Collected farmer data
     * @returns {string} Prompt for Gemini API
     */
    function constructRecommendationPrompt(farmerData) {
        // Limit data to prevent token count issues
        const limitedData = {};
        
        // Priority fields to include
        const priorityFields = [
            'farmerName', 'farmerLocation', 'farmSize', 'crops', 'selectedCrops',
            'soilType', 'waterSource', 'irrigationSystem', 'rainfall'
        ];
        
        // Add priority fields first
        priorityFields.forEach(field => {
            if (farmerData[field]) {
                limitedData[field] = farmerData[field];
            }
        });
        
        // Add other fields if they exist and aren't too large
        for (const [key, value] of Object.entries(farmerData)) {
            if (!priorityFields.includes(key)) {
                // Skip very large objects to prevent token limit issues
                const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
                if (valueStr.length < 500) {
                    limitedData[key] = value;
                } else {
                    // For large objects, include a summary
                    if (typeof value === 'object') {
                        if (Array.isArray(value)) {
                            limitedData[key] = `Array with ${value.length} items`;
                        } else {
                            limitedData[key] = `Object with keys: ${Object.keys(value).join(', ')}`;
                        }
                    }
                }
            }
        }
        
        // Convert farmer data to string representation
        let dataString = '';
        for (const [key, value] of Object.entries(limitedData)) {
            dataString += `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}\n`;
        }
        
        // Get preferred language for context
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        
        // Construct prompt
        return `You are an agricultural expert assistant. Based on the following farmer data, generate 5 specific, actionable recommendations for improving farm productivity and profitability. Each recommendation should include a title, description, and relevant tags.

Farmer Data:
${dataString}

Farmer's preferred language: ${preferredLanguage}

Format your response as a JSON array with objects having these properties:
- type: one of [crop, soil, water, pest, market, equipment, finance]
- title: short, specific recommendation title
- description: 2-3 sentences explaining the recommendation and its benefits
- tags: array of 2-3 relevant tags

Example format:
[
  {
    "type": "crop",
    "title": "Plant drought-resistant wheat varieties",
    "description": "Based on your soil type and low rainfall, drought-resistant wheat varieties like HD-2967 would increase yield by 15-20%. These varieties require less water and are more resistant to heat stress.",
    "tags": ["wheat", "drought-resistant", "water-saving"]
  }
]

Only respond with the JSON array, no other text. Make recommendations specific to the farmer's location and crops if that information is available.`;
    }
    
    /**
     * Parse recommendations from Gemini API response
     * @param {string} responseText - Text response from Gemini API
     * @returns {Array} Array of recommendation objects
     */
    function parseRecommendations(responseText) {
        try {
            // Extract JSON array from response
            const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            
            if (jsonMatch) {
                // Parse JSON array
                const recommendations = JSON.parse(jsonMatch[0]);
                return recommendations.slice(0, 5); // Limit to 5 recommendations
            }
            
            // Fallback: try to parse the entire response as JSON
            try {
                const recommendations = JSON.parse(responseText);
                if (Array.isArray(recommendations)) {
                    return recommendations.slice(0, 5);
                }
            } catch (e) {
                // If that fails too, throw error
                throw new Error('Failed to parse recommendations');
            }
            
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error parsing recommendations:', error);
            
            // Return fallback recommendations
            return getFallbackRecommendations();
        }
    }
    
    /**
     * Display recommendations in the UI
     * @param {Array} recommendations - Array of recommendation objects
     */
    function displayRecommendations(recommendations) {
        // Hide loading, show content
        recommendationsLoading.style.display = 'none';
        recommendationsContent.style.display = 'block';
        
        // Clear previous content
        recommendationsContent.innerHTML = '';
        
        // Add each recommendation
        recommendations.forEach(recommendation => {
            const card = document.createElement('div');
            card.className = `recommendation-card ${recommendation.type || 'crop'}`;
            
            // Get icon based on recommendation type
            const icon = getRecommendationIcon(recommendation.type);
            
            // Create card content
            card.innerHTML = `
                <div class="recommendation-title">
                    <i class="${icon}"></i>
                    ${recommendation.title}
                </div>
                <div class="recommendation-description">
                    ${recommendation.description}
                </div>
                <div class="recommendation-tags">
                    ${recommendation.tags.map(tag => `<span class="recommendation-tag">${tag}</span>`).join('')}
                </div>
            `;
            
            recommendationsContent.appendChild(card);
        });
    }
    
    /**
     * Get icon class based on recommendation type
     * @param {string} type - Recommendation type
     * @returns {string} Font Awesome icon class
     */
    function getRecommendationIcon(type) {
        switch (type) {
            case 'crop':
                return 'fas fa-seedling';
            case 'soil':
                return 'fas fa-mountain';
            case 'water':
                return 'fas fa-tint';
            case 'pest':
                return 'fas fa-bug';
            case 'market':
                return 'fas fa-store';
            case 'equipment':
                return 'fas fa-tractor';
            case 'finance':
                return 'fas fa-rupee-sign';
            default:
                return 'fas fa-lightbulb';
        }
    }
    
    /**
     * Show message when no data is available
     */
    function showNoDataMessage() {
        recommendationsLoading.style.display = 'none';
        recommendationsContent.style.display = 'block';
        recommendationsContent.innerHTML = `
            <div class="recommendation-card">
                <div class="recommendation-title">
                    <i class="fas fa-info-circle"></i>
                    Complete Your Profile
                </div>
                <div class="recommendation-description">
                    Please complete your farmer profile and farm parameters to receive personalized recommendations.
                    Visit the Parameters page to add information about your crops, soil type, and farming practices.
                </div>
                <div class="recommendation-tags">
                    <span class="recommendation-tag">profile</span>
                    <span class="recommendation-tag">parameters</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    function showErrorMessage(message) {
        recommendationsLoading.style.display = 'none';
        recommendationsContent.style.display = 'block';
        recommendationsContent.innerHTML = `
            <div class="recommendation-card">
                <div class="recommendation-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    Error Generating Recommendations
                </div>
                <div class="recommendation-description">
                    ${message || 'There was an error generating recommendations. Please try again later.'}
                </div>
                <div class="recommendation-tags">
                    <span class="recommendation-tag">error</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Get fallback recommendations when API fails
     * @returns {Array} Array of fallback recommendation objects
     */
    function getFallbackRecommendations() {
        // Get some basic data to personalize fallbacks
        const location = localStorage.getItem('farmerLocation') || 'your region';
        const crops = localStorage.getItem('selectedCrops') ? 
            JSON.parse(localStorage.getItem('selectedCrops')) : ['crops'];
        const mainCrop = Array.isArray(crops) && crops.length > 0 ? crops[0] : 'crops';
        
        return [
            {
                type: 'crop',
                title: `Consider crop rotation for ${mainCrop}`,
                description: `Implementing a crop rotation system with ${mainCrop} can improve soil health and reduce pest pressure. This practice can increase yields by up to 10-15% while reducing fertilizer needs.`,
                tags: ['crop-rotation', 'soil-health', mainCrop]
            },
            {
                type: 'water',
                title: 'Implement drip irrigation',
                description: `Drip irrigation can reduce water usage by up to 60% compared to flood irrigation while improving crop yields. It's especially effective in ${location} where water conservation is important.`,
                tags: ['water-saving', 'efficiency', 'irrigation']
            },
            {
                type: 'soil',
                title: 'Conduct regular soil testing',
                description: 'Regular soil testing helps identify nutrient deficiencies and pH imbalances. Testing your soil twice a year can guide precise fertilizer application, saving costs and improving yields.',
                tags: ['soil-health', 'testing', 'nutrients']
            },
            {
                type: 'market',
                title: 'Explore direct marketing channels',
                description: 'Selling directly to consumers or restaurants can increase your profit margins by 25-30%. Consider farmers markets, CSA programs, or partnering with local businesses in your area.',
                tags: ['marketing', 'direct-sales', 'profitability']
            },
            {
                type: 'finance',
                title: 'Apply for Kisan Credit Card',
                description: 'The Kisan Credit Card scheme provides farmers with affordable credit for cultivation expenses. With interest rates as low as 4%, it can significantly reduce your financing costs.',
                tags: ['credit', 'government-scheme', 'financing']
            }
        ];
    }
});
