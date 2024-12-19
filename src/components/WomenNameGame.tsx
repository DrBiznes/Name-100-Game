import { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { GameTimer } from './GameTimer';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputState {
  index: number;
  value: string;
  status: 'idle' | 'valid' | 'invalid';
}

export function WomenNameGame() {
  const [isGameActive, setIsGameActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState<Array<{ index: number; name: string }>>([]);
  const [inputs, setInputs] = useState<InputState[]>(
    Array.from({ length: 100 }, (_, i) => ({ 
      index: i, 
      value: '', 
      status: 'idle' 
    }))
  );
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<number>();

  useEffect(() => {
    if (isGameActive) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive]);

  const startGame = () => {
    setIsGameActive(true);
    setElapsedTime(0);
    setNames([]);
    setInputs(Array.from({ length: 100 }, (_, i) => ({ 
      index: i, 
      value: '', 
      status: 'idle' 
    })));
    inputRefs.current[0]?.focus();
  };

  const checkWikipedia = async (name: string): Promise<boolean> => {
    try {
      // First, search for the page
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(name)}&format=json&origin=*`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.query.search.length === 0) {
        return false;
      }

      // Get the first result's page content
      const pageId = searchData.query.search[0].pageid;
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();

      const extract = contentData.query.pages[pageId].extract.toLowerCase();

      // Check for female-indicating terms in the first paragraph
      const femaleTerms = [
        'actress',
        'she',
        'her',
        'woman',
        'female',
        'women',
        'businesswoman',
        'spokeswoman',
        'chairwoman',
        'congresswoman',
        'servicewoman',
        'mother',
        'sister',
        'daughter',
        'queen',
        'princess',
        'duchess'
      ];

      return femaleTerms.some(term => extract.includes(term));
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
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const currentValue = inputs[index].value.trim();
      
      if (currentValue) {
        const isValid = await checkName(currentValue, index);
        if (isValid) {
          // Add to names list
          setNames(prev => [...prev, { index, name: currentValue }]);
          
          // Update input status to valid and keep the value
          setInputs(prev => 
            prev.map(input => 
              input.index === index 
                ? { ...input, status: 'valid' } 
                : input
            )
          );
          
          // Move to next input
          const nextIndex = index + 1;
          if (nextIndex < 100) {
            inputRefs.current[nextIndex]?.focus();
          }
        }
        // Invalid case is handled in checkName function
      }
    }
  };

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto">
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Name 100 Women</h1>
        
        <div className="flex items-center gap-4">
          <GameTimer elapsedTime={elapsedTime} />
          <Progress value={(names.length / 100) * 100} className="w-full" />
          <span>{names.length}/100</span>
        </div>

        <Button 
          onClick={startGame}
          disabled={isLoading || isGameActive}
          className="w-full md:w-auto"
        >
          Start Game
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 34 }).map((_, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, offset) => {
              const index = groupIndex * 3 + offset;
              if (index >= 100) return null;
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
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
} 