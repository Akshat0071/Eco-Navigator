import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger';

/**
 * Tests the connection to the Gemini API
 * @returns Promise<boolean> - True if connection is successful, false otherwise
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    // Get the API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      logger.error('Gemini API key is not configured');
      return false;
    }
    
    // Initialize the API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Make a simple request
    const result = await model.generateContent('Hello, are you working?');
    const response = await result.response;
    const text = response.text();
    
    logger.info('Gemini API test response:', text);
    return true;
  } catch (error) {
    logger.error('Error testing Gemini API connection:', error);
    return false;
  }
} 