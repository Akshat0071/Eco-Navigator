
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        isScrolled
          ? 'glass shadow-sm backdrop-blur-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-eco-500" />
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-eco-600 to-eco-400 bg-clip-text text-transparent">Sustainify</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <a
                href="#features"
                className="text-foreground/80 hover:text-eco-500 transition-colors font-medium"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#stats"
                className="text-foreground/80 hover:text-eco-500 transition-colors font-medium"
              >
                Impact
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="text-foreground/80 hover:text-eco-500 transition-colors font-medium"
              >
                Testimonials
              </a>
            </li>
            <li>
              <Button 
                className="bg-eco-500 hover:bg-eco-600 text-white rounded-full transition-all px-6"
                asChild
              >
                <Link to="/login">
                  Login
                </Link>
              </Button>
            </li>
            <li>
              <Button 
                variant="outline" 
                className="border-eco-500 text-eco-500 hover:bg-eco-500/10 rounded-full transition-all px-6"
                asChild
              >
                <Link to="/sign-up">
                  Sign Up
                </Link>
              </Button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground/80 hover:text-eco-500 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'fixed inset-x-0 bg-white/90 backdrop-blur-lg shadow-lg transition-all duration-300 ease-in-out md:hidden',
            isMobileMenuOpen
              ? 'top-16 opacity-100 visible'
              : 'top-[-100%] opacity-0 invisible'
          )}
        >
          <ul className="flex flex-col py-4 px-6 space-y-4">
            <li>
              <a
                href="#features"
                className="block py-2 text-foreground/80 hover:text-eco-500 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#stats"
                className="block py-2 text-foreground/80 hover:text-eco-500 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Impact
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="block py-2 text-foreground/80 hover:text-eco-500 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
            </li>
            <li className="pt-2">
              <Button 
                className="w-full bg-eco-500 hover:bg-eco-600 text-white rounded-full transition-all"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/login">
                  Login
                </Link>
              </Button>
            </li>
            <li>
              <Button 
                variant="outline" 
                className="w-full border-eco-500 text-eco-500 hover:bg-eco-500/10 rounded-full transition-all"
                asChild
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link to="/sign-up">
                  Sign Up
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
