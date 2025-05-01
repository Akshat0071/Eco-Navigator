import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSocialAuthCallback } from '@/utils/socialAuth';
import { toast } from 'sonner';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const provider = window.location.pathname.includes('google') ? 'google' : 'github';

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Starting OAuth callback process for:', provider);
        const result = await handleSocialAuthCallback(provider);
        
        if (result && result.token) {
          console.log('Authentication successful, redirecting to dashboard');
          toast.success('Successfully logged in!');
          navigate('/dashboard', { replace: true });
        } else {
          console.error('No token in result:', result);
          throw new Error('No token received from server');
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to authenticate. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [navigate, provider]);

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