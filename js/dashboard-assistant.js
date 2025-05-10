document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-message-btn');
    const chatMessages = document.getElementById('chat-messages');
    const voiceBtn = document.getElementById('voice-btn');
    const speakBtn = document.getElementById('speak-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const recordingStatus = document.getElementById('recording-status');
    
    // Initialize assistant elements if they exist
    if (!messageInput || !sendBtn || !chatMessages) {
        return; // Exit if elements don't exist
    }
    
    let recognition = null;
    let synth = window.speechSynthesis;
    let isSpeechEnabled = false;
    
    // Function to add user message
    function addUserMessage(message) {
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
    
    // Function to add assistant message
    function addAssistantMessage(message) {
        const msgElement = document.createElement('div');
        msgElement.className = 'message assistant-message';
        msgElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${message}
            </div>
        `;
        chatMessages.appendChild(msgElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Speak message if speech is enabled
        if (isSpeechEnabled) {
            speakText(message);
        }
    }
    
    // Function to handle user message submission
    async function handleUserMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        addUserMessage(message);
        messageInput.value = '';
        
        // Process user query and generate response
        await processUserQuery(message);
    }
    
    // Process user query and generate response using Gemini
    async function processUserQuery(query) {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message assistant-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Ensure Gemini API is initialized
        if (!window.assistantGemini) {
            // Try to initialize from localStorage if possible
            const apiKey = localStorage.getItem('gemini_api_key');
            if (apiKey) {
                window.assistantGemini = new GeminiAPI(apiKey);
            } else {
                chatMessages.removeChild(typingIndicator);
                addAssistantMessage('Gemini API not initialized. Please set up your API key.');
                return;
            }
        }

        try {
            // Gather ALL relevant farmer/farm data from localStorage
            let context = '';
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                // Skip obviously irrelevant or UI-only keys
                if ([
                    'theme', 'preferredLanguage', 'google_translate_element', 'PAGER', 'ai-chat-minimized',
                    'lastVisited', 'dashboardState', 'sidebarCollapsed', 'recentNotifications', 'visitedPages'
                ].includes(key)) continue;
                try {
                    let value = localStorage.getItem(key);
                    // Try to pretty-print JSON values
                    if (value && (value.startsWith('{') || value.startsWith('['))) {
                        value = JSON.stringify(JSON.parse(value), null, 2);
                    }
                    context += `\n${key}:\n${value}\n`;
                } catch (e) {
                    // fallback: just include raw value
                    context += `\n${key}:\n${localStorage.getItem(key)}\n`;
                }
            }

            // Detect language of the user's question using franc-min (loaded globally)
            let detectedLang = 'en';
            if (window.franc) {
                const isoMap = window.franc.isoMap || {eng:'en',hin:'hi',ben:'bn',mar:'mr',guj:'gu',pan:'pa',tam:'ta',tel:'te',kan:'kn',mal:'ml',ori:'or'};
                const francResult = window.franc(query);
                detectedLang = isoMap[francResult] || 'en';
            }

            // If the user explicitly requests a language in their question, prioritize that (simple heuristic)
            const langKeywords = {
                'hindi': 'hi', 'english': 'en', 'bengali': 'bn', 'marathi': 'mr', 'gujarati': 'gu', 'punjabi': 'pa',
                'tamil': 'ta', 'telugu': 'te', 'kannada': 'kn', 'malayalam': 'ml', 'odia': 'or', 'oriya': 'or'
            };
            let explicitLang = null;
            for (const [word, code] of Object.entries(langKeywords)) {
                if (query.toLowerCase().includes('in ' + word)) {
                    explicitLang = code;
                    break;
                }
            }

            // Fallback to preferredLanguage if detection fails
            let preferredLanguage = explicitLang || detectedLang || localStorage.getItem('preferredLanguage') || (navigator.language ? navigator.language.split('-')[0] : 'en');

            // Persona & instruction preamble
            const personaPreamble = `You are Kissan Sathi, a friendly, knowledgeable digital assistant for Indian farmers.\nYou know the following about the farmer and his farm (all available data below):\n${context}\n\nInstructions: Always reply in ${preferredLanguage} unless the user requests another language. Answer in a clear, plain conversational tone. Use the data above to personalize answers. If the user asks for a detailed answer, provide one. Otherwise, keep it clear and to the point. Do not use markup, lists, or code blocks unless the user specifically asks for them.\n\nUser's question: ${query}`;

            const result = await window.assistantGemini.generateContent(personaPreamble);
            chatMessages.removeChild(typingIndicator);

            // Post-process: Strip basic markdown/HTML/markup (bold, italics, code, lists)
            let cleanText = result.text
                .replace(/\*\*(.*?)\*\*/g, '$1') // bold
                .replace(/\*(.*?)\*/g, '$1') // italics
                .replace(/`([^`]*)`/g, '$1') // inline code
                .replace(/\n- /g, '\n') // lists
                .replace(/^- /gm, '') // lists at start
                .replace(/\n{2,}/g, '\n') // multiple newlines
                .replace(/<[^>]+>/g, '') // html tags
                .replace(/\n/g, '<br>') // convert newlines to <br> for display
                .trim();

            addAssistantMessage(cleanText);
        } catch (error) {
            chatMessages.removeChild(typingIndicator);
            addAssistantMessage(`Sorry, there was an error fetching a response from Gemini: ${error.message}`);
        }
    }
    
    // Handle send button click
    if (sendBtn) {
        sendBtn.addEventListener('click', async () => {
            await handleUserMessage();
        });
    }
    
    // Handle Enter key press in message input
    if (messageInput) {
        messageInput.addEventListener('keydown', async function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                await handleUserMessage();
            }
        });
    }
    
    // Speech to text functionality
    if (voiceBtn) {
        voiceBtn.addEventListener('click', function() {
            if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
                if (recognition && recognition.listening) {
                    recognition.stop();
                    recordingStatus.textContent = 'Recording stopped';
                    setTimeout(() => {
                        recordingStatus.textContent = '';
                    }, 2000);
                    return;
                }
                
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.lang = 'en-IN';
                recognition.interimResults = false;
                
                recognition.onstart = function() {
                    recordingStatus.textContent = 'Listening...';
                    voiceBtn.classList.add('recording');
                };
                
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    messageInput.value = transcript;
                    recordingStatus.textContent = 'Processing...';
                };
                
                recognition.onend = function() {
                    recordingStatus.textContent = 'Ready';
                    voiceBtn.classList.remove('recording');
                    setTimeout(() => {
                        recordingStatus.textContent = '';
                    }, 2000);
                };
                
                recognition.onerror = function(event) {
                    recordingStatus.textContent = 'Error: ' + event.error;
                    setTimeout(() => {
                        recordingStatus.textContent = '';
                    }, 2000);
                    voiceBtn.classList.remove('recording');
                };
                
                recognition.start();
            } else {
                recordingStatus.textContent = 'Speech recognition not supported in this browser';
                setTimeout(() => {
                    recordingStatus.textContent = '';
                }, 3000);
            }
        });
    }
    
    // Text to speech functionality
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            synth.speak(utterance);
        }
    }
    
    // Toggle speech functionality
    if (speakBtn) {
        speakBtn.addEventListener('click', function() {
            isSpeechEnabled = !isSpeechEnabled;
            const icon = speakBtn.querySelector('i');
            
            if (isSpeechEnabled) {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                speakText('Speech output is now enabled');
            } else {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                
                if (synth.speaking) {
                    synth.cancel();
                }
            }
        });
    }
    
    // Clear chat functionality
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', function() {
            // Remove all messages except the first (greeting)
            while (chatMessages.children.length > 1) {
                chatMessages.removeChild(chatMessages.lastChild);
            }
        });
    }
});
