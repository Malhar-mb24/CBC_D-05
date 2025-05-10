// Translations object for multilingual support
const translations = {
    en: {
        home: "Home",
        details: "Details",
        parameters: "Parameters",
        dashboard: "Dashboard",
        welcome: "Welcome to Kissan Sarthi",
        subtitle: "Your smart agriculture companion",
        copyright: "© 2024 Kissan Sarthi. All rights reserved.",
        selectLanguage: "Select Language",
        farmerDetails: "Farmer Details",
        name: "Name",
        age: "Age",
        experience: "Years of Experience",
        landSize: "Land Size (acres)",
        location: "Location",
        submit: "Submit",
        save: "Save",
        cancel: "Cancel",
        loading: "Loading...",
        error: "Error",
        success: "Success"
    },
    hi: {
        home: "होम",
        details: "विवरण",
        parameters: "पैरामीटर",
        dashboard: "डैशबोर्ड",
        welcome: "किसान सारथी में आपका स्वागत है",
        subtitle: "आपका स्मार्ट कृषि साथी",
        copyright: "© 2024 किसान सारथी। सर्वाधिकार सुरक्षित।",
        selectLanguage: "भाषा चुनें",
        farmerDetails: "किसान विवरण",
        name: "नाम",
        age: "आयु",
        experience: "अनुभव (वर्ष)",
        landSize: "भूमि का आकार (एकड़)",
        location: "स्थान",
        submit: "जमा करें",
        save: "सहेजें",
        cancel: "रद्द करें",
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफल"
    }
};

// API Configuration
const API_KEYS = {
    GEMINI: 'YOUR_GEMINI_API_KEY',
    GOOGLE_TRANSLATE: 'YOUR_GOOGLE_TRANSLATE_API_KEY',
    WEATHER: 'YOUR_WEATHER_API_KEY',
    AGRICULTURE: 'YOUR_AGRICULTURE_API_KEY',
    MAPS: 'YOUR_GOOGLE_MAPS_API_KEY'
};

// API Endpoints
const API_ENDPOINTS = {
    GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
    AGRICULTURE: 'https://api.agriculture.example.com/v1', // Replace with actual endpoint
    MAPS: 'https://maps.googleapis.com/maps/api/js'
};

// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if language is set
    if (!localStorage.getItem('preferredLanguage')) {
        window.location.href = 'language.html';
        return;
    }

    // Initialize the application
    initializeApp();
});

// UI State Management
const UIState = {
    isChatMinimized: false,
    isDarkMode: false,
    currentPage: window.location.pathname.split('/').pop() || 'index.html'
};

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    UIState.isDarkMode = savedTheme === 'dark';
}

function toggleTheme() {
    UIState.isDarkMode = !UIState.isDarkMode;
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', UIState.isDarkMode ? 'dark' : 'light');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Loading States
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

// Navigation
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === UIState.currentPage);
    });
}

// Form Handling
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    showLoading(submitButton);
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading(submitButton);
        showToast('Form submitted successfully!', 'success');
        form.reset();
    }, 1000);
}

// Initialize Application
async function initializeApp() {
    // Initialize theme
    initializeTheme();
    
    // Add event listeners
    setupEventListeners();
    
    // Load initial data
    await loadInitialData();
    
    // Initialize language
    initializeLanguage();
    
    // Initialize AI chat
    initializeAIChat();
    
    // Update active navigation
    updateActiveNavLink();
}

// Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href) {
                UIState.currentPage = href;
                updateActiveNavLink();
            }
        });
    });
}

// Language Management
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);
}

function setLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
    
    // Update Google Translate
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    }
    
    // Show language change notification
    showToast(`Language changed to ${lang}`, 'info');
}

