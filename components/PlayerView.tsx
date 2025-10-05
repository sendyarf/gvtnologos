import React, { useState } from 'react';
import type { Match } from '../types';
import { getMatchStatus, getMatchStartDate } from '../utils/date';
import CountdownTimer from './CountdownTimer';
import { copyMatchUrl } from '../utils/share';

interface PlayerViewProps {
  match: Match;
  onBack: () => void;
  onRefresh: () => void;
  onShareSuccess: () => void;
}

const BackArrowIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const ServersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const PlayerView: React.FC<PlayerViewProps> = ({ match, onBack, onRefresh, onShareSuccess }) => {
  const [currentServerUrl, setCurrentServerUrl] = useState<string>(match.servers[0]?.url || '');
  
  const status = getMatchStatus(match);
  const isLive = status === 'live';
  const isUpcoming = status === 'upcoming';
  const matchDate = getMatchStartDate(match);

  const handleCopyUrl = async () => {
    const copiedToClipboard = await copyMatchUrl(match);
    if (copiedToClipboard) {
      onShareSuccess();
    }
  };

  if (!match) return null;

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-3 py-1.5 bg-surface hover:bg-surface-hover border border-border rounded-md transition-colors text-secondary hover:text-primary group"
      >
        <BackArrowIcon className="mr-2" />
        <span>Back to Schedule</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content: Player and Match Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Video Player or Countdown */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-2xl shadow-black/30">
            {isLive ? (
              currentServerUrl ? (
              <iframe
                  key={currentServerUrl} // Re-mounts iframe on src change
                  src={currentServerUrl}
                  title="Live Stream Player"
                  className="w-full h-full"
                  allow="encrypted-media; autoplay; fullscreen"
                  allowFullScreen
                  scrolling="no"
              ></iframe>
              ) : (
              <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
                  <p className="text-secondary font-semibold mt-2">No stream available for this match.</p>
                  <p className="text-secondary text-sm mt-1">Please select a different server if available.</p>
              </div>
              )
            ) : isUpcoming ? (
              matchDate ? (
                <CountdownTimer targetDate={matchDate} onCountdownFinish={onRefresh} />
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
                    <p className="text-secondary font-semibold">Match time is not available.</p>
                </div>
              )
            ) : ( // Past status
              <div className="w-full h-full flex flex-col justify-center items-center bg-surface text-center p-4">
                <h3 className="text-2xl font-bold text-primary mb-2">Match Has Finished</h3>
                <p className="text-secondary">This match is no longer available to watch.</p>
              </div>
            )}
          </div>

          {/* Match Info */}
          <div className="bg-surface border border-border rounded-lg p-4 md:p-6">
            <div className="flex justify-between items-start gap-4">
              <div className='min-w-0'>
                <p className="text-md font-medium text-secondary truncate">{match.league || 'Unknown League'}</p>
              </div>
              <div className="flex items-center gap-1">
                {isLive && (
                  <div className="flex items-center gap-2 px-3 py-1 font-semibold text-accent2 text-sm bg-accent2/10 rounded-full shrink-0">
                      <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
                      </span>
                      <span>LIVE</span>
                  </div>
                )}
                <button 
                  onClick={handleCopyUrl}
                  aria-label="Copy Match URL"
                  title="Copy Match URL"
                  className="p-2 rounded-full text-secondary hover:bg-surface-hover hover:text-primary transition-colors"
                >
                    <CopyIcon />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-4 mt-3">
                {match.team2?.name ? (
                    <>
                        <h2 className="flex-1 text-xl md:text-3xl font-bold text-primary text-right truncate min-w-0">{match.team1?.name || 'TBA'}</h2>
                        <span className="text-secondary font-mono text-lg md:text-xl px-1 md:px-2">VS</span>
                        <h2 className="flex-1 text-xl md:text-3xl font-bold text-primary text-left truncate min-w-0">{match.team2?.name || 'TBA'}</h2>
                    </>
                ) : (
                    <h2 className="text-xl md:text-3xl font-bold text-primary text-center truncate w-full">{match.team1?.name || 'TBA'}</h2>
                )}
            </div>
          </div>
        </div>

        {/* Sidebar: Server List */}
        {isLive && (
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-lg p-5 lg:sticky lg:top-24">
                <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-3"><ServersIcon /> Server List</h3>
                <div className="flex flex-col space-y-2">
                {match.servers.map((server, index) => (
                    <button
                    key={index}
                    onClick={() => setCurrentServerUrl(server.url)}
                    className={`w-full text-left px-4 py-2.5 rounded-md font-medium transition-all duration-200 border-l-2
                        ${currentServerUrl === server.url
                        ? 'bg-accent1/10 border-accent1 text-accent1'
                        : 'bg-transparent border-transparent hover:bg-surface-hover text-secondary hover:text-primary'
                        }`}
                    >
                    <span className={`truncate`}>{server.label || `Server ${index + 1}`}</span>
                    </button>
                ))}
                {match.servers.length === 0 && (
                    <p className="text-secondary text-sm text-center py-4">No servers available for this match.</p>
                )}
                </div>
              </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default PlayerView;