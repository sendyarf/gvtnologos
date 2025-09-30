import React, { useState } from 'react';
import type { Match } from '../types';

interface PlayerViewProps {
  match: Match;
  onBack: () => void;
}

// FIX: Updated BackArrowIcon to accept a className prop to resolve a TypeScript error.
const BackArrowIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 mr-2 ${className || ''}`.trim()} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const TvIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-secondary group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);


const PlayerView: React.FC<PlayerViewProps> = ({ match, onBack }) => {
  const [currentServerUrl, setCurrentServerUrl] = useState<string>(match.servers[0]?.url || '');
  
  if (!match) return null;

  return (
    <div className="animate-fade-in-up max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 bg-surface hover:bg-surface-hover rounded-lg transition-colors font-semibold group"
      >
        <BackArrowIcon className="text-secondary group-hover:text-primary transition-colors" />
        <span className="text-secondary group-hover:text-primary transition-colors">Back to Schedule</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Player and Match Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-surface-hover">
              {currentServerUrl ? (
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
                  <TvIcon />
                  <p className="text-secondary font-semibold mt-2">No stream available for this match.</p>
                  <p className="text-secondary text-sm mt-1">Please select a different server if available.</p>
              </div>
              )}
          </div>

          {/* Match Info */}
          <div className="bg-surface rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <p className="text-lg font-semibold text-accent1 truncate pr-4">{match.league}</p>
              <div className="flex items-center gap-1.5 bg-accent2/10 px-3 py-1.5 rounded-full flex-shrink-0">
                  <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent2 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent2"></span>
                  </span>
                  <span className="text-sm font-bold text-accent2">LIVE</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
               <h2 className="text-2xl md:text-3xl font-bold text-primary text-left truncate">{match.team1.name}</h2>
               <span className="text-secondary font-mono text-xl">VS</span>
               <h2 className="text-2xl md:text-3xl font-bold text-primary text-right truncate">{match.team2.name}</h2>
            </div>
          </div>
        </div>

        {/* Sidebar: Server List */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl p-6 shadow-lg lg:sticky lg:top-24">
            <h3 className="text-xl font-semibold mb-4 text-primary flex items-center group"><TvIcon /> Server List</h3>
            <div className="flex flex-col space-y-3">
              {match.servers.map((server, index) => (
                  <button
                  key={index}
                  onClick={() => setCurrentServerUrl(server.url)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 border-2 flex items-center group
                      ${currentServerUrl === server.url
                      ? 'bg-accent1 text-background border-accent1 shadow-lg shadow-accent1/30'
                      : 'bg-surface-hover border-transparent hover:border-accent1/50 text-primary'
                      }`}
                  >
                  <span className={`w-2.5 h-2.5 rounded-full mr-4 transition-colors flex-shrink-0 ${currentServerUrl === server.url ? 'bg-background' : 'bg-secondary group-hover:bg-accent1'}`}></span>
                  <span className="truncate">{server.label || `Server ${index + 1}`}</span>
                  </button>
              ))}
              {match.servers.length === 0 && (
                  <p className="text-secondary text-sm text-center py-4">No servers available for this match.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlayerView;