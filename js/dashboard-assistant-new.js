// Add styles for system message
const style = document.createElement('style');
style.textContent = `
    .system-message .message-avatar {
        background-color: #dbeafe !important;
        color: #2563eb !important;
    }
    
    .system-message .message-content {
        background-color: #dbeafe !important;
        color: #2563eb !important;
        font-style: italic;
    }
    
    .system-message {
        transition: opacity 0.5s ease-out;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Kisan Sathi AI Assistant...');
    
    // Initialize Gemini API first
    initializeGeminiAPI();
    
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-message-btn');
    const chatMessages = document.getElementById('chat-messages');
    const voiceBtn = document.getElementById('voice-btn');
    const speakBtn = document.getElementById('speak-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const recordingStatus = document.getElementById('recording-status');
    
    // Initialize assistant elements if they exist
    if (!messageInput || !sendBtn || !chatMessages) {
        console.log('Assistant elements not found on this page. Skipping initialization.');
        return; // Exit if elements don't exist
    }
    
    // Add system message to indicate successful initialization
    if (chatMessages.children.length === 1) {
        const systemMsg = document.createElement('div');
        systemMsg.className = 'message system-message';
        systemMsg.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="message-content">
                Gemini AI is now powering your assistant. Ask any questions!
            </div>
        `;
        chatMessages.appendChild(systemMsg);
        setTimeout(() => {
            systemMsg.style.opacity = '0';
            setTimeout(() => systemMsg.remove(), 500);
        }, 5000);
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
        
        return msgElement;
    }
    
    // Function to handle user message submission
    async function handleUserMessage() {
        if (!messageInput.value.trim()) return;
        
        // Add user message to chat
        const userMessage = messageInput.value.trim();
        addUserMessage(userMessage);
        messageInput.value = '';
        
        // Show loading indicator
        const loadingMessage = addAssistantMessage('<div class="typing-indicator"><span></span><span></span><span></span></div>');
        
        try {
            // Get user's preferred language
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
            
            // Construct prompt with user message, context, and language preference
            const systemPrompt = "You are Kisan Sathi, an AI assistant for farmers. Provide helpful advice on farming practices, crop selection, weather information, and government schemes. Be concise, friendly, and informative.";
            const prompt = `${systemPrompt}\n\nUser's preferred language: ${preferredLanguage}\n\nPlease respond in ${preferredLanguage} language.\n\nUser: ${userMessage}`;
            
            // Call Gemini API
            const result = await window.assistantGemini.generateContent(prompt);
            
            // Remove loading indicator and add assistant response
            chatMessages.removeChild(loadingMessage);
            const assistantMessage = result.text.trim();
            addAssistantMessage(assistantMessage);
            
            // Speak the response if speech is enabled
            if (isSpeechEnabled) {
                speakText(assistantMessage);
            }
            
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // Remove loading indicator and show error message
            chatMessages.removeChild(loadingMessage);
            
            // Get user's preferred language for error message
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
            let errorMessage = 'I\'m sorry, I encountered an error. Please try again later.';
            
            // Provide error message in the user's preferred language
            if (preferredLanguage === 'hi') {
                errorMessage = 'मुझे खेद है, मुझे एक त्रुटि मिली। कृपया बाद में पुनः प्रयास करें।';
            } else if (preferredLanguage === 'mr') {
                errorMessage = 'मला माफ करा, मला एक त्रुटी आढळली. कृपया नंतर पुन्हा प्रयत्न करा.';
            } else if (preferredLanguage === 'gu') {
                errorMessage = 'મને માફ કરશો, મને એક ભૂલ મળી. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.';
            } else if (preferredLanguage === 'bn') {
                errorMessage = 'আমি দুঃখিত, আমি একটি ত্রুটি পেয়েছি। পরে আবার চেষ্টা করুন।';
            } else if (preferredLanguage === 'ta') {
                errorMessage = 'மன்னிக்கவும், எனக்கு ஒரு பிழை ஏற்பட்டது. பிறகு மீண்டும் முயற்சிக்கவும்.';
            } else if (preferredLanguage === 'te') {
                errorMessage = 'క్షమించండి, నాకు లోపం ఎదురైంది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.';
            } else if (preferredLanguage === 'ml') {
                errorMessage = 'ക്ഷമിക്കണം, എനിക്ക് ഒരു പിശക് കണ്ടെത്തി. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.';
            } else if (preferredLanguage === 'kn') {
                errorMessage = 'ಕ್ಷಮಿಸಿ, ನನಗೆ ದೋಷ ಕಂಡುಬಂದಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.';
            }
            
            addAssistantMessage(errorMessage);
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
                if (recognition && recognition.recognizing) {
                    recognition.stop();
                    recordingStatus.textContent = 'Recording stopped';
                    setTimeout(() => {
                        recordingStatus.textContent = '';
                    }, 2000);
                    return;
                }
                
                startSpeechRecognition();
            } else {
                recordingStatus.textContent = 'Speech recognition not supported in this browser';
                setTimeout(() => {
                    recordingStatus.textContent = '';
                }, 3000);
            }
        });
    }
    
    // Language codes for speech recognition
    const langCodes = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'mr': 'mr-IN',
        'gu': 'gu-IN',
        'bn': 'bn-IN',
        'ta': 'ta-IN',
        'te': 'te-IN',
        'ml': 'ml-IN',
        'kn': 'kn-IN'
    };
    
    // Function to start speech recognition with proper language settings
    function startSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.recognizing = true;
        
        // Get the user's preferred language from localStorage
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        
        // Set recognition parameters
        recognition.lang = langCodes[preferredLanguage] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = function() {
            recordingStatus.textContent = 'Listening...';
            voiceBtn.classList.add('recording');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            
            // Process the transcript based on language
            let processedText = transcript.trim();
            
            // Convert numbers to digits if needed
            if (preferredLanguage !== 'en') {
                processedText = convertNumberWordsToDigits(processedText, preferredLanguage);
            }
            
            messageInput.value = processedText;
            recordingStatus.textContent = 'Processing...';
        };
        
        recognition.onend = function() {
            recognition.recognizing = false;
            recordingStatus.textContent = 'Ready';
            voiceBtn.classList.remove('recording');
            setTimeout(() => {
                recordingStatus.textContent = '';
            }, 2000);
        };
        
        recognition.onerror = function(event) {
            recognition.recognizing = false;
            recordingStatus.textContent = 'Error: ' + event.error;
            setTimeout(() => {
                recordingStatus.textContent = '';
            }, 2000);
            voiceBtn.classList.remove('recording');
        };
        
        recognition.start();
    }
    
    // Function to convert number words to digits in different languages
    function convertNumberWordsToDigits(text, language) {
        // Number words in different languages
        const numberWords = {
            'hi': {
                'शून्य': '0', 'एक': '1', 'दो': '2', 'तीन': '3', 'चार': '4',
                'पांच': '5', 'छह': '6', 'सात': '7', 'आठ': '8', 'नौ': '9',
                'दस': '10'
            },
            'mr': {
                'शून्य': '0', 'एक': '1', 'दोन': '2', 'तीन': '3', 'चार': '4',
                'पाच': '5', 'सहा': '6', 'सात': '7', 'आठ': '8', 'नऊ': '9',
                'दहा': '10'
            },
            'bn': {
                'শূন্য': '0', 'এক': '1', 'দুই': '2', 'তিন': '3', 'চার': '4',
                'পাঁচ': '5', 'ছয়': '6', 'সাত': '7', 'আট': '8', 'নয়': '9',
                'দশ': '10'
            },
            'ta': {
                'சுழியம்': '0', 'ஒன்று': '1', 'இரண்டு': '2', 'மூன்று': '3', 'நான்கு': '4',
                'ஐந்து': '5', 'ஆறு': '6', 'ஏழு': '7', 'எட்டு': '8', 'ஒன்பது': '9',
                'பத்து': '10'
            },
            'te': {
                'సున్నా': '0', 'ఒకటి': '1', 'రెండు': '2', 'మూడు': '3', 'నాలుగు': '4',
                'ఐదు': '5', 'ఆరు': '6', 'ఏడు': '7', 'ఎనిమిది': '8', 'తొమ్మిది': '9',
                'పది': '10'
            },
            'ml': {
                'പൂജ്യം': '0', 'ഒന്ന്': '1', 'രണ്ട്': '2', 'മൂന്ന്': '3', 'നാല്': '4',
                'അഞ്ച്': '5', 'ആറ്': '6', 'ഏഴ്': '7', 'എട്ട്': '8', 'ഒൻപത്': '9',
                'പത്ത്': '10'
            },
            'kn': {
                'ಸೊನ್ನೆ': '0', 'ಒಂದು': '1', 'ಎರಡು': '2', 'ಮೂರು': '3', 'ನಾಲ್ಕು': '4',
                'ಐದು': '5', 'ಆರು': '6', 'ಏಳು': '7', 'ಎಂಟು': '8', 'ಒಂಬತ್ತು': '9',
                'ಹತ್ತು': '10'
            },
            'gu': {
                'શૂન્ય': '0', 'એક': '1', 'બે': '2', 'ત્રણ': '3', 'ચાર': '4',
                'પાંચ': '5', 'છ': '6', 'સાત': '7', 'આઠ': '8', 'નવ': '9',
                'દસ': '10'
            }
        };
        
        // If we don't have number words for this language, return original text
        if (!numberWords[language]) return text;
        
        // Replace number words with digits
        let result = text;
        for (const [word, digit] of Object.entries(numberWords[language])) {
            const regex = new RegExp('\\b' + word + '\\b', 'gi');
            result = result.replace(regex, digit);
        }
        
        return result;
    }
    
    // Text to speech functionality
    function speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Get the user's preferred language from localStorage
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
            
            // Map language codes to speech synthesis language codes
            const langMap = {
                'en': 'en-IN',
                'hi': 'hi-IN',
                'mr': 'mr-IN',
                'gu': 'gu-IN',
                'bn': 'bn-IN',
                'ta': 'ta-IN',
                'te': 'te-IN',
                'ml': 'ml-IN',
                'kn': 'kn-IN'
            };
            
            // Set the utterance language based on user preference
            utterance.lang = langMap[preferredLanguage] || 'en-IN';
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

// Function to initialize the Gemini API
function initializeGeminiAPI() {
    // Try to get API key from multiple sources
    let apiKey = null;
    
    // 1. Try to get from main.js API_KEYS
    if (window.API_KEYS && window.API_KEYS.GEMINI) {
        apiKey = window.API_KEYS.GEMINI;
        console.log('Using API key from global API_KEYS object');
    } 
    // 2. Try to get from localStorage
    else if (localStorage.getItem('gemini_api_key')) {
        apiKey = localStorage.getItem('gemini_api_key');
        console.log('Using API key from localStorage');
    } 
    // 3. Use hardcoded key as fallback
    else {
        apiKey = 'AIzaSyAYU3EdLwGORlH-HDJhRgasrbhOOnrVcis';
        console.log('Using fallback API key');
    }
    
    // Initialize the API
    try {
        window.assistantGemini = new GeminiAPI(apiKey);
        console.log('Successfully initialized Gemini API');
        return window.assistantGemini;
    } catch (error) {
        console.error('Error initializing Gemini API:', error);
        return null;
    }
}
