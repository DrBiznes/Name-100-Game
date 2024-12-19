import { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { GameTimer } from '@/components/GameTimer';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface InputState {
  index: number;
  value: string;
  status: 'idle' | 'valid' | 'invalid';
}

interface WomenNameGameProps {
  onGameStateChange: (state: { isActive: boolean; elapsedTime: number }) => void;
  timerRef: React.RefObject<HTMLElement>;
}

const GAME_COUNTS = [20, 50, 100] as const;
type GameCount = typeof GAME_COUNTS[number];

export function WomenNameGame({ onGameStateChange, timerRef }: WomenNameGameProps) {
  const [isGameActive, setIsGameActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [targetCount, setTargetCount] = useState<GameCount>(100);
  const [names, setNames] = useState<Array<{ index: number; name: string }>>([]);
  const [inputs, setInputs] = useState<InputState[]>(
    Array.from({ length: targetCount }, (_, i) => ({ 
      index: i, 
      value: '', 
      status: 'idle' 
    }))
  );
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isGameActive) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = prev + 1;
          onGameStateChange({ isActive: true, elapsedTime: newTime });
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isGameActive, onGameStateChange]);

  const startGame = () => {
    setIsGameActive(true);
    setElapsedTime(0);
    setNames([]);
    setInputs(Array.from({ length: targetCount }, (_, i) => ({ 
      index: i, 
      value: '', 
      status: 'idle' 
    })));
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  };

  const checkWikipedia = async (name: string): Promise<boolean> => {
    try {
      // First, search for the page
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch="${encodeURIComponent(name)}"&format=json&origin=*`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.query.search.length === 0) {
        return false;
      }

      // Check if the first search result's title matches our search term (case-insensitive)
      const firstResult = searchData.query.search[0];
      if (!firstResult.title.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }

      // Get the page content
      const pageId = firstResult.pageid;
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&pageids=${pageId}&format=json&origin=*`;
      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();

      const page = contentData.query.pages[pageId];
      const intro = page.extract || '';

      // Remove HTML tags and convert to plain text
      const plainText = intro.replace(/<[^>]*>/g, '');

      // Look for female indicators
      const femaleIndicators = ['she', 'her', 'hers', 'woman', 'female'];
      
      // Convert to lowercase and split into words
      const words = plainText.toLowerCase().split(/\s+/);
      
      // Find the first female indicator
      const firstFemaleIndicator = words.find((word: string) => femaleIndicators.includes(word));

      // Return true if we found a female indicator
      return !!firstFemaleIndicator;

    } catch (error) {
      console.error('Error checking Wikipedia:', error);
      return false;
    }
  };

  const checkName = async (name: string, index: number) => {
    if (!name.trim()) return false;
    
    if (names.some(entry => entry.name.toLowerCase() === name.toLowerCase())) {
      setInputs(prev => 
        prev.map(input => 
          input.index === index 
            ? { ...input, status: 'invalid' } 
            : input
        )
      );
      return false;
    }

    setIsLoading(true);
    try {
      const isValidWoman = await checkWikipedia(name);
      setIsLoading(false);
      
      setInputs(prev => 
        prev.map(input => 
          input.index === index 
            ? { ...input, status: isValidWoman ? 'valid' : 'invalid' } 
            : input
        )
      );
      
      return isValidWoman;
    } catch (error) {
      console.error('Error checking name:', error);
      setIsLoading(false);
      setInputs(prev => 
        prev.map(input => 
          input.index === index 
            ? { ...input, status: 'invalid' } 
            : input
        )
      );
      return false;
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInputs(prev => 
      prev.map(input => 
        input.index === index 
          ? { ...input, value, status: 'idle' } 
          : input
      )
    );
  };

  const handleInputKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Check for either Tab (without shift) or Enter key
    if ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') {
      e.preventDefault();
      const currentValue = inputs[index].value.trim();
      
      if (currentValue) {
        // First check for duplicates - show immediate feedback
        if (names.some(entry => entry.name.toLowerCase() === currentValue.toLowerCase())) {
          setInputs(prev => 
            prev.map(input => 
              input.index === index 
                ? { ...input, status: 'invalid' } 
                : input
            )
          );
          return; // Stop here if it's a duplicate
        }

        // Show loading state while checking Wikipedia
        setIsLoading(true);
        const isValid = await checkName(currentValue, index);
        setIsLoading(false);

        if (isValid) {
          setNames(prev => [...prev, { index, name: currentValue }]);
          // First update the status to valid
          setInputs(prev => 
            prev.map(input => 
              input.index === index 
                ? { ...input, value: currentValue, status: 'valid' } 
                : input
            )
          );
          // Then clear and move to next input
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
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: targetCount }).map((_, index) => {
          const input = inputs[index];
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="w-6 flex justify-end items-center">
                {input.status === 'valid' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : input.status === 'invalid' ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : (
                  <span className="text-sm text-gray-500">{index + 1}.</span>
                )}
              </span>
              <Input
                ref={el => inputRefs.current[index] = el}
                value={input.value}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => handleInputKeyDown(e, index)}
                disabled={!isGameActive || input.status === 'valid'}
                className={cn(
                  "w-full",
                  input.status === 'valid' && "bg-green-50",
                  input.status === 'invalid' && "bg-red-50"
                )}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
} 