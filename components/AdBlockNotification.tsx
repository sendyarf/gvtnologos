import React from 'react';

const ShieldAlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 mb-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
        <path d="M21 21v-5h-5"/>
    </svg>
);


const AdBlockNotification: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div 
        className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4 sm:p-6 border border-dashed border-amber-500/40"
        role="alert"
        aria-live="assertive"
    >
        <ShieldAlertIcon />
        <h3 className="text-lg sm:text-xl font-bold text-amber-300">Please Disable Your Ad Blocker</h3>
        <p className="text-sm text-amber-300/80 mt-2">
            To watch the stream, please disable your ad blocker for this site and then refresh the page.
        </p>
        <button
            onClick={handleRefresh}
            className="mt-6 flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-lg font-semibold hover:bg-amber-400 hover:text-background transition-all duration-300"
        >
            <RefreshIcon />
            Refresh Page
        </button>
    </div>
  );
};

export default AdBlockNotification;