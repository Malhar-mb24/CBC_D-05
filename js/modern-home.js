// Modern Homepage JavaScript for Kisan Sathi

// Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = `${progress}%`;
        loadingText.textContent = `Loading... ${Math.floor(progress)}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.classList.add('loaded');
                initHomepage();
            }, 500);
        }
    }, 200);
});

// Initialize all homepage animations and interactions
function initHomepage() {
    initHero3D();
    initChatbot();
    initRedirectCards();
    initServicesHover();
    initTestimonialSlider();
    initScrollAnimations();
}

// 3D Hero Section Effects
function initHero3D() {
    const hero = document.querySelector('.hero-3d');
    const heroContent = document.querySelector('.hero-content');
    
    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const moveX = (x - 0.5) * 20;
        const moveY = (y - 0.5) * 20;
        
        heroContent.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
        
        // Parallax for floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 1 + index * 0.5;
            element.style.transform = `translateX(${moveX * speed}px) translateY(${moveY * speed}px)`;
        });
    });
    
    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translateX(0) translateY(0)';
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(element => {
            element.style.transform = 'translateX(0) translateY(0)';
        });
    });
}

// Chatbot Functionality
function initChatbot() {
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSendBtn = document.querySelector('.chatbot-input button');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    
    // Initial bot message
    setTimeout(() => {
        addBotMessage("नमस्ते! मैं किसान सारथी AI हूँ। आपकी कृषि संबंधित प्रश्नों में मदद करने के लिए यहां हूँ। आप मुझसे क्या पूछना चाहते हैं?");
    }, 1000);
    
    // Add event listeners
    chatbotSendBtn.addEventListener('click', sendUserMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
    
    function sendUserMessage() {
        const message = chatbotInput.value.trim();
        if (message === '') return;
        
        // Add user message
        addUserMessage(message);
        chatbotInput.value = '';
        
        // Simulate bot thinking
        setTimeout(() => {
            const botResponses = [
                "आपके प्रश्न के लिए धन्यवाद। मैं आपकी सहायता करने के लिए तत्पर हूँ।",
                "यह जानकारी मैं आपके लिए खोज रहा हूँ। कृपया थोड़ा इंतज़ार करें।",
                "आपके क्षेत्र में इस फसल के लिए यह उपयुक्त समय है।",
                "मौसम की भविष्यवाणी के अनुसार, अगले सप्ताह बारिश की संभावना है।",
                "आपकी फसल के लिए यह उर्वरक अनुशंसित है।"
            ];
            
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
            addBotMessage(randomResponse);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);
    }
    
    function addUserMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function addBotMessage(text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'bot-message');
        messageElement.textContent = text;
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}

// Redirect Cards Animations
function initRedirectCards() {
    const cards = document.querySelectorAll('.redirect-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.transform = 'scale(0.95)';
                    c.style.filter = 'brightness(0.8)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                if (c !== card) {
                    c.style.transform = 'translateY(0)';
                    c.style.filter = 'brightness(1)';
                }
            });
        });
    });
}

// Services Section Hover Effects
function initServicesHover() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            serviceCards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.6';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            serviceCards.forEach(c => {
                c.style.opacity = '1';
            });
        });
    });
}

// Testimonial Slider Functionality
function initTestimonialSlider() {
    const track = document.querySelector('.testimonials-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slider-dot');
    
    let currentIndex = 0;
    const cardWidth = cards[0].offsetWidth + 32; // Card width + gap
    
    // Set initial position
    updateSlider();
    
    // Event listeners
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, cards.length - 1);
        updateSlider();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
    
    function updateSlider() {
        const translateX = -currentIndex * cardWidth;
        track.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Update buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cards.length - 1;
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex === cards.length - 1 ? '0.5' : '1';
    }
    
    // Auto slide
    let autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateSlider();
    }, 5000);
    
    // Pause auto slide on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }, 5000);
    });
    
    // Update on window resize
    window.addEventListener('resize', () => {
        // Recalculate card width
        const newCardWidth = cards[0].offsetWidth + 32;
        if (newCardWidth !== cardWidth) {
            cardWidth = newCardWidth;
            updateSlider();
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Animate elements within sections
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                elementObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        elementObserver.observe(element);
    });
}
