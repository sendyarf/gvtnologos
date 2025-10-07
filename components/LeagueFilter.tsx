import React from 'react';

interface LeagueFilterProps {
  leagues: string[];
  selectedLeague: string | null;
  onSelect: (league: string | null) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({ leagues, selectedLeague, onSelect }) => {
  const filterOptions = ['All', ...leagues];

  return (
    <div className="mb-8 -mx-4 px-4">
        <div className="flex space-x-2 pb-2 overflow-x-auto whitespace-nowrap" style={{'scrollbarWidth': 'none', 'msOverflowStyle': 'none', 'WebkitOverflowScrolling': 'touch'}}>
            <style>
            {`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}
            </style>
            {filterOptions.map((league) => {
                const isAllButton = league === 'All';
                const isActive = isAllButton ? selectedLeague === null : selectedLeague === league;

                return (
                    <button
                        key={league}
                        onClick={() => onSelect(isAllButton ? null : league)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                            isActive
                            ? 'bg-gradient-to-br from-accent1 to-accent2 text-white border-transparent shadow-md'
                            : 'bg-surface border-border text-secondary hover:bg-surface-hover hover:text-primary'
                        }`}
                    >
                        {league}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default LeagueFilter;
