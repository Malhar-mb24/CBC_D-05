class BadgeHandler {
    constructor() {
        this.badgeData = {
            id: this.generateUniqueID(),
            name: 'Sample Badge',
            description: 'This is a sample badge',
            rating: 0,
            type: 'sample',
            icon: '⭐'
        };
    }

    // Generate a unique badge ID
    generateUniqueID() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // Generate QR code
    generateQRCode() {
        const qrContainer = document.getElementById('qrContainer');
        const qr = new QRCode(qrContainer, {
            text: JSON.stringify(this.badgeData),
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // Update badge display
        this.updateBadgeDisplay();
    }

    // Update badge display
    updateBadgeDisplay() {
        document.getElementById('badgeName').textContent = this.badgeData.name;
        document.getElementById('badgeDescription').textContent = this.badgeData.description;
        document.getElementById('badgeID').textContent = `Badge ID: ${this.badgeData.id}`;
        document.getElementById('badgeRating').textContent = `Rating: ${this.badgeData.rating}/100`;
        document.getElementById('badgeIcon').textContent = this.badgeData.icon;
        document.getElementById('badgeIcon').style.color = this.getBadgeColor(this.badgeData.rating);
    }

    // Get badge color based on rating
    getBadgeColor(rating) {
        if (rating >= 90) return '#2ecc71'; // Green
        if (rating >= 75) return '#3498db'; // Blue
        if (rating >= 50) return '#f1c40f'; // Yellow
        return '#e74c3c'; // Red
    }

    // Load badge data from URL parameters
    loadBadgeData() {
        const urlParams = new URLSearchParams(window.location.search);
        const badgeData = urlParams.get('data');
        
        if (badgeData) {
            try {
                this.badgeData = JSON.parse(decodeURIComponent(badgeData));
                this.updateBadgeDisplay();
            } catch (error) {
                console.error('Error parsing badge data:', error);
            }
        }
    }

    // Update badge system
    updateBadgeSystem(data) {
        // Calculate badge levels
        const irrigationLevel = this.getBadgeLevel(data.irrigationScore);
        const waterLevel = this.getBadgeLevel(data.waterScore);
        const soilLevel = this.getBadgeLevel(data.soilScore);
        const practiceLevel = this.getBadgeLevel(data.practiceScore);
        const totalLevel = this.getBadgeLevel(data.totalScore);
        
        // Update badge display
        this.updateBadgeSystemDisplay({
            irrigation: irrigationLevel,
            water: waterLevel,
            soil: soilLevel,
            practice: practiceLevel,
            total: totalLevel
        });
        
        // Save updated badge data
        this.saveBadgeSystemData({
            irrigationScore: data.irrigationScore,
            waterScore: data.waterScore,
            soilScore: data.soilScore,
            practiceScore: data.practiceScore,
            totalScore: data.totalScore
        });
    }

    // Get badge level based on score
    getBadgeLevel(score) {
        if (score >= 90) return 'gold';
        if (score >= 70) return 'silver';
        if (score >= 50) return 'bronze';
        return 'none';
    }

    // Update badge system display
    updateBadgeSystemDisplay(badgeLevels) {
        const badgeContainer = document.getElementById('badgesContainer');
        if (!badgeContainer) return;
        
        badgeContainer.innerHTML = `
            <div class="badge-card">
                <div class="badge-icon ${badgeLevels.irrigation}">
                    <i class="fas fa-water"></i>
                </div>
                <div class="badge-info">
                    <h3>Irrigation</h3>
                    <p>Level: ${badgeLevels.irrigation}</p>
                </div>
            </div>
            <div class="badge-card">
                <div class="badge-icon ${badgeLevels.water}">
                    <i class="fas fa-tint"></i>
                </div>
                <div class="badge-info">
                    <h3>Water Management</h3>
                    <p>Level: ${badgeLevels.water}</p>
                </div>
            </div>
            <div class="badge-card">
                <div class="badge-icon ${badgeLevels.soil}">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="badge-info">
                    <h3>Soil Health</h3>
                    <p>Level: ${badgeLevels.soil}</p>
                </div>
            </div>
            <div class="badge-card">
                <div class="badge-icon ${badgeLevels.practice}">
                    <i class="fas fa-tools"></i>
                </div>
                <div class="badge-info">
                    <h3>Farming Practices</h3>
                    <p>Level: ${badgeLevels.practice}</p>
                </div>
            </div>
            <div class="badge-card">
                <div class="badge-icon ${badgeLevels.total}">
                    <i class="fas fa-certificate"></i>
                </div>
                <div class="badge-info">
                    <h3>Overall Rating</h3>
                    <p>Level: ${badgeLevels.total}</p>
                </div>
            </div>
        `;
    }

    // Save badge system data
    saveBadgeSystemData(data) {
        localStorage.setItem('badgeSystemData', JSON.stringify(data));
    }

    // Load badge system data
    loadBadgeSystemData() {
        const savedData = localStorage.getItem('badgeSystemData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.updateBadgeSystemDisplay({
                irrigation: this.getBadgeLevel(data.irrigationScore),
                water: this.getBadgeLevel(data.waterScore),
                soil: this.getBadgeLevel(data.soilScore),
                practice: this.getBadgeLevel(data.practiceScore),
                total: this.getBadgeLevel(data.totalScore)
            });
        }
    }
}

// Initialize badge handler
const badgeHandler = new BadgeHandler();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load badge data
    badgeHandler.loadBadgeData();
    badgeHandler.loadBadgeSystemData();

    // Generate QR code
    document.getElementById('generateQR').addEventListener('click', () => {
        badgeHandler.generateQRCode();
    });
});
