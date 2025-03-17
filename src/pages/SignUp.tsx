
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignUpForm, { SignUpFormValues } from '@/components/auth/SignUpForm';
import MFAVerificationDialog from '@/components/auth/MFAVerificationDialog';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

const SignUp: React.FC = () => {
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const [formValues, setFormValues] = useState<SignUpFormValues | null>(null);
  
  const handleSignUpSuccess = (data: SignUpFormValues) => {
    setFormValues(data);
    setShowMfaDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Sustainify to start your eco-friendly journey
            </p>
          </div>
          
          <div className="mt-8 glass-card p-6 rounded-xl">
            <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
            
            <div className="mt-6">
              <SocialLoginButtons />
            </div>
          </div>
          
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-eco-600 hover:text-eco-500">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      
      <Footer />
      
      <MFAVerificationDialog 
        open={showMfaDialog} 
        onOpenChange={setShowMfaDialog} 
        formValues={formValues}
      />
    </div>
  );
};

export default SignUp;
