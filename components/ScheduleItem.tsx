import React from 'react';
import type { Match } from '../types';

interface ScheduleItemProps {
  match: Match;
  onSelect: (match: Match) => void;
}

const TvIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary group-hover:text-accent1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);


const getIsLive = (match: Match): boolean => {
    if (
        match.kickoff_date === 'live' ||
        match.match_date === 'live' ||
        match.kickoff_time === 'live' ||
        match.match_time === 'live' ||
        match.duration === 'live'
    ) {
        return true;
    }
    const now = new Date();
    // Append '+07:00' to correctly parse as Jakarta time.
    const matchStart = new Date(`${match.match_date}T${match.match_time}:00+07:00`);
    if (isNaN(matchStart.getTime())) return false;

    const durationHours = parseFloat(match.duration);
    if (isNaN(durationHours)) return false;

    const matchEnd = new Date(matchStart.getTime() + durationHours * 60 * 60 * 1000);
    return now >= matchStart && now <= matchEnd;
};


const ScheduleItem: React.FC<ScheduleItemProps> = ({ match, onSelect }) => {
  const isLive = getIsLive(match);

  let formattedTime = 'TBD';
  let formattedDate = '';

  if (!isLive) {
    const kickoffDate = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`);
    if (!isNaN(kickoffDate.getTime())) {
        formattedTime = kickoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        formattedDate = kickoffDate.toLocaleDateString([], { weekday: 'short' });
    }
  }

  const itemClasses = `group bg-surface rounded-xl p-4 transition-all duration-300 shadow-md flex items-center gap-4 ${
    isLive
      ? 'cursor-pointer hover:bg-surface-hover hover:shadow-xl hover:-translate-y-1 border-l-4 border-accent2'
      : 'cursor-not-allowed opacity-60 border-l-4 border-transparent'
  }`;

  return (
    <div
      onClick={isLive ? () => onSelect(match) : undefined}
      className={itemClasses}
      aria-disabled={!isLive}
    >
      {/* Time/Status Column */}
      <div className="flex flex-col items-center justify-center w-20 text-center">
        {isLive ? (
          <div className="flex flex-col items-center gap-1">
            <span className="bg-accent2 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 shadow-md shadow-accent2/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </span>
          </div>
        ) : (
          <>
            <p className="text-lg font-bold text-primary">{formattedTime}</p>
            <p className="text-xs text-secondary">{formattedDate}</p>
          </>
        )}
      </div>

      {/* Teams & League Column */}
      <div className="flex-grow">
        <div className="flex items-center text-center">
          <p className="flex-1 text-base md:text-lg font-bold text-primary text-right truncate">{match.team1.name}</p>
          <span className="text-secondary font-mono text-xs mx-3">VS</span>
          <p className="flex-1 text-base md:text-lg font-bold text-primary text-left truncate">{match.team2.name}</p>
        </div>
        <p className="text-sm text-center font-semibold text-secondary mt-1 truncate">{match.league}</p>
      </div>

      {/* Watch Icon Column */}
      {isLive && (
        <div className="w-12 flex items-center justify-center">
          <TvIcon />
        </div>
      )}
    </div>
  );
};

export default ScheduleItem;