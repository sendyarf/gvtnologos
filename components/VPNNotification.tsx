import React from 'react';

interface VPNNotificationProps {
  onClose: () => void;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent1 shrink-0">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const VPNNotification: React.FC<VPNNotificationProps> = ({ onClose }) => {
  return (
    <div className="animate-fade-in-down mb-6 relative overflow-hidden rounded-lg border border-accent1/20 bg-accent1/5 p-4">
      <div className="flex items-start gap-3 pr-8">
        <InfoIcon />
        <div className="flex-1">
          <p className="text-sm text-primary font-medium">Stream not loading or blocked?</p>
          <p className="text-sm text-secondary mt-1">
            Try using <a href="https://1.1.1.1" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:text-accent2 hover:underline font-semibold transition-colors">Cloudflare WARP (1.1.1.1)</a> or a VPN to bypass restrictions and improve connectivity.
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 text-secondary hover:text-primary hover:bg-surface-hover rounded-full transition-colors"
        aria-label="Close notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export default VPNNotification;