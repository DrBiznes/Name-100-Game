import { useEffect, useState } from 'react';

interface FloatingTimerProps {
  elapsedTime: number;
  isGameActive: boolean;
  timerRef: React.RefObject<HTMLElement>;
}

export function FloatingTimer({ elapsedTime, isGameActive, timerRef }: FloatingTimerProps) {
  const [showTimer, setShowTimer] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (timerRef.current) {
        const rect = timerRef.current.getBoundingClientRect();
        const isAboveViewport = rect.top < 0;
        if (showTimer !== isAboveViewport) {
          setShowTimer(isAboveViewport);
        }
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [timerRef, showTimer]);

  if (!isGameActive || !showTimer) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-white shadow-lg rounded-lg p-3 z-[9999] text-lg font-mono border">
      {formatTime(elapsedTime)}
    </div>
  );
} 