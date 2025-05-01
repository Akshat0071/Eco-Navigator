import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const GithubCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (!code) {
          throw new Error('No authorization code received');
        }

        const response = await axios.post('http://localhost:3000/api/auth/github/callback', {
          code
        });

        const { token, user } = response.data;
        login(token, user);
        navigate('/dashboard');
      } catch (error) {
        console.error('GitHub OAuth error:', error);
        navigate('/login', { state: { error: 'GitHub authentication failed' } });
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing GitHub Sign In...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default GithubCallback; 