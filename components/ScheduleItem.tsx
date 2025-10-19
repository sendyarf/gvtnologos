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

  // Check if the 'live' status comes from manual data entry.
  const isManuallyLive = isLive && (
      ['live', 'Live', 'LIVE'].includes(match.kickoff_time) ||
      ['live', 'Live', 'LIVE'].includes(match.match_time)
  );

  let formattedTime = 'TBD';
  let formattedDate = '';

  // Per user request, schedule list display should use kickoff_date and kickoff_time
  const kickoffDate = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`);

  if (!isNaN(kickoffDate.getTime())) {
      formattedTime = kickoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      formattedDate = kickoffDate.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
  }

  const itemClasses = `group bg-surface border border-border rounded-lg p-3 md:p-4 transition-all duration-300 flex items-center gap-3 md:gap-4 cursor-pointer hover:bg-surface-hover hover:border-accent1/30`;

  return (
    <div
      onClick={() => onSelect(match)}
      className={itemClasses}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(match)}
    >
      {/* Time/Status Column */}
      <div className="flex flex-col items-center justify-center w-20 md:w-24 text-center shrink-0 h-14">
        {isManuallyLive ? (
            <div className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-accent2 bg-accent2/10 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent2"></span>
              </span>
              <span>LIVE</span>
            </div>
        ) : (
            <>
                <p className="text-lg md:text-xl font-semibold text-primary">{formattedTime}</p>
                {isLive ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-accent2 bg-accent2/10 rounded-full">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
                      </span>
                      <span>LIVE</span>
                    </div>
                ) : (
                    <p className="text-xs text-secondary uppercase tracking-wider">{formattedDate}</p>
                )}
            </>
        )}
      </div>
      
      {/* Teams & League Column */}
      <div className="flex-grow min-w-0">
        {match.team2?.name ? (
            <div className="flex flex-col md:flex-row md:items-center text-center">
              <p className="text-base md:text-lg font-bold text-primary truncate md:text-right md:flex-1">{match.team1?.name || 'TBA'}</p>
              <span className="text-secondary font-mono text-xs md:text-sm my-0.5 md:my-0 md:mx-4">vs</span>
              <p className="text-base md:text-lg font-bold text-primary truncate md:text-left md:flex-1">{match.team2?.name || 'TBA'}</p>
            </div>
        ) : (
            <div className="text-center">
                <p className="text-base md:text-lg font-bold text-primary truncate">{match.team1?.name || 'TBA'}</p>
            </div>
        )}
        <p className="text-sm text-center text-secondary mt-1 truncate">{match.league || 'Unknown League'}</p>
      </div>
    </div>
  );
};

export default ScheduleItem;
