import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, leaderboardApi, LeaderboardEntry } from '@/services/api';
import { User } from 'lucide-react';
import { Pagination, PaginationItem, PaginationLink, PaginationContent, PaginationPrevious, PaginationNext, PaginationEllipsis } from './ui/pagination';

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

const ITEMS_PER_PAGE = 10;

export function UserHistory() {
  const { id } = useParams();
  const [stats, setStats] = useState<ScoreStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Query for user history - simplified to single request
  const { data: userData, isLoading: isLoadingHistory } = useQuery({
    queryKey: QUERY_KEYS.userHistory(id || ''),
    queryFn: () => leaderboardApi.getUserHistory(id || ''),
    enabled: !!id,
  });

  // Calculate paginated data
  const paginatedHistory = userData?.history?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Update renderPaginationItems to use full history length
  const renderPaginationItems = () => {
    const items = [];
    const totalPages = Math.ceil((userData?.history?.length || 0) / ITEMS_PER_PAGE);
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (
        i === currentPage - 2 ||
        i === currentPage + 2
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return items;
  };

  // Update pagination navigation
  const totalPages = Math.ceil((userData?.history?.length || 0) / ITEMS_PER_PAGE);

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
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <User className="h-4 w-4" />
            <span>Submitted by</span>
          </div>
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
                {' '}Their best Name {mode} time ranks in the{' '}
                <span className="font-bold text-foreground">
                  top {100 - percentile}%
                </span>{' '}
                of all players.
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
        {paginatedHistory?.map((entry) => (
          <Link 
            key={entry.id}
            to={`/scores/${entry.id}`}
            className="block hover:bg-muted transition-colors"
          >
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
          </Link>
        ))}
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
} 