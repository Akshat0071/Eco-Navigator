import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSocialAuthCallback } from '@/utils/socialAuth';
import { toast } from 'sonner';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code received');
        }

        const user = await handleSocialAuthCallback('google');
        toast.success('Successfully logged in with Google');
        navigate('/dashboard');
      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to authenticate with Google');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Google Sign In</h1>
        <p className="text-muted-foreground">Please wait while we process your authentication...</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 