// Government schemes data
const governmentSchemes = [
    {
        id: 1,
        title: "PM-KISAN",
        description: "Income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
        category: "subsidy",
        eligibility: "All land holding farmers with cultivable land",
        deadline: "Ongoing",
        icon: "credit-card",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
        id: 2,
        title: "Kisan Credit Card",
        description: "Provides farmers with affordable credit for their agricultural needs.",
        category: "loan",
        eligibility: "All farmers, sharecroppers, and tenant farmers",
        deadline: "Ongoing",
        icon: "credit-card",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
        id: 3,
        title: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
        category: "insurance",
        eligibility: "All farmers growing notified crops",
        deadline: "Before sowing season",
        icon: "leaf",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
        id: 4,
        title: "Soil Health Card Scheme",
        description: "Provides information on soil health and recommends appropriate dosage of nutrients.",
        category: "subsidy",
        eligibility: "All farmers",
        deadline: "Ongoing",
        icon: "leaf",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
        id: 5,
        title: "Pradhan Mantri Krishi Sinchai Yojana",
        description: "Ensures access to means of irrigation to all agricultural farms in the country.",
        category: "subsidy",
        eligibility: "Farmers with irrigation needs",
        deadline: "Ongoing",
        icon: "droplet",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
        id: 6,
        title: "Agricultural Infrastructure Fund",
        description: "Financing facility for investment in post-harvest management infrastructure.",
        category: "loan",
        eligibility: "Farmers, FPOs, Agri-entrepreneurs",
        deadline: "Ongoing",
        icon: "building",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    }
];

// Export for use in other files
window.governmentSchemes = governmentSchemes;
