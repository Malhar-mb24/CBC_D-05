// Dashboard functionality
class Dashboard {
    constructor() {
        this.farmerId = localStorage.getItem('currentFarmerId');
        this.parameters = JSON.parse(localStorage.getItem('parameterSelections')) || {};
        this.charts = {};
        this.initialize();
    }

    async initialize() {
        this.loadFarmerDetails();
        this.initializeCharts();
        this.displayBadges();
        this.loadMetrics();
        this.displayPracticeRating();
    }

    loadFarmerDetails() {
        const farmerDetails = JSON.parse(localStorage.getItem('farmerDetails')) || {};
        const detailsContainer = document.getElementById('farmer-details');
        
        if (detailsContainer) {
            detailsContainer.innerHTML = `
                <h3 data-i18n="farmer_profile">Farmer Profile</h3>
                <div class="profile-info">
                    <p><strong data-i18n="name">Name:</strong> ${farmerDetails.name || 'Not set'}</p>
                    <p><strong data-i18n="location">Location:</strong> ${farmerDetails.location || 'Not set'}</p>
                    <p><strong data-i18n="land_area">Land Area:</strong> ${farmerDetails.landArea || 'Not set'} acres</p>
                    <p><strong data-i18n="farming_type">Farming Type:</strong> ${farmerDetails.farmingType || 'Not set'}</p>
                </div>
            `;
        }
    }

    initializeCharts() {
        // Initialize price chart
        const priceCtx = document.getElementById('price-chart');
        if (priceCtx) {
            this.charts.price = new Chart(priceCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Market Prices',
                        data: [65, 59, 80, 81, 56, 55],
                        borderColor: '#4CAF50',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Market Price Trends'
                        }
                    }
                }
            });
        }

        // Initialize parameter distribution charts
        this.initializeParameterCharts();
    }

    initializeParameterCharts() {
        // Create charts for each parameter type
        const parameterTypes = ['crops', 'irrigation', 'growth', 'market'];
        
        parameterTypes.forEach(type => {
            const container = document.createElement('div');
            container.className = 'dashboard-card';
            container.innerHTML = `
                <h3>${type.charAt(0).toUpperCase() + type.slice(1)} Distribution</h3>
                <canvas id="${type}-chart"></canvas>
            `;
            
            document.querySelector('.dashboard-right').appendChild(container);
            
            const ctx = document.getElementById(`${type}-chart`);
            if (ctx) {
                this.charts[type] = new Chart(ctx, {
                    type: 'pie',
                    data: this.getChartData(type),
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
        });
    }

    getChartData(type) {
        const selections = this.parameters[type] || [];
        return {
            labels: selections,
            datasets: [{
                data: selections.map(() => Math.random() * 100),
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FFC107',
                    '#9C27B0',
                    '#FF5722'
                ]
            }]
        };
    }

    displayBadges() {
        if (!window.badgeSystem) return;

        const badges = window.badgeSystem.getFarmerBadges(this.farmerId);
        const badgeGrid = document.getElementById('badgeGrid');
        
        if (!badgeGrid) return;

        if (badges.length === 0) {
            badgeGrid.innerHTML = '<p data-i18n="no_badges">No badges earned yet. Keep exploring to earn badges!</p>';
            return;
        }

        // Group badges by type
        const cropBadges = badges.filter(b => b.id.includes('_master'));
        const practiceBadges = badges.filter(b => b.id.includes('_practitioner'));

        badgeGrid.innerHTML = `
            <div class="badge-section">
                <h3 data-i18n="crop_mastery">Crop Mastery</h3>
                <div class="badge-row">
                    ${cropBadges.map(badge => this.createBadgeCard(badge)).join('')}
                </div>
            </div>
            <div class="badge-section">
                <h3 data-i18n="practice_rating">Practice Rating</h3>
                <div class="badge-row">
                    ${practiceBadges.map(badge => this.createBadgeCard(badge)).join('')}
                </div>
            </div>
        `;
    }

    createBadgeCard(badge) {
        return `
            <div class="badge-card" style="border-color: ${badge.color}">
                <span class="badge-icon">${badge.icon}</span>
                <h3>${badge.name}</h3>
                <p>${badge.description}</p>
                <small data-i18n="awarded_on">Awarded on</small>
                <small>${new Date(badge.awardedAt).toLocaleDateString()}</small>
            </div>
        `;
    }

    displayPracticeRating() {
        const ratingContainer = document.getElementById('practiceRating');
        if (!ratingContainer) return;

        let totalScore = 0;
        Object.entries(this.parameters).forEach(([type, selections]) => {
            selections.forEach(practice => {
                Object.entries(window.badgeSystem.practiceScores).forEach(([key, score]) => {
                    if (practice.includes(key)) {
                        totalScore += score;
                    }
                });
            });
        });

        const rating = this.calculateRating(totalScore);
        
        ratingContainer.innerHTML = `
            <div class="rating-card" style="border-color: ${rating.color}">
                <div class="rating-icon">${rating.icon}</div>
                <div class="rating-info">
                    <h3>${rating.name}</h3>
                    <p>${rating.description}</p>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${totalScore}%; background-color: ${rating.color}"></div>
                    </div>
                    <p class="score-text">Score: ${totalScore}/100</p>
                </div>
            </div>
        `;
    }

    calculateRating(score) {
        if (score >= 90) {
            return {
                name: 'Blue Practitioner',
                description: 'Excellent farming practices with minimal environmental impact',
                icon: '🔵',
                color: 'blue'
            };
        } else if (score >= 75) {
            return {
                name: 'Green Practitioner',
                description: 'Good farming practices with moderate environmental impact',
                icon: '🟢',
                color: 'green'
            };
        } else if (score >= 50) {
            return {
                name: 'Red Practitioner',
                description: 'Basic farming practices with high environmental impact',
                icon: '🔴',
                color: 'red'
            };
        } else {
            return {
                name: 'Black Practitioner',
                description: 'Traditional farming practices with significant environmental impact',
                icon: '⚫',
                color: 'black'
            };
        }
    }

    loadMetrics() {
        const metricsContainer = document.getElementById('metrics-container');
        if (!metricsContainer) return;

        // Calculate metrics based on parameter selections
        const metrics = {
            totalCrops: this.parameters.crops?.length || 0,
            irrigationMethods: this.parameters.irrigation?.length || 0,
            growthEnhancers: this.parameters.growth?.length || 0,
            marketAnalysis: this.parameters.market?.length || 0
        };

        metricsContainer.innerHTML = `
            <h3 data-i18n="key_metrics">Key Metrics</h3>
            <div class="metrics-grid">
                <div class="metric-card">
                    <span class="metric-icon">🌾</span>
                    <div class="metric-info">
                        <h4 data-i18n="crops_selected">Crops Selected</h4>
                        <p>${metrics.totalCrops}</p>
                    </div>
                </div>
                <div class="metric-card">
                    <span class="metric-icon">💧</span>
                    <div class="metric-info">
                        <h4 data-i18n="irrigation_methods">Irrigation Methods</h4>
                        <p>${metrics.irrigationMethods}</p>
                    </div>
                </div>
                <div class="metric-card">
                    <span class="metric-icon">🌱</span>
                    <div class="metric-info">
                        <h4 data-i18n="growth_enhancers">Growth Enhancers</h4>
                        <p>${metrics.growthEnhancers}</p>
                    </div>
                </div>
                <div class="metric-card">
                    <span class="metric-icon">📊</span>
                    <div class="metric-info">
                        <h4 data-i18n="market_analysis">Market Analysis</h4>
                        <p>${metrics.marketAnalysis}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new Dashboard();
}); 