import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { InputState } from '../hooks/useGameState';
import { useState, useRef } from 'react';
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
          <span className="text-sm font-bold text-foreground">{index + 1}.</span>
        )}
      </span>
      <Input
        ref={inputRef}
        value={input.value}
        readOnly={input.status === 'valid' || input.status === 'pending'}
        disabled={!isGameActive && input.status !== 'valid'}
        onClick={handleInputClick}
        onChange={e => isGameActive && input.status !== 'pending' && onInputChange(index, e.target.value)}
        onKeyDown={e => input.status !== 'pending' && onKeyDown(e, index)}
        spellCheck={true}
        lang="en"
        enterKeyHint="next"
        inputMode="text"
        autoComplete="on"
        autoCorrect="on"
        autoCapitalize="on"
        data-state={input.status}
        className={cn(
          input.status === 'valid' && "cursor-pointer",
          input.status === 'pending' && "cursor-wait",
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