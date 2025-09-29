import React from 'react';

interface ScrollToTopButtonProps {
  onClick: () => void;
}

const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-br from-accent1 to-accent2 text-white p-3 rounded-full shadow-lg shadow-black/50 transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent1/50 z-50 animate-fade-in"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
    </button>
  );
};

export default ScrollToTopButton;