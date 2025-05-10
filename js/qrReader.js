class QRReader {
    constructor() {
        this.video = document.getElementById('qrVideo');
        this.canvas = document.getElementById('qrCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scanning = false;
    }

    async startScan() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            this.video.srcObject = stream;
            this.video.play();
            
            this.scanning = true;
            this.scanQR();
            
            document.getElementById('startScan').style.display = 'none';
            document.getElementById('stopScan').style.display = 'inline-block';
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Error: Could not access camera. Please allow camera access.');
        }
    }

    stopScan() {
        this.scanning = false;
        const stream = this.video.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        this.video.srcObject = null;
        this.video.pause();
        
        document.getElementById('startScan').style.display = 'inline-block';
        document.getElementById('stopScan').style.display = 'none';
    }

    async scanQR() {
        if (!this.scanning) return;

        try {
            // Capture frame
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            // Decode QR code
            const code = await this.decodeQR(imageData);
            if (code) {
                this.handleQRCode(code);
            }
        } catch (err) {
            console.error('Error scanning QR code:', err);
        }

        // Continue scanning
        requestAnimationFrame(() => this.scanQR());
    }

    async decodeQR(imageData) {
        const worker = new Worker('js/qrWorker.js');
        return new Promise((resolve) => {
            worker.onmessage = (event) => {
                resolve(event.data);
            };
            worker.postMessage(imageData);
        });
    }

    handleQRCode(code) {
        try {
            const badgeData = JSON.parse(code);
            // Redirect to badge details page with the scanned data
            window.location.href = `badge-details.html?data=${encodeURIComponent(JSON.stringify(badgeData))}`;
        } catch (error) {
            console.error('Error parsing QR code data:', error);
            alert('Invalid QR code data');
        }
    }
}

// Initialize QR reader
document.addEventListener('DOMContentLoaded', () => {
    const qrReader = new QRReader();

    // Start scanning
    document.getElementById('startScan').addEventListener('click', () => {
        qrReader.startScan();
    });

    // Stop scanning
    document.getElementById('stopScan').addEventListener('click', () => {
        qrReader.stopScan();
    });
});
