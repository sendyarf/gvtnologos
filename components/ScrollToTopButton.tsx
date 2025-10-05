import React from 'react';

interface ScrollToTopButtonProps {
  onClick: () => void;
}

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
);

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-surface text-secondary border border-border p-3 rounded-full shadow-lg shadow-black/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl hover:bg-surface-hover hover:text-accent1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent1/50 z-50 animate-fade-in"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
    </button>
  );
};

export default ScrollToTopButton;