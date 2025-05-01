import { testGeminiConnection } from '../utils/testGeminiConnection';
import { logger } from '../utils/logger';

/**
 * Script to check the Gemini API key and connection
 * Run this script to verify that the API key is valid and the service is accessible
 */
async function main() {
  logger.info('Checking Gemini API connection...');
  
  // Check if the API key is set
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  if (!apiKey) {
    logger.error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    process.exit(1);
  }
  
  // Log the API key length (not the actual key)
  logger.info(`API key length: ${apiKey.length}`);
  
  // Test the connection
  const isConnected = await testGeminiConnection();
  
  if (isConnected) {
    logger.info('Gemini API connection successful!');
    process.exit(0);
  } else {
    logger.error('Gemini API connection failed. Please check your API key and network connection.');
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  logger.error('Error running script:', error);
  process.exit(1);
}); 