import React from 'react';

interface UpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onUpdate, onDismiss }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-md sm:left-auto sm:right-6 sm:-translate-x-0 sm:w-full sm:max-w-sm bg-surface text-primary p-4 rounded-lg shadow-2xl flex items-center justify-between z-[60] animate-fade-in-up">
      <div className="flex items-center">
        <RefreshIcon />
        <p className="font-semibold">New schedule available!</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onUpdate}
          className="px-3 py-1 bg-accent1 hover:opacity-90 rounded-md text-sm font-bold text-background transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={onDismiss}
          className="p-1 text-secondary hover:text-primary rounded-full transition-colors"
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;