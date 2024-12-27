import { useState, useRef, useEffect } from 'react';
import { checkWikipedia } from '../services/nameValidationService';
import { useMutation } from '@tanstack/react-query';

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

  const nameValidationMutation = useMutation<boolean, Error, { name: string; index: number }>({
    mutationFn: ({ name }) => checkWikipedia(name),
    onSuccess: (isValidWoman, variables) => {
      const { index, name } = variables;
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
    },
    onError: (_, variables) => {
      const { index } = variables;
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
    }
  });

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

  useEffect(() => {
    if (isGameActive && names.length === targetCount) {
      setIsGameActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      onGameStateChange({ isActive: false, elapsedTime });
    }
  }, [names.length, targetCount, isGameActive, elapsedTime, onGameStateChange]);

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
    
    return nameValidationMutation.mutateAsync({ name, index });
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
    isLoading: nameValidationMutation.isPending,
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