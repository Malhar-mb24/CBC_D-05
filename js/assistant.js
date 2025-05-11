/**
 * Kisan Sathi AI Assistant
 * Handles chat functionality and integration with AI services
 */

// Store chat history
let chatHistory = [];

// Initialize the assistant
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Kisan Sathi AI Assistant...');
    
    // Check if we're on the dashboard page with the assistant section
    const assistantSection = document.getElementById('kisan-sathi');
    if (!assistantSection) {
        console.log('Assistant section not found, exiting initialization');
        return;
    }
    
    // Initialize chat
    initChat();
    
    // Load chat history
    loadChatHistory();
});

/**
 * Initialize chat functionality
 */
function initChat() {
    console.log('Setting up chat functionality...');
    
    // Get chat elements
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-message-btn');
    const voiceButton = document.getElementById('voice-btn');
    const speakButton = document.getElementById('speak-btn');
    const clearButton = document.getElementById('clear-chat-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    // Set up event listeners
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keydown', function(event) {
            // Send message on Enter key (without Shift)
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (voiceButton) {
        voiceButton.addEventListener('click', toggleVoiceInput);
    }
    
    if (speakButton) {
        speakButton.addEventListener('click', toggleTextToSpeech);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearChat);
    }
    
    console.log('Chat functionality set up successfully');
}

/**
 * Send a message to the assistant
 */
function sendMessage() {
    console.log('Attempting to send message...');
    
    // Get message input
    const messageInput = document.getElementById('message-input');
    if (!messageInput) {
        console.error('Message input element not found');
        return;
    }
    
    // Get message text
    const messageText = messageInput.value.trim();
    if (!messageText) {
        console.log('Message is empty, not sending');
        return;
    }
    
    console.log('Sending message:', messageText);
    
    // Add user message to chat
    addMessageToChat('user', messageText);
    
    // Clear input
    messageInput.value = '';
    
    // Focus input for next message
    messageInput.focus();
    
    // Process message and get response
    processMessage(messageText);
}

/**
 * Process the user message and generate a response
 * @param {string} message - The user's message
 */
function processMessage(message) {
    console.log('Processing message:', message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI processing time (replace with actual API call in production)
    setTimeout(() => {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Generate response based on message
        const response = generateResponse(message);
        
        // Add assistant response to chat
        addMessageToChat('assistant', response);
        
        // Speak response if text-to-speech is enabled
        if (isSpeechEnabled()) {
            speakText(response);
        }
    }, 1000);
}

/**
 * Generate a response based on the user's message
 * @param {string} message - The user's message
 * @returns {string} The assistant's response
 */
function generateResponse(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check for common farming queries
    if (lowerMessage.includes('crop') && (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('which'))) {
        return "Based on your soil type and climate, I recommend considering rice, wheat, or cotton. For more specific recommendations, please share details about your soil type, water availability, and region.";
    }
    
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
        return "For balanced nutrition, consider using a mix of organic and inorganic fertilizers. Organic options like compost and manure improve soil health, while NPK fertilizers provide essential nutrients. Always test your soil before application.";
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('disease')) {
        return "Integrated Pest Management (IPM) is the best approach. This includes crop rotation, beneficial insects, and targeted pesticides only when necessary. For specific pest issues, please describe the symptoms or share a photo.";
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
        return "Drip irrigation is the most water-efficient method, saving up to 60% compared to flood irrigation. Consider installing soil moisture sensors to optimize watering schedules based on actual plant needs.";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast') || lowerMessage.includes('rain')) {
        return "The current forecast shows normal conditions for the season. For precise local weather, I recommend checking the weather section of the dashboard which provides 7-day forecasts specific to your location.";
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('sell')) {
        return "Current market trends show stable prices for major crops. Check the Market Analysis section for real-time price data. Consider joining a Farmer Producer Organization (FPO) for better negotiation power.";
    }
    
    if (lowerMessage.includes('scheme') || lowerMessage.includes('subsidy') || lowerMessage.includes('government')) {
        return "You may be eligible for several government schemes. The PM-KISAN provides ₹6,000 annually, and the Soil Health Card Scheme offers free soil testing. Visit the Government Schemes section to check your eligibility for these and other programs.";
    }
    
    if (lowerMessage.includes('loan') || lowerMessage.includes('credit') || lowerMessage.includes('finance')) {
        return "Kisan Credit Cards offer loans at 4% interest (with timely repayment). NABARD also provides various agricultural financing options. I recommend checking with your local cooperative bank for the best terms available in your area.";
    }
    
    if (lowerMessage.includes('organic') || lowerMessage.includes('natural farming')) {
        return "Organic farming can be profitable with the right approach. Start with crop rotation, green manuring, and composting. Certification takes 2-3 years but allows premium pricing. The government offers subsidies up to ₹50,000/hectare for organic conversion.";
    }
    
    // Default responses for greetings and common queries
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
        return "Namaste! How can I assist you with your farming today?";
    }
    
    if (lowerMessage.includes('thank')) {
        return "You're welcome! Feel free to ask if you need any more farming advice.";
    }
    
    if (lowerMessage.includes('how are you')) {
        return "I'm functioning well and ready to help with your agricultural questions!";
    }
    
    // Default response for other queries
    return "That's an interesting question about farming. Could you provide more details so I can give you specific advice? I can help with crop selection, pest management, government schemes, market prices, and more.";
}

