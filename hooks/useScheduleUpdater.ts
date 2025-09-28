import { useState, useEffect, useRef } from 'react';
import type { Match } from '../types';

const SCHEDULE_URL = 'https://weekendsch.pages.dev/sch/schedule.json';
const CHECK_INTERVAL = 60000; // 60 seconds

export const useScheduleUpdater = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const knownScheduleJSON = useRef<string | null>(null);

  useEffect(() => {
    let intervalId: number;

    const checkUpdates = async () => {
      try {
        const response = await fetch(SCHEDULE_URL, { cache: 'no-store' }); // Ensure fresh data
        if (!response.ok) {
          console.error(`Background fetch failed: ${response.status}`);
          return;
        }
        const data: Match[] = await response.json();
        const latestJSON = JSON.stringify(data);

        if (knownScheduleJSON.current === null) {
          // First check, establish baseline
          knownScheduleJSON.current = latestJSON;
        } else if (knownScheduleJSON.current !== latestJSON) {
          setIsUpdateAvailable(true);
          if (intervalId) clearInterval(intervalId); // Stop checking
        }
      } catch (error) {
        console.error("Error checking for schedule updates:", error);
      }
    };

    // Initial check to set baseline after a small delay
    const initialCheckTimeout = setTimeout(checkUpdates, 5000);
    
    // Then check periodically
    intervalId = window.setInterval(checkUpdates, CHECK_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearTimeout(initialCheckTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  const dismissUpdate = () => {
    setIsUpdateAvailable(false);
  };

  return {
    isUpdateAvailable,
    reloadPage,
    dismissUpdate,
  };
};
