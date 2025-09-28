
import React from 'react';
import type { Match } from '../types';
import ScheduleItem from './ScheduleItem';

interface ScheduleListProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ matches, onSelectMatch }) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl text-slate-400">No Matches Found</h2>
        <p className="text-slate-500 mt-2">Try adjusting your search or check back later.</p>
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