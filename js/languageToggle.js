// Language toggle functionality
function createLanguageToggle() {
    const languageToggle = document.createElement('div');
    languageToggle.className = 'language-toggle';
    
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const languages = {
        'en': { name: 'English', icon: 'fas fa-language' },
        'hi': { name: 'हिंदी', icon: 'fas fa-language' }
    };

    languageToggle.innerHTML = `
        <div class="language-select">
            <button class="lang-btn" id="langBtn">
                <i class="${languages[currentLang].icon}"></i>
                <span>${languages[currentLang].name}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="lang-dropdown" id="langDropdown">
                ${Object.entries(languages).map(([code, { name, icon }]) => `
                    <button class="lang-option" data-lang="${code}">
                        <i class="${icon}"></i>
                        <span>${name}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    // Add event listeners
    const langBtn = languageToggle.querySelector('#langBtn');
    const langDropdown = languageToggle.querySelector('#langDropdown');
    const langOptions = languageToggle.querySelectorAll('.lang-option');

    langBtn.addEventListener('click', () => {
        langDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!languageToggle.contains(e.target)) {
            langDropdown.classList.remove('active');
        }
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const langCode = option.getAttribute('data-lang');
            localStorage.setItem('preferredLanguage', langCode);
            window.location.reload();
        });
    });

    return languageToggle;
}

// Add language toggle to navigation
const nav = document.querySelector('.nav-links');
if (nav) {
    const languageToggle = createLanguageToggle();
    nav.appendChild(languageToggle);
}
