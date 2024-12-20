import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { InputState } from '../hooks/useGameState';
import { useState, useRef, useEffect } from 'react';
import { NameCard } from './NameCard';

interface NameInputProps {
  input: InputState;
  index: number;
  isGameActive: boolean;
  inputRef: (el: HTMLInputElement | null) => void;
  onInputChange: (index: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
}

export function NameInput({
  input,
  index,
  isGameActive,
  inputRef,
  onInputChange,
  onKeyDown
}: NameInputProps) {
  const [showCard, setShowCard] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const handleInputClick = () => {
    if (!isGameActive) return;

    if (input.status === 'valid') {
      setShowCard(!showCard);
    }
  };

  const handleCardClose = () => {
    setShowCard(false);
  };

  return (
    <div ref={inputContainerRef} className="flex items-center gap-2 relative">
      <span className="w-6 flex justify-end items-center">
        {input.status === 'valid' ? (
          <span className="material-icons text-green-500" style={{ fontSize: '16px' }}>check</span>
        ) : input.status === 'invalid' ? (
          <span className="material-icons text-red-500" style={{ fontSize: '16px' }}>close</span>
        ) : input.status === 'pending' ? (
          <span className="material-icons text-yellow-500 animate-spin" style={{ fontSize: '16px' }}>refresh</span>
        ) : (
          <span className="text-sm text-gray-500">{index + 1}.</span>
        )}
      </span>
      <Input
        ref={inputRef}
        value={input.value}
        readOnly={input.status === 'valid'}
        disabled={!isGameActive}
        onClick={handleInputClick}
        onChange={e => isGameActive && onInputChange(index, e.target.value)}
        onKeyDown={e => onKeyDown(e, index)}
        className={cn(
          "w-full",
          input.status === 'valid' && "bg-green-50 cursor-pointer hover:bg-green-100",
          input.status === 'invalid' && "bg-red-50",
          input.status === 'pending' && "bg-yellow-50",
        )}
      />
      <NameCard
        name={input.value}
        isOpen={showCard}
        onClose={handleCardClose}
        triggerRef={inputContainerRef}
      />
    </div>
  );
} 