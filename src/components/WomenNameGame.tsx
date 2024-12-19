import { useState } from 'react';
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

const GAME_COUNTS = [20, 50, 100] as const;
type GameCount = typeof GAME_COUNTS[number];

interface WomenNameGameProps {
  onGameStateChange: (state: { isActive: boolean; elapsedTime: number }) => void;
  timerRef: React.RefObject<HTMLDivElement>;
}

export function WomenNameGame({ onGameStateChange, timerRef }: WomenNameGameProps) {
  const [targetCount, setTargetCount] = useState<GameCount>(100);
  
  const {
    isGameActive,
    elapsedTime,
    isLoading,
    names,
    inputs,
    inputRefs,
    startGame,
    checkName,
    handleInputChange,
    setInputs,
    setNames
  } = useGameState({ targetCount, onGameStateChange });

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
            const nextIndex = index + 1;
            if (nextIndex < targetCount) {
              handleInputChange(nextIndex, '');
              inputRefs.current[nextIndex]?.focus();
            }
          }, 100);
        }
      }
    }
  };

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto border-0 shadow-none bg-transparent">
      {/* Game Header */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-2 justify-center">
          <span className="text-xl md:text-2xl font-bold">I Can Name</span>
          <Select
            defaultValue="100"
            onValueChange={(value) => setTargetCount(Number(value) as GameCount)}
            disabled={isGameActive}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="100" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="header" disabled>
                How Many?
              </SelectItem>
              {GAME_COUNTS.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xl md:text-2xl font-bold">Women</span>
        </div>
        
        <div className="flex items-center gap-4" ref={timerRef}>
          <GameTimer elapsedTime={elapsedTime} />
          <Progress value={(names.length / targetCount) * 100} className="w-full" />
          <span>{names.length}/{targetCount}</span>
        </div>

        <Button 
          onClick={startGame}
          disabled={isLoading || isGameActive}
          className="w-full md:w-auto"
        >
          Start Game
        </Button>
      </div>

      {/* Name Inputs Grid */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: targetCount }).map((_, index) => (
          <NameInput
            key={index}
            input={inputs[index]}
            index={index}
            isGameActive={isGameActive}
            inputRef={el => inputRefs.current[index] = el}
            onInputChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
          />
        ))}
      </div>
    </Card>
  );
} 