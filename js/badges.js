// Badge definitions
const BADGES = {
    // Crop Mastery Badges
    RICE_MASTER: {
        id: 'rice_master',
        name: 'Rice Master',
        description: 'Expert in rice cultivation with optimal practices',
        icon: '🌾',
        color: 'green',
        requirements: {
            type: 'crop_selection',
            crop: 'rice',
            threshold: 3,
            practices: ['proper_irrigation', 'balanced_fertilizer', 'pest_control']
        }
    },
    WHEAT_MASTER: {
        id: 'wheat_master',
        name: 'Wheat Master',
        description: 'Expert in wheat cultivation with optimal practices',
        icon: '🌾',
        color: 'gold',
        requirements: {
            type: 'crop_selection',
            crop: 'wheat',
            threshold: 3,
            practices: ['soil_preparation', 'timely_sowing', 'disease_control']
        }
    },
    MAIZE_MASTER: {
        id: 'maize_master',
        name: 'Maize Master',
        description: 'Expert in maize cultivation with optimal practices',
        icon: '🌽',
        color: 'orange',
        requirements: {
            type: 'crop_selection',
            crop: 'maize',
            threshold: 3,
            practices: ['spacing_management', 'water_management', 'pest_control']
        }
    },

    // Practice Rating Badges
    BLUE_PRACTITIONER: {
        id: 'blue_practitioner',
        name: 'Blue Practitioner',
        description: 'Excellent farming practices with minimal environmental impact',
        icon: '🔵',
        color: 'blue',
        requirements: {
            type: 'practice_rating',
            score: 90,
            practices: ['organic_pesticides', 'water_conservation', 'soil_health']
        }
    },
    GREEN_PRACTITIONER: {
        id: 'green_practitioner',
        name: 'Green Practitioner',
        description: 'Good farming practices with moderate environmental impact',
        icon: '🟢',
        color: 'green',
        requirements: {
            type: 'practice_rating',
            score: 75,
            practices: ['balanced_fertilizer', 'pest_management', 'crop_rotation']
        }
    },
    RED_PRACTITIONER: {
        id: 'red_practitioner',
        name: 'Red Practitioner',
        description: 'Basic farming practices with high environmental impact',
        icon: '🔴',
        color: 'red',
        requirements: {
            type: 'practice_rating',
            score: 50,
            practices: ['chemical_fertilizer', 'pesticide_use', 'mono_cropping']
        }
    },
    BLACK_PRACTITIONER: {
        id: 'black_practitioner',
        name: 'Black Practitioner',
        description: 'Traditional farming practices with significant environmental impact',
        icon: '⚫',
        color: 'black',
        requirements: {
            type: 'practice_rating',
            score: 25,
            practices: ['heavy_chemical_use', 'flood_irrigation', 'no_crop_rotation']
        }
    }
};

// Badge management system
class BadgeSystem {
    constructor() {
        this.badges = JSON.parse(localStorage.getItem('farmerBadges')) || {};
        this.practiceScores = {
            organic_pesticides: 30,
            water_conservation: 25,
            soil_health: 25,
            balanced_fertilizer: 20,
            pest_management: 20,
            crop_rotation: 20,
            chemical_fertilizer: -15,
            pesticide_use: -15,
            mono_cropping: -10,
            heavy_chemical_use: -30,
            flood_irrigation: -20,
            no_crop_rotation: -20
        };
    }

    // Check and award badges based on parameter selections
    checkAndAwardBadges(parameterType, selections) {
        const farmerId = localStorage.getItem('currentFarmerId');
        if (!farmerId) return;

        if (!this.badges[farmerId]) {
            this.badges[farmerId] = [];
        }

        // Check crop mastery badges
        this.checkCropMasteryBadges(farmerId, selections);
        
        // Check practice rating badges
        this.checkPracticeRatingBadges(farmerId, selections);

        this.saveBadges();
    }

    checkCropMasteryBadges(farmerId, selections) {
        Object.values(BADGES).forEach(badge => {
            if (badge.requirements.type === 'crop_selection') {
                const cropSelections = selections.filter(s => s.includes(badge.requirements.crop));
                const practiceMatches = badge.requirements.practices.every(practice => 
                    selections.some(s => s.includes(practice))
                );

                if (cropSelections.length >= badge.requirements.threshold && practiceMatches) {
                    this.awardBadge(farmerId, badge);
                }
            }
        });
    }

    checkPracticeRatingBadges(farmerId, selections) {
        let totalScore = 0;
        selections.forEach(practice => {
            Object.entries(this.practiceScores).forEach(([key, score]) => {
                if (practice.includes(key)) {
                    totalScore += score;
                }
            });
        });

        Object.values(BADGES).forEach(badge => {
            if (badge.requirements.type === 'practice_rating' && totalScore >= badge.requirements.score) {
                this.awardBadge(farmerId, badge);
            }
        });
    }

    // Award a badge to a farmer
    awardBadge(farmerId, badge) {
        if (!this.badges[farmerId].some(b => b.id === badge.id)) {
            this.badges[farmerId].push({
                id: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                color: badge.color,
                awardedAt: new Date().toISOString()
            });
            
            this.showBadgeNotification(badge);
        }
    }

    // Get all badges for a farmer
    getFarmerBadges(farmerId) {
        return this.badges[farmerId] || [];
    }

    // Save badges to localStorage
    saveBadges() {
        localStorage.setItem('farmerBadges', JSON.stringify(this.badges));
    }

    // Show badge notification
    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content" style="border-left: 4px solid ${badge.color}">
                <span class="badge-icon">${badge.icon}</span>
                <div class="badge-info">
                    <h3>New Badge Earned!</h3>
                    <p>${badge.name}</p>
                    <small>${badge.description}</small>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize badge system
const badgeSystem = new BadgeSystem();

// Export for use in other files
window.badgeSystem = badgeSystem; 