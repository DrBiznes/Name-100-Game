import { useState, useEffect, useRef } from 'react';
import { Timer, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface NameEntry {
  name: string;
  verified: boolean;
}

interface WikipediaResponse {
  description?: string;
  extract?: string;
}

// Constants
const FEMALE_INDICATORS = [
  'woman',
  'female',
  'she',
  'her',
  'actress',
  'spokeswoman',
  'businesswoman',
  'grandmother',
  'mother',
  'daughter',
  'sister',
  'queen'
];

// Wikipedia API functions
const fetchWikipediaData = async (name: string): Promise<WikipediaResponse> => {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
  );
  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.statusText}`);
  }
  return response.json();
};

const checkIfFemale = (data: WikipediaResponse): boolean => {
  const textToSearch = `${data.description || ''} ${data.extract || ''}`.toLowerCase();
  console.log('Searching text:', textToSearch); // Debug log
  const foundIndicator = FEMALE_INDICATORS.find(term => textToSearch.includes(term));
  console.log('Found indicator:', foundIndicator); // Debug log
  return Boolean(foundIndicator);
};

// Game logic components
const GameTimer = ({ elapsedTime }: { elapsedTime: number }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Timer className="w-6 h-6" />
      <span className="text-xl">{formatTime(elapsedTime)}</span>
    </div>
  );
};

const NamesList = ({ names }: { names: NameEntry[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {names.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <Check className="w-4 h-4 text-green-500" />
        <span>{entry.name}</span>
      </div>
    ))}
  </div>
);

export function WomenNameGame() {
  const [names, setNames] = useState<NameEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && names.length < 100) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, names.length]);

  const checkWikipedia = async (name: string): Promise<boolean> => {
    try {
      console.log('Checking Wikipedia for:', name); // Debug log
      const data = await fetchWikipediaData(name);
      return checkIfFemale(data);
    } catch (error) {
      console.error('Wikipedia check error:', error); // Debug log
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const isValid = await checkWikipedia(currentInput);
      console.log('Is valid?', isValid); // Debug log
      
      if (isValid && !names.some(n => n.name.toLowerCase() === currentInput.toLowerCase())) {
        const newNames = [...names, { name: currentInput, verified: true }];
        setNames(newNames);
        setCurrentInput('');
        
        if (newNames.length === 100) {
          setIsGameActive(false);
        }
      }
    } catch (error) {
      console.error('Submit error:', error); // Debug log
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    setElapsedTime(0);
    setNames([]);
    setCurrentInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Name 100 Women</h1>
        
        <div className="flex items-center gap-4 mb-4">
          <GameTimer elapsedTime={elapsedTime} />
          <Progress value={(names.length / 100) * 100} className="w-full" />
          <span>{names.length}/100</span>
        </div>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Enter a woman's name..."
              disabled={!isGameActive}
            />
            <Button 
              type={isGameActive ? "submit" : "button"}
              onClick={() => !isGameActive && startGame()}
              disabled={isLoading}
            >
              {isGameActive ? (isLoading ? "Checking..." : "Submit") : "Start Game"}
            </Button>
          </div>
        </form>

        <NamesList names={names} />
      </Card>
    </div>
  );
} 