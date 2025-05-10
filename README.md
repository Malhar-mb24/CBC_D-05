# AI-Powered Smart Farming Assistant

A comprehensive web application that helps farmers make informed decisions using AI and machine learning.

## Features

1. Crop Disease Detector
2. Soil Suitability Advisor
3. Crop Price Trend Predictor
4. Pest Alert System
5. Weather-Based Irrigation Advisor
6. Harvest Time Predictor
7. AI Chatbot for Farming FAQs
8. Text-to-Voice Crop Guide
9. OCR for Paper Records
10. Kisan ID Dashboard

## Setup Instructions

### Required API Keys

1. OpenWeatherMap API Key
   - Sign up at https://openweathermap.org/api
   - Get a free API key
   - Add it to `config/config.js` as `weatherApiKey`

2. OpenAI API Key
   - Sign up at https://platform.openai.com/
   - Get an API key
   - Add it to `config/config.js` as `openaiApiKey`

3. TensorFlow.js Model
   - Create your model using Teachable Machine (https://teachablemachine.withgoogle.com/)
   - Export the model and update the URLs in `config/config.js` under `cropDiseaseModel`

### Backend Setup (Optional)

For features requiring backend processing:
1. Set up a Flask server
2. Deploy to a free hosting service like Render
3. Update the `backendApi.baseUrl` in `config/config.js`

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Security Notes

- Never commit your API keys to version control
- Use environment variables for production deployments
- Consider using a .env file for local development

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
