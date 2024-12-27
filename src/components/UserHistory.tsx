import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, leaderboardApi, LeaderboardEntry } from '@/services/api';

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
  percentiles: {
    [key: number]: number;
  };
}

function calculatePercentile(score: number, leaderboardData: LeaderboardEntry[]): number {
  if (!leaderboardData.length) return 0;
  const position = leaderboardData.findIndex(entry => Number(entry.score) > score);
  if (position === -1) return 100;
  return Math.round((position / leaderboardData.length) * 100);
}

export function UserHistory() {
  const { id } = useParams();
  const [stats, setStats] = useState<ScoreStats | null>(null);

  // Query for user history
  const { data: userData, isLoading: isLoadingHistory } = useQuery({
    queryKey: QUERY_KEYS.userHistory(id || ''),
    queryFn: () => leaderboardApi.getUserHistory(id || ''),
    enabled: !!id,
  });

  // Queries for leaderboard data
  const { data: leaderboard20 } = useQuery({
    queryKey: QUERY_KEYS.leaderboard('20'),
    queryFn: () => leaderboardApi.getLeaderboard('20'),
    enabled: !!userData?.score,
  });

  const { data: leaderboard50 } = useQuery({
    queryKey: QUERY_KEYS.leaderboard('50'),
    queryFn: () => leaderboardApi.getLeaderboard('50'),
    enabled: !!userData?.score,
  });

  const { data: leaderboard100 } = useQuery({
    queryKey: QUERY_KEYS.leaderboard('100'),
    queryFn: () => leaderboardApi.getLeaderboard('100'),
    enabled: !!userData?.score,
  });

  useEffect(() => {
    if (!userData?.history) return;

    // Calculate stats as before
    const statCalc: ScoreStats = {
      averageTime: 0,
      bestTime: Infinity,
      totalGames: userData.history.length,
      gameModeCounts: {},
      percentiles: {} // New field for percentiles
    };

    let totalTime = 0;
    userData.history.forEach((entry: ScoreHistoryEntry) => {
      totalTime += entry.score;
      statCalc.bestTime = Math.min(statCalc.bestTime, entry.score);
      statCalc.gameModeCounts[entry.name_count] = 
        (statCalc.gameModeCounts[entry.name_count] || 0) + 1;
    });

    statCalc.averageTime = Math.round(totalTime / userData.history.length);

    // Calculate percentiles for each game mode
    if (leaderboard20) {
      const bestScore20 = userData.history
        .filter(entry => entry.name_count === 20)
        .reduce((min, entry) => Math.min(min, entry.score), Infinity);
      if (bestScore20 !== Infinity) {
        statCalc.percentiles[20] = calculatePercentile(bestScore20, leaderboard20);
      }
    }

    // Repeat for other game modes...
    if (leaderboard50) {
      const bestScore50 = userData.history
        .filter(entry => entry.name_count === 50)
        .reduce((min, entry) => Math.min(min, entry.score), Infinity);
      if (bestScore50 !== Infinity) {
        statCalc.percentiles[50] = calculatePercentile(bestScore50, leaderboard50);
      }
    }

    if (leaderboard100) {
      const bestScore100 = userData.history
        .filter(entry => entry.name_count === 100)
        .reduce((min, entry) => Math.min(min, entry.score), Infinity);
      if (bestScore100 !== Infinity) {
        statCalc.percentiles[100] = calculatePercentile(bestScore100, leaderboard100);
      }
    }

    setStats(statCalc);
  }, [userData?.history, leaderboard20, leaderboard50, leaderboard100]);

  if (isLoadingHistory) return <div>Loading...</div>;

  return (
    <Card className="p-4 md:p-6">
      {userData?.score && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span style={{ color: userData.score.username_color }}>
              {userData.score.username}
            </span>
          </h2>
          <time className="text-sm text-muted-foreground block mb-4">
            Joined {formatSubmissionDate(userData.score.submission_date)}
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
            {Object.entries(stats.percentiles).map(([mode, percentile]) => (
              <span key={mode}>
                {' '}Their best Name {mode} time ranks in the top {100 - percentile}% of all players.
              </span>
            ))}
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
        {userData?.history.map((entry) => (
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