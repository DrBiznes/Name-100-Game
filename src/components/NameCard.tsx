import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchWikipediaData, QUERY_KEYS } from '@/services/wikipediaService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="relative">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-md shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      ) : wikiData ? (
        <AnimatePresence mode="wait">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {wikiData.thumbnail && (
              <motion.div 
                className="w-24 h-24 rounded-md overflow-hidden float-left mr-4 mb-2"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <img
                  src={wikiData.thumbnail}
                  alt={wikiData.title}
                  className="object-cover w-full h-full"
                />
              </motion.div>
            )}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold">{wikiData.title}</h2>
              <p className="text-sm mb-2">
                {wikiData.extract}
              </p>
            </motion.div>
            <div className="clear-both" />
            <motion.a
              href={wikiData.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 inline-flex items-center gap-1 text-sm mx-auto w-fit"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>open_in_new</span>
              <span>Wikipedia</span>
            </motion.a>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No Wikipedia data found.
        </motion.p>
      )}
    </div>,
    document.body
  ) : null;
} 