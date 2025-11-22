import React from 'react';

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent2 shrink-0">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
);

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 transition-opacity">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

const PromoCard: React.FC = () => {
  return (
    <a
      href="http://himawarinovel.my.id/"
      target="_blank"
      rel="noopener noreferrer"
      className="group block mt-4 relative overflow-hidden rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-accent2/50 hover:shadow-lg hover:shadow-accent2/10"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
            <div className="mt-1 bg-accent2/10 p-2 rounded-lg group-hover:bg-accent2/20 transition-colors">
                <BookIcon />
            </div>
            <div>
                <h4 className="text-sm font-bold text-primary group-hover:text-accent2 transition-colors">
                    Himawari Novel
                </h4>
                <p className="text-xs text-secondary mt-1 leading-relaxed">
                    Read translated English novels for free.
                </p>
            </div>
        </div>
        <ExternalLinkIcon />
      </div>
    </a>
  );
};

export default PromoCard;