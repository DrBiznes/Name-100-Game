import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { fetchWikipediaData, WikiPageData } from '@/services/wikipediaService';

interface NameCardProps {
  name: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
}

export function NameCard({ name, isOpen, onClose, triggerRef }: NameCardProps) {
  const [wikiData, setWikiData] = useState<WikiPageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchWikipediaData(name);
      setWikiData(data);
      setIsLoading(false);
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, name]);

  useEffect(() => {
    if (isOpen && cardRef.current && triggerRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect();
      const card = cardRef.current;
      
      card.style.position = 'fixed';
      card.style.top = `${trigger.bottom + window.scrollY + 8}px`;
      card.style.left = `${trigger.left + window.scrollX}px`;
    }
  }, [isOpen]);

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