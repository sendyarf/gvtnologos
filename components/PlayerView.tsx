import React, { useState } from 'react';
import type { Match } from '../types';

interface PlayerViewProps {
  match: Match;
  onBack: () => void;
}

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PlayerView: React.FC<PlayerViewProps> = ({ match, onBack }) => {
  const [currentServerUrl, setCurrentServerUrl] = useState<string>(match.servers[0]?.url || '');
  
  if (!match) return null;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center px-4 py-2 bg-surface hover:bg-surface-hover rounded-lg transition-colors text-lg font-semibold"
      >
        <BackArrowIcon />
        Back to Schedule
      </button>

      <div className="mb-4 p-4 bg-surface rounded-lg">
        <p className="text-sm font-semibold text-accent2">{match.league}</p>
        <h2 className="text-2xl font-bold text-primary">{match.team1.name} vs {match.team2.name}</h2>
      </div>

      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-surface-hover">
        {currentServerUrl ? (
          <iframe
            key={currentServerUrl} // Re-mounts iframe on src change
            src={currentServerUrl}
            title="Live Stream Player"
            className="w-full h-full"
            allow="encrypted-media"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-surface">
              <p className="text-secondary">No stream available for this match.</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-surface rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-primary">Select a Server:</h3>
        <div className="flex flex-wrap gap-3">
          {match.servers.map((server, index) => (
            <button
              key={index}
              onClick={() => setCurrentServerUrl(server.url)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 border-2
                ${currentServerUrl === server.url
                  ? 'bg-accent1 text-background border-accent1 shadow-md scale-105'
                  : 'bg-surface-hover border-transparent hover:bg-accent2 hover:text-background text-primary'
                }`}
            >
              {server.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerView;