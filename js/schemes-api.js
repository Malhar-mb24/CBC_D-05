/**
 * Government Schemes API Integration
 * Handles fetching scheme data from the FastAPI backend
 */

// API base URL - change this to your actual FastAPI server URL in production
const SCHEMES_API_BASE_URL = "http://localhost:8000";

/**
 * Fetch all available schemes with optional filtering
 * @param {string} ministry - Optional ministry filter
 * @param {string} category - Optional category filter
 * @returns {Promise<Array>} - Array of scheme objects
 */
async function fetchSchemes(ministry = null, category = null) {
    try {
        let url = `${SCHEMES_API_BASE_URL}/schemes`;
        const params = new URLSearchParams();
        
        if (ministry) params.append('ministry', ministry);
        if (category) params.append('category', category);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching schemes:", error);
        // Fallback to mock data if API is unavailable
        return getMockSchemes(category);
    }
}

/**
 * Fetch a specific scheme by ID
 * @param {number} schemeId - The ID of the scheme to fetch
 * @returns {Promise<Object>} - Scheme object
 */
async function fetchSchemeById(schemeId) {
    try {
        const response = await fetch(`${SCHEMES_API_BASE_URL}/schemes/${schemeId}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching scheme ${schemeId}:`, error);
        // Fallback to mock data
        return getMockSchemeById(schemeId);
    }
}

/**
 * Fetch all available scheme categories
 * @returns {Promise<Array>} - Array of category strings
 */
async function fetchCategories() {
    try {
        const response = await fetch(`${SCHEMES_API_BASE_URL}/categories`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories
        return ["subsidy", "loan", "insurance"];
    }
}

/**
 * Check eligibility for a specific scheme
 * @param {number} schemeId - The ID of the scheme
 * @param {Object} farmerData - Farmer profile data for eligibility check
 * @returns {Promise<Object>} - Eligibility result
 */
async function checkEligibility(schemeId, farmerData) {
    try {
        let url = `${SCHEMES_API_BASE_URL}/check-eligibility/${schemeId}`;
        const params = new URLSearchParams();
        
        if (farmerData.location) params.append('location', farmerData.location);
        if (farmerData.landSize) params.append('land_size', farmerData.landSize);
        if (farmerData.cropType) params.append('crop_type', farmerData.cropType);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error checking eligibility for scheme ${schemeId}:`, error);
        // Fallback to mock eligibility check
        return getMockEligibility(schemeId, farmerData);
    }
}

/**
 * Mock data for when the API is unavailable
 */
function getMockSchemes(category = null) {
    const schemes = [
        {
            id: 1,
            title: "PM-KISAN",
            description: "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
            category: "subsidy",
            eligibility: "All land holding farmers with cultivable land",
            deadline: "Ongoing",
            icon: "credit-card",
            apply_url: "https://pmkisan.gov.in/",
            ministry: "Ministry of Agriculture",
            start_date: "2019-02-01",
            image_url: "https://pmkisan.gov.in/Images/pmkisan_logo.png"
        },
        {
            id: 2,
            title: "Kisan Credit Card",
            description: "Provides farmers with affordable credit for their agricultural needs.",
            category: "loan",
            eligibility: "All farmers, sharecroppers, and tenant farmers",
            deadline: "Ongoing",
            icon: "credit-card",
            apply_url: "https://www.nabard.org/content1.aspx?id=572&catid=23&mid=530",
            ministry: "Ministry of Finance"
        },
        {
            id: 3,
            title: "Pradhan Mantri Fasal Bima Yojana",
            description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
            category: "insurance",
            eligibility: "All farmers growing notified crops",
            deadline: "Before sowing season",
            icon: "leaf",
            apply_url: "https://pmfby.gov.in/",
            ministry: "Ministry of Agriculture"
        },
        {
            id: 4,
            title: "Soil Health Card Scheme",
            description: "Provides information on soil health and recommends appropriate dosage of nutrients.",
            category: "subsidy",
            eligibility: "All farmers",
            deadline: "Ongoing",
            icon: "leaf",
            apply_url: "https://soilhealth.dac.gov.in/",
            ministry: "Ministry of Agriculture"
        },
        {
            id: 5,
            title: "Pradhan Mantri Krishi Sinchai Yojana",
            description: "Ensures access to means of irrigation to all agricultural farms in the country.",
            category: "subsidy",
            eligibility: "Farmers with irrigation needs",
            deadline: "Ongoing",
            icon: "tint",
            apply_url: "https://pmksy.gov.in/",
            ministry: "Ministry of Water Resources"
        },
        {
            id: 6,
            title: "Agricultural Infrastructure Fund",
            description: "Financing facility for investment in post-harvest management infrastructure.",
            category: "loan",
            eligibility: "Farmers, FPOs, Agri-entrepreneurs",
            deadline: "2023-2029",
            icon: "tractor",
            apply_url: "https://agriinfra.dac.gov.in/",
            ministry: "Ministry of Agriculture"
        },
        {
            id: 7,
            title: "Interest Subvention Scheme",
            description: "Provides short-term crop loans up to ₹3 lakh at a subsidized interest rate.",
            category: "subsidy",
            eligibility: "Farmers availing crop loans",
            deadline: "Ongoing",
            icon: "percent",
            apply_url: "https://agricoop.gov.in/",
            ministry: "Ministry of Agriculture"
        }
    ];
    
    if (category && category !== 'all') {
        return schemes.filter(scheme => scheme.category === category);
    }
    
    return schemes;
}

/**
 * Get a mock scheme by ID
 */
function getMockSchemeById(id) {
    const schemes = getMockSchemes();
    return schemes.find(scheme => scheme.id === parseInt(id)) || null;
}

/**
 * Mock eligibility check
 */
function getMockEligibility(schemeId, farmerData) {
    const scheme = getMockSchemeById(schemeId);
    if (!scheme) {
        return {
            is_eligible: false,
            message: "Scheme not found"
        };
    }
    
    // Simple eligibility logic based on scheme category and farmer data
    let isEligible = true;
    let requirements = [];
    
    if (scheme.category === "subsidy") {
        requirements = ["Land ownership document", "Bank account details", "Aadhaar card"];
    } else if (scheme.category === "loan") {
        isEligible = farmerData.landSize > 1.0;
        requirements = ["Land record", "Bank statement", "Income proof", "Crop planning document"];
    } else if (scheme.category === "insurance") {
        const eligibleCrops = ["wheat", "rice", "maize", "cotton", "sugarcane"];
        isEligible = eligibleCrops.includes(farmerData.cropType?.toLowerCase());
        requirements = ["Land record", "Details of crops sown", "Bank account details"];
    }
    
    return {
        scheme_id: schemeId,
        scheme_name: scheme.title,
        is_eligible: isEligible,
        eligibility_criteria: scheme.eligibility,
        requirements: requirements,
        next_steps: isEligible 
            ? "Visit your nearest agriculture office or apply online" 
            : "Contact the agriculture department for exceptions"
    };
}
