import React from 'react';
import { Ghost, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

const PageNotFound = () => {
  const [position, setPosition] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => (prev === 0 ? 10 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div 
          className="mb-8 transition-transform duration-1500 ease-in-out"
          style={{ transform: `translateY(${position}px)` }}
        >
          <Ghost className="w-24 h-24 mx-auto text-gray-900" />
        </div>

        <h1 className="text-8xl font-bold text-gray-900 animate-pulse">
          Oops!
        </h1>

        <div className="mt-4 space-y-4">
          <p className="text-2xl font-medium text-gray-800">
            Looks like this is not available!
          </p>
          <p className="text-gray-600 max-w-md mx-auto">
            Don't worry, it happens to the best of us. Why not head back home and start fresh?
          </p>
        </div>

        <p className="mt-12 text-sm text-gray-500">
          Fun fact: You've discovered our secret page! 
          Unfortunately, it's just a 404 error. 🙈
        </p>
      </div>
    </div>
  );
};

export default PageNotFound;