import React from 'react';
import { AlertCircle } from 'lucide-react';

const NoPaymentsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg pt-20 m-10 border border-gray-200 my-6">
      <div className="flex items-center justify-center bg-gray-100 p-4 rounded-full mb-4">
        <AlertCircle size={32} className="text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
      <p className="text-gray-500 text-center mb-6">We couldn't find any payments associated with your account.</p>
      <button className="px-4 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        Make a payment
      </button>
    </div>
  );
};

export default NoPaymentsFound;