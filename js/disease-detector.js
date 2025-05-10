// Disease classification model
const model = {
    healthy: 'Healthy',
    bacterial: 'Bacterial Spot',
    early_blight: 'Early Blight',
    late_blight: 'Late Blight',
    leaf_mold: 'Leaf Mold',
    mosaic_virus: 'Mosaic Virus',
    yellow_leaf_curl: 'Yellow Leaf Curl'
};

// Treatment recommendations
const recommendations = {
    healthy: 'Your crop is healthy! Continue with regular care.',
    bacterial: 'Apply copper-based fungicides and maintain proper plant spacing.',
    early_blight: 'Use fungicides containing chlorothalonil and rotate crops.',
    late_blight: 'Apply fungicides containing mancozeb and improve drainage.',
    leaf_mold: 'Increase air circulation and use fungicides containing chlorothalonil.',
    mosaic_virus: 'Remove infected plants and control aphids.',
    yellow_leaf_curl: 'Use insecticides to control whiteflies and remove infected plants.'
};

let tfModel = null;

// Load the model
async function loadModel() {
    try {
        tfModel = await mobilenet.load();
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}

// Initialize the model when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadModel();
});

// Handle image upload
document.getElementById('imageUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create image preview
    const preview = document.getElementById('imagePreview');
    const img = document.createElement('img');
    img.style.maxWidth = '300px';
    img.style.maxHeight = '300px';
    
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
        preview.innerHTML = '';
        preview.appendChild(img);
    };
    reader.readAsDataURL(file);

    // Process the image and get prediction
    await processImage(file);
});

async function processImage(file) {
    if (!tfModel) {
        alert('Model is still loading. Please try again in a moment.');
        return;
    }

    // Create a canvas to resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Load the image
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    await new Promise((resolve) => {
        img.onload = resolve;
    });

    // Resize the image to 224x224 (MobileNet input size)
    canvas.width = 224;
    canvas.height = 224;
    ctx.drawImage(img, 0, 0, 224, 224);

    // Convert canvas to tensor
    const tensor = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();

    // Get prediction
    const prediction = await tfModel.classify(tensor);
    
    // Display results
    const resultDiv = document.getElementById('predictionResult');
    const confidenceDiv = document.getElementById('confidenceScore');
    const recommendationDiv = document.getElementById('recommendation');

    resultDiv.textContent = `Prediction: ${prediction[0].className}`;
    confidenceDiv.textContent = `Confidence: ${(prediction[0].probability * 100).toFixed(2)}%`;
    recommendationDiv.textContent = `Recommendation: ${recommendations[prediction[0].className.toLowerCase()]} `;

    // Clean up
    tensor.dispose();
}
