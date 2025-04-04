
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { User } from '@/services/userService';
import { SignUpFormValues } from './SignUpForm';

interface MFAVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formValues: SignUpFormValues | null;
}

const MFAVerificationDialog: React.FC<MFAVerificationDialogProps> = ({ 
  open, 
  onOpenChange,
  formValues
}) => {
  const [mfaCode, setMfaCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const verifyMfaCode = async () => {
    if (!formValues) return;
    
    if (mfaCode.length !== 6 || !/^\d+$/.test(mfaCode)) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // For demo purposes, we're simulating a successful verification
      // In a real app, you would verify the code with your backend
      
      // Create a mock user for demo purposes
      const mockUser: User = {
        _id: 'demo-user-id',
        name: formValues.name,
        email: formValues.email,
        password: '', // We don't store the password in client-side
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      login(mockUser);
      
      onOpenChange(false);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('MFA verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify your identity</DialogTitle>
          <DialogDescription>
            We've sent a 6-digit code to your email. Enter it below to complete your signup.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="flex items-center space-x-2 text-sm mb-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">For demo purposes, enter any 6 digits</span>
          </div>
          
          <Input
            className="w-full text-center text-lg"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            maxLength={6}
            placeholder="000000"
          />
          
          <Button 
            className="w-full bg-eco-500 hover:bg-eco-600 text-white mt-4"
            onClick={verifyMfaCode}
            disabled={mfaCode.length !== 6 || isVerifying}
          >
            Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MFAVerificationDialog;
