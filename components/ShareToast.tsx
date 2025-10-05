import React from 'react';

const ClipboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-accent1 shrink-0">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

const ShareToast: React.FC = () => {
  return (
    <div 
        className="fixed bottom-6 inset-x-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 bg-surface text-primary p-4 rounded-lg border border-border shadow-2xl shadow-black/40 flex items-center z-[60] animate-fade-in-up"
        role="alert"
        aria-live="assertive"
    >
      <ClipboardIcon />
      <p className="font-semibold text-sm">Match URL copied to clipboard!</p>
    </div>
  );
};

export default ShareToast;