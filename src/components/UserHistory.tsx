import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { formatTime, formatSubmissionDate } from '@/lib/utils';

interface ScoreHistoryEntry {
  id: number;
  username: string;
  score: number;
  submission_date: string;
  name_count: number;
  username_color: string;
}

interface ScoreStats {
  averageTime: number;
  bestTime: number;
  totalGames: number;
  gameModeCounts: {
    [key: number]: number;
  };
}

interface ScoreData {
  id: string;
  username: string;
  username_color: string;
  score: number;
  submission_date: string;
  name_count: number;
  completed_names: string[];
}

export function UserHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState<ScoreHistoryEntry[]>([]);
  const [stats, setStats] = useState<ScoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/scores/${id}?include_history=true&history_limit=10`
        );
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch history');
        }

        setHistory(data.history);
        
        // Calculate stats
        const statCalc: ScoreStats = {
          averageTime: 0,
          bestTime: Infinity,
          totalGames: data.history.length,
          gameModeCounts: {}
        };

        let totalTime = 0;
        data.history.forEach((entry: ScoreHistoryEntry) => {
          totalTime += entry.score;
          statCalc.bestTime = Math.min(statCalc.bestTime, entry.score);
          statCalc.gameModeCounts[entry.name_count] = 
            (statCalc.gameModeCounts[entry.name_count] || 0) + 1;
        });

        statCalc.averageTime = Math.round(totalTime / data.history.length);
        setStats(statCalc);

        setScoreData(data.score);

      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <Card className="p-4 md:p-6">
      {scoreData && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span style={{ color: scoreData.username_color }}>
              {scoreData.username}
            </span>
          </h2>
          <time className="text-sm text-muted-foreground block mb-4">
            Joined {formatSubmissionDate(scoreData.submission_date)}
          </time>
        </div>
      )}

      {stats && (
        <div className="prose mb-8">
          <p className="text-sm leading-relaxed text-muted-foreground space-y-1">
            This player has completed{' '}
            <span className="font-bold text-foreground">{stats.totalGames} games</span>
            {stats.gameModeCounts[20] && (
              <>
                , including{' '}
                <span className="font-bold text-foreground">
                  {stats.gameModeCounts[20]} games
                </span>{' '}
                of Name 20
              </>
            )}
            {stats.gameModeCounts[50] && (
              <>
                {' and '}
                <span className="font-bold text-foreground">
                  {stats.gameModeCounts[50]} games
                </span>{' '}
                of Name 50
              </>
            )}
            {stats.gameModeCounts[100] && (
              <>
                {' and '}
                <span className="font-bold text-foreground">
                  {stats.gameModeCounts[100]} games
                </span>{' '}
                of Name 100
              </>
            )}.
            <br />
            Their best time is{' '}
            <span className="font-mono font-bold text-foreground">
              {formatTime(stats.bestTime)}
            </span>{' '}
            with an average completion time of{' '}
            <span className="font-mono font-bold text-foreground">
              {formatTime(stats.averageTime)}
            </span>.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recent Games</h3>
        {history.map((entry) => (
          <div 
            key={entry.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div className="flex flex-col">
              <span className="font-medium">Name {entry.name_count}</span>
              <span className="text-sm text-muted-foreground">
                {formatSubmissionDate(entry.submission_date)}
              </span>
            </div>
            <span className="font-mono text-lg font-bold">
              {formatTime(entry.score)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
} 