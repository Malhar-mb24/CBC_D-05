class VisualizationHandler {
    constructor() {
        this.charts = {};
    }

    // Initialize all visualizations
    initializeVisualizations() {
        this.initializeCropCharts();
        this.initializeIrrigationCharts();
        this.initializeGrowthCharts();
        this.initializeMarketCharts();
    }

    // Initialize crop-related charts
    initializeCropCharts() {
        const cropData = JSON.parse(localStorage.getItem('processedData'))?.crops;
        if (!cropData) return;

        // Yield Estimation Chart
        this.createYieldChart(cropData.yieldEstimates);
        
        // Crop Distribution Chart
        this.createCropDistributionChart(cropData.selected);
    }

    // Initialize irrigation-related charts
    initializeIrrigationCharts() {
        const irrigationData = JSON.parse(localStorage.getItem('processedData'))?.irrigation;
        if (!irrigationData) return;

        // Water Requirements Chart
        this.createWaterRequirementsChart(irrigationData.waterRequirements);
        
        // Irrigation Efficiency Chart
        this.createEfficiencyChart(irrigationData.efficiency);
    }

    // Initialize growth-related charts
    initializeGrowthCharts() {
        const growthData = JSON.parse(localStorage.getItem('processedData'))?.growth;
        if (!growthData) return;

        // Growth Impact Chart
        this.createGrowthImpactChart(growthData.impact);
        
        // Resource Utilization Chart
        this.createResourceUtilizationChart(growthData.methods);
    }

    // Initialize market-related charts
    initializeMarketCharts() {
        const marketData = JSON.parse(localStorage.getItem('processedData'))?.market;
        if (!marketData) return;

        // Market Trends Chart
        this.createMarketTrendsChart(marketData.trends);
        
        // Price Predictions Chart
        this.createMarketPredictionsChart(marketData.predictions);
    }

    // Chart Creation Methods
    createYieldChart(yieldData) {
        const ctx = document.getElementById('yield-chart');
        if (!ctx) return;

        this.charts.yield = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: yieldData.map(d => d.crop),
                datasets: [{
                    label: 'Estimated Yield (quintals)',
                    data: yieldData.map(d => d.estimatedYield),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Yield (quintals)'
                        }
                    }
                }
            }
        });
    }

    createCropDistributionChart(crops) {
        const ctx = document.getElementById('crop-distribution-chart');
        if (!ctx) return;

        this.charts.cropDistribution = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: crops,
                datasets: [{
                    data: crops.map(() => Math.random() * 100),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Crop Distribution'
                    }
                }
            }
        });
    }

    createWaterRequirementsChart(waterData) {
        const ctx = document.getElementById('water-requirements-chart');
        if (!ctx) return;

        this.charts.waterRequirements = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: waterData.map(d => d.method),
                datasets: [{
                    label: 'Water Required (L)',
                    data: waterData.map(d => d.waterNeeded),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Water Required (L)'
                        }
                    }
                }
            }
        });
    }

    createEfficiencyChart(efficiencyData) {
        const ctx = document.getElementById('irrigation-efficiency-chart');
        if (!ctx) return;

        this.charts.efficiency = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: efficiencyData.map(d => d.method),
                datasets: [{
                    label: 'Efficiency (%)',
                    data: efficiencyData.map(d => d.efficiency),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Efficiency (%)'
                        }
                    }
                }
            }
        });
    }

    createGrowthImpactChart(impactData) {
        const ctx = document.getElementById('growth-impact-chart');
        if (!ctx) return;

        this.charts.growthImpact = new Chart(ctx, {
            type: 'line',
            data: {
                labels: impactData.map(d => d.method),
                datasets: [{
                    label: 'Impact (%)',
                    data: impactData.map(d => d.impact),
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Impact (%)'
                        }
                    }
                }
            }
        });
    }

    createResourceUtilizationChart(methods) {
        const ctx = document.getElementById('resource-utilization-chart');
        if (!ctx) return;

        this.charts.resourceUtilization = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: methods,
                datasets: [{
                    data: methods.map(() => Math.random() * 100),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Resource Utilization'
                    }
                }
            }
        });
    }

    createMarketTrendsChart(trendsData) {
        const ctx = document.getElementById('market-trends-chart');
        if (!ctx) return;

        this.charts.marketTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Market Trend',
                    data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Price (₹)'
                        }
                    }
                }
            }
        });
    }

    createMarketPredictionsChart(predictionsData) {
        const ctx = document.getElementById('price-predictions-chart');
        if (!ctx) return;

        this.charts.marketPredictions = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: predictionsData.map(d => d.item),
                datasets: [{
                    label: 'Predicted Price (₹)',
                    data: predictionsData.map(d => d.prediction),
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Price (₹)'
                        }
                    }
                }
            }
        });
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