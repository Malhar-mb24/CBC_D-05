// Selection Functionality - Optimized Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Kisan Sathi] DOMContentLoaded');
    // Initialize all selection grids
    initCropSelection();
    initSelectionGrids();
    initNumberInputs();
    // Load saved parameters if they exist
    loadSavedParameters();
    // Setup form submission to save all parameters
    setupFormSubmission();
});

// Multi-selection for crops
function initCropSelection() {
    const cropGrid = document.querySelector('.crop-grid');
    if (!cropGrid) return;
    
    const selectedCropsInput = document.getElementById('selectedCrops');
    if (!selectedCropsInput) return;
    
    // Initialize selected crops array
    let selectedCrops = [];
    
    // Use event delegation
    cropGrid.addEventListener('click', function(e) {
        const cropItem = e.target.closest('.crop-item');
        if (!cropItem) return;
        
        const cropValue = cropItem.getAttribute('data-value');
        if (!cropValue) return;
        
        // Toggle selection
        if (cropItem.classList.contains('selected')) {
            cropItem.classList.remove('selected');
            selectedCrops = selectedCrops.filter(crop => crop !== cropValue);
        } else {
            cropItem.classList.add('selected');
            selectedCrops.push(cropValue);
        }
        
        // Update hidden input
        selectedCropsInput.value = selectedCrops.join(',');
    });
}

// Single-selection for other dropdowns
function initSelectionGrids() {
    // Find all selection grids
    const selectionContainers = document.querySelectorAll('.selection-container');
    
    selectionContainers.forEach(container => {
        const hiddenInput = container.querySelector('input[type="hidden"]');
        const selectionGrid = container.querySelector('.selection-grid');
        
        if (!hiddenInput || !selectionGrid) return;
        
        // Use event delegation
        selectionGrid.addEventListener('click', function(e) {
            const selectionItem = e.target.closest('.selection-item');
            if (!selectionItem) return;
            
            const value = selectionItem.getAttribute('data-value');
            if (!value) return;
            
            // Single selection - deselect all others
            const allItems = selectionGrid.querySelectorAll('.selection-item');
            allItems.forEach(item => item.classList.remove('selected'));
            
            // Select this item
            selectionItem.classList.add('selected');
            
            // Update hidden input
            hiddenInput.value = value;
        });
    });
}

// Number input with GUI controls
function initNumberInputs() {
    const numberInputs = document.querySelectorAll('.number-input-container');
    
    numberInputs.forEach(container => {
        const hiddenInput = container.querySelector('input[type="hidden"]');
        const display = container.querySelector('.number-display');
        const incrementBtn = container.querySelector('.increment');
        const decrementBtn = container.querySelector('.decrement');
        
        if (!hiddenInput || !display || !incrementBtn || !decrementBtn) return;
        
        // Set initial value
        let value = parseInt(hiddenInput.value || '0');
        display.textContent = value;
        
        // Increment button
        incrementBtn.addEventListener('click', function() {
            value++;
            updateValue();
        });
        
        // Decrement button
        decrementBtn.addEventListener('click', function() {
            if (value > 0) {
                value--;
                updateValue();
            }
        });
        
        function updateValue() {
            display.textContent = value;
            hiddenInput.value = value;
        }
    });
}

// Load saved parameters from localStorage
function loadSavedParameters() {
    const savedParameters = localStorage.getItem('farmParameters');
    if (!savedParameters) return;
    
    try {
        const parameters = JSON.parse(savedParameters);
        
        // Load values for number inputs
        Object.keys(parameters).forEach(key => {
            // Handle number inputs
            const numberContainer = document.querySelector(`.number-input-container input[id="${key}"]`);
            if (numberContainer) {
                const display = numberContainer.closest('.number-input-container').querySelector('.number-display');
                numberContainer.value = parameters[key];
                if (display) {
                    display.textContent = parameters[key];
                }
                return;
            }
            
            // Handle multi-select (crops)
            if (key === 'selectedCrops' && parameters[key]) {
                const cropValues = parameters[key].split(',');
                const cropItems = document.querySelectorAll('.crop-item');
                cropItems.forEach(item => {
                    const value = item.getAttribute('data-value');
                    if (cropValues.includes(value)) {
                        item.classList.add('selected');
                    }
                });
                const selectedCropsInput = document.getElementById('selectedCrops');
                if (selectedCropsInput) {
                    selectedCropsInput.value = parameters[key];
                }
                return;
            }
            
            // Handle single-select items
            const hiddenInput = document.getElementById(key);
            if (hiddenInput && hiddenInput.type === 'hidden' && parameters[key]) {
                hiddenInput.value = parameters[key];
                const container = hiddenInput.closest('.selection-container');
                if (container) {
                    const item = container.querySelector(`.selection-item[data-value="${parameters[key]}"]`);
                    if (item) {
                        item.classList.add('selected');
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading saved parameters:', error);
    }
}

// Setup form submission to save all parameters
function setupFormSubmission() {
    const parameterForm = document.getElementById('parameterForm');
    if (!parameterForm) return;
    
    parameterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        const selectedCrops = document.getElementById('selectedCrops');
        if (selectedCrops && selectedCrops.required && !selectedCrops.value) {
            alert('Please select at least one crop');
            return;
        }
        
        // Collect all form data
        const formData = new FormData(parameterForm);
        const data = Object.fromEntries(formData.entries());
        
        // Save to localStorage
        localStorage.setItem('farmParameters', JSON.stringify(data));
        
        // Add transition effect
        document.body.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 300);
    });
}
