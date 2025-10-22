import React from 'react';
import type { Match } from '../types';
import { getMatchStatus } from '../utils/date';

interface ScheduleItemProps {
  match: Match;
  onSelect: (match: Match) => void;
  isPinned: boolean;
  onTogglePin: (matchId: string) => void;
}

const PinIcon = ({ isPinned }: { isPinned: boolean }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={`transition-all duration-200 ${isPinned ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-current'}`}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const ScheduleItem: React.FC<ScheduleItemProps> = ({ match, onSelect, isPinned, onTogglePin }) => {
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

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the onSelect from firing
    onTogglePin(match.id);
  };

  const itemClasses = `group bg-surface border border-border rounded-lg p-3 md:p-4 transition-all duration-300 flex items-center gap-3 md:gap-4`;

  return (
    <div className={itemClasses}>
      <div
        onClick={() => onSelect(match)}
        className="flex-grow flex items-center gap-3 md:gap-4 cursor-pointer min-w-0"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(match)}
      >
        {/* Time/Status Column */}
        <div className="flex flex-col items-center justify-center w-20 md:w-24 text-center shrink-0">
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
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-primary">{formattedTime}</p>
                    {isLive ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-accent2 bg-accent2/10 rounded-full mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
                        </span>
                        <span>LIVE</span>
                        </div>
                    ) : (
                        <p className="text-xs text-secondary uppercase tracking-wider mt-1">{formattedDate}</p>
                    )}
                </>
            )}
        </div>
        
        {/* Teams & League Column */}
        <div className="flex-grow min-w-0">
            {match.team2?.name ? (
                <div className="flex flex-col md:flex-row md:items-center text-center">
                <p className="text-sm sm:text-base md:text-lg font-bold text-primary md:text-right md:flex-1">{match.team1?.name || 'TBA'}</p>
                <span className="text-secondary font-mono text-xs md:text-sm my-0.5 md:my-0 md:mx-4">vs</span>
                <p className="text-sm sm:text-base md:text-lg font-bold text-primary md:text-left md:flex-1">{match.team2?.name || 'TBA'}</p>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-primary">{match.team1?.name || 'TBA'}</p>
                </div>
            )}
            <p className="text-xs sm:text-sm text-center text-secondary mt-1">{match.league || 'Unknown League'}</p>
        </div>
      </div>

      {/* Pin Button */}
      <button 
        onClick={handlePinClick}
        className="p-3 shrink-0 text-secondary hover:text-amber-400 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label={isPinned ? 'Unpin match' : 'Pin match'}
        title={isPinned ? 'Unpin match' : 'Pin match'}
      >
        <PinIcon isPinned={isPinned} />
      </button>
    </div>
  );
};

export default ScheduleItem;