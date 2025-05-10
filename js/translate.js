// Google Translate initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,bn,gu,hi,kn,ml,mr,ne,or,pa,si,ta,te',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Apply translation settings when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Make sure the Google Translate element exists
    if (document.getElementById('google_translate_element')) {
        // If Google Translate API is loaded, initialize it
        if (typeof google !== 'undefined' && google.translate) {
            googleTranslateElementInit();
        }
    }
});
