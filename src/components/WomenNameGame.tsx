import { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { GameTimer } from '@/components/GameTimer';
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

      // Get the first result's page content and categories
      const pageId = searchData.query.search[0].pageid;
      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=categories|pageprops&pageids=${pageId}&format=json&origin=*`;
      const contentResponse = await fetch(contentUrl);
      const contentData = await contentResponse.json();

      const page = contentData.query.pages[pageId];
      const categories = page.categories?.map((cat: { title: string }) => cat.title.toLowerCase()) || [];

      // Definitive female categories that are commonly used on Wikipedia
      const femaleCategories = [
        'category:women ',
        'category:female ',
        'actresses',
        'category:women artists',
        'category:women writers',
        'category:women musicians',
        'category:women politicians',
        'category:queens',
        'category:feminists',
        'category:women activists',
        'category:women scientists',
        'category:women academics',
        'category:women athletes',
        'category:female singers',
        'category:female models',
        'category:women business executives',
        'category:women journalists',
        'category:first ladies',
        'category:princesses',
        'category:female dancers',
        'category:women directors',
        'category:female composers',
        'category:women entrepreneurs',
        'category:women inventors',
        'category:women philosophers',
        'category:women mathematicians',
        'category:women engineers',
        'category:female athletes',
        'category:women olympians',
        'category:women religious leaders',
        'category:women heads of state',
        'category:women heads of government',
        'category:women nobel laureates',
        'category:women television personalities',
        'category:female broadcasters',
        'category:women comedians',
        'category:women painters',
        'category:women sculptors',
        'category:women photographers',
        'category:women fashion designers',
        'category:women chefs',
        'category:women lawyers',
        'category:women judges',
        'category:women physicians',
        'category:women nurses',
        'category:women social workers',
        'category:women activists',
        
        // Political Leaders
        'category:women prime ministers',
        'category:female heads of government',
        'category:women presidents',
        'category:women vice presidents',
        'category:women governors',
        'category:women senators',
        'category:women members of parliament',
        'category:women diplomats',
        'category:women ambassadors',
        'category:women cabinet ministers',
        
        // Regional Political Categories
        'category:women politicians of the united kingdom',
        'category:women politicians of india',
        'category:women politicians of australia',
        'category:women politicians of canada',
        'category:women politicians of new zealand',
        'category:women politicians of germany',
        'category:women politicians of france',
        'category:women politicians of japan',
        'category:women politicians of brazil',
        'category:women politicians of south africa',
        
        // Royalty and Nobility
        'category:queens regnant',
        'category:queens consort',
        'category:women monarchs',
        'category:duchesses',
        'category:countesses',
        'category:baronesses',
        
        // Additional Professional Categories
        'category:women archaeologists',
        'category:women anthropologists',
        'category:women sociologists',
        'category:women psychologists',
        'category:women economists',
        'category:women historians',
        'category:women professors',
        'category:women researchers',
        'category:women chief executives',
        'category:women business owners',
        'category:women philanthropists',
        
        // Arts and Culture
        'category:women poets',
        'category:women novelists',
        'category:women playwrights',
        'category:women screenwriters',
        'category:women film producers',
        'category:women choreographers',
        'category:women conductors (music)',
        'category:women opera singers',
        'category:women pop singers',
        'category:women rock singers',
        'category:women jazz musicians',
        
        // Sports
        'category:women footballers',
        'category:women tennis players',
        'category:women basketball players',
        'category:women swimmers',
        'category:women gymnasts',
        'category:women runners',
        'category:women boxers',
        'category:women martial artists',
        
        // STEM
        'category:women computer scientists',
        'category:women biologists',
        'category:women chemists',
        'category:women physicists',
        'category:women astronomers',
        'category:women neuroscientists',
        'category:women medical researchers',
        'category:women aerospace engineers',
        
        // More flexible category patterns
        'women prime minister',
        'female prime minister',
        'woman prime minister',
        'women chancellor',
        'female chancellor',
        'woman chancellor',
        
        // Regional categories without strict formatting
        'women in european politics',
        'european women politicians',
        'female politicians in europe',
        'women political leaders in europe',
        
        // Country leadership variations
        'women heads of state',
        'female heads of state',
        'women heads of government',
        'female heads of government',
        'women national leaders',
        'female national leaders',
        
        // More flexible political categories
        'women in politics',
        'female politicians',
        'women politicians',
        'women political leaders',
        'female political leaders',
        
        // General female descriptors
        'female',
        'woman',
        'women',
        'actress',
        'actresses',
        'businesswoman',
        'businesswomen',
        'spokeswoman',
        'spokeswomen',
        'congresswoman',
        'congresswomen',
        'assemblywoman',
        'assemblywomen',
        'chairwoman',
        'chairwomen',
        'councilwoman',
        'councilwomen',
        'alderwoman',
        'alderwomen',
        'servicewoman',
        'servicewomen',
        'stateswoman',
        'stateswomen',
        
        // Family and title variations
        'mother of',
        'daughter of',
        'sister of',
        'wife of',
        'queen',
        'princess',
        'duchess',
        'countess',
        'baroness',
        'lady',
        'dame',
        'madame',
        
        // Professional variations
        'female executive',
        'woman executive',
        'female ceo',
        'woman ceo',
        'female founder',
        'woman founder',
        'female entrepreneur',
        'woman entrepreneur',
        
        // Achievement categories
        'female recipient',
        'woman recipient',
        'female honoree',
        'woman honoree',
        'female laureate',
        'woman laureate',
        
        // Historical and cultural
        'female pioneer',
        'woman pioneer',
        'female leader',
        'woman leader',
        'female revolutionary',
        'woman revolutionary',
        'female activist',
        'woman activist',
      ];

      // Check if any of the page's categories match our female categories
      return categories.some((category: string) => 
        femaleCategories.some(femaleCategory => 
          category.includes(femaleCategory)
        )
      );

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
            if (nextIndex < 100) {
              handleInputChange(nextIndex, '');
              inputRefs.current[nextIndex]?.focus();
            }
          }, 100);
        } else {
          // Stay on current input if name is invalid
          inputRefs.current[index]?.focus();
        }
      }
    }
  };

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto border-0 shadow-none bg-transparent">
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

      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 100 }).map((_, index) => {
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