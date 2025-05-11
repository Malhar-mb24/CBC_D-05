/**
 * Speech Recognition Handler for Kisan Sathi
 * Handles multilingual speech recognition for all input fields
 * Supports 8 languages: English, Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, Malayalam, and Kannada
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Speech Recognition Handler...');
    
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
    
    // Initialize speech recognition
    let recognition;
    let currentInputId;
    let activeButton;
    
    // Find all mic buttons
    const micButtons = document.querySelectorAll('.mic-btn');
    if (micButtons.length === 0) {
        console.log('No mic buttons found on this page.');
        return;
    }
    
    console.log(`Found ${micButtons.length} mic buttons on this page.`);
    
    // Attach event listeners to all mic buttons
    micButtons.forEach(button => {
        button.addEventListener('click', function() {
            const inputId = this.getAttribute('data-input');
            if (!inputId) {
                console.error('Mic button missing data-input attribute');
                return;
            }
            
            startSpeechRecognition(inputId, this);
        });
    });
    
    // Function to start speech recognition
    function startSpeechRecognition(inputId, button) {
        // Check if speech recognition is supported
        if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }
        
        // Stop any ongoing recognition
        if (recognition && recognition.recognizing) {
            recognition.abort();
        }
        
        // Get the input element
        const inputElement = document.getElementById(inputId);
        if (!inputElement) {
            console.error(`Input element with ID ${inputId} not found`);
            return;
        }
        
        // Reset active state of all buttons
        micButtons.forEach(btn => btn.classList.remove('active'));
        
        // Set current input and button
        currentInputId = inputId;
        activeButton = button;
        activeButton.classList.add('active');
        
        // Get user's preferred language
        const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
        
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.recognizing = true;
        
        // Configure recognition
        recognition.lang = langCodes[preferredLanguage] || 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        // Show feedback that we're listening
        const transcriptElement = document.getElementById(`transcript-${inputId}`);
        if (transcriptElement) {
            transcriptElement.textContent = 'Listening...';
        }
        
        // Handle recognition results
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.trim();
            let processedText = transcript;
            
            // Process text based on input type
            if (inputId === 'mobile' || inputId === 'aadhar' || 
                inputId === 'mobileOTP' || inputId === 'aadharOTP') {
                // For number fields, extract only digits
                processedText = extractDigitsOnly(transcript, preferredLanguage);
            } else {
                // For other fields, convert number words to digits if needed
                if (preferredLanguage !== 'en') {
                    processedText = convertNumberWordsToDigits(processedText, preferredLanguage);
                }
            }
            
            // Update the input value
            inputElement.value = processedText;
            
            // Trigger input event to update any dependent UI
            const inputEvent = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(inputEvent);
            
            // Update transcript
            if (transcriptElement) {
                transcriptElement.textContent = `Recognized: ${transcript}`;
            }
        };
        
        // Handle recognition end
        recognition.onend = function() {
            recognition.recognizing = false;
            
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            
            // Update transcript
            if (transcriptElement) {
                setTimeout(() => {
                    transcriptElement.textContent = '';
                }, 3000);
            }
        };
        
        // Handle recognition errors
        recognition.onerror = function(event) {
            recognition.recognizing = false;
            
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            
            // Show error in transcript
            if (transcriptElement) {
                transcriptElement.textContent = `Error: ${event.error}`;
                setTimeout(() => {
                    transcriptElement.textContent = '';
                }, 3000);
            }
        };
        
        // Start recognition
        recognition.start();
    }
    
    // Function to extract only digits from a transcript
    function extractDigitsOnly(text, language) {
        // First convert any number words to digits
        if (language !== 'en') {
            text = convertNumberWordsToDigits(text, language);
        }
        
        // Then extract only digits
        return text.replace(/[^0-9]/g, '');
    }
    
    // Function to convert number words to digits
    function convertNumberWordsToDigits(text, language) {
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
    
    console.log('Speech Recognition Handler initialized successfully.');
});
