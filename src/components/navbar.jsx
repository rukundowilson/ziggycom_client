import React, { useState, useEffect } from 'react';
import { Menu, X, UserPlus, LogIn, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

const NavBar = () => {
  const Navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path) => {
    Navigate(path);
    console.log(`Navigating to: ${path}`);
  };

  return (
    <nav style={{zIndex: {
      '9999': '9999',
    }}} className={`fixed  w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-700/95 backdrop-blur-sm shadow-lg' : 'bg-gray-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
              className="text-white font-bold text-2xl hover:text-blue-400 transition-colors"
            >
              Ziggy

            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
              className="text-gray-300 hover:text-white flex items-center space-x-2 transition-colors py-2 px-3 rounded-lg hover:bg-gray-800"
            >
              <Home size={18} />
              <span>Home</span>
            </a>
            
            <a 
              href="/register" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/register');
              }}
              className="text-gray-300 hover:text-white flex items-center space-x-2 transition-colors py-2 px-3 rounded-lg hover:bg-gray-800"
            >
              <UserPlus size={18} />
              <span>Register</span>
            </a>
            
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/login');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <LogIn size={18} />
              <span>Login</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-56 opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="pt-2 pb-4 space-y-2">
            <a 
              href="/" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Home size={18} />
                <span>Home</span>
              </div>
            </a>
            
            <a 
              href="/register" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/register');
              }}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <UserPlus size={18} />
                <span>Register</span>
              </div>
            </a>
            
            <a 
              href="/login" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/login');
              }}
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <LogIn size={18} />
                <span>Login</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;