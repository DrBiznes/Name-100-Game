interface GameTimerProps {
  elapsedTime: number;
}

export function GameTimer({ elapsedTime }: GameTimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-lg font-mono whitespace-nowrap">
      {formatTime(elapsedTime)}
    </div>
  );
} 