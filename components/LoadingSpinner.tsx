import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-surface-hover rounded-full animate-spin border-t-accent1"></div>
      <p className="mt-4 text-lg text-secondary tracking-widest">LOADING...</p>
    </div>
  );
};