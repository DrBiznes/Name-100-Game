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
        <p className="text-base leading-relaxed text-muted-foreground space-y-1">
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

          <br /><br />
          The most frequently named women are{' '}
          {topNames.map((stat, index) => (
            <span key={stat.name}>
              <span className="font-bold text-foreground">{stat.name}</span>
              {' '}({stat.count.toLocaleString()} times)
              {index < topNames.length - 1 ? ', ' : '.'}
            </span>
          ))}

          {commonMisspellings.length > 0 && (
            <>
              <br /><br />
              Common variations in submissions include{' '}
              {commonMisspellings.map((stat, index) => (
                <span key={stat.name}>
                  <span className="font-bold text-foreground">{stat.name}</span>
                  {' '}(submitted as: {stat.variants.slice(0, 3).join(', ')}
                  {stat.variants.length > 3 ? '...' : ''})
                  {index < commonMisspellings.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </>
          )}
        </p>
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
            <div className="font-['Alegreya'] text-muted-foreground">Loading stats...</div>
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