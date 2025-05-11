/**
 * Details Page Profile Sync
 * Ensures data from the farmer details form is properly saved and synced with the profile
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the details page
    const farmerForm = document.getElementById('farmerForm');
    if (!farmerForm) return;
    
    console.log('Details page detected, setting up profile sync...');
    
    // Add an enhanced submit handler to ensure data is properly saved
    farmerForm.addEventListener('submit', function(e) {
        // The original handler will still run, this is just an enhancement
        
        console.log('Farmer form submitted, syncing with profile...');
        
        // Collect form data
        const formData = new FormData(farmerForm);
        const farmerData = {};
        
        formData.forEach((value, key) => {
            farmerData[key] = value;
        });
        
        // Add timestamp for tracking
        farmerData.lastUpdated = new Date().toISOString();
        
        // Ensure the data is saved to localStorage with the correct key
        localStorage.setItem('farmerDetails', JSON.stringify(farmerData));
        
        console.log('Farmer details saved to localStorage:', farmerData);
        
        // No need to prevent default or redirect, the original handler will do that
    }, false); // Use capturing to run before the original handler
    
    console.log('Profile sync setup complete');
});
