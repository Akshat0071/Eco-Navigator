import { toast } from "sonner";
import axios from "axios";

// Get environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';

// Log environment variables and configuration
console.log('Current origin:', window.location.origin);
console.log('Google Client ID:', GOOGLE_CLIENT_ID);
console.log('GitHub Client ID:', GITHUB_CLIENT_ID);

const GOOGLE_CONFIG = {
  clientId: GOOGLE_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scope: "email profile",
};

const GITHUB_CONFIG = {
  clientId: GITHUB_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/github/callback`,
  scope: "user:email",
};

// Log the full configuration
console.log('Google Config:', GOOGLE_CONFIG);
console.log('GitHub Config:', GITHUB_CONFIG);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initiateGoogleAuth = () => {
  if (!GOOGLE_CONFIG.clientId) {
    console.error("Google Client ID is not configured");
    toast.error("Google authentication is not properly configured. Please check your environment variables.");
    return;
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CONFIG.clientId}` +
    `&redirect_uri=${encodeURIComponent(GOOGLE_CONFIG.redirectUri)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(GOOGLE_CONFIG.scope)}` +
    `&access_type=offline` +
    `&prompt=consent`;

  console.log('Initiating Google Auth with URL:', authUrl);
  window.location.href = authUrl;
};

export const initiateGithubAuth = () => {
  if (!GITHUB_CONFIG.clientId) {
    console.error("GitHub Client ID is not configured");
    toast.error("GitHub authentication is not properly configured. Please check your environment variables.");
    return;
  }

  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CONFIG.clientId}` +
    `&redirect_uri=${encodeURIComponent(GITHUB_CONFIG.redirectUri)}` +
    `&scope=${encodeURIComponent(GITHUB_CONFIG.scope)}`;

  console.log('Initiating GitHub Auth with URL:', authUrl);
  window.location.href = authUrl;
};

export const handleSocialAuthCallback = async (provider: "google" | "github"): Promise<any> => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error(`${provider} OAuth error:`, error);
      throw new Error(`OAuth error: ${error}`);
    }

    if (!code) {
      console.error('No authorization code found in URL');
      throw new Error('No authorization code received');
    }

    console.log(`Processing ${provider} callback with code:`, code);
    console.log('Sending request to:', `${API_URL}/api/users/auth/${provider}`);

    // Get the current origin
    const currentOrigin = window.location.origin;
    console.log('Current origin:', currentOrigin);

    // Send the code to our backend
    const response = await api.post(`/api/users/auth/${provider}`, { 
      code,
      redirectUri: `${currentOrigin}/auth/${provider}/callback`
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).catch(error => {
      console.error(`${provider} API error:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      throw new Error(error.response?.data?.message || `Failed to authenticate with ${provider}`);
    });
    
    if (!response || !response.data) {
      console.error('Invalid response from server');
      throw new Error('Invalid response from server');
    }

    if (response.data.token) {
      console.log('Successfully received token from server');
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      console.error('No token in response:', response.data);
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error(`${provider} callback error:`, error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
    throw error;
  }
};