/**
 * Gemini API Integration with Assistant
 * This file connects the Gemini API to the AI assistant
 * in the dashboard to provide more intelligent and contextual responses.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Gemini integration with Assistant...');
    
    // Check if the assistant elements exist on the page
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-message-btn');
    
    if (!chatMessages || !messageInput || !sendBtn) {
        console.log('Assistant elements not found on this page. Skipping Gemini integration.');
        return;
    }
    
    // Get the API key from main.js or use the one from localStorage
    let apiKey = '';
    
    // Try to get the API key from the global API_KEYS object first
    if (window.API_KEYS && window.API_KEYS.GEMINI) {
        apiKey = window.API_KEYS.GEMINI;
        console.log('Using API key from global API_KEYS object');
    } else {
        // Fallback to localStorage
        apiKey = localStorage.getItem('gemini_api_key') || 'AIzaSyByXYQL2vksV3IP6bdfdshYcksV1h6EEd4';
        console.log('Using API key from localStorage or default');
    }
    
    try {
        // Initialize Gemini API
        window.assistantGemini = new GeminiAPI(apiKey);
        console.log('Gemini API initialized for assistant');
        
        // Override the assistant's message handling
        overrideAssistantFunctionality();
    } catch (error) {
        console.error('Error initializing Gemini API:', error);
        addSystemMessage('Error connecting to Gemini API. Using fallback responses.');
    }
    
    // Add a system message function
    function addSystemMessage(message) {
        if (!chatMessages) return;
        
        const msgElement = document.createElement('div');
        msgElement.className = 'message system-message';
        msgElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="message-content">
                ${message}
            </div>
        `;
        chatMessages.appendChild(msgElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to override the assistant's functionality
    function overrideAssistantFunctionality() {
        // Make sure the assistantGemini is available
        if (!window.assistantGemini) return;
        
        // Create our new processUserQuery function that uses Gemini API
        window.geminiProcessUserQuery = async function(query) {
            try {
                console.log('Processing query with Gemini API:', query);
                
                // Direct query to Gemini without farming context
                const result = await window.assistantGemini.generateContent(query);
                return result.text;
            } catch (error) {
                console.error('Error using Gemini API, falling back to default responses:', error);
                // Return a simple fallback message
                return `I'm sorry, I couldn't process your request through Gemini at the moment. Please try again later.`;
            }
        };
        
        // Try to hook into the assistant's functionality
        const handleUserMessageOriginal = window.handleUserMessage;
        
        // Wait a moment to ensure the assistant script has loaded
        setTimeout(() => {
            // Try to find the handleUserMessage function directly
            const allScripts = document.querySelectorAll('script');
            let assistantScript = null;
            
            for (const script of allScripts) {
                if (script.src && script.src.includes('dashboard-assistant.js')) {
                    assistantScript = script;
                    break;
                }
            }
            
            if (assistantScript) {
                console.log('Found assistant script, attempting integration');
                
                // Create a wrapper for the processUserQuery function
                const originalAddAssistantMessage = window.addAssistantMessage;
                
                if (typeof originalAddAssistantMessage === 'function') {
                    window.addAssistantMessage = function(message) {
                        originalAddAssistantMessage(message);
                    };
                    
                    // Attempt to override the message handler or attach our own
                    if (sendBtn) {
                        // Remove existing click listeners (not always possible)
                        const newSendBtn = sendBtn.cloneNode(true);
                        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
                        
                        // Add our Gemini-powered handler
                        newSendBtn.addEventListener('click', async function() {
                            const message = messageInput.value.trim();
                            if (!message) return;
                            
                            // Add user message to chat
                            if (typeof window.addUserMessage === 'function') {
                                window.addUserMessage(message);
                            } else {
                                const msgElement = document.createElement('div');
                                msgElement.className = 'message user-message';
                                msgElement.innerHTML = `
                                    <div class="message-avatar">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="message-content">
                                        ${message}
                                    </div>
                                `;
                                chatMessages.appendChild(msgElement);
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                            
                            messageInput.value = '';
                            
                            // Show typing indicator
                            const typingIndicator = document.createElement('div');
                            typingIndicator.className = 'message assistant-message typing-indicator';
                            typingIndicator.innerHTML = `
                                <div class="message-avatar">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <div class="message-content">
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div>
                            `;
                            chatMessages.appendChild(typingIndicator);
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // Get response from Gemini
                            try {
                                const response = await window.geminiProcessUserQuery(message);
                                
                                // Remove typing indicator
                                chatMessages.removeChild(typingIndicator);
                                
                                // Add assistant response
                                if (typeof window.addAssistantMessage === 'function') {
                                    window.addAssistantMessage(response);
                                } else {
                                    const msgElement = document.createElement('div');
                                    msgElement.className = 'message assistant-message';
                                    msgElement.innerHTML = `
                                        <div class="message-avatar">
                                            <i class="fas fa-robot"></i>
                                        </div>
                                        <div class="message-content">
                                            ${response}
                                        </div>
                                    `;
                                    chatMessages.appendChild(msgElement);
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                }
                            } catch (error) {
                                console.error('Error getting response from Gemini:', error);
                                
                                // Remove typing indicator
                                chatMessages.removeChild(typingIndicator);
                                
                                // Add error message
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'message assistant-message';
                                errorMsg.innerHTML = `
                                    <div class="message-avatar">
                                        <i class="fas fa-robot"></i>
                                    </div>
                                    <div class="message-content">
                                        I'm sorry, I encountered an error processing your request. Please try again later.
                                    </div>
                                `;
                                chatMessages.appendChild(errorMsg);
                                chatMessages.scrollTop = chatMessages.scrollHeight;
                            }
                        });
                        
                        // Also handle Enter key press
                        messageInput.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                newSendBtn.click();
                            }
                        });
                        
                        console.log('Gemini API successfully integrated with Assistant');
                        addSystemMessage('Gemini AI is now powering your assistant. Ask any questions!');
                    }
                } else {
                    console.error('Could not find addAssistantMessage function');
                }
            } else {
                console.error('Could not find assistant script');
            }
        }, 1000); // Wait 1 second for everything to load
    }
});

// Add some simple CSS for typing indicator if it's not already defined
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .typing-indicator .message-content {
            display: flex;
            align-items: center;
            min-height: 24px;
        }
        
        .typing-indicator .dot {
            background-color: #10b981;
            border-radius: 50%;
            display: inline-block;
            height: 8px;
            width: 8px;
            margin: 0 3px;
            animation: typing-dot 1.4s infinite ease-in-out both;
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
        
        @keyframes typing-dot {
            0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .system-message .message-avatar {
            background-color: #dbeafe !important;
            color: #2563eb !important;
        }
        
        .system-message .message-content {
            background-color: #dbeafe !important;
            color: #2563eb !important;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
});
