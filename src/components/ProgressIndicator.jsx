import React from 'react';
import { useState, useEffect } from 'react';
import { Check, User, Lock, Send } from 'lucide-react';

const StepIndicator = ({ currentStep = 1 }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const steps = [
    { number: 1, label: 'Company profile', icon: User },
    { number: 2, label: 'Admin Setup', icon: Lock },
    { number: 3, label: 'Confirmation', icon: Send }
  ];

  const getStepColor = (stepNumber) => {
    if (currentStep > stepNumber) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (currentStep === stepNumber) return 'bg-gradient-to-r from-green-400 to-green-500';
    return 'bg-gray-100';
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-[100px]">
        <div className="bg-gray-700 text-white p-4">
    {/* Header */}
    <div className="flex items-center space-x-4">
        
        <div>
            <h1 className="text-2xl font-bold">Ziggycom</h1>
            <p className="text-sm text-blue-100"><a href="/login">already have an account? <span className='text-2xl text-white hover:text-green-500 font-bold'> login</span></a></p>
        </div>
        </div>
    </div>
      <div className="relative border p-6 bg-white">
        {/* Progress bar background */}
        <div className="absolute h-1 bg-gray-200 top-1/2 -translate-y-1/2 left-0 right-0 rounded-full" />
        
        {/* Animated progress bar */}
        <div 
          className={`absolute h-1 bg-gradient-to-r from-green-500 to-green-600 top-1/2 -translate-y-1/2 left-0 rounded-full transition-all duration-500 ease-in-out`}
          style={{ 
            width: mounted ? `${((currentStep - 1) / (steps.length - 1)) * 100}%` : '0%'
          }}
        />

        {/* Steps container */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Circle with icon */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  shadow-sm transform transition-all duration-300 ease-in-out
                  ${getStepColor(step.number)}
                  ${isCurrent ? 'scale-110' : 'scale-100'}
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <StepIcon className={`w-6 h-6 ${isCurrent ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </div>

                {/* Label */}
                <div className={`
                  mt-4 flex flex-col items-center
                  transition-all duration-300
                  ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                  style={{ transitionDelay: `${(index * 100) + 150}ms` }}
                >
                  <span className={`text-sm font-semibold mb-1
                    ${isCurrent ? 'text-green-600' : isCompleted ? 'text-green-500' : 'text-gray-500'}
                  `}>
                    Step {step.number}
                  </span>
                  <span className={`text-xs
                    ${isCurrent ? 'text-gray-800' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
