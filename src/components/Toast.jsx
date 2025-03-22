import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  const borderColor = type === 'error' ? 'border-red-200' : 'border-green-200';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor} ${borderColor} text-center flex items-center justify-between min-w-[320px]`}>
      <div>
        <p className={`${textColor} font-medium`}>{message} </p>
                                         {/* {renderError('country')} */}
    <p><small className={`${textColor} font-small block`} >resetting in {duration/1000}s</small></p>
      </div>
      <br />
      
      <button 
        onClick={onClose}
        className={`${textColor} hover:opacity-70 transition-opacity ml-4`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;