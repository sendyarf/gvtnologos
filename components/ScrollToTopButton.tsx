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
      className="fixed bottom-6 right-6 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 z-50"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
    </button>
  );
};

export default ScrollToTopButton;
