import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import OAuthCallback from './pages/auth/OAuthCallback';

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import GoogleCallback from "@/pages/auth/GoogleCallback";
import GithubCallback from "@/pages/auth/GithubCallback";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
      <AuthProvider>
          <Layout>
          <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Social Auth Callback Routes */}
                <Route path="/auth/google/callback" element={<OAuthCallback />} />
                <Route path="/auth/github/callback" element={<OAuthCallback />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Layout>
          <Toaster position="top-right" />
      </AuthProvider>
      </Router>
      </ThemeProvider>
    </ErrorBoundary>
);
};

export default App;
