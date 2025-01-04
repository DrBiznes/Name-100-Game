import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { GameTimer } from '@/components/GameTimer';
import { NameInput } from './NameInput';
import { useGameState } from '../hooks/useGameState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { GameCompletionDialog } from './GameCompletionDialog';
import ConfettiExplosion from 'react-confetti-explosion';
import { toast } from "sonner";
import { leaderboardApi } from '@/services/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const GAME_COUNTS = [20, 50, 100] as const;
type GameCount = typeof GAME_COUNTS[number];

interface WomenNameGameProps {
  onGameStateChange: (state: { isActive: boolean; elapsedTime: number }) => void;
  timerRef: React.RefObject<HTMLDivElement>;
}

export function WomenNameGame({ onGameStateChange, timerRef }: WomenNameGameProps) {
  const [targetCount, setTargetCount] = useState<GameCount>(100);
  const [completedGameCount, setCompletedGameCount] = useState<GameCount | null>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isGameActive,
    elapsedTime,
    isLoading,
    names,
    inputs,
    inputRefs,
    startGame: originalStartGame,
    checkName,
    handleInputChange,
  } = useGameState({ targetCount: completedGameCount || targetCount, onGameStateChange });

  const queryClient = useQueryClient();
  
  // Add mutation for score submission
  const submitScoreMutation = useMutation({
    mutationFn: leaderboardApi.submitScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit score";
      toast.error(errorMessage, {
        description: "Please try again or contact support if the problem persists."
      });
    }
  });

  const confettiProps = {
    force: 0.8,
    duration: 3000,
    particleCount: 250,
    width: 1600,
  };

  useEffect(() => {
    if (!completedGameCount && names.length === targetCount) {
      setCompletedGameCount(targetCount);
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [names.length, targetCount, completedGameCount]);

  const startGame = () => {
    setCompletedGameCount(null);
    originalStartGame();
    
    // Focus hidden input first (forces mobile keyboard)
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
    
    // Then focus the actual input with a slight delay
    setTimeout(() => {
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    }, 50);
  };

  const findNextEmptyInput = (currentIndex: number): number => {
    // Look for the next empty input after the current index
    for (let i = currentIndex + 1; i < targetCount; i++) {
      if (inputs[i].status === 'idle' && !inputs[i].value) {
        return i;
      }
    }
    // If none found after current index, look from beginning
    for (let i = 0; i < currentIndex; i++) {
      if (inputs[i].status === 'idle' && !inputs[i].value) {
        return i;
      }
    }
    // If no empty inputs found, return current index
    return currentIndex;
  };

  const handleInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') {
      e.preventDefault();
      const currentValue = inputs[index].value.trim();
      
      if (currentValue && inputs[index].status !== 'pending') {
        const isValid = await checkName(currentValue, index);

        if (isValid) {
          setTimeout(() => {
            const nextIndex = findNextEmptyInput(index);
            if (nextIndex < targetCount) {
              inputRefs.current[nextIndex]?.focus();
            }
          }, 100);
        }
      }
    }
  };

  const handleSubmitScore = async (username: string, token: string) => {
    if (username.length !== 3) {
      toast.error("Username must be exactly 3 letters");
      return Promise.reject();
    }

    if (!completedGameCount) {
      toast.error("No completed game found");
      return Promise.reject();
    }

    return submitScoreMutation.mutateAsync({
      username: username.toUpperCase(),
      completion_time: elapsedTime,
      completed_names: names.map(n => n.name),
      game_mode: completedGameCount.toString(),
      cf_turnstile_response: token
    });
  };

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto border-0 shadow-none bg-transparent">
      {/* Hidden input for mobile keyboard trigger */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="opacity-0 h-0 w-0 absolute -z-10"
        aria-hidden="true"
        readOnly
      />
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ConfettiExplosion {...confettiProps} />
          </div>
        </div>
      )}
      
      {/* Game Header */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-xl md:text-2xl font-bold font-['Chonburi']">I Can Name</span>
          <Select
            defaultValue="100"
            onValueChange={(value) => setTargetCount(Number(value) as GameCount)}
            disabled={isGameActive}
            value={targetCount.toString()}
          >
            <SelectTrigger className="w-[105px] font-['Chonburi']">
              <SelectValue placeholder="100" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header" disabled className="font-['Chonburi']">
                How Many?
              </SelectItem>
              {GAME_COUNTS.map((count) => (
                <SelectItem key={count} value={count.toString()} className="font-['Chonburi']">
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xl md:text-2xl font-bold font-['Chonburi']">Women</span>
        </div>
        
        <div className="flex items-center gap-4" ref={timerRef}>
          <GameTimer elapsedTime={elapsedTime} />
          <Progress 
            value={(names.length / (completedGameCount || targetCount)) * 100} 
            className="w-full" 
          />
          <span className="font-mono text-lg whitespace-nowrap">{names.length}/{completedGameCount || targetCount}</span>
        </div>

        <Button 
          onClick={startGame}
          disabled={isLoading || isGameActive}
          variant="default"
          className="w-full md:w-auto"
        >
          Start Game
        </Button>
      </div>

      {/* Name Inputs Grid */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: completedGameCount || targetCount }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              transition={{
                opacity: { duration: 0.2 },
                layout: { duration: 0.3 },
                scale: { duration: 0.2 }
              }}
            >
              <NameInput
                input={inputs[index]}
                index={index}
                isGameActive={isGameActive}
                inputRef={el => inputRefs.current[index] = el}
                onInputChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {completedGameCount && names.length === completedGameCount && !showCompletionDialog && (
        <div className="mt-4 flex justify-center">
          <Button 
            onClick={() => setShowCompletionDialog(true)}
            variant="default"
            className="w-full md:w-auto mx-auto"
          >
            Upload Score
          </Button>
        </div>
      )}

      <GameCompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        elapsedTime={elapsedTime}
        onSubmitScore={handleSubmitScore}
      />
    </Card>
  );
} 