
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your account to continue your sustainable journey
            </p>
          </div>
          
          <div className="mt-8 glass-card p-6 rounded-xl">
            <LoginForm />
            
            <div className="mt-6">
              <SocialLoginButtons />
            </div>
          </div>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/sign-up" className="font-medium text-eco-600 hover:text-eco-500">
              Sign up for free
            </Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
