import React, { useEffect, useRef, useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { cn } from '@/lib/utils';

interface NoteProps {
  number: number;
  children: React.ReactNode;
}

export function Note({ number, children }: NoteProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateNotePosition = () => {
      if (!triggerRef.current || !noteRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const noteElement = noteRef.current;
      
      // Calculate the vertical position relative to the viewport
      noteElement.style.top = `${triggerRect.top}px`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const noteId = entry.target.getAttribute('data-note-trigger');
          const noteElement = document.querySelector(`[data-note="${noteId}"]`);
          
          if (noteElement) {
            if (entry.isIntersecting) {
              noteElement.classList.add('active');
              updateNotePosition();
            } else {
              noteElement.classList.remove('active');
            }
          }
        });
      },
      {
        rootMargin: '-10% 0px -30% 0px',
        threshold: [0, 0.2, 1]
      }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    // Update position on scroll and resize
    window.addEventListener('scroll', updateNotePosition);
    window.addEventListener('resize', updateNotePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateNotePosition);
      window.removeEventListener('resize', updateNotePosition);
    };
  }, [number]);

  const numberIndicatorClass = "inline-flex items-center justify-center px-2 h-[1.4em] text-sm font-['Alegreya'] bg-card text-primary rounded-full border border-primary";

  return (
    <>
      {/* Mobile hover card with touch support */}
      <HoverCard open={isOpen} onOpenChange={setIsOpen}>
        <HoverCardTrigger asChild>
          <span 
            ref={triggerRef}
            data-note-trigger={number}
            className={cn(numberIndicatorClass, "cursor-help align-text-top -mt-1")}
            onClick={() => setIsOpen(!isOpen)} // Toggle on click for mobile
            onTouchEnd={(e) => {
              e.preventDefault(); // Prevent default touch behavior
              setIsOpen(!isOpen);
            }}
          >
            {number}
          </span>
        </HoverCardTrigger>
        <HoverCardContent 
          className="font-['Alegreya'] md:hidden bg-card text-foreground"
          onPointerDownOutside={() => setIsOpen(false)} // Close when clicking outside
        >
          {children}
        </HoverCardContent>
      </HoverCard>

      {/* Desktop floating note */}
      <div 
        ref={noteRef}
        className="hidden md:block fixed note-content" 
        data-note={number}
        style={{
          right: 'calc(2rem + 2vw)',
          width: '18rem',
          maxWidth: '20rem',
          marginLeft: '2rem'
        }}
      >
        <div className="font-['Alegreya'] text-foreground">
          <div className="flex items-start gap-3">
            <span className={numberIndicatorClass}>
              {number}
            </span>
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 