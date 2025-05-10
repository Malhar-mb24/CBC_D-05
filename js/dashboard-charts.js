document.addEventListener('DOMContentLoaded', function() {
    // Crop Types Chart
    const cropCtx = document.getElementById('cropChart');
    if (cropCtx) {
        const cropData = {
            labels: ['Wheat', 'Rice', 'Maize', 'Pulses'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
                hoverOffset: 4
            }]
        };
        
        new Chart(cropCtx, {
            type: 'pie',
            data: cropData,
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
    
    // Land Type Chart
    const landCtx = document.getElementById('landChart');
    if (landCtx) {
        const landData = {
            labels: ['Irrigated', 'Rain-fed'],
            datasets: [{
                data: [65, 35],
                backgroundColor: ['#3b82f6', '#8b5cf6'],
                hoverOffset: 4
            }]
        };
        
        new Chart(landCtx, {
            type: 'pie',
            data: landData,
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
    
    // Irrigation Methods Chart
    const irrigationCtx = document.getElementById('irrigationChart');
    if (irrigationCtx) {
        const irrigationData = {
            labels: ['Drip', 'Sprinkler', 'Flood'],
            datasets: [{
                data: [40, 25, 35],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                hoverOffset: 4
            }]
        };
        
        new Chart(irrigationCtx, {
            type: 'pie',
            data: irrigationData,
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
    
    // Soil Types Chart
    const soilCtx = document.getElementById('soilChart');
    if (soilCtx) {
        const soilData = {
            labels: ['Sandy', 'Loamy', 'Clay', 'Silt'],
            datasets: [{
                label: 'Acres',
                data: [5, 12, 8, 3],
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        };
        
        new Chart(soilCtx, {
            type: 'bar',
            data: soilData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Acres'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Market Analysis Charts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    

});
