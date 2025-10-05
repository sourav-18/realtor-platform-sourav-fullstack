// src/components/layout/Footer.jsx
import React from 'react';
import { Home, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">RealtorPro</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters in one platform.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@realtorpro.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="block text-gray-300 hover:text-white transition">
                Browse Properties
              </a>
              <a href="/about" className="block text-gray-300 hover:text-white transition">
                About Us
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; 2025 RealtorPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;