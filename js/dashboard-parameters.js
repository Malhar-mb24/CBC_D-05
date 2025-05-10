/**
 * Dashboard Parameters Handler
 * Loads farm parameters from localStorage and updates the dashboard accordingly
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load parameters from localStorage
    loadFarmParameters();
});

/**
 * Load farm parameters from localStorage and update dashboard
 */
function loadFarmParameters() {
    const savedParameters = localStorage.getItem('farmParameters');
    if (!savedParameters) {
        console.warn('No farm parameters found in localStorage');
        showParametersNotFoundMessage();
        return;
    }

    try {
        const parameters = JSON.parse(savedParameters);
        console.log('Loaded parameters:', parameters);
        
        // Update dashboard sections with parameter data
        updateCropSection(parameters);
        updateIrrigationSection(parameters);
        updateFertilizerSection(parameters);
        updateMarketSection(parameters);
        updateSoilSection(parameters);
        
        // Show parameter summary in the overview section
        updateOverviewSection(parameters);
    } catch (error) {
        console.error('Error parsing farm parameters:', error);
    }
}

/**
 * Show a message when no parameters are found
 */
function showParametersNotFoundMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'parameters-not-found';
    messageContainer.innerHTML = `
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No farm parameters found. Please <a href="parameters.html">set your parameters</a> first.</p>
        </div>
    `;
    
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
        dashboardContainer.prepend(messageContainer);
    }
}

/**
 * Update the crop section with selected crops
 */
function updateCropSection(parameters) {
    if (!parameters.selectedCrops) return;
    
    const cropValues = parameters.selectedCrops.split(',');
    
    // Update crop cards visibility
    const cropCards = document.querySelectorAll('.price-card');
    cropCards.forEach(card => {
        const cropClass = card.className.split(' ').find(cls => cls.includes('-card') && !cls.includes('price-card'));
        if (cropClass) {
            const cropName = cropClass.replace('-card', '');
            
            // Show only selected crops or keep all visible if none match
            const shouldShow = cropValues.some(crop => 
                crop.toLowerCase() === cropName.toLowerCase() || 
                (crop === 'corn' && cropName === 'maize')
            );
            
            card.style.display = shouldShow ? 'block' : 'none';
        }
    });
    
    // Update crop area in the overview
    const cropAreaElement = document.querySelector('.crop-area-value');
    if (cropAreaElement && parameters.cropArea) {
        cropAreaElement.textContent = `${parameters.cropArea} acres`;
    }
    
    // Update the crop pie chart
    updateCropPieChart(cropValues);
}

/**
 * Update irrigation section based on parameters
 */
function updateIrrigationSection(parameters) {
    if (!parameters.irrigationType || !parameters.waterSource) return;
    
    // Update irrigation type in the water management section
    const irrigationTypeElement = document.querySelector('.irrigation-type');
    if (irrigationTypeElement) {
        irrigationTypeElement.textContent = capitalizeFirstLetter(parameters.irrigationType) + ' Irrigation';
    }
    
    // Update water source
    const waterSourceElement = document.querySelector('.water-source');
    if (waterSourceElement) {
        waterSourceElement.textContent = capitalizeFirstLetter(parameters.waterSource);
    }
    
    // Update water access in soil health section
    const waterAccessElement = document.querySelector('.water-access-value');
    if (waterAccessElement && parameters.waterAccess) {
        waterAccessElement.textContent = capitalizeFirstLetter(parameters.waterAccess);
    }
}

/**
 * Update fertilizer section based on parameters
 */
function updateFertilizerSection(parameters) {
    if (!parameters.fertilizerType || !parameters.pestControl) return;
    
    // Update fertilizer type
    const fertilizerTypeElement = document.querySelector('.fertilizer-type-value');
    if (fertilizerTypeElement) {
        fertilizerTypeElement.textContent = capitalizeFirstLetter(parameters.fertilizerType);
    }
    
    // Update pest control method
    const pestControlElement = document.querySelector('.pest-control-value');
    if (pestControlElement) {
        pestControlElement.textContent = capitalizeFirstLetter(parameters.pestControl);
    }
}

/**
 * Update market section based on parameters
 */
