import React from 'react';
import type { Match } from '../types';
import ScheduleItem from './ScheduleItem';

interface PinnedMatchesProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  pinnedMatchIds: string[];
  onTogglePin: (matchId: string) => void;
}

const PinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);


const PinnedMatches: React.FC<PinnedMatchesProps> = ({ matches, onSelectMatch, pinnedMatchIds, onTogglePin }) => {
  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
          <PinIcon />
          <h2 className="text-lg font-bold text-primary">Pinned Matches</h2>
      </div>
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id}>
            <ScheduleItem 
              match={match} 
              onSelect={onSelectMatch}
              isPinned={pinnedMatchIds.includes(match.id)}
              onTogglePin={onTogglePin}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedMatches;
