import { useEffect, useState } from 'react';

interface RefreshTimerProps {
  cacheTimestamp: string;
  cacheExpiresIn: number;
}

export function RefreshTimer({ cacheTimestamp, cacheExpiresIn }: RefreshTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const cacheExpiration = new Date(cacheTimestamp);
      cacheExpiration.setSeconds(cacheExpiration.getSeconds() + cacheExpiresIn);
      return Math.max(0, Math.floor((cacheExpiration.getTime() - Date.now()) / 1000));
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [cacheTimestamp, cacheExpiresIn]);

  const formatTime = (seconds: number) => {
    if (seconds > 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm font-['Alegreya'] text-muted-foreground">
      <span className="material-icons text-header">update</span>
      {timeRemaining > 0 ? (
        <span>
          Next update in <span className="font-mono">{formatTime(timeRemaining)}</span>
        </span>
      ) : (
        <span>Updating...</span>
      )}
    </div>
  );
} 