import React, { useState } from 'react';
import { ChevronRight, Users, CreditCard, LayoutDashboard, CheckCircle, X } from 'lucide-react';

const LandingPage = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const features = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Employee Management",
      description: "Easily add, update, and manage employee status through an intuitive admin dashboard",
      stats: "500+ Companies Trust Us"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      title: "Payment Processing",
      description: "Handle payroll payments securely and efficiently with automated processing",
      stats: "99.9% Accuracy Rate"
    },
    {
      icon: <LayoutDashboard className="h-6 w-6 text-blue-600" />,
      title: "Unified Dashboard",
      description: "Access all payroll features and reports from a centralized admin dashboard",
      stats: "30% Time Saved"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
     
      {/* Hero Section with Background Image */}
        <div className="relative py-20 overflow-hidden pt-[200px]"
             style={{
           backgroundImage: "url('/man.jpeg')", // Replace with your image path
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
             }}>
          <div className="absolute inset-0 bg-black bg-opacity-50" /> {/* Dark overlay */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center relative">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl font-bold text-white mb-6">
              Simplify Your 
              <span className="text-blue-400"> Payroll </span>
              Management
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Streamline employee management and payments in one powerful dashboard
            </p>
          </div>

          {/* Stats */}
          <div className="w-full mt-16 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">10k+</div>
              <div className="text-gray-200">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">99.9%</div>
              <div className="text-gray-200">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">30%</div>
              <div className="text-gray-200">Time Saved</div>
            </div>
          </div>
            </div>
          </div>
        </div>

        {/* Features Section with Hover Effects */}
      <div className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: hoveredFeature === index ? '#F8FAFF' : 'white',
                boxShadow: hoveredFeature === index ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
              }}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="text-blue-600 font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {feature.stats}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-4xl w-full mx-4 relative">
            <button 
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
              <iframe
                src="https://www.youtube.com/embed/your-video-id"
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">paieSouple</h3>
            <p className="text-gray-600">Simplifying payroll management for businesses worldwide.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#demo">Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;