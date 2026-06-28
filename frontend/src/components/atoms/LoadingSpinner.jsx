import React from 'react';

export const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      {message && <p className="text-xs text-gray-500 font-medium animate-pulse">{message}</p>}
    </div>
  );
};