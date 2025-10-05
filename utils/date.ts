import type { Match } from '../types';

export const getMatchStatus = (match: Match): 'live' | 'upcoming' | 'past' => {
  // Manual override from data source
  if (
    ['live', 'Live', 'LIVE'].includes(match.kickoff_date) ||
    ['live', 'Live', 'LIVE'].includes(match.match_date) ||
    ['live', 'Live', 'LIVE'].includes(match.kickoff_time) ||
    ['live', 'Live', 'LIVE'].includes(match.match_time) ||
    ['live', 'Live', 'LIVE'].includes(match.duration)
  ) {
    return 'live';
  }

  const now = new Date();
  let matchStart: Date | null = null;

  // Try parsing match_date/time first, then fallback to kickoff_date/time
  const primaryDate = new Date(`${match.match_date}T${match.match_time}:00+07:00`);
  if (!isNaN(primaryDate.getTime())) {
    matchStart = primaryDate;
  } else {
    const secondaryDate = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`);
    if (!isNaN(secondaryDate.getTime())) {
      matchStart = secondaryDate;
    }
  }
  
  // If we couldn't parse any valid date, we can't determine the status, so treat as upcoming.
  if (!matchStart) {
    return 'upcoming';
  }

  // Handle duration parsing with a fallback
  let durationHours = parseFloat(match.duration);
  if (isNaN(durationHours) || durationHours <= 0) {
    durationHours = 3; // Assume a default 3-hour duration if data is invalid
  }

  const matchEnd = new Date(matchStart.getTime() + durationHours * 60 * 60 * 1000);

  if (now >= matchStart && now <= matchEnd) {
    return 'live';
  }
  if (now > matchEnd) {
    return 'past';
  }
  return 'upcoming';
};

export const getMatchStartDate = (match: Match): Date | null => {
    // Per user request, countdown should use match_date and match_time
    const matchStart = new Date(`${match.match_date}T${match.match_time}:00+07:00`);
    if (!isNaN(matchStart.getTime())) {
        return matchStart;
    }
    return null;
}