
import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Mail, Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const FooterLink: React.FC<{ href: string; children: React.ReactNode; className?: string }> = ({ 
  href, 
  children, 
  className 
}) => (
  <a 
    href={href} 
    className={cn(
      "text-foreground/70 hover:text-eco-500 transition-colors",
      className
    )}
  >
    {children}
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="relative pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.00 49.99L48.00 68.13C96.00 86.27 192.00 122.55 288.00 131.18C384.00 139.82 480.00 120.82 576.00 111.72C672.00 102.62 768.00 103.17 864.00 92.29C960.00 81.42 1056.00 59.14 1152.00 64.55C1248.00 69.96 1344.00 102.90 1392.00 119.93L1440.00 136.96L1440.00 320.00L1392.00 320.00C1344.00 320.00 1248.00 320.00 1152.00 320.00C1056.00 320.00 960.00 320.00 864.00 320.00C768.00 320.00 672.00 320.00 576.00 320.00C480.00 320.00 384.00 320.00 288.00 320.00C192.00 320.00 96.00 320.00 48.00 320.00L0.00 320.00Z"
            fill="currentColor"
            className="text-eco-500"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 md:p-10 lg:p-12 mb-12 animate-scale-up">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                Stay updated with our newsletter
              </h3>
              <p className="text-muted-foreground mb-6 md:mb-0">
                Get the latest tips, updates, and eco-challenges delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-eco-500"
              />
              <Button className="bg-eco-500 hover:bg-eco-600 text-white rounded-full px-6 py-3 font-medium transition-all hover:-translate-y-1 duration-300 flex items-center">
                <span>Subscribe</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <Leaf className="h-8 w-8 text-eco-500 mr-2" />
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-eco-600 to-eco-400 bg-clip-text text-transparent">Sustainify</span>
            </div>
            <p className="text-muted-foreground mb-6">
              The all-in-one platform for tracking your health, sustainability efforts, 
              and making a positive impact on the planet.
            </p>
            <div className="flex space-x-4">
              <FooterLink href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-eco-500/10">
                <Instagram className="w-5 h-5" />
              </FooterLink>
              <FooterLink href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-eco-500/10">
                <Twitter className="w-5 h-5" />
              </FooterLink>
              <FooterLink href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-eco-500/10">
                <Facebook className="w-5 h-5" />
              </FooterLink>
              <FooterLink href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-eco-500/10">
                <Youtube className="w-5 h-5" />
              </FooterLink>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Features</h4>
            <ul className="space-y-4">
              <li><FooterLink href="#">Health Tracking</FooterLink></li>
              <li><FooterLink href="#">Eco-Habits Monitoring</FooterLink></li>
              <li><FooterLink href="#">AI Recommendations</FooterLink></li>
              <li><FooterLink href="#">Progress Analytics</FooterLink></li>
              <li><FooterLink href="#">Community Challenges</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><FooterLink href="#">Blog</FooterLink></li>
              <li><FooterLink href="#">Help Center</FooterLink></li>
              <li><FooterLink href="#">Contact Support</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <div className="space-y-4">
              <a href="mailto:hello@sustainify.com" className="flex items-center text-foreground/70 hover:text-eco-500 transition-colors">
                <Mail className="w-5 h-5 mr-3" />
                hello@sustainify.com
              </a>
              <p className="text-muted-foreground">
                123 Green Street <br />
                Eco City, EC 12345 <br />
                United States
              </p>
              <Button variant="outline" className="border-eco-500 text-eco-500 hover:bg-eco-500/10 rounded-full px-6 py-2 mt-2">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Sustainify. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <FooterLink href="#" className="text-sm">Privacy</FooterLink>
            <FooterLink href="#" className="text-sm">Terms</FooterLink>
            <FooterLink href="#" className="text-sm">Cookies</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
