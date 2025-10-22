import React from 'react';
import type { Match } from '../types';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  pinnedMatchIds: string[];
  onTogglePin: (matchId: string) => void;
}

const NoMatchesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-border">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="13.5" y1="8.5" x2="8.5" y2="13.5"></line>
        <line x1="8.5" y1="8.5" x2="13.5" y2="13.5"></line>
    </svg>
);


const ScheduleList: React.FC<ScheduleListProps> = ({ matches, onSelectMatch, pinnedMatchIds, onTogglePin }) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-24 flex flex-col items-center border border-dashed border-border rounded-lg">
        <NoMatchesIcon />
        <h2 className="text-xl font-semibold text-primary mt-6">No Matches Found</h2>
        <p className="text-secondary mt-2">Your search did not return any results. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match, index) => (
        <div key={match.id} style={{ animationDelay: `${index * 50}ms`}} className="animate-fade-in-up opacity-0">
          <ScheduleItem 
            match={match} 
            onSelect={onSelectMatch} 
            isPinned={pinnedMatchIds.includes(match.id)}
            onTogglePin={onTogglePin}
          />
        </div>
      ))}
    </div>
  );
};

export default ScheduleList;
