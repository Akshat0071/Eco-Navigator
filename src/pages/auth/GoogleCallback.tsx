import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSocialAuthCallback } from "@/utils/socialAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { handleSocialLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true);
        console.log('Starting Google callback handling...');
        
        const data = await handleSocialAuthCallback("google");
        console.log('Received data from callback:', data);
        
        if (data) {
          console.log('Attempting to login with data:', data);
          await handleSocialLogin(data);
          console.log('Login successful, navigating to dashboard...');
          navigate("/dashboard");
        } else {
          console.error('No data received from callback');
          setError("Failed to authenticate with Google");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setError(error instanceof Error ? error.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [navigate, handleSocialLogin]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-600">Authentication Failed</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/login")}>
              Return to Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="ml-2"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Completing Google Sign In...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-600 mx-auto"></div>
        <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 