/**
 * Add a message to the chat
 * @param {string} sender - 'user' or 'assistant'
 * @param {string} text - The message text
 */
function addMessageToChat(sender, text) {
    // Get chat messages container
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) {
        console.error('Chat messages container not found');
        return;
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    // Create avatar
    const avatarElement = document.createElement('div');
    avatarElement.className = 'message-avatar';
    
    // Set avatar icon based on sender
    if (sender === 'user') {
        avatarElement.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatarElement.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    // Create message content
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.textContent = text;
    
    // Assemble message
    messageElement.appendChild(avatarElement);
    messageElement.appendChild(contentElement);
    
    // Add to chat
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    chatHistory.push({
        sender: sender,
        text: text,
        timestamp: new Date().toISOString()
    });
    
    // Save chat history
    saveChatHistory();
}

/**
 * Show typing indicator
 */
function showTypingIndicator() {
    // Get chat messages container
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Check if typing indicator already exists
    let typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) return;
    
    // Create typing indicator
    typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'message assistant-message typing-indicator';
    
    // Create avatar
    const avatarElement = document.createElement('div');
    avatarElement.className = 'message-avatar';
    avatarElement.innerHTML = '<i class="fas fa-robot"></i>';
    
    // Create content with dots
    const contentElement = document.createElement('div');
    contentElement.className = 'message-content';
    contentElement.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    
    // Assemble indicator
    typingIndicator.appendChild(avatarElement);
    typingIndicator.appendChild(contentElement);
    
    // Add to chat
    chatMessages.appendChild(typingIndicator);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Remove typing indicator
 */
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Toggle voice input
 */
function toggleVoiceInput() {
    console.log('Voice input toggled');
    
    const voiceButton = document.getElementById('voice-btn');
    const recordingStatus = document.getElementById('recording-status');
    
    if (!voiceButton || !recordingStatus) return;
    
    // Check if recording is active
    const isRecording = voiceButton.classList.contains('active');
    
    if (isRecording) {
        // Stop recording
        voiceButton.classList.remove('active');
        recordingStatus.textContent = '';
        
        // In a real implementation, this would stop the speech recognition
        console.log('Stopped recording');
        
        // Simulate getting speech recognition result
        setTimeout(() => {
            const messageInput = document.getElementById('message-input');
            if (messageInput) {
                messageInput.value = "How to improve soil health?";
                sendMessage();
            }
        }, 500);
    } else {
        // Start recording
        voiceButton.classList.add('active');
        recordingStatus.textContent = 'Listening...';
        
        // In a real implementation, this would start the speech recognition
        console.log('Started recording');
    }
}

/**
 * Toggle text-to-speech
 */
function toggleTextToSpeech() {
    console.log('Text-to-speech toggled');
    
    const speakButton = document.getElementById('speak-btn');
    if (!speakButton) return;
    
    // Toggle active state
    speakButton.classList.toggle('active');
    
    // Update icon
    const icon = speakButton.querySelector('i');
    if (icon) {
        if (speakButton.classList.contains('active')) {
            icon.className = 'fas fa-volume-up';
        } else {
            icon.className = 'fas fa-volume-mute';
        }
    }
    
    // Save preference
    localStorage.setItem('ttsEnabled', speakButton.classList.contains('active'));
}

/**
 * Check if text-to-speech is enabled
 * @returns {boolean} Whether text-to-speech is enabled
 */
function isSpeechEnabled() {
    const speakButton = document.getElementById('speak-btn');
    if (!speakButton) return false;
    
    return speakButton.classList.contains('active');
}

/**
 * Speak text using text-to-speech
 * @param {string} text - The text to speak
 */
function speakText(text) {
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
        console.error('Speech synthesis not supported');
        return;
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language (can be changed based on user preference)
    utterance.lang = 'en-IN';
    
    // Speak
    window.speechSynthesis.speak(utterance);
}

/**
 * Clear chat
 */
function clearChat() {
    console.log('Clearing chat');
    
    // Get chat messages container
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Remove all messages except the first welcome message
    while (chatMessages.children.length > 1) {
        chatMessages.removeChild(chatMessages.lastChild);
    }
    
    // Clear chat history except welcome message
    chatHistory = chatHistory.slice(0, 1);
    
    // Save updated history
    saveChatHistory();
}

/**
 * Save chat history to localStorage
 */
function saveChatHistory() {
    try {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
    try {
        const savedHistory = localStorage.getItem('chatHistory');
        
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
            
            // Display chat history
            const chatMessages = document.getElementById('chat-messages');
            if (!chatMessages) return;
            
            // Clear existing messages
            chatMessages.innerHTML = '';
            
            // Add messages from history
            chatHistory.forEach(message => {
                addMessageToChat(message.sender, message.text);
            });
        } else {
            // Add default welcome message
            chatHistory = [{
                sender: 'assistant',
                text: "Hello! I'm Kisan Sathi, your personal farming assistant. How can I help you today?",
                timestamp: new Date().toISOString()
            }];
            
            saveChatHistory();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Add CSS for typing indicator
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .message-content {
            display: flex;
            align-items: center;
            height: 30px;
        }
        
        .typing-indicator .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin: 0 3px;
            background-color: #999;
            border-radius: 50%;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        .typing-indicator .dot:nth-child(1) {
            animation-delay: 0s;
        }
        
        .typing-indicator .dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-indicator .dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typingAnimation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
});
