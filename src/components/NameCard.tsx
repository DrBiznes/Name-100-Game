import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchWikipediaData, QUERY_KEYS } from '@/services/wikipediaService';
import { useQuery } from '@tanstack/react-query';

interface NameCardProps {
  name: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export function NameCard({ name, isOpen, onClose, triggerRef }: NameCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: wikiData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.wikiData(name),
    queryFn: () => fetchWikipediaData(name),
    enabled: isOpen, // Only fetch when card is open
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
  });

  const updatePosition = () => {
    if (cardRef.current && triggerRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect();
      const card = cardRef.current;
      const viewportHeight = window.innerHeight;
      
      // Calculate if there's room below the trigger
      const spaceBelow = viewportHeight - trigger.bottom;
      const cardHeight = card.offsetHeight;
      
      // Position horizontally
      let left = trigger.left + window.scrollX;
      
      // Position vertically - if not enough space below, show above
      let top;
      if (spaceBelow >= cardHeight || spaceBelow >= 200) { // 200px as minimum space
        top = trigger.bottom + window.scrollY + 8;
      } else {
        top = trigger.top + window.scrollY - cardHeight - 8;
      }
      
      // Prevent card from going off-screen horizontally
      const rightEdge = left + card.offsetWidth;
      if (rightEdge > window.innerWidth) {
        left = window.innerWidth - card.offsetWidth - 16;
      }
      
      card.style.position = 'absolute';
      card.style.top = `${top}px`;
      card.style.left = `${left}px`;
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen, wikiData]);

  const handleClickOutside = (event: MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return isOpen ? createPortal(
    <div
      ref={cardRef}
      className="fixed z-50 w-80 max-w-md rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
      style={{ position: 'absolute' }}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="material-icons animate-spin text-lg">refresh</span>
          <span>Loading...</span>
        </div>
      ) : wikiData ? (
        <div className="relative">
          {wikiData.thumbnail && (
            <div className="w-24 h-24 rounded-md overflow-hidden float-left mr-4 mb-2">
              <img
                src={wikiData.thumbnail}
                alt={wikiData.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-lg font-bold">{wikiData.title}</h2>
            <p className="text-sm mb-2">
              {wikiData.extract}
            </p>
          </div>
          <div className="clear-both" />
          <a
            href={wikiData.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-2 inline-flex items-center gap-1 text-sm mx-auto w-fit"
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>open_in_new</span>
            <span>Wikipedia</span>
          </a>
        </div>
      ) : (
        <p>No Wikipedia data found.</p>
      )}
    </div>,
    document.body
  ) : null;
} 