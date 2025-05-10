// Parameters page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeParameters();
});

function initializeParameters() {
    loadParameters();
    setupParameterListeners();
    loadSavedSelections();
}

function loadParameters() {
    // Load parameters from various CSV files
    Promise.all([
        fetch('/data/crops.csv').then(response => response.text()),
        fetch('/data/growth_enhancers.csv').then(response => response.text()),
        fetch('/data/irrigation.csv').then(response => response.text()),
        fetch('/data/other_factors.csv').then(response => response.text())
    ])
    .then(([cropsData, growthData, irrigationData, otherData]) => {
        processParameters(cropsData, growthData, irrigationData, otherData);
    })
    .catch(error => {
        console.error('Error loading parameters:', error);
    });
}

function processParameters(cropsData, growthData, irrigationData, otherData) {
    const container = document.getElementById('parameters-container');
    if (!container) return;

    // Create sections
    const sections = [
        { title: 'Crops', data: parseCSV(cropsData), type: 'crops' },
        { title: 'Growth Enhancers', data: parseCSV(growthData), type: 'enhancers' },
        { title: 'Irrigation', data: parseCSV(irrigationData), type: 'irrigation' },
        { title: 'Other Factors', data: parseCSV(otherData), type: 'factors' }
    ];

    // Create UI
    container.innerHTML = sections.map(section => `
        <div class="parameter-section">
            <h3>${section.title}</h3>
            <div class="parameter-cards" data-type="${section.type}">
                ${createCards(section.data, section.type)}
            </div>
        </div>
    `).join('');
}

function createCards(data, type) {
    return data.map(item => `
        <div class="parameter-card" data-id="${item.id || item.name}">
            <h4>${item.name || item.crop_name || item.enhancer_name || item.method || item.factor}</h4>
            ${Object.entries(item)
                .filter(([key]) => !['id', 'name', 'crop_name', 'enhancer_name', 'method', 'factor'].includes(key))
                .map(([key, value]) => `<p>${key}: ${value}</p>`)
                .join('')}
        </div>
    `).join('');
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
        }, {});
    });
}

function setupParameterListeners() {
    const container = document.getElementById('parameters-container');
    if (container) {
        container.addEventListener('click', handleCardClick);
    }
}

function handleCardClick(event) {
    const card = event.target.closest('.parameter-card');
    if (!card) return;

    card.classList.toggle('selected');
    saveSelections();
}

function saveSelections() {
    const selections = {};
    document.querySelectorAll('.parameter-cards').forEach(section => {
        const type = section.dataset.type;
        selections[type] = Array.from(section.querySelectorAll('.parameter-card.selected'))
            .map(card => card.dataset.id);
    });
    localStorage.setItem('parameterSelections', JSON.stringify(selections));
}

function loadSavedSelections() {
    const saved = localStorage.getItem('parameterSelections');
    if (saved) {
        const selections = JSON.parse(saved);
        Object.entries(selections).forEach(([type, ids]) => {
            ids.forEach(id => {
                const card = document.querySelector(`.parameter-card[data-id="${id}"]`);
                if (card) card.classList.add('selected');
            });
        });
    }
}

// Parameters and Badges Management
class ParametersManager {
    constructor() {
        this.parameters = {
            crops: [],
            landTypes: [],
            irrigationMethods: [],
            soilTypes: []
        };
        this.badges = [];
        this.charts = {};
    }

    // Initialize parameters and charts
    async initialize() {
        await this.loadParameters();
        this.initializeCharts();
        this.updateBadges();
    }

    // Load parameters from API or local storage
    async loadParameters() {
        try {
            // In production, replace with actual API call
            const response = await fetch('/api/parameters');
            this.parameters = await response.json();
        } catch (error) {
            // Fallback to mock data
            this.parameters = {
                crops: [
                    { name: 'Wheat', area: 30, unit: 'acres' },
                    { name: 'Rice', area: 20, unit: 'acres' },
                    { name: 'Maize', area: 15, unit: 'acres' }
                ],
                landTypes: [
                    { type: 'Irrigated', percentage: 60 },
                    { type: 'Rainfed', percentage: 40 }
                ],
                irrigationMethods: [
                    { method: 'Drip', percentage: 40 },
                    { method: 'Sprinkler', percentage: 30 },
                    { method: 'Flood', percentage: 30 }
                ],
                soilTypes: [
                    { type: 'Clay', percentage: 30 },
                    { type: 'Loam', percentage: 50 },
                    { type: 'Sandy', percentage: 20 }
                ]
            };
        }
    }

