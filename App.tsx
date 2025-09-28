import React, { useState, useEffect, useCallback } from 'react';
import type { Match } from './types';
import ScheduleList from './components/ScheduleList';
import PlayerView from './components/PlayerView';
import { LoadingSpinner } from './components/LoadingSpinner';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useScheduleUpdater } from './hooks/useScheduleUpdater';
import UpdateNotification from './components/UpdateNotification';

const SCHEDULE_URL = 'https://weekendsch.pages.dev/sch/schedule.json';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ClearIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 2.005a9.995 9.995 0 100 19.99 9.995 9.995 0 000-19.99zm5.405 7.152l-2.071 9.692c-.15.706-.57 1.05-1.233.655l-4.72-3.478-2.28 2.193a.925.925 0 01-.72.316l.32-4.81 8.783-7.854c.38-.34-.078-.52-.6-.203l-10.85 6.78-4.66-1.453c-.7-.218-.71-.926.14-1.353l17.09-6.556c.58-.224 1.09.122.9 1.01z"></path>
    </svg>
);

const DonateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
);

const getMatchStatus = (match: Match): 'live' | 'upcoming' | 'past' => {
  if (
    match.kickoff_date === 'live' ||
    match.match_date === 'live' ||
    match.kickoff_time === 'live' ||
    match.match_time === 'live' ||
    match.duration === 'live'
  ) {
    return 'live';
  }

  const now = new Date();
  // By appending '+07:00', we specify the time is in Jakarta time (WIB/UTC+7).
  // The Date object will correctly represent this point in time, regardless of user's timezone.
  const matchStart = new Date(`${match.match_date}T${match.match_time}:00+07:00`);
  if (isNaN(matchStart.getTime())) return 'upcoming'; // Gracefully handle invalid date strings

  const durationHours = parseFloat(match.duration);
  if (isNaN(durationHours)) return 'upcoming'; // Fallback if duration is invalid

  const matchEnd = new Date(matchStart.getTime() + durationHours * 60 * 60 * 1000);

  if (now >= matchStart && now <= matchEnd) {
    return 'live';
  }
  if (now > matchEnd) {
    return 'past';
  }
  return 'upcoming';
};


const App: React.FC = () => {
  const [schedule, setSchedule] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
  const { isUpdateAvailable, reloadPage, dismissUpdate } = useScheduleUpdater();


  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SCHEDULE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Match[] = await response.json();

      const statusPriority = { live: 1, upcoming: 2, past: 3 };

      const sortedData = data
        .filter(match => getMatchStatus(match) !== 'past') // Filter out past matches
        .sort((a, b) => {
          const statusA = getMatchStatus(a);
          const statusB = getMatchStatus(b);

          if (statusA !== statusB) {
            return statusPriority[statusA] - statusPriority[statusB];
          }

          // This part only runs if both matches are 'upcoming'
          if (statusA === 'upcoming') {
            const dateA = new Date(`${a.match_date}T${a.match_time}:00+07:00`);
            const dateB = new Date(`${b.match_date}T${b.match_time}:00+07:00`);
            // Handle potential invalid dates in sorting
            if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
              return dateA.getTime() - dateB.getTime();
            }
          }
          return 0; // Keep original order if dates are invalid or status is not 'upcoming'
        });
        
      setSchedule(sortedData);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to fetch schedule: ${e.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsScrollButtonVisible(true);
      } else {
        setIsScrollButtonVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
  };

  const handleBackToSchedule = () => {
    setSelectedMatch(null);
  };

  const filteredMatches = schedule.filter(match =>
    match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.league.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-screen text-center text-red-400">
            <p className="text-xl">{error}</p>
            <button
                onClick={fetchSchedule}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
                Try Again
            </button>
        </div>
      );
    }
    
    if (selectedMatch) {
      return (
        <PlayerView match={selectedMatch} onBack={handleBackToSchedule} />
      );
    }

    return (
      <>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search for a team or league..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 pl-12 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            aria-label="Search matches"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-full"
                aria-label="Clear search"
              >
                <ClearIcon />
              </button>
            </div>
          )}
        </div>
        <ScheduleList matches={filteredMatches} onSelectMatch={handleSelectMatch} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-500 cursor-pointer" onClick={() => { handleBackToSchedule(); fetchSchedule(); }}>
            GOVOET
          </h1>
          <div className="flex items-center space-x-4">
            <a
              href="https://t.me/FootySch"
              target="_blank"
              rel="noopener noreferrer"
              title="Join Telegram"
              className="text-slate-400 hover:text-teal-300 transition-colors"
            >
              <TelegramIcon />
            </a>
            <a
              href="https://saweria.co/JustFutball"
              target="_blank"
              rel="noopener noreferrer"
              title="Donate"
              className="text-slate-400 hover:text-teal-300 transition-colors"
            >
              <DonateIcon />
            </a>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>All streams are provided by third parties. We do not host any content.</p>
      </footer>
      {isUpdateAvailable && <UpdateNotification onReload={reloadPage} onDismiss={dismissUpdate} />}
      {isScrollButtonVisible && <ScrollToTopButton onClick={scrollToTop} />}
    </div>
  );
};

export default App;