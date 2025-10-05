import React from 'react';

interface UpdateNotificationProps {
  onUpdate: () => void;
  onDismiss: () => void;
}

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-accent1 shrink-0"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8"/><path d="M21 22v-6h-6"/><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"/></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);


const UpdateNotification: React.FC<UpdateNotificationProps> = ({ onUpdate, onDismiss }) => {
  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm bg-surface text-primary p-4 rounded-lg border border-border shadow-2xl shadow-black/40 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between z-[60] animate-fade-in-up">
      <div className="flex items-center">
        <RefreshIcon />
        <p className="font-semibold">Schedule has been updated!</p>
      </div>
      <div className="flex items-center gap-2 self-stretch sm:self-auto">
        <button
          onClick={onUpdate}
          className="flex-grow px-4 py-1.5 bg-accent1 hover:bg-accent1/90 rounded-md text-sm font-bold text-white transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={onDismiss}
          className="p-1.5 text-secondary hover:text-primary hover:bg-surface-hover rounded-full transition-colors shrink-0"
          aria-label="Dismiss notification"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default UpdateNotification;