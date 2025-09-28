
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-400"></div>
      <p className="mt-4 text-lg text-slate-300">Loading Matches...</p>
    </div>
  );
};