function updateMarketSection(parameters) {
    if (!parameters.selectedCrops) return;
    
    const selectedCrops = parameters.selectedCrops.split(',');
    if (selectedCrops.length === 0) return;
    
    // Update target price in overview if available
    const targetPriceElement = document.querySelector('.target-price-value');
    if (targetPriceElement && parameters.targetPrice) {
        targetPriceElement.textContent = `₹${parameters.targetPrice}/quintal`;
    }
    
    // Update market distance in overview if available
    const marketDistanceElement = document.querySelector('.market-distance-value');
    if (marketDistanceElement && parameters.marketDistance) {
        marketDistanceElement.textContent = `${parameters.marketDistance} km`;
    }
    
    // Populate the crop dropdown
    populateCropDropdown(selectedCrops);
    
    // Create other crop cards
    createOtherCropCards(selectedCrops);
    
    // Select the first crop by default
    if (selectedCrops.length > 0) {
        selectCrop(selectedCrops[0]);
    }
    
    // Add event listener to the crop dropdown
    const cropSelect = document.getElementById('crop-select');
    if (cropSelect) {
        cropSelect.addEventListener('change', function() {
            selectCrop(this.value);
        });
    }
    
    // Add event listener to the time range dropdown
    const timeRange = document.getElementById('time-range');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            // Get the currently selected crop
            const cropSelect = document.getElementById('crop-select');
            if (cropSelect && cropSelect.value) {
                updateMarketChart(cropSelect.value, this.value);
            }
        });
    }
}

/**
 * Update soil section based on parameters
 */
function updateSoilSection(parameters) {
    if (!parameters.soilType) return;
    
    // Update soil type
    const soilTypeElement = document.querySelector('.soil-type-value');
    if (soilTypeElement) {
        soilTypeElement.textContent = capitalizeFirstLetter(parameters.soilType);
    }
    
    // Update fertilizer usage
    const fertilizerUsageElement = document.querySelector('.fertilizer-usage-value');
    if (fertilizerUsageElement && parameters.fertilizerUsage) {
        fertilizerUsageElement.textContent = capitalizeFirstLetter(parameters.fertilizerUsage);
    }
    
    // Update crop rotation
    const cropRotationElement = document.querySelector('.crop-rotation-value');
    if (cropRotationElement && parameters.cropRotation) {
        cropRotationElement.textContent = parameters.cropRotation === 'yes' ? 'Yes' : 'No';
    }
}

/**
 * Update overview section with parameter summary
 */
function updateOverviewSection(parameters) {
    // Create parameter summary
    let summary = '';
    
    if (parameters.selectedCrops) {
        const crops = parameters.selectedCrops.split(',').map(crop => capitalizeFirstLetter(crop)).join(', ');
        summary += `<div class="parameter-summary-item"><strong>Crops:</strong> ${crops}</div>`;
    }
    
    if (parameters.cropArea) {
        summary += `<div class="parameter-summary-item"><strong>Area:</strong> ${parameters.cropArea} acres</div>`;
    }
    
    if (parameters.irrigationType) {
        summary += `<div class="parameter-summary-item"><strong>Irrigation:</strong> ${capitalizeFirstLetter(parameters.irrigationType)}</div>`;
    }
    
    if (parameters.soilType) {
        summary += `<div class="parameter-summary-item"><strong>Soil:</strong> ${capitalizeFirstLetter(parameters.soilType)}</div>`;
    }
    
    // Add summary to overview section
    const overviewElement = document.querySelector('.overview-summary');
    if (overviewElement) {
        overviewElement.innerHTML = summary;
    }
}

/**
 * Update the crop pie chart based on selected crops
 */
