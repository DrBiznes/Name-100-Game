import { useState, useEffect, useRef } from 'react';
import { fetchWikipediaData, WikiPageData } from '@/services/wikipediaService';

interface NameCardProps {
  name: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NameCard({ name, isOpen, onClose }: NameCardProps) {
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

  return isOpen ? (
    <div
      ref={cardRef}
      className="absolute z-10 w-80 max-w-md rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none top-full mt-2"
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
    </div>
  ) : null;
} 