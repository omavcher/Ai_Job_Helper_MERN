// LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 z-[9999999999999999] flex justify-center items-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-solid border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="absolute top-20 left-1/2 transform -translate-x-1/2 text-lg text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