function updateCropPieChart(selectedCrops) {
    // Get the existing chart instance
    const cropChartElement = document.getElementById('cropChart');
    if (!cropChartElement) return;
    
    // Define crop colors
    const cropColors = {
        'wheat': '#10b981',  // green
        'rice': '#f59e0b',   // yellow
        'corn': '#3b82f6',   // blue
        'maize': '#3b82f6',  // blue (same as corn)
        'sugarcane': '#8b5cf6', // purple
        'cotton': '#ec4899',  // pink
        'soybean': '#14b8a6', // teal
        'potato': '#f97316',  // orange
        'tomato': '#ef4444',  // red
        'pulses': '#8b5cf6'   // purple
    };
    
    // Create data for the pie chart based on selected crops
    const labels = [];
    const data = [];
    const backgroundColor = [];
    
    // If no crops are selected, use default data
    if (!selectedCrops || selectedCrops.length === 0) {
        return; // Keep existing chart
    }
    
    // Calculate equal distribution if multiple crops
    const percentage = Math.floor(100 / selectedCrops.length);
    const remainder = 100 - (percentage * selectedCrops.length);
    
    // Add each selected crop to the chart data
    selectedCrops.forEach((crop, index) => {
        // Handle corn/maize naming
        let displayName = capitalizeFirstLetter(crop);
        if (crop === 'corn') displayName = 'Maize';
        
        // Add to chart data
        labels.push(displayName);
        
        // Distribute percentages (give remainder to first crop)
        data.push(index === 0 ? percentage + remainder : percentage);
        
        // Add color (use default if not defined)
        backgroundColor.push(cropColors[crop.toLowerCase()] || '#6b7280');
    });
    
    // Get the Chart instance and update it
    const chartInstance = Chart.getChart(cropChartElement);
    if (chartInstance) {
        // Update existing chart
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = data;
        chartInstance.data.datasets[0].backgroundColor = backgroundColor;
        chartInstance.update();
    } else {
        // Create new chart if instance doesn't exist
        new Chart(cropChartElement, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Update market price cards based on selected crops
 */
function updateMarketPriceCards(selectedCropsString) {
    if (!selectedCropsString) return;
    
    const selectedCrops = selectedCropsString.split(',');
    const priceCards = document.querySelectorAll('.price-card');
    
    // Show/hide price cards based on selected crops
    priceCards.forEach(card => {
        // Extract crop name from card class
        const cropClasses = Array.from(card.classList).filter(cls => 
            cls !== 'price-card' && cls.endsWith('-card')
        );
        
        if (cropClasses.length > 0) {
            const cardCropName = cropClasses[0].replace('-card', '');
            
            // Check if this crop is in the selected crops
            const isSelected = selectedCrops.some(crop => {
                // Handle special case for corn/maize
                if (crop.toLowerCase() === 'corn' && cardCropName === 'maize') {
                    return true;
                }
                return crop.toLowerCase() === cardCropName.toLowerCase();
            });
            
            // Show only selected crops
            card.style.display = isSelected ? 'block' : 'none';
        }
    });
    
    // Update price data with random variations to make it look dynamic
    updatePriceData(selectedCrops);
}

/**
 * Update market tabs based on selected crops
 */
function updateMarketTabs(selectedCropsString) {
    if (!selectedCropsString) return;
    
    const selectedCrops = selectedCropsString.split(',');
    const marketTabs = document.querySelectorAll('.market-tab-btn');
    const marketTabContents = document.querySelectorAll('.market-tab-content');
    
    // First hide all tabs and contents
    marketTabs.forEach(tab => {
        const cropName = tab.getAttribute('data-crop');
        const isSelected = selectedCrops.some(crop => {
            // Handle special case for corn/maize
            if (crop.toLowerCase() === 'corn' && cropName === 'maize') {
                return true;
            }
            return crop.toLowerCase() === cropName.toLowerCase();
        });
        
        tab.style.display = isSelected ? 'block' : 'none';
        tab.classList.remove('active');
    });
    
    marketTabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Find the first visible tab and make it active
    const firstVisibleTab = Array.from(marketTabs).find(tab => tab.style.display !== 'none');
    if (firstVisibleTab) {
        firstVisibleTab.classList.add('active');
        const cropName = firstVisibleTab.getAttribute('data-crop');
        const tabContent = document.getElementById(`${cropName}-content`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }
    
    // Update chart data for each crop
    selectedCrops.forEach(crop => {
        updateCropPriceChart(crop);
    });
}

/**
 * Update price data with random variations to make it look dynamic
 */
function updatePriceData(selectedCrops) {
    // Base prices for different crops
    const basePrices = {
        'wheat': 2350,
        'rice': 3050,
        'corn': 2150,
        'maize': 2150,
        'sugarcane': 285,
        'cotton': 6200,
        'soybean': 3800,
        'potato': 1200,
        'tomato': 1500,
        'pulses': 6600
    };
    
    // Generate random price changes (-3% to +5%)
    selectedCrops.forEach(crop => {
        const cropLower = crop.toLowerCase();
        const basePrice = basePrices[cropLower] || 2000;
        
        // Generate random percentage change (-3 to +5)
        const percentChange = (Math.random() * 8 - 3).toFixed(2);
        const isPositive = percentChange >= 0;
        
        // Calculate new price
        const priceChange = basePrice * (percentChange / 100);
        const newPrice = Math.round(basePrice + priceChange);
        
        // Find the price card for this crop
        let cardCropName = cropLower;
        if (cropLower === 'corn') cardCropName = 'maize';
        
        const priceCard = document.querySelector(`.${cardCropName}-card`);
        if (priceCard) {
            // Update price
            const priceElement = priceCard.querySelector('.current-price');
            if (priceElement) {
                priceElement.textContent = `₹${newPrice}`;
            }
            
            // Update change percentage
            const changeElement = priceCard.querySelector('.price-change');
            if (changeElement) {
                // Update class for color
                changeElement.classList.remove('positive', 'negative');
                changeElement.classList.add(isPositive ? 'positive' : 'negative');
                
                // Update icon
                const iconElement = changeElement.querySelector('i');
                if (iconElement) {
                    iconElement.className = isPositive ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
                }
                
                // Update percentage text
                const percentElement = changeElement.querySelector('span');
                if (percentElement) {
                    percentElement.textContent = `${Math.abs(percentChange)}%`;
                }
            }
        }
    });
}

/**
 * Update price chart for a specific crop
 */
function updateCropPriceChart(crop) {
    // Normalize crop name
    let cropName = crop.toLowerCase();
    if (cropName === 'corn') cropName = 'maize';
    
    // Get chart canvas
    const chartCanvas = document.getElementById(`${cropName}Chart`);
    if (!chartCanvas) return;
    
    // Generate random price data for the last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const labels = [];
    
    // Create labels for the last 12 months
    for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - 11 + i + 12) % 12; // Get correct month index
        labels.push(months[monthIndex]);
    }
    
    // Base prices for different crops
    const basePrices = {
        'wheat': 2350,
        'rice': 3050,
        'maize': 2150,
        'sugarcane': 285,
        'cotton': 6200,
        'soybean': 3800,
        'potato': 1200,
        'tomato': 1500,
        'pulses': 6600
    };
    
    const basePrice = basePrices[cropName] || 2000;
    
    // Generate price data with a realistic trend
    const data = [];
    let price = basePrice * 0.85; // Start at 85% of current price
    
    for (let i = 0; i < 12; i++) {
        // Add some randomness but maintain an overall upward trend
        const randomFactor = 1 + (Math.random() * 0.06 - 0.02); // -2% to +4%
        const trendFactor = 1 + (i * 0.01); // Gradual increase over time
        
        price = price * randomFactor * trendFactor;
        data.push(Math.round(price));
    }
    
    // Get existing chart or create new one
    const chartInstance = Chart.getChart(chartCanvas);
    
    if (chartInstance) {
        // Update existing chart
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = data;
        chartInstance.update();
    } else {
        // Create new chart
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${capitalizeFirstLetter(cropName)} Price (₹/quintal)`,
                    data: data,
                    borderColor: getCropColor(cropName),
                    backgroundColor: getCropColor(cropName, 0.1),
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Get color for a specific crop
 */
function getCropColor(cropName, alpha = 1) {
    const cropColors = {
        'wheat': `rgba(16, 185, 129, ${alpha})`,  // green
        'rice': `rgba(245, 158, 11, ${alpha})`,    // yellow
        'maize': `rgba(59, 130, 246, ${alpha})`,   // blue
        'sugarcane': `rgba(139, 92, 246, ${alpha})`, // purple
        'cotton': `rgba(236, 72, 153, ${alpha})`,   // pink
        'soybean': `rgba(20, 184, 166, ${alpha})`,  // teal
        'potato': `rgba(249, 115, 22, ${alpha})`,   // orange
        'tomato': `rgba(239, 68, 68, ${alpha})`,    // red
        'pulses': `rgba(139, 92, 246, ${alpha})`    // purple
    };
    
    return cropColors[cropName] || `rgba(107, 114, 128, ${alpha})`; // Default gray
}

/**
 * Helper function to capitalize first letter of a string
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
