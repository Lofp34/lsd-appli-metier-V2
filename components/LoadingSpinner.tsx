import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center my-6">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
  </div>
);

export default LoadingSpinner;
