import { useQuery } from '@tanstack/react-query';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { NameList } from '@/components/NameList';
import { QUERY_KEYS, statsApi, type StatsResponse } from '@/services/api';
import { Helmet } from 'react-helmet-async';
import { Separator } from './ui/separator';
import { RefreshTimer } from './ui/refresh-timer';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import nameDatabase from '@/lib/womendatabase.json';

// Helper function to normalize names for comparison (same as nameValidationService.ts)
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/-/g, ' ')               // Replace hyphens with spaces
    .replace(/\./g, '')              // Remove periods
    .trim();                          // Remove leading/trailing whitespace
}

// Helper function to capitalize name parts
const capitalizeNameParts = (name: string) => {
  return name.split(' ').map(part => {
    // Handle hyphenated names
    if (part.includes('-')) {
      return part.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-');
    }
    // Handle names with periods (like initials)
    if (part.includes('.')) {
      return part.toUpperCase();
    }
    // Regular capitalization
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join(' ');
};

// Helper function to find proper name from database
const findProperName = (name: string): string => {
  const normalizedInputName = normalizeNameForComparison(name);
  
  const databaseMatch = nameDatabase.names.find(dbName => 
    normalizeNameForComparison(dbName) === normalizedInputName
  );
  
  return databaseMatch || capitalizeNameParts(name);
};

function StatsTextSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-28 bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
          <Skeleton className="h-4 w-24 bg-muted" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-48 bg-muted" />
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>
        <div className="flex items-center flex-wrap gap-1">
          <Skeleton className="h-4 w-24 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
          <Skeleton className="h-4 w-28 bg-muted" />
          <Skeleton className="h-4 w-24 bg-muted" />
        </div>
      </div>
    </div>
  );
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export function Stats() {
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const { data: statsData, isLoading } = useQuery<StatsResponse>({
    queryKey: QUERY_KEYS.stats(selectedMode),
    queryFn: () => statsApi.getStats(selectedMode),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours - matches server cache
    gcTime: 12 * 60 * 60 * 1000, // 12 hours - align with server cache
    refetchInterval: (query) => {
      if (!query.state.data) return false;
      
      // Calculate time until cache expires
      const cacheTimestamp = new Date(query.state.data.cacheTimestamp).getTime();
      const expiresAt = cacheTimestamp + (query.state.data.cacheExpiresIn * 1000);
      const now = Date.now();
      
      return Math.max(expiresAt - now, 0);
    },
    // Only refetch when cache expires
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const renderStatsParagraph = () => {
    if (!statsData) return null;

    const topNames = statsData.stats.slice(0, 5);
    const commonMisspellings = statsData.stats
      .filter(stat => stat.variants.length > 1)
      .slice(0, 3);

    return (
      <div className="prose mb-8">
        <AnimatePresence mode="wait">
          <motion.div 
            className="text-base leading-relaxed text-muted-foreground space-y-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.p 
              custom={0} 
              variants={textVariants}
              className="space-y-1"
            >
              A total of{' '}
              <span className="font-bold text-foreground">
                {statsData.totalOccurrences.toLocaleString()}
              </span>{' '}
              names have been submitted across{' '}
              <span className="font-bold text-foreground">
                {statsData.totalNames.toLocaleString()}
              </span>{' '}
              unique women.
              
              {selectedMode !== 'all' && (
                <span>
                  {' '}These stats are filtered for Name {selectedMode} mode.
                </span>
              )}
            </motion.p>

            <motion.p 
              custom={1} 
              variants={textVariants}
              className="space-y-1"
            >
              The most frequently named women are{' '}
              {topNames.map((stat, index) => (
                <span key={stat.name}>
                  <span className="font-bold text-foreground">{findProperName(stat.name)}</span>
                  {' '}({stat.count.toLocaleString()} times)
                  {index < topNames.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </motion.p>

            {commonMisspellings.length > 0 && (
              <motion.p 
                custom={2} 
                variants={textVariants}
                className="space-y-1"
              >
                Common misspellings include{' '}
                {commonMisspellings.map((stat, index) => (
                  <span key={stat.name}>
                    <span className="font-bold text-foreground">{findProperName(stat.name)}</span>
                    {' '}(misspelled as: {stat.variants.slice(0, 3).join(', ')}
                    {stat.variants.length > 3 ? '...' : ''})
                    {index < commonMisspellings.length - 1 ? ', ' : '.'}
                  </span>
                ))}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Name100Women - Statistics {selectedMode !== 'all' ? `(Name ${selectedMode})` : ''}</title>
        <meta 
          name="description" 
          content={`Statistics for Name100Women game${selectedMode !== 'all' ? ` in Name ${selectedMode} mode` : ''} - View most named women and common variations.`} 
        />
      </Helmet>

      <div className="lg:col-span-1">
        <Card className="p-4 md:p-6 bg-transparent border-0 shadow-none">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold font-['Chonburi'] text-header leading-none text-glow flex items-center gap-3">
                <span className="material-icons text-header text-3xl">leaderboard</span>
                Stats
              </h2>
              <Select
                value={selectedMode}
                onValueChange={setSelectedMode}
              >
                <SelectTrigger className="w-[160px] font-['Alegreya'] h-8 -mt-3">
                  <SelectValue placeholder="Select game mode">
                    {selectedMode === 'all' ? 'All Modes' : `Name ${selectedMode}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-['Alegreya']">All Modes</SelectItem>
                  <SelectItem value="20" className="font-['Alegreya']">Name 20</SelectItem>
                  <SelectItem value="50" className="font-['Alegreya']">Name 50</SelectItem>
                  <SelectItem value="100" className="font-['Alegreya']">Name 100</SelectItem>
                </SelectContent>
              </Select>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="material-icons text-muted-foreground hover:text-header cursor-help transition-colors -mt-3">info</span>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="w-80 bg-card text-card-foreground border-border shadow-lg"
                  sideOffset={8}
                >
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="material-icons text-header">info</span>
                      <p className="text-sm font-['Alegreya'] text-card-foreground">
                        Statistics are updated every 12 hours
                      </p>
                    </div>
                    {statsData && (
                      <RefreshTimer
                        cacheTimestamp={statsData.cacheTimestamp}
                        cacheExpiresIn={statsData.cacheExpiresIn}
                      />
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          
          <div className="mb-6">
            <Separator className="my-2" />
          </div>

          {isLoading ? (
            <StatsTextSkeleton />
          ) : statsData ? (
            renderStatsParagraph()
          ) : (
            <div className="font-['Alegreya'] text-destructive">Failed to load stats</div>
          )}
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <NameList 
          stats={statsData?.stats || []} 
          isLoading={isLoading}
        />
      </div>
    </>
  );
} 