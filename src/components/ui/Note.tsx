import React, { useEffect, useRef } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { cn } from '@/lib/utils';

interface NoteProps {
  number: number;
  children: React.ReactNode;
}

export function Note({ number, children }: NoteProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const noteId = entry.target.getAttribute('data-note-trigger');
          const noteElement = document.querySelector(`[data-note="${noteId}"]`);
          
          if (noteElement) {
            if (entry.isIntersecting) {
              noteElement.classList.add('active');
            } else {
              noteElement.classList.remove('active');
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
      }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [number]);

  return (
    <>
      {/* Always render the hover card for mobile */}
      <HoverCard>
        <HoverCardTrigger asChild>
          <span 
            ref={triggerRef}
            data-note-trigger={number}
            className="inline-flex items-center justify-center w-5 h-5 text-sm font-['Alegreya'] bg-card text-primary rounded-full border border-primary cursor-help align-text-top -mt-1"
          >
            {number}
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="font-['Alegreya'] lg:hidden bg-card text-foreground">
          {children}
        </HoverCardContent>
      </HoverCard>

      {/* Render the floating note for desktop */}
      <div 
        className="hidden lg:block fixed right-[max(2rem,calc((100vw-90rem)/2+2rem))] w-72 note-content" 
        data-note={number}
        style={{
          maxWidth: 'calc((100vw - 90rem) / 2 + 16rem)'
        }}
      >
        <div className="bg-card p-4 rounded-lg border border-border shadow-lg font-['Alegreya'] text-foreground">
          {children}
        </div>
      </div>
    </>
  );
} 