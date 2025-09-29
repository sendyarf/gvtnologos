import React from 'react';
import type { Match } from '../types';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

const SearchIconLarge = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="absolute -top-10 left-1/2 -translate-x-1/2 h-64 w-64 text-surface-hover -z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


const ScheduleList: React.FC<ScheduleListProps> = ({ matches, onSelectMatch }) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-20 relative overflow-hidden">
        <SearchIconLarge />
        <h2 className="text-2xl font-bold text-primary">No Matches Found</h2>
        <p className="text-secondary mt-2">Try adjusting your search or check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <ScheduleItem key={match.id} match={match} onSelect={onSelectMatch} />
      ))}
    </div>
  );
};

export default ScheduleList;