// AI Chat Initialization
async function initializeAIChat() {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'ai-chat-container';
    chatContainer.innerHTML = `
        <div class="ai-chat-header">
            <h3>
                <img src="assets/bot-avatar.png" alt="AI Assistant" class="bot-avatar">
                AI Assistant
            </h3>
            <button class="minimize-btn">_</button>
        </div>
        <div class="ai-chat-messages"></div>
        <div class="ai-chat-input">
            <input type="text" placeholder="Ask about farming...">
            <button>
                <span class="send-icon">➤</span>
            </button>
        </div>
    `;
    
    document.body.appendChild(chatContainer);
    setupChatListeners(chatContainer);
}

// Chat Listeners
async function setupChatListeners(container) {
    const input = container.querySelector('input');
    const sendBtn = container.querySelector('button');
    const messagesContainer = container.querySelector('.ai-chat-messages');
    const minimizeBtn = container.querySelector('.minimize-btn');
    
    minimizeBtn.addEventListener('click', () => {
        UIState.isChatMinimized = !UIState.isChatMinimized;
        container.classList.toggle('minimized', UIState.isChatMinimized);
    });
    
    const sendMessage = async () => {
        const question = input.value.trim();
        if (question) {
            showLoading(sendBtn);
            await handleChatMessage(question, messagesContainer);
            input.value = '';
            hideLoading(sendBtn);
        }
    };
    
    sendBtn.addEventListener('click', sendMessage);
    
    input.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            await sendMessage();
        }
    });
}

// Chat Message Handling
async function handleChatMessage(question, container) {
    // Add user message with typing animation
    container.innerHTML += `
        <div class="message user-message">
            <p>${question}</p>
        </div>
    `;
    
    // Add typing indicator
    container.innerHTML += `
        <div class="message ai-message typing">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    container.scrollTop = container.scrollHeight;
    
    try {
        // Try Gemini API first
        const response = await getGeminiResponse(question);
        
        // Remove typing indicator
        container.querySelector('.typing').remove();
        
        // Add AI response
        container.innerHTML += `
            <div class="message ai-message">
                <p>${response}</p>
            </div>
        `;
    } catch (error) {
        // Remove typing indicator
        container.querySelector('.typing').remove();
        
        // Fallback to local FAQ
        const fallbackResponse = getLocalResponse(question);
        container.innerHTML += `
            <div class="message ai-message">
                <p>${fallbackResponse}</p>
            </div>
        `;
    }
    
    container.scrollTop = container.scrollHeight;
}

// Gemini API configuration
const GEMINI_API_KEY = 'AIzaSyByXYQL2vksV3IP6bdfdshYcksV1h6EEd4'; // Replace with your API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function getGeminiResponse(question) {
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an agricultural expert. Please answer this farming-related question: ${question}`
                    }]
                }]
            })
        });
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

function getLocalResponse(question) {
    const faq = {
        'organic': 'Organic farming focuses on natural methods and avoids synthetic inputs.',
        'chemical': 'Chemical farming uses synthetic fertilizers and pesticides for higher yields.',
        'irrigation': 'Choose irrigation based on crop needs, water availability, and cost.',
        'crops': 'Select crops based on your soil type, climate, and market demand.',
        'pest': 'Integrated Pest Management (IPM) combines biological, cultural, and chemical methods.',
        'soil': 'Regular soil testing helps determine nutrient needs and pH levels.',
        'weather': 'Monitor weather forecasts and adapt farming practices accordingly.',
        'market': 'Research local market prices and demand before selecting crops.',
        'fertilizer': 'Use fertilizers based on soil test results and crop requirements.',
        'harvest': 'Harvest timing affects crop quality and market value.'
    };
    
    const lowerQuestion = question.toLowerCase();
    for (const [key, answer] of Object.entries(faq)) {
        if (lowerQuestion.includes(key)) {
            return answer;
        }
    }
    
    return "I'm sorry, I don't have information about that. Please try asking about organic farming, chemical farming, irrigation, or crop selection.";
}

function loadInitialData() {
    // Load initial data from the server
    fetch('/data/crops.csv')
        .then(response => response.text())
        .then(data => {
            // Process the data
            console.log('Crops data loaded');
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
} 