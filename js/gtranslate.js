// gTranslate configuration
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,bn,gu,hi,kn,ml,mr,ne,or,pa,si,ta,te',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        gaTrack: true,
        gaId: 'UA-XXXXX-X'
    }, 'google_translate_element');
}

// Function to add the translate element to the page
document.addEventListener('DOMContentLoaded', function() {
    // Add the translate element to the header
    const header = document.querySelector('header');
    if (header) {
        const translateDiv = document.createElement('div');
        translateDiv.id = 'google_translate_element';
        translateDiv.className = 'translate-toggle';
        header.appendChild(translateDiv);
    }
});
