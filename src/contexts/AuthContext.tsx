import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { rateLimiter } from "@/utils/rateLimiter";
import { validatePassword } from "@/utils/passwordValidation";
import { User } from '@/services/userService';

interface SocialUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (token: string, userData: SocialUser) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  userProfile: {
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
    };
  } | null;
  updateProfile: (data: Partial<{
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
    };
  }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
    };
  } | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('userProfile');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedProfile && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedProfile = JSON.parse(storedProfile);
        
        // Log the stored data for debugging
        console.log('Restoring user from localStorage:', parsedUser);
        console.log('Restoring profile from localStorage:', parsedProfile);
        
        setUser(parsedUser);
        setUserProfile(parsedProfile);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);
  
  const socialLogin = async (token: string, userData: SocialUser) => {
    try {
      // Store the token
      localStorage.setItem('token', token);
      
      // Convert social user to app user
      const appUser: User = {
        _id: userData.id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setUser(appUser);
      localStorage.setItem('user', JSON.stringify(appUser));
      
      // Create or update user profile with proper profile picture handling
      let avatarUrl = userData.profilePicture;
      
      // Ensure the profile picture URL is properly formatted
      if (!avatarUrl) {
        if (userData.id.startsWith('github_')) {
          avatarUrl = `https://avatars.githubusercontent.com/u/${userData.id.replace('github_', '')}?v=4`;
        } else if (userData.id.startsWith('google_')) {
          avatarUrl = userData.profilePicture || '';
        }
      }
      
      const profile = {
        name: `${userData.firstName} ${userData.lastName}`,
        avatar_url: avatarUrl,
        preferences: {
          notifications: true,
        },
      };
      
      // Log the profile data for debugging
      console.log('Setting profile data:', profile);
      console.log('Profile picture URL:', avatarUrl);
      
      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Verify the data was stored correctly
      const storedProfile = localStorage.getItem('userProfile');
      console.log('Stored profile in localStorage:', storedProfile);
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error handling social login:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call to your backend
      const newUser: User = {
        _id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      const profile = {
        name: newUser.name,
        avatar_url: '',
        preferences: {
          notifications: true,
        },
      };

      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));

      navigate('/login');
      toast.success('Account created successfully! Please log in.');
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call to your backend
      const existingUser: User = {
        _id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(existingUser);
      localStorage.setItem('user', JSON.stringify(existingUser));

      const profile = {
        name: existingUser.name,
        avatar_url: '',
        preferences: {
          notifications: true,
        },
      };

      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would make an API call to your backend
      toast.success('Password reset link sent to your email');
    } catch (error) {
      console.error('Error during password reset:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // In a real app, this would make an API call to your backend
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error during password update:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<{
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
    };
  }>) => {
    try {
      if (userProfile) {
        const updatedProfile = { ...userProfile, ...data };
        setUserProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      login,
      socialLogin,
      logout,
      resetPassword,
      updatePassword,
      userProfile,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
