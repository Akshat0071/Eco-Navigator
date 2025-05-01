import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { rateLimiter } from "@/utils/rateLimiter";
import { validatePassword } from "@/utils/passwordValidation";
import { User } from '@/services/userService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userProfile: {
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
      theme: 'light' | 'dark';
    };
  } | null;
  updateProfile: (data: Partial<{
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
      theme: 'light' | 'dark';
    };
  }>) => Promise<void>;
  handleSocialLogin: (userData: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
      theme: 'light' | 'dark';
    };
  } | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);
      setTheme(profile.preferences.theme);
    }
    
    setLoading(false);
  }, []);
  
  const handleSocialLogin = async (userData: User) => {
    try {
    setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Create or update user profile
      const profile = {
        name: userData.name || 'User',
        avatar_url: userData.avatar_url || '',
        preferences: {
          notifications: true,
          theme: 'light' as const,
        },
      };
      
      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
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
          theme: 'light' as const,
        },
      };

      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would make an API call to your backend
      const mockUser: User = {
        _id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      const profile = {
        name: mockUser.name,
        avatar_url: '',
        preferences: {
          notifications: true,
          theme: 'light' as const,
        },
      };

      setUserProfile(profile);
      localStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
    setUser(null);
      setUserProfile(null);
    localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would make an API call to your backend
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      // In a real app, this would make an API call to your backend
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          theme: newTheme as 'light' | 'dark',
        },
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };

  const updateProfile = async (data: Partial<{
    name: string;
    avatar_url: string;
    preferences: {
      notifications: boolean;
      theme: 'light' | 'dark';
    };
  }>) => {
    if (!userProfile) return;

    try {
      const updatedProfile = {
        ...userProfile,
        ...data,
      };
      setUserProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
      user, 
    loading,
    signUp,
      login, 
    logout,
    resetPassword,
    updatePassword,
    theme,
    toggleTheme,
    userProfile,
    updateProfile,
    handleSocialLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
