import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSocialAuthCallback } from '@/utils/socialAuth';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  isVerified: boolean;
}

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socialLogin } = useAuth();
  const provider = window.location.pathname.includes('google') ? 'google' : 'github';

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Log the start of the process
        console.log('Starting OAuth callback process for:', provider);
        console.log('Current URL:', window.location.href);
        
        // Extract and log the code
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
        
        console.log('Authorization code received:', code);
        
        const result = await handleSocialAuthCallback(provider);
        
        if (result && result.token) {
          console.log('Authentication successful, processing user data');
          console.log('User data:', result.user);
          
          // Ensure profile picture is properly set
          if (!result.user.profilePicture) {
            if (provider === 'github') {
              result.user.profilePicture = `https://avatars.githubusercontent.com/u/${result.user.id}?v=4`;
            } else if (provider === 'google') {
              result.user.profilePicture = result.user.profilePicture || '';
            }
          }
          
          // Add provider prefix to user ID
          result.user.id = `${provider}_${result.user.id}`;
          
          // Store the token and user data
          await socialLogin(result.token, result.user);
          toast.success('Successfully logged in!');
          return; // Exit early on success
        }
        
        throw new Error('No token received from server');
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to authenticate. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [navigate, provider, socialLogin]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {isLoading && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback; 