/**
 * Market Analysis functionality for the dashboard
 */

// Crop data with icons and colors
const cropData = {
    'wheat': { 
        icon: '🌾', 
        color: '#10b981',
        basePrice: 2350,
        insight: 'Wheat prices have shown a steady increase over the past year. The current market trend indicates favorable conditions for selling in the upcoming months. Consider timing your sales to maximize profits.'
    },
    'rice': { 
        icon: '🌾', 
        color: '#f59e0b',
        basePrice: 3050,
        insight: 'Rice prices have been stable with slight increases. Market demand remains strong, especially for premium varieties. Consider exploring value-added rice products for better margins.'
    },
    'corn': { 
        icon: '🌽', 
        color: '#3b82f6',
        basePrice: 2150,
        insight: 'Maize prices have fluctuated but show an overall positive trend. Demand for feed and ethanol production continues to drive the market. Monitor international trade policies that may affect prices.'
    },
    'maize': { 
        icon: '🌽', 
        color: '#3b82f6',
        basePrice: 2150,
        insight: 'Maize prices have fluctuated but show an overall positive trend. Demand for feed and ethanol production continues to drive the market. Monitor international trade policies that may affect prices.'
    },
    'sugarcane': { 
        icon: '🎋', 
        color: '#8b5cf6',
        basePrice: 285,
        insight: 'Sugarcane prices are influenced by government policies and international sugar prices. The trend shows moderate growth with seasonal variations. Consider value-added products like jaggery for better returns.'
    },
    'cotton': { 
        icon: '💮', 
        color: '#ec4899',
        basePrice: 6200,
        insight: 'Cotton prices have been volatile but remain strong. International demand and textile industry growth are key factors. Quality and certification can significantly impact your selling price.'
    },
    'soybean': { 
        icon: '🫘', 
        color: '#14b8a6',
        basePrice: 3800,
        insight: 'Soybean prices have shown good growth due to increasing demand for plant proteins. The market outlook is positive, especially for organic and non-GMO varieties.'
    },
    'potato': { 
        icon: '🥔', 
        color: '#f97316',
        basePrice: 1200,
        insight: 'Potato prices show seasonal variations but have a stable long-term trend. Cold storage facilities can help you sell when prices are higher. Consider contracts with food processors for stable income.'
    },
    'tomato': { 
        icon: '🍅', 
        color: '#ef4444',
        basePrice: 1500,
        insight: 'Tomato prices are highly seasonal and volatile. Consider greenhouse cultivation for off-season production when prices are higher. Value-added products can provide more stable income.'
    },
    'pulses': { 
        icon: '🫛', 
        color: '#8b5cf6',
        basePrice: 6600,
        insight: 'Pulses have shown strong price growth due to increasing demand for plant proteins. Government support programs and minimum support prices provide a safety net. Quality and variety selection are key to maximizing returns.'
    }
};

/**
 * Populate the crop dropdown with selected crops
 */
function populateCropDropdown(selectedCrops) {
    const cropSelect = document.getElementById('crop-select');
    if (!cropSelect) return;
    
    // Clear existing options
    cropSelect.innerHTML = '';
    
    // Add options for each selected crop
    selectedCrops.forEach(crop => {
        const cropLower = crop.toLowerCase();
        // Handle corn/maize naming
        let displayName = capitalizeFirstLetter(crop);
        if (cropLower === 'corn') displayName = 'Maize';
        
        const option = document.createElement('option');
        option.value = cropLower;
        option.textContent = displayName;
        cropSelect.appendChild(option);
    });
}

/**
 * Create cards for other crops (not the currently selected one)
 */
