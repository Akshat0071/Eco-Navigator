import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSocialAuthCallback } from '@/utils/socialAuth';
import { toast } from 'sonner';

const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('No authorization code received');
        }

        const user = await handleSocialAuthCallback('github');
        toast.success('Successfully logged in with GitHub');
        navigate('/dashboard');
      } catch (error) {
        console.error('GitHub callback error:', error);
        toast.error('Failed to authenticate with GitHub');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing GitHub Sign In</h1>
        <p className="text-muted-foreground">Please wait while we process your authentication...</p>
      </div>
    </div>
  );
};

export default GithubCallback; 