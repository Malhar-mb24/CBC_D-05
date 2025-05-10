// Market analysis data for crops
const marketAnalysisData = {
    wheat: [
        { month: "Jan", price: 1800, prevPrice: 1750 },
        { month: "Feb", price: 1850, prevPrice: 1800 },
        { month: "Mar", price: 1900, prevPrice: 1850 },
        { month: "Apr", price: 1950, prevPrice: 1900 },
        { month: "May", price: 2000, prevPrice: 1950 },
        { month: "Jun", price: 2050, prevPrice: 2000 }
    ],
    rice: [
        { month: "Jan", price: 3500, prevPrice: 3450 },
        { month: "Feb", price: 3550, prevPrice: 3500 },
        { month: "Mar", price: 3600, prevPrice: 3550 },
        { month: "Apr", price: 3650, prevPrice: 3600 },
        { month: "May", price: 3700, prevPrice: 3650 },
        { month: "Jun", price: 3750, prevPrice: 3700 }
    ]
};

// Export for use in other files
window.marketAnalysisData = marketAnalysisData;