function createOtherCropCards(selectedCrops) {
    const container = document.getElementById('other-crops-container');
    if (!container) return;
    
    // Clear existing cards
    container.innerHTML = '';
    
    // Create a card for each crop (except the first one which is shown in detail)
    if (selectedCrops.length <= 1) {
        // If only one crop, show a message
        const message = document.createElement('p');
        message.className = 'no-crops-message';
        message.textContent = 'No other crops selected.';
        container.appendChild(message);
        return;
    }
    
    // Skip the first crop (it's shown in detail) and create cards for others
    for (let i = 1; i < selectedCrops.length; i++) {
        const crop = selectedCrops[i].toLowerCase();
        // Handle corn/maize naming
        let displayName = capitalizeFirstLetter(selectedCrops[i]);
        let cropKey = crop;
        if (crop === 'corn') {
            displayName = 'Maize';
            cropKey = 'maize';
        }
        
        // Generate price data
        const basePrice = cropData[crop]?.basePrice || 2000;
        const percentChange = (Math.random() * 8 - 3).toFixed(2);
        const isPositive = percentChange >= 0;
        const priceChange = basePrice * (percentChange / 100);
        const newPrice = Math.round(basePrice + priceChange);
        
        // Create card
        const card = document.createElement('div');
        card.className = `price-card ${cropKey}-card`;
        card.setAttribute('data-crop', crop);
        
        card.innerHTML = `
            <div class="price-card-content">
                <div class="crop-name">${displayName}</div>
                <div class="price-info">
                    <div class="current-price">₹${newPrice.toLocaleString()}</div>
                    <div class="price-change ${isPositive ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                        <span>${Math.abs(percentChange)}%</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add click event to select this crop
        card.addEventListener('click', function() {
            const cropSelect = document.getElementById('crop-select');
            if (cropSelect) {
                cropSelect.value = crop;
                selectCrop(crop);
            }
        });
        
        container.appendChild(card);
    }
}

/**
 * Select a crop and update the market analysis display
 */
function selectCrop(crop) {
    if (!crop) return;
    
    const cropLower = crop.toLowerCase();
    const cropInfo = cropData[cropLower] || {
        icon: '🌱',
        color: '#6b7280',
        basePrice: 2000,
        insight: 'No specific market insights available for this crop.'
    };
    
    // Update crop icon and name
    const cropIcon = document.getElementById('selected-crop-icon');
    const cropName = document.getElementById('selected-crop-name');
    
    if (cropIcon) cropIcon.textContent = cropInfo.icon;
    if (cropName) {
        // Handle corn/maize naming
        let displayName = capitalizeFirstLetter(crop);
        if (cropLower === 'corn') displayName = 'Maize';
        cropName.textContent = displayName;
    }
    
    // Generate price data
    const basePrice = cropInfo.basePrice;
    const percentChange = (Math.random() * 8 - 3).toFixed(2);
    const isPositive = percentChange >= 0;
    const priceChange = basePrice * (percentChange / 100);
    const newPrice = Math.round(basePrice + priceChange);
    
    // Update price and change
    const priceElement = document.getElementById('selected-crop-price');
    const changeElement = document.getElementById('selected-crop-change');
    
    if (priceElement) priceElement.textContent = `₹${newPrice.toLocaleString()}`;
    if (changeElement) {
        changeElement.className = `price-change ${isPositive ? 'positive' : 'negative'}`;
        changeElement.innerHTML = `
            <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
            <span>${Math.abs(percentChange)}%</span>
        `;
    }
    
    // Update price stats
    updatePriceStats(cropLower);
    
    // Update market insight
    const insightElement = document.getElementById('market-insight-text');
    if (insightElement) insightElement.textContent = cropInfo.insight;
    
    // Update chart
    const timeRange = document.getElementById('time-range');
    const range = timeRange ? timeRange.value : 'year';
    updateMarketChart(cropLower, range);
}

/**
 * Update price statistics for the selected crop
 */
function updatePriceStats(crop) {
    const cropInfo = cropData[crop] || { basePrice: 2000 };
    const basePrice = cropInfo.basePrice;
    
    // Generate realistic price stats
    const highest = Math.round(basePrice * (1 + (Math.random() * 0.15 + 0.1))); // 10-25% higher
    const lowest = Math.round(basePrice * (1 - (Math.random() * 0.15 + 0.05))); // 5-20% lower
    const avg = Math.round((highest + lowest + basePrice) / 3);
    
    // Update the DOM
    const highestElement = document.getElementById('highest-price');
    const lowestElement = document.getElementById('lowest-price');
    const avgElement = document.getElementById('avg-price');
    
    if (highestElement) highestElement.textContent = `₹${highest.toLocaleString()}`;
    if (lowestElement) lowestElement.textContent = `₹${lowest.toLocaleString()}`;
    if (avgElement) avgElement.textContent = `₹${avg.toLocaleString()}`;
}

/**
 * Update the market chart for the selected crop
 */
function updateMarketChart(crop, timeRange = 'year') {
    const chartCanvas = document.getElementById('marketPriceChart');
    if (!chartCanvas) return;
    
    const cropInfo = cropData[crop] || { 
        color: '#6b7280',
        basePrice: 2000
    };
    
    // Generate price data based on time range
    let dataPoints;
    let labels;
    
    switch (timeRange) {
        case 'month':
            dataPoints = generateMonthlyData(cropInfo.basePrice);
            labels = generateDailyLabels(30);
            break;
        case 'quarter':
            dataPoints = generateQuarterlyData(cropInfo.basePrice);
            labels = generateWeeklyLabels(12);
            break;
        case 'year':
        default:
            dataPoints = generateYearlyData(cropInfo.basePrice);
            labels = generateMonthlyLabels();
            break;
    }
    
    // Get existing chart or create new one
    const chartInstance = Chart.getChart(chartCanvas);
    
    if (chartInstance) {
        // Update existing chart
        chartInstance.data.labels = labels;
        chartInstance.data.datasets[0].data = dataPoints;
        chartInstance.data.datasets[0].borderColor = cropInfo.color;
        chartInstance.data.datasets[0].backgroundColor = hexToRgba(cropInfo.color, 0.1);
        chartInstance.data.datasets[0].label = `${capitalizeFirstLetter(crop)} Price (₹/quintal)`;
        chartInstance.update();
    } else {
        // Create new chart
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${capitalizeFirstLetter(crop)} Price (₹/quintal)`,
                    data: dataPoints,
                    borderColor: cropInfo.color,
                    backgroundColor: hexToRgba(cropInfo.color, 0.1),
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
                                return `₹${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Generate daily labels for the last 30 days
 */
function generateDailyLabels(days = 30) {
    const labels = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(`${date.getDate()}/${date.getMonth() + 1}`);
    }
    
    return labels;
}

/**
 * Generate weekly labels for the last X weeks
 */
function generateWeeklyLabels(weeks = 12) {
    const labels = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeks * 7));
    
    for (let i = 0; i < weeks; i++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        labels.push(`W${i+1}`);
    }
    
    return labels;
}

/**
 * Generate monthly labels for the last 12 months
 */
function generateMonthlyLabels() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    
    for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - 11 + i + 12) % 12;
        labels.push(months[monthIndex]);
    }
    
    return labels;
}

/**
 * Generate price data for monthly view (30 days)
 */
function generateMonthlyData(basePrice) {
    const data = [];
    let price = basePrice * 0.95; // Start slightly below base price
    
    for (let i = 0; i < 30; i++) {
        // Add some randomness but maintain a realistic trend
        const randomFactor = 1 + (Math.random() * 0.04 - 0.02); // -2% to +2%
        price = price * randomFactor;
        
        // Add some small trends
        if (i % 7 === 0) {
            price = price * (1 + (Math.random() * 0.04 - 0.02)); // Weekly adjustment
        }
        
        data.push(Math.round(price));
    }
    
    return data;
}

/**
 * Generate price data for quarterly view (12 weeks)
 */
function generateQuarterlyData(basePrice) {
    const data = [];
    let price = basePrice * 0.9; // Start at 90% of current price
    
    for (let i = 0; i < 12; i++) {
        // Add some randomness but maintain an overall upward trend
        const randomFactor = 1 + (Math.random() * 0.05 - 0.02); // -2% to +3%
        const trendFactor = 1 + (i * 0.005); // Gradual increase over time
        
        price = price * randomFactor * trendFactor;
        data.push(Math.round(price));
    }
    
    return data;
}

/**
 * Generate price data for yearly view (12 months)
 */
function generateYearlyData(basePrice) {
    const data = [];
    let price = basePrice * 0.85; // Start at 85% of current price
    
    for (let i = 0; i < 12; i++) {
        // Add some randomness but maintain an overall upward trend
        const randomFactor = 1 + (Math.random() * 0.06 - 0.02); // -2% to +4%
        const trendFactor = 1 + (i * 0.01); // Gradual increase over time
        
        // Add seasonal effects
        let seasonalFactor = 1;
        if (i >= 3 && i <= 5) { // Spring/Summer boost
            seasonalFactor = 1.02;
        } else if (i >= 9 && i <= 11) { // Winter slump
            seasonalFactor = 0.98;
        }
        
        price = price * randomFactor * trendFactor * seasonalFactor;
        data.push(Math.round(price));
    }
    
    return data;
}

/**
 * Convert hex color to rgba
 */
function hexToRgba(hex, alpha = 1) {
    // Default fallback color
    if (!hex) return `rgba(107, 114, 128, ${alpha})`;
    
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return `rgba(107, 114, 128, ${alpha})`;
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
