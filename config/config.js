// API Keys and Configuration
const config = {
    // OpenWeatherMap API Key
    weatherApiKey: 'YOUR_OPENWEATHERMAP_API_KEY',
    
    // OpenAI API Key (for chatbot and summarization)
    openaiApiKey: 'YOUR_OPENAI_API_KEY',
    
    // Teachable Machine Model URLs
    cropDiseaseModel: {
        modelUrl: 'YOUR_TFJS_MODEL_URL',
        metadataUrl: 'YOUR_TFJS_METADATA_URL'
    },
    
    // Backend API endpoints
    backendApi: {
        baseUrl: 'https://your-backend-api.com',
        endpoints: {
            soilAnalysis: '/api/soil-analysis',
            pricePrediction: '/api/price-prediction',
            irrigationAdvice: '/api/irrigation-advice',
            harvestPrediction: '/api/harvest-prediction'
        }
    },
    
    // Default settings
    defaults: {
        temperatureUnit: 'celsius',
        language: 'en',
        currency: 'INR'
    },
    
    // Crop database
    crops: {
        supported: ['wheat', 'rice', 'corn', 'potato', 'tomato', 'cucumber'],
        regions: {
            'north': ['Delhi', 'Punjab', 'Haryana'],
            'south': ['Tamil Nadu', 'Kerala', 'Karnataka']
        }
    }
};

export default config;
