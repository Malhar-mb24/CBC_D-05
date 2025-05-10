class VisualizationHandler {
    constructor() {
        this.charts = {};
        this.parameters = JSON.parse(localStorage.getItem('farmParameters')) || {};
    }

    // Initialize all visualizations
    initializeVisualizations() {
        this.initializeYieldChart();
        this.initializeCropDistributionChart();
        this.initializeWaterRequirementsChart();
        this.initializeIrrigationEfficiencyChart();
        this.initializeGrowthImpactChart();
        this.initializeResourceUtilizationChart();
        this.initializeMarketTrendsChart();
        this.initializePricePredictionsChart();
    }

    // Initialize crop-related charts
    initializeYieldChart() {
        const ctx = document.getElementById('yield-chart');
        if (!ctx) return;

        this.charts.yield = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Estimated Yield (quintals)',
                    data: this.calculateYieldData(),
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
                        text: 'Crop Yield Estimation'
                    }
                }
            }
        });
    }

    initializeCropDistributionChart() {
        const ctx = document.getElementById('crop-distribution-chart');
        if (!ctx) return;

        const cropData = this.getCropDistributionData();
        this.charts.cropDistribution = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: cropData.labels,
                datasets: [{
                    data: cropData.values,
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
        });
    }

    initializeWaterRequirementsChart() {
        const ctx = document.getElementById('water-requirements-chart');
        if (!ctx) return;

        this.charts.waterRequirements = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Water Requirements (mm)',
                    data: this.calculateWaterRequirements(),
                    backgroundColor: '#2196F3'
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
                        text: 'Monthly Water Requirements'
                    }
                }
            }
        });
    }

    initializeIrrigationEfficiencyChart() {
        const ctx = document.getElementById('irrigation-efficiency-chart');
        if (!ctx) return;

        const efficiencyData = this.calculateIrrigationEfficiency();
        this.charts.irrigationEfficiency = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Efficient', 'Moderate', 'Inefficient'],
                datasets: [{
                    data: efficiencyData,
                    backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
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
                        text: 'Irrigation Efficiency'
                    }
                }
            }
        });
    }

    initializeGrowthImpactChart() {
        const ctx = document.getElementById('growth-impact-chart');
        if (!ctx) return;

        this.charts.growthImpact = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Growth Rate',
                    data: this.calculateGrowthImpact(),
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
                        text: 'Growth Impact Analysis'
                    }
                }
            }
        });
    }

    initializeResourceUtilizationChart() {
        const ctx = document.getElementById('resource-utilization-chart');
        if (!ctx) return;

        const resourceData = this.calculateResourceUtilization();
        this.charts.resourceUtilization = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Water', 'Fertilizer', 'Pesticides', 'Labor', 'Equipment'],
                datasets: [{
                    label: 'Resource Utilization',
                    data: resourceData,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: '#4CAF50',
                    pointBackgroundColor: '#4CAF50'
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
                        text: 'Resource Utilization'
                    }
                }
            }
        });
    }

    initializeMarketTrendsChart() {
        const ctx = document.getElementById('market-trends-chart');
        if (!ctx) return;

        this.charts.marketTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Market Price (₹/quintal)',
                    data: this.calculateMarketTrends(),
                    borderColor: '#FF5722',
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

    initializePricePredictionsChart() {
        const ctx = document.getElementById('price-predictions-chart');
        if (!ctx) return;

        this.charts.pricePredictions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Predicted Price (₹/quintal)',
                    data: this.calculatePricePredictions(),
                    borderColor: '#9C27B0',
                    tension: 0.1,
                    borderDash: [5, 5]
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
                        text: 'Price Predictions'
                    }
                }
            }
        });
    }

    // Helper methods for data calculation
    calculateYieldData() {
        // Mock data - replace with actual calculations based on parameters
        return [65, 70, 75, 80, 85, 90];
    }

    getCropDistributionData() {
        const cropType = this.parameters.cropType || 'wheat';
        const cropArea = this.parameters.cropArea || 0;
        
        // Mock data - replace with actual calculations
        return {
            labels: [cropType, 'Other Crops'],
            values: [cropArea, 100 - cropArea]
        };
    }

    calculateWaterRequirements() {
        // Mock data - replace with actual calculations based on parameters
        return [50, 60, 70, 80, 90, 100];
    }

    calculateIrrigationEfficiency() {
        const irrigationType = this.parameters.irrigationType || 'flood';
        
        // Mock data - replace with actual calculations
        switch (irrigationType) {
            case 'drip':
                return [80, 15, 5];
            case 'sprinkler':
                return [60, 30, 10];
            default:
                return [40, 40, 20];
        }
    }

    calculateGrowthImpact() {
        // Mock data - replace with actual calculations
        return [10, 25, 45, 70];
    }

    calculateResourceUtilization() {
        // Mock data - replace with actual calculations
        return [80, 70, 60, 85, 75];
    }

    calculateMarketTrends() {
        // Mock data - replace with actual calculations
        return [1500, 1600, 1550, 1700, 1650, 1800];
    }

    calculatePricePredictions() {
        // Mock data - replace with actual calculations
        return [1800, 1850, 1900, 1950, 2000, 2050];
    }

    // Update all charts with new data
    updateCharts() {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};

        // Reinitialize all charts
        this.initializeVisualizations();
    }
}

// Export for use in other files
window.visualizationHandler = new VisualizationHandler(); 