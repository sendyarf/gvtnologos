import React from 'react';
import type { Match } from '../types';
import { getMatchStatus } from '../utils/date';

interface ScheduleItemProps {
  match: Match;
  onSelect: (match: Match) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ match, onSelect }) => {
  const status = getMatchStatus(match);
  const isLive = status === 'live';

  let formattedTime = 'TBD';
  let formattedDate = '';

  if (!isLive) {
    // Per user request, schedule list display should use kickoff_date and kickoff_time
    const kickoffDate = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`);

    if (!isNaN(kickoffDate.getTime())) {
        formattedTime = kickoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        formattedDate = kickoffDate.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
    }
  }

  const itemClasses = `group bg-surface border border-border rounded-lg p-3 md:p-4 transition-all duration-300 flex items-center gap-3 md:gap-6 cursor-pointer hover:bg-surface-hover hover:border-accent1/30`;

  return (
    <div
      onClick={() => onSelect(match)}
      className={itemClasses}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(match)}
    >
      {/* Time/Status Column */}
      <div className="flex flex-col items-center justify-center w-20 md:w-24 text-center shrink-0">
        {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1 font-semibold text-accent2 bg-accent2/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
              </span>
              <span className="text-sm">LIVE</span>
            </div>
        ) : (
          <>
            <p className="text-lg md:text-xl font-semibold text-primary">{formattedTime}</p>
            <p className="text-xs text-secondary uppercase tracking-wider">{formattedDate}</p>
          </>
        )}
      </div>
      
      {/* Teams & League Column */}
      <div className="flex-grow min-w-0">
        {match.team2.name ? (
            <div className="flex flex-col md:flex-row md:items-center text-center">
              <p className="text-base md:text-lg font-bold text-primary truncate md:text-right md:flex-1">{match.team1.name}</p>
              <span className="text-secondary font-mono text-xs md:text-sm my-0.5 md:my-0 md:mx-4">vs</span>
              <p className="text-base md:text-lg font-bold text-primary truncate md:text-left md:flex-1">{match.team2.name}</p>
            </div>
        ) : (
            <div className="text-center">
                <p className="text-base md:text-lg font-bold text-primary truncate">{match.team1.name}</p>
            </div>
        )}
        <p className="text-sm text-center text-secondary mt-1 truncate">{match.league}</p>
      </div>

      {/* Arrow right on hover */}
      <div className="w-12 flex items-center justify-end shrink-0 text-secondary group-hover:text-primary transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-300 group-hover:translate-x-1">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default ScheduleItem;