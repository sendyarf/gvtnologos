
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
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-lg"
      >
        <BackArrowIcon />
        Back to Schedule
      </button>

      <div className="mb-4 p-4 bg-slate-800 rounded-lg">
        <p className="text-sm text-teal-400">{match.league}</p>
        <h2 className="text-2xl font-bold">{match.team1.name} vs {match.team2.name}</h2>
      </div>

      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-slate-700">
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
          <div className="w-full h-full flex justify-center items-center">
              <p className="text-slate-400">No stream available for this match.</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Select a Server:</h3>
        <div className="flex flex-wrap gap-2">
          {match.servers.map((server, index) => (
            <button
              key={index}
              onClick={() => setCurrentServerUrl(server.url)}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-200
                ${currentServerUrl === server.url
                  ? 'bg-teal-500 text-white shadow-md scale-105'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
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
