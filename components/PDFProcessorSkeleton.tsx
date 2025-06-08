import React from 'react';

const PDFProcessorSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="w-full h-12 bg-gray-300 rounded-md flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gray-400 rounded"></div>
        <div className="w-32 h-4 bg-gray-400 rounded"></div>
      </div>
    </div>
    <div className="text-center text-sm text-gray-500">
      Chargement du processeur PDF...
    </div>
  </div>
);

export default PDFProcessorSkeleton; 