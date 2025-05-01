/**
 * Utility function to check if environment variables are properly loaded
 */
export function checkEnvironmentVariables() {
  // Validate configuration
  const isValid = validateConfig();
  
  if (!isValid) {
    console.error('Environment variables are not properly configured. Please check your .env file.');
    console.log('Make sure your .env file:');
    console.log('1. Is in the root directory of your project');
    console.log('2. Contains all required variables with the VITE_ prefix');
    console.log('3. Has no spaces around the = sign');
    console.log('4. Has no quotes around the values');
    console.log('5. Has been saved after making changes');
    console.log('6. The development server has been restarted after making changes');
  }
  
  return isValid;
}

// Helper function to validate configuration
function validateConfig() {
  const errors = [];
  
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    errors.push('VITE_GEMINI_API_KEY is not configured');
  }

  if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
    errors.push('VITE_OPENWEATHER_API_KEY is not configured');
  }

  if (!import.meta.env.VITE_CARBON_FOOTPRINT_API_KEY) {
    errors.push('VITE_CARBON_FOOTPRINT_API_KEY is not configured');
  }

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID || !import.meta.env.VITE_GOOGLE_CLIENT_SECRET) {
    errors.push('VITE_GOOGLE_CLIENT_ID or VITE_GOOGLE_CLIENT_SECRET is not configured');
  }

  if (!import.meta.env.VITE_GITHUB_CLIENT_ID || !import.meta.env.VITE_GITHUB_CLIENT_SECRET) {
    errors.push('VITE_GITHUB_CLIENT_ID or VITE_GITHUB_CLIENT_SECRET is not configured');
  }

  if (!import.meta.env.VITE_MONGODB_URI) {
    errors.push('VITE_MONGODB_URI is not configured');
  }

  if (errors.length > 0) {
    console.error('Configuration Errors:', errors);
    return false;
  }
  
  return true;
} 