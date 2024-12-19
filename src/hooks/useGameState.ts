import { useState, useRef, useEffect } from 'react';
import { checkWikipedia } from '../services/nameValidationService';

export interface InputState {
  index: number;
  value: string;
  status: 'idle' | 'valid' | 'invalid' | 'pending';
}

interface UseGameStateProps {
  targetCount: number;
  onGameStateChange: (state: { isActive: boolean; elapsedTime: number }) => void;
}

export function useGameState({ targetCount, onGameStateChange }: UseGameStateProps) {
  const [isGameActive, setIsGameActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState<Array<{ index: number; name: string }>>([]);
  const [inputs, setInputs] = useState<InputState[]>(
    Array.from({ length: targetCount }, (_, i) => ({ 
      index: i, 
      value: '', 
      status: 'idle' 
    }))
  );
  const [pendingValidations, setPendingValidations] = useState<Set<number>>(new Set());

  const intervalRef = useRef<number>();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const checkName = async (name: string, index: number) => {
    if (!name.trim()) return false;
    
    if (pendingValidations.has(index)) {
      return;
    }
    
    if (names.some(entry => entry.name.toLowerCase() === name.toLowerCase())) {
      setInputs(prev => 
        prev.map(input => 
          input.index === index 
            ? { ...input, status: 'invalid' } 
            : input
        )
      );
      setTimeout(() => {
        inputRefs.current[index]?.focus();
      }, 0);
      return false;
    }

    setPendingValidations(prev => new Set(prev).add(index));
    setInputs(prev => 
      prev.map(input => 
        input.index === index 
          ? { ...input, status: 'pending' } 
          : input
      )
    );
    
    setIsLoading(true);
    try {
      const isValidWoman = await checkWikipedia(name);
      setIsLoading(false);
      
      setPendingValidations(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      
      setInputs(prev => 
        prev.map(input => 
          input.index === index 
            ? { ...input, status: isValidWoman ? 'valid' : 'invalid' } 
            : input
        )
      );
      
      if (isValidWoman) {
        setNames(prev => [...prev, { index, name }]);
      } else {
        setTimeout(() => {
          inputRefs.current[index]?.focus();
          inputRefs.current[index]?.select();
        }, 0);
      }
      
      return isValidWoman;
    } catch (error) {
      console.error('Error checking name:', error);
      setIsLoading(false);
      
      setPendingValidations(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      
      setInputs(prev => 
        prev.map(input => 
          input.index === index 
            ? { ...input, status: 'invalid' } 
            : input
        )
      );
      
      setTimeout(() => {
        inputRefs.current[index]?.focus();
        inputRefs.current[index]?.select();
      }, 0);
      
      return false;
    }
  };

  const handleInputChange = (index: number, value: string) => {
    setInputs(prev => 
      prev.map(input => 
        input.index === index 
          ? { ...input, value, status: input.status === 'invalid' ? 'idle' : input.status } 
          : input
      )
    );
  };

  return {
    isGameActive,
    elapsedTime,
    isLoading,
    names,
    inputs,
    inputRefs,
    startGame,
    checkName,
    setNames,
    setInputs,
    pendingValidations,
    handleInputChange
  };
} 