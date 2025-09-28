import React from 'react';
import type { Match } from '../types';

interface ScheduleItemProps {
  match: Match;
  onSelect: (match: Match) => void;
}

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 inline-block text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TvIcon = ({ isLive }: { isLive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-auto text-slate-400 transition-colors ${isLive ? 'group-hover:text-teal-300' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

  let formattedTime = '';
  let formattedDate = '';

  if (!isLive) {
    // Append '+07:00' to parse the date string as Jakarta time (WIB/UTC+7).
    // toLocaleTimeString/toLocaleDateString will then automatically convert it to the user's local timezone for display.
    const kickoffDate = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`);
    if (!isNaN(kickoffDate.getTime())) {
        formattedTime = kickoffDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        formattedDate = kickoffDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    }
  }

  const itemClasses = `group bg-slate-800 rounded-lg p-4 border transition-all duration-300 shadow-md flex items-center ${
    isLive
      ? 'cursor-pointer hover:bg-slate-700/50 hover:shadow-lg border-red-500/50'
      : 'cursor-not-allowed opacity-70 border-transparent'
  }`;

  return (
    <div
      onClick={isLive ? () => onSelect(match) : undefined}
      className={itemClasses}
      aria-disabled={!isLive}
    >
      <div className="flex flex-col md:flex-row md:items-center w-full">
        <div className="w-full md:w-1/3 mb-2 md:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-teal-400">{match.league}</p>
          </div>
          {isLive ? (
            <div className="flex items-center">
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE NOW
              </span>
            </div>
          ) : (
             <p className="text-xs text-slate-400 flex items-center">
                <ClockIcon />
                {formattedDate && formattedTime ? `${formattedDate}, ${formattedTime}` : 'Time TBD'}
            </p>
          )}
        </div>

        <div className="w-full md:w-2/3 flex items-center">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full">
             <h3 className="text-base md:text-lg font-bold text-gray-100 tracking-wide text-center w-full">
                {match.team1.name} <span className="text-slate-400 mx-2">vs</span> {match.team2.name}
            </h3>
          </div>
        </div>
      </div>
      <TvIcon isLive={isLive} />
    </div>
  );
};

export default ScheduleItem;