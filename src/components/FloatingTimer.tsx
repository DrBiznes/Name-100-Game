import { useEffect, useState } from 'react';

interface FloatingTimerProps {
  elapsedTime: number;
  isGameActive: boolean;
  timerRef: React.RefObject<HTMLElement>;
}

export function FloatingTimer({ elapsedTime, isGameActive, timerRef }: FloatingTimerProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      if (timerRef.current) {
        const rect = timerRef.current.getBoundingClientRect();
        const isAboveViewport = rect.top < 0;
        setShowTimer(isAboveViewport);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [timerRef]);

  // Handle game state visibility
  useEffect(() => {
    if (!isGameActive) {
      setIsVisible(false);
      return;
    }

    // Only show if we're scrolled past the timer and the game is active
    setIsVisible(showTimer);
  }, [isGameActive, showTimer]);

  // Reset visibility when timer resets to 0
  useEffect(() => {
    if (elapsedTime === 0) {
      setIsVisible(false);
    }
  }, [elapsedTime]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-muted text-foreground shadow-lg rounded-lg p-3 z-[9999] text-lg font-mono border border-primary">
      {formatTime(elapsedTime)}
    </div>
  );
} 