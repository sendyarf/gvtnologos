import React from 'react';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-400">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);

interface AdBlockNotificationProps {
  onClose: () => void;
}

const AdBlockNotification: React.FC<AdBlockNotificationProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed bottom-0 inset-x-0 bg-amber-500/10 backdrop-blur-md border-t border-amber-500/30 z-[60] animate-fade-in-up"
        role="alert"
        aria-live="assertive"
    >
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <ShieldIcon />
            <div className="flex-grow">
                <h3 className="font-bold text-amber-300">Ad Blocker Detected</h3>
                <p className="text-sm text-amber-300/80 mt-1">
                    Please consider disabling your ad blocker on this site. Ads help us keep the servers running and provide free streams.
                </p>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-amber-300/70 hover:text-amber-300 hover:bg-white/10 rounded-full transition-colors shrink-0 absolute top-3 right-3 sm:static"
                aria-label="Dismiss notification"
            >
                <CloseIcon />
            </button>
        </div>
    </div>
  );
};

export default AdBlockNotification;