    // Initialize Chart.js visualizations
    initializeCharts() {
        // Crop Distribution Chart
        this.charts.crops = new Chart(
            document.getElementById('cropChart'),
            {
                type: 'pie',
                data: {
                    labels: this.parameters.crops.map(crop => crop.name),
                    datasets: [{
                        data: this.parameters.crops.map(crop => crop.area),
                        backgroundColor: [
                            '#4CAF50',
                            '#2196F3',
                            '#FFC107',
                            '#9C27B0',
                            '#FF5722'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Crop Distribution'
                        }
                    }
                }
            }
        );

        // Land Types Chart
        this.charts.landTypes = new Chart(
            document.getElementById('landTypeChart'),
            {
                type: 'pie',
                data: {
                    labels: this.parameters.landTypes.map(land => land.type),
                    datasets: [{
                        data: this.parameters.landTypes.map(land => land.percentage),
                        backgroundColor: ['#4CAF50', '#2196F3']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Land Types'
                        }
                    }
                }
            }
        );

        // Irrigation Methods Chart
        this.charts.irrigation = new Chart(
            document.getElementById('irrigationChart'),
            {
                type: 'pie',
                data: {
                    labels: this.parameters.irrigationMethods.map(method => method.method),
                    datasets: [{
                        data: this.parameters.irrigationMethods.map(method => method.percentage),
                        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: 'Irrigation Methods'
                        }
                    }
                }
            }
        );

        // Soil Types Chart
        this.charts.soil = new Chart(
            document.getElementById('soilChart'),
            {
                type: 'bar',
                data: {
                    labels: this.parameters.soilTypes.map(soil => soil.type),
                    datasets: [{
                        label: 'Soil Distribution',
                        data: this.parameters.soilTypes.map(soil => soil.percentage),
                        backgroundColor: '#4CAF50'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Soil Types'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            }
        );
    }

    // Update badges based on parameters
    updateBadges() {
        const badgeContainer = document.getElementById('badgeContainer');
        if (!badgeContainer) return;

        this.badges = [];

        // Check for organic farming
        if (this.parameters.crops.some(crop => crop.organic)) {
            this.badges.push({
                name: 'Organic Farmer',
                icon: 'leaf',
                color: '#4CAF50'
            });
        }

        // Check for modern irrigation
        if (this.parameters.irrigationMethods.some(method => 
            method.method === 'Drip' && method.percentage > 50)) {
            this.badges.push({
                name: 'Water Efficient',
                icon: 'tint',
                color: '#2196F3'
            });
        }

        // Check for crop diversity
        if (this.parameters.crops.length >= 3) {
            this.badges.push({
                name: 'Crop Diversifier',
                icon: 'seedling',
                color: '#FFC107'
            });
        }

        // Render badges
        badgeContainer.innerHTML = this.badges.map(badge => `
            <div class="badge" style="background-color: ${badge.color}">
                <i class="fas fa-${badge.icon}"></i>
                <span>${badge.name}</span>
            </div>
        `).join('');
    }

    // Update parameters and refresh visualizations
    async updateParameters(newParameters) {
        this.parameters = { ...this.parameters, ...newParameters };
        this.initializeCharts();
        this.updateBadges();
        
        // Save to backend
        try {
            await fetch('/api/parameters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.parameters)
            });
        } catch (error) {
            console.error('Error saving parameters:', error);
        }
    }
}

// Initialize parameters manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const parametersManager = new ParametersManager();
    parametersManager.initialize();
});

// Add badge system integration
function handleParameterSelection(parameterType, selections) {
    // Existing parameter handling code
    // ... existing code ...

    // Check for badges
    if (window.badgeSystem) {
        window.badgeSystem.checkAndAwardBadges(parameterType, selections);
    }
}

// Modify the existing event listeners to include badge checking
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Add badge system script
    const badgeScript = document.createElement('script');
    badgeScript.src = 'js/badges.js';
    document.head.appendChild(badgeScript);

    // Modify existing event listeners to include badge checking
    const parameterForms = document.querySelectorAll('.parameter-form');
    parameterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const parameterType = this.dataset.parameterType;
            const selections = Array.from(this.querySelectorAll('input:checked')).map(input => input.value);
            handleParameterSelection(parameterType, selections);
        });
    });
}); 