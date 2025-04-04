import { toast } from "sonner";
import { User } from "@/services/userService";

interface SocialAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

// Log environment variables and configuration
console.log('Current origin:', window.location.origin);
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('GitHub Client ID:', import.meta.env.VITE_GITHUB_CLIENT_ID);

const GOOGLE_CONFIG: SocialAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scope: "email profile",
};

const GITHUB_CONFIG: SocialAuthConfig = {
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
  redirectUri: `${window.location.origin}/auth/github/callback`,
  scope: "user:email",
};

// Log the full configuration
console.log('Google Config:', GOOGLE_CONFIG);
console.log('GitHub Config:', GITHUB_CONFIG);

export const initiateGoogleAuth = () => {
  if (!GOOGLE_CONFIG.clientId) {
    console.error("Google Client ID is not configured");
    toast.error("Google authentication is not properly configured");
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
    toast.error("GitHub authentication is not properly configured");
    return;
  }

  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CONFIG.clientId}` +
    `&redirect_uri=${encodeURIComponent(GITHUB_CONFIG.redirectUri)}` +
    `&scope=${encodeURIComponent(GITHUB_CONFIG.scope)}`;

  window.location.href = authUrl;
};

export const handleSocialAuthCallback = async (provider: "google" | "github"): Promise<User> => {
  console.log('Handling social auth callback for provider:', provider);
  console.log('Current URL:', window.location.href);
  
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");
  const errorDescription = urlParams.get("error_description");

  console.log('URL Parameters:', {
    code: code ? 'present' : 'missing',
    error,
    errorDescription
  });

  if (error) {
    console.error("OAuth error:", error, errorDescription);
    throw new Error(errorDescription || error);
  }

  if (!code) {
    console.error("No authorization code received");
    throw new Error("No authorization code received");
  }

  try {
    // For development/testing, we'll simulate a successful authentication
    // In a real app, you would send this code to your backend
    const now = new Date();
    const mockUserData: User = {
      _id: crypto.randomUUID(),
      email: "test@example.com",
      name: "Test User",
      provider: provider,
      createdAt: now,
      updatedAt: now
    };

    console.log('Simulating successful authentication with data:', mockUserData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return mockUserData;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};