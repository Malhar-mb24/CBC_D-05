/**
 * Gemini API Integration for Kissan Sarthi
 * This file handles communication with Google's Gemini API
 */

class GeminiAPI {
    constructor(apiKey) {
        this.apiKey = apiKey || 'AIzaSyAYU3EdLwGORlH-HDJhRgasrbhOOnrVcis';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.model = 'gemini-2.0-flash'; // Using the model specified in the API example
        this.initialized = false;
        
        if (!this.apiKey) {
            console.error('Gemini API key is missing. Please provide a valid API key.');
            return;
        }
        
        this.initialized = true;
        console.log('Gemini API initialized successfully');
    }
    
    /**
     * Send a prompt to Gemini API and get a response
     * @param {string} prompt - The user's prompt/question
     * @param {Object} options - Additional options like temperature, maxTokens, etc.
     * @returns {Promise} - Promise containing the response
     */
    async generateContent(prompt, options = {}) {
        if (!this.initialized) {
            throw new Error('Gemini API not initialized. Please check your API key.');
        }
        
        if (!prompt) {
            throw new Error('Prompt is required');
        }
        
        const defaultOptions = {
            temperature: 0.7,
            maxOutputTokens: 800,
            topP: 0.9,
            topK: 40
        };
        
        const requestOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: requestOptions.temperature,
                        maxOutputTokens: requestOptions.maxOutputTokens,
                        topP: requestOptions.topP,
                        topK: requestOptions.topK
                    }
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Gemini API Error:', errorText);
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            return this._processResponse(data);
            
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw error;
        }
    }
    
    /**
     * Process and extract text from Gemini API response
     * @param {Object} response - The API response object
     * @returns {string} - Extracted text response
     */
    _processResponse(response) {
        if (!response || !response.candidates || !response.candidates[0]) {
            throw new Error('Invalid response structure from Gemini API');
        }
        
        try {
            return {
                text: response.candidates[0].content.parts[0].text,
                fullResponse: response
            };
        } catch (error) {
            console.error('Error extracting text from Gemini response:', error);
            console.log('Response structure:', JSON.stringify(response, null, 2));
            throw new Error('Failed to extract text from response');
        }
    }
    
    /**
     * Simple console test to verify the API is working
     * @param {string} testPrompt - Test prompt to send to the API
     */
    async testInConsole(testPrompt = "What are some sustainable farming practices for rice cultivation?") {
        console.log('Testing Gemini API with prompt:', testPrompt);
        try {
            const result = await this.generateContent(testPrompt);
            console.log('Gemini API Test Result:');
            console.log(result.text);
            return result.text;
        } catch (error) {
            console.error('Gemini API Test Failed:', error.message);
            return null;
        }
    }
    
    /**
     * Check if the API key is valid by making a small test request
     * @returns {Promise<boolean>} - Whether the API key is valid
     */
    async validateApiKey() {
        try {
            const response = await fetch(`${this.baseUrl}/${this.model}?key=${this.apiKey}`);
            return response.ok;
        } catch (error) {
            console.error('Error validating API key:', error);
            return false;
        }
    }
}

// Global instance for easy access from console for testing
window.geminiAPI = null;

// Function to initialize with API key
function initGeminiAPI(apiKey) {
    window.geminiAPI = new GeminiAPI(apiKey);
    return window.geminiAPI;
}

// Auto-initialize if API key is present in localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
        initGeminiAPI(savedApiKey);
    }
});
