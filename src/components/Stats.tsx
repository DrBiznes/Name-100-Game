import { useQuery } from '@tanstack/react-query';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';
import { NameList } from '@/components/NameList';
import { QUERY_KEYS, statsApi, type StatsResponse } from '@/services/api';

export function Stats() {
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const { data: statsData, isLoading } = useQuery<StatsResponse>({
    queryKey: QUERY_KEYS.stats(selectedMode),
    queryFn: () => statsApi.getStats(selectedMode),
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });

  const renderStatsParagraph = () => {
    if (!statsData) return null;

    const topNames = statsData.stats.slice(0, 5);
    const commonMisspellings = statsData.stats
      .filter(stat => stat.variants.length > 1)
      .slice(0, 3);

    return (
      <div className="prose mb-8">
        <p className="text-sm leading-relaxed text-muted-foreground space-y-1">
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
      <div className="lg:col-span-1">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Statistics</h2>
            <Select
              value={selectedMode}
              onValueChange={setSelectedMode}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select game mode">
                  {selectedMode === 'all' ? 'All Modes' : `Name ${selectedMode}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="20">Name 20</SelectItem>
                <SelectItem value="50">Name 50</SelectItem>
                <SelectItem value="100">Name 100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div>Loading stats...</div>
          ) : statsData ? (
            renderStatsParagraph()
          ) : (
            <div>Failed to load stats</div>
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