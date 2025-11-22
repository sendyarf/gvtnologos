
import React, { useState, useEffect } from 'react';
import type { Match } from '../types';
import { getMatchStatus, getMatchStartDate } from '../utils/date';
import CountdownTimer from './CountdownTimer';
import { copyMatchUrl } from '../utils/share';
import AdBlockNotification from './AdBlockNotification';
import PromoCard from './PromoCard';

interface PlayerViewProps {
  match: Match;
  onBack: () => void;
  onRefresh: () => void;
  onShareSuccess: () => void;
  isAdBlockerActive: boolean;
}

const PRIMARY_DOMAIN = 'multi.govoet.my.id';
const BACKUP_DOMAIN = '01.himawarinovel.my.id';

const BackArrowIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const ServersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
        <path d="M21 21v-5h-5"/>
    </svg>
);

const FixIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
);


const PlayerView: React.FC<PlayerViewProps> = ({ match, onBack, onRefresh, onShareSuccess, isAdBlockerActive }) => {
  const [currentServerUrl, setCurrentServerUrl] = useState<string>(match.servers[0]?.url || '');
  const [useBackupDomain, setUseBackupDomain] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const status = getMatchStatus(match);
  const isLive = status === 'live';
  const isUpcoming = status === 'upcoming';
  const matchDate = getMatchStartDate(match);

  // Reset backup domain state when manually changing servers from the list
  useEffect(() => {
    setUseBackupDomain(false);
  }, [currentServerUrl]);

  const handleCopyUrl = async () => {
    const copiedToClipboard = await copyMatchUrl(match);
    if (copiedToClipboard) {
      onShareSuccess();
    }
  };
  
  const handleRefreshStream = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleFixStream = () => {
    setUseBackupDomain(prev => !prev);
    setRefreshKey(prevKey => prevKey + 1);
  };

  const getDisplayUrl = (url: string) => {
    if (useBackupDomain && url.includes(PRIMARY_DOMAIN)) {
        return url.replace(PRIMARY_DOMAIN, BACKUP_DOMAIN);
    }
    // If we toggle back to primary (useBackupDomain is false), 
    // or if the URL doesn't contain the primary domain, return original.
    return url;
  };

  const activeUrl = getDisplayUrl(currentServerUrl);

  if (!match) return null;

  const renderPlayerContent = () => {
    if (isAdBlockerActive) {
      return <AdBlockNotification />;
    }
    
    if (isLive) {
      return activeUrl ? (
        <iframe
            key={`${activeUrl}-${refreshKey}`}
            src={activeUrl}
            title="Live Stream Player"
            className="w-full h-full"
            allow="encrypted-media; autoplay; fullscreen"
            allowFullScreen
            scrolling="no"
            onError={() => {
                // Attempt to auto-switch if iframe throws a catchable error (rare for cross-origin)
                if (!useBackupDomain) handleFixStream();
            }}
        ></iframe>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
            <p className="text-primary font-semibold text-lg">Select a Stream</p>
            <p className="text-secondary text-sm mt-1">Choose an available stream from the list to start watching.</p>
        </div>
      );
    }
    
    if (isUpcoming) {
      return matchDate ? (
        <CountdownTimer targetDate={matchDate} onCountdownFinish={onRefresh} />
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
            <p className="text-secondary font-semibold">Match time is not available.</p>
        </div>
      );
    }

    // Past status
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
        <h3 className="text-2xl font-bold text-primary mb-2">Match Has Finished</h3>
        <p className="text-secondary">This match is no longer available to watch.</p>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border rounded-md transition-colors text-secondary hover:text-primary group"
      >
        <BackArrowIcon className="mr-2" />
        <span>Back to Schedule</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Player and Match Info */}
        <div className="lg:col-span-2 flex flex-col">
           <div className="bg-surface border border-border rounded-xl shadow-2xl shadow-black/30 overflow-hidden">

            {/* Match Header */}
            <div className="p-4 md:p-5 border-b border-border">
                <div className="flex items-center justify-center gap-2 md:gap-4 text-center">
                    {match.team2?.name ? (
                        <>
                            <h2 className="flex-1 text-xl md:text-2xl font-bold text-primary truncate">
                                {match.team1?.name || 'TBA'}
                            </h2>
                            <span className="text-secondary font-mono text-base md:text-lg">VS</span>
                            <h2 className="flex-1 text-xl md:text-2xl font-bold text-primary truncate">
                                {match.team2?.name || 'TBA'}
                            </h2>
                        </>
                    ) : (
                        <h2 className="text-xl md:text-2xl font-bold text-primary truncate w-full">
                            {match.team1?.name || 'TBA'}
                        </h2>
                    )}
                </div>
            </div>

            {/* Video Player or Countdown */}
            <div className="aspect-video bg-black relative">
              {renderPlayerContent()}
            </div>

            {/* Action Bar */}
            <div className="p-3 md:p-4 border-t border-border bg-black/20 flex justify-between items-center flex-wrap gap-y-2">
                <div className="flex items-center gap-3 min-w-0">
                    {isLive && (
                    <div className="flex items-center gap-2 px-3 py-1 font-semibold text-accent2 text-xs bg-accent2/10 rounded-full shrink-0">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
                        </span>
                        <span>LIVE</span>
                    </div>
                    )}
                    <p className="text-sm font-medium text-secondary truncate">{match.league || 'Unknown League'}</p>
                </div>

                <div className="flex items-center gap-2">
                    {isLive && currentServerUrl && !isAdBlockerActive && (
                        <>
                            {/* Only show Fix Stream button if the current URL matches the primary domain */}
                            {currentServerUrl.includes(PRIMARY_DOMAIN) && (
                                <button 
                                    onClick={handleFixStream}
                                    aria-label="Fix Stream"
                                    title={useBackupDomain ? "Switch back to Primary" : "Switch to Backup Source"}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                        useBackupDomain 
                                        ? 'bg-warning/10 text-warning border border-warning/30 hover:bg-warning/20' 
                                        : 'bg-surface hover:bg-surface-hover text-secondary hover:text-primary'
                                    }`}
                                >
                                    <FixIcon />
                                    <span className="hidden sm:inline">Fix Stream</span>
                                </button>
                            )}
                            <button 
                                onClick={handleRefreshStream}
                                aria-label="Refresh Stream"
                                title="Refresh Stream"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors"
                            >
                                <RefreshIcon />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </>
                    )}
                    <button 
                        onClick={handleCopyUrl}
                        aria-label="Share Match"
                        title="Share Match"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors"
                    >
                        <ShareIcon />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Server List & Promo */}
        {isLive && (
            <div className="lg:col-span-1">
                {/* Wrapper for sticky positioning of both elements */}
                <div className="lg:sticky lg:top-24">
                    <div className="bg-surface border border-border rounded-xl">
                        <h3 className="text-lg font-semibold text-primary flex items-center gap-3 p-5 border-b border-border">
                            <ServersIcon /> 
                            Available Streams
                        </h3>
                        <div className="flex flex-col space-y-1 p-3">
                            {match.servers.length > 0 ? (
                                match.servers.map((server, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentServerUrl(server.url)}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-base
                                            ${currentServerUrl === server.url
                                            ? 'bg-gradient-to-r from-accent1 to-accent2 text-white shadow-md shadow-accent1/20'
                                            : 'bg-transparent hover:bg-surface-hover text-secondary hover:text-primary'
                                            }`}
                                    >
                                        <span className="truncate">{server.label || `Server ${index + 1}`}</span>
                                    </button>
                                ))
                            ) : (
                                <p className="text-secondary text-sm text-center py-8 px-4">No streams available for this match.</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Promotional Card */}
                    <PromoCard />
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default PlayerView;
