import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Match } from './types';
import ScheduleList from './components/ScheduleList';
import PlayerView from './components/PlayerView';
import { LoadingSpinner } from './components/LoadingSpinner';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useScheduleUpdater } from './hooks/useScheduleUpdater';
import UpdateNotification from './components/UpdateNotification';
import { getMatchStatus } from './utils/date';
import ShareToast from './components/ShareToast';
import LeagueFilter from './components/LeagueFilter';

const SCHEDULE_URL = 'https://weekendsch.pages.dev/sch/schedule.json';

const POPULAR_LEAGUES = [
    'UEFA Champions League',
    'England - Premier League',
    'Spain - La Liga',
    'Italy - Serie A',
    'Germany - Bundesliga',
    'France - Ligue 1'
];

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const ClearIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const DonateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"></path></svg>
);


const App: React.FC = () => {
  const [schedule, setSchedule] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const initialUrlChecked = useRef(false);
  

  const fetchSchedule = useCallback(async () => {
    // Only show initial loading spinner, not for background refreshes
    if (!schedule.length) {
      setLoading(true);
    }
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

          // 1. Sort by status (live > upcoming)
          if (statusA !== statusB) {
            return statusPriority[statusA] - statusPriority[statusB];
          }

          // 2. If status is the same, sort by date (both for 'live' and 'upcoming')
          const getSortableDate = (match: Match) => {
            // Prioritize match_date/time as it's used for countdown
            let date = new Date(`${match.match_date}T${match.match_time}:00+07:00`);
            if (!isNaN(date.getTime())) {
                return date;
            }
            // Fallback to kickoff_date/time
            date = new Date(`${match.kickoff_date}T${match.kickoff_time}:00+07:00`);
            if (!isNaN(date.getTime())) {
                return date;
            }
            return null; // Should not happen with valid data
          };
    
          const dateA = getSortableDate(a);
          const dateB = getSortableDate(b);

          if (dateA && dateB) {
              return dateA.getTime() - dateB.getTime();
          }

          return 0;
        });
        
      setSchedule(sortedData);
      
      setSelectedMatch(currentMatch => {
        if (!currentMatch) return null;
        const updatedMatch = sortedData.find(m => m.id === currentMatch.id);
        return updatedMatch || null;
      });

    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to fetch schedule: ${e.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [schedule.length]);
  
  const { isUpdateAvailable, triggerUpdate, dismissUpdate } = useScheduleUpdater(fetchSchedule);


  useEffect(() => {
    fetchSchedule();
    
    const handlePopState = () => {
        const path = window.location.pathname;
        if (path === '/') {
            setSelectedMatch(null);
        } else {
            const matchId = path.substring(1);
            // We need to wait for schedule to be loaded, this is handled in another useEffect
            // This is mainly for browser back/forward buttons
            setSchedule(currentSchedule => {
                const matchFromUrl = currentSchedule.find(m => m.id === matchId);
                if (matchFromUrl) {
                    setSelectedMatch(matchFromUrl);
                }
                return currentSchedule;
            });
        }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
        window.removeEventListener('popstate', handlePopState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle direct URL access
  useEffect(() => {
    if (schedule.length > 0 && !initialUrlChecked.current) {
      const path = window.location.pathname;
      if (path !== '/') {
        const matchId = path.substring(1);
        const matchFromUrl = schedule.find(m => m.id === matchId);
        if (matchFromUrl) {
          setSelectedMatch(matchFromUrl);
        }
      }
      initialUrlChecked.current = true;
    }
  }, [schedule]);


    useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsScrollButtonVisible(true);
      } else {
        setIsScrollButtonVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSchedule(currentSchedule => {
        const updatedSchedule = currentSchedule.filter(match => getMatchStatus(match) !== 'past');
        if (updatedSchedule.length !== currentSchedule.length) {
          return updatedSchedule;
        }
        return currentSchedule;
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSelectMatch = (match: Match) => {
    setSelectedMatch(match);
    window.history.pushState({}, '', `/${match.id}`);
    window.scrollTo(0, 0);
  };

  const handleBackToSchedule = () => {
    setSelectedMatch(null);
    window.history.pushState({}, '', '/');
  };
  
  const handleLogoClick = () => {
    if (selectedMatch) {
      handleBackToSchedule();
    } else {
       window.history.pushState({}, '', '/');
    }
    setSearchQuery('');
    setSelectedLeague(null);
    fetchSchedule();
  }

  const handleShareSuccess = () => {
    setShowCopyToast(true);
    setTimeout(() => {
        setShowCopyToast(false);
    }, 3000);
  };

  const filteredMatches = schedule
    .filter(match => !selectedLeague || (match.league || '').toLowerCase() === selectedLeague.toLowerCase())
    .filter(match => {
        const query = searchQuery.toLowerCase();
        return (match.team1?.name || '').toLowerCase().includes(query) ||
            (match.team2?.name || '').toLowerCase().includes(query) ||
            (match.league || '').toLowerCase().includes(query)
    });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[calc(100vh-250px)]">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-250px)] text-center text-warning">
            <p className="text-xl font-medium mb-2">{error}</p>
            <p className="text-secondary mb-6">There was an issue loading the schedule. Please try again.</p>
            <button
                onClick={() => fetchSchedule()}
                className="mt-4 px-5 py-2.5 bg-accent1/10 text-accent1 border border-accent1/30 rounded-lg font-semibold hover:bg-accent1 hover:text-white transition-all duration-300"
            >
                Try Again
            </button>
        </div>
      );
    }
    
    if (selectedMatch) {
      return (
        <PlayerView match={selectedMatch} onBack={handleBackToSchedule} onRefresh={fetchSchedule} onShareSuccess={handleShareSuccess} />
      );
    }

    return (
      <>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search for team, league..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg py-3 pl-11 pr-10 text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent1/50 focus:border-accent1/50 transition-all"
            aria-label="Search matches"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="text-secondary" />
          </div>
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 focus:outline-none focus:ring-2 focus:ring-secondary/50 rounded-full group"
                aria-label="Clear search"
              >
                <ClearIcon className="text-secondary group-hover:text-primary transition-colors" />
              </button>
            </div>
          )}
        </div>
        <LeagueFilter
            leagues={POPULAR_LEAGUES}
            selectedLeague={selectedLeague}
            onSelect={setSelectedLeague}
        />
        <ScheduleList matches={filteredMatches} onSelectMatch={handleSelectMatch} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-primary font-sans">
      <header className="bg-background/80 backdrop-blur-lg border-b border-border/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold cursor-pointer" onClick={handleLogoClick}>
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-accent1 to-accent2">GOVOET</span>
          </h1>
          <div className="flex items-center space-x-1">
            <a
              href="https://t.me/FootySch"
              target="_blank"
              rel="noopener noreferrer"
              title="Join Telegram"
              className="p-2 rounded-lg text-secondary hover:text-accent1 hover:bg-surface transition-colors"
            >
              <TelegramIcon />
            </a>
            <a
              href="https://saweria.co/JustFutball"
              target="_blank"
              rel="noopener noreferrer"
              title="Donate"
              className="p-2 rounded-lg text-secondary hover:text-accent2 hover:bg-surface transition-colors"
            >
              <DonateIcon />
            </a>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <footer className="text-center py-8 text-secondary/80 text-xs border-t border-border mt-8">
        <p>All streams are provided by third parties. We do not host any content.</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} GOVOET. All Rights Reserved.</p>
      </footer>
      {isUpdateAvailable && <UpdateNotification onUpdate={triggerUpdate} onDismiss={dismissUpdate} />}
      {isScrollButtonVisible && <ScrollToTopButton onClick={scrollToTop} />}
      {showCopyToast && <ShareToast />}
    </div>
  );
};

export default App;