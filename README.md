#Eco-Navigator - Eco-Lifestyle Tracker 🌍

A full-stack web application that helps users adopt and maintain sustainable habits by tracking their health, providing AI-driven recommendations, and promoting eco-friendly living.

## Features 🌟

- **Health Tracking**: Monitor steps, calories, water intake, and carbon footprint
- **AI-Powered Recommendations**: Personalized diet and workout plans using Gemini AI
- **Eco-Score System**: Track your sustainability impact
- **Community Features**: Share progress and compete with friends
- **Educational Resources**: Learn about sustainable living
- **Smart Home Integration**: AI-powered energy usage recommendations
- **Mobile Responsive**: Access from any device

## Tech Stack 🛠

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **AI Integration**: Google Gemini API
- **Authentication**: OAuth 2.0
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **API Integration**: OpenWeather, Carbon Footprint APIs

## Prerequisites 📋

- Node.js (v16 or higher)
- MongoDB
- Google Cloud Platform account (for Gemini API)
- OpenWeather API key
- Carbon Footprint API key
- Google OAuth credentials
- GitHub OAuth credentials

## Installation 🚀

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sustainify.git
   cd sustainify
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   # API Keys
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   VITE_CARBON_FOOTPRINT_API_KEY=your_carbon_footprint_api_key_here

   # OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   VITE_GITHUB_CLIENT_ID=your_github_client_id_here
   VITE_GITHUB_CLIENT_SECRET=your_github_client_secret_here

   # Database Configuration
   VITE_MONGODB_URI=mongodb://localhost:27017/sustainify

   # Authentication
   VITE_JWT_SECRET=your_jwt_secret_key_here

   # Application Configuration
   NODE_ENV=development
   PORT=3000
   ```

   **Important**: All environment variables that need to be accessed in the frontend must be prefixed with `VITE_`. This is a requirement of Vite.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables 🔑

The application uses environment variables for configuration. Here's what each variable is used for:

- **VITE_GEMINI_API_KEY**: API key for Google's Gemini AI model (used for AI recommendations and smart home features)
- **VITE_OPENWEATHER_API_KEY**: API key for OpenWeather API
- **VITE_CARBON_FOOTPRINT_API_KEY**: API key for Carbon Footprint API
- **VITE_GOOGLE_CLIENT_ID**: Google OAuth client ID
- **VITE_GOOGLE_CLIENT_SECRET**: Google OAuth client secret
- **VITE_GITHUB_CLIENT_ID**: GitHub OAuth client ID
- **VITE_GITHUB_CLIENT_SECRET**: GitHub OAuth client secret
- **VITE_MONGODB_URI**: MongoDB connection string
- **VITE_JWT_SECRET**: Secret key for JWT token generation
- **NODE_ENV**: Environment (development, production)
- **PORT**: Port number for the server

## Project Structure 📁

```
sustainify/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API and business logic
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── contexts/      # React contexts
│   ├── types/         # TypeScript type definitions
│   └── config/        # Configuration files
├── public/            # Static assets
└── ...config files
```

## API Documentation 📚

### Gemini API Integration

The application uses Google's Gemini API for:
- Generating personalized workout plans
- Creating sustainable meal recommendations
- Analyzing eco-scores
- Providing smart lifestyle suggestions
- Smart home energy usage recommendations

### Rate Limiting

- 60 requests per minute per user
- Exponential backoff for retries
- Caching for frequently requested data

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

For support, email support@sustainify.com or join our Discord community.

## Acknowledgments 🙏

- Google Gemini API
- OpenWeather API
- Carbon Footprint API
- All contributors and supporters
