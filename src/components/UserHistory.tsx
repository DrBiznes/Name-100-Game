import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, leaderboardApi, LeaderboardEntry } from '@/services/api';
import { User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

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
  worstTime: number;
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

const ITEMS_PER_PAGE = 3;

function UserHistorySkeleton() {
  return (
    <div className="space-y-4">
      {/* User Header Skeleton */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="h-4 w-4" />
          <Skeleton className="h-4 w-24 bg-muted" />
        </div>
        <Skeleton className="h-8 w-48 bg-muted mb-2" /> {/* Username */}
        <Skeleton className="h-4 w-32 bg-muted" /> {/* Join date */}
      </div>

      {/* Stats Skeleton - More compact layout */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32 bg-muted" />
          <Skeleton className="h-4 w-16 bg-muted" />
          <Skeleton className="h-4 w-24 bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28 bg-muted" />
          <Skeleton className="h-4 w-20 bg-muted" />
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-36 bg-muted" />
          <Skeleton className="h-4 w-24 bg-muted" />
        </div>
      </div>

      {/* Recent Games Skeleton */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-32 bg-muted" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 bg-muted" />
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i}
            className={`block ${i % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'} mb-1`}
          >
            <div className="flex items-center justify-between py-2 px-3 rounded-lg">
              <div className="flex flex-col gap-0.5">
                <Skeleton className="h-5 w-24 bg-muted" />
                <Skeleton className="h-4 w-32 bg-muted" />
              </div>
              <Skeleton className="h-6 w-20 bg-muted" />
            </div>
          </div>
        ))}
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

    const statCalc: ScoreStats = {
      averageTime: 0,
      bestTime: Infinity,
      worstTime: -Infinity,
      totalGames: userData.history.length,
      gameModeCounts: {},
      percentiles: {}
    };

    let totalTime = 0;
    userData.history.forEach((entry: ScoreHistoryEntry) => {
      totalTime += entry.score;
      statCalc.bestTime = Math.min(statCalc.bestTime, entry.score);
      statCalc.worstTime = Math.max(statCalc.worstTime, entry.score);
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
        statCalc.percentiles[20] = calculatePercentile(bestScore20, leaderboard20.leaderboard);
      }
    }

    // Repeat for other game modes...
    if (leaderboard50) {
      const bestScore50 = userData.history
        .filter(entry => entry.name_count === 50)
        .reduce((min, entry) => Math.min(min, entry.score), Infinity);
      if (bestScore50 !== Infinity) {
        statCalc.percentiles[50] = calculatePercentile(bestScore50, leaderboard50.leaderboard);
      }
    }

    if (leaderboard100) {
      const bestScore100 = userData.history
        .filter(entry => entry.name_count === 100)
        .reduce((min, entry) => Math.min(min, entry.score), Infinity);
      if (bestScore100 !== Infinity) {
        statCalc.percentiles[100] = calculatePercentile(bestScore100, leaderboard100.leaderboard);
      }
    }

    setStats(statCalc);
  }, [userData?.history, leaderboard20, leaderboard50, leaderboard100]);

  if (isLoadingHistory) {
    return (
      <Card className="p-4 md:p-6 border-0 shadow-none bg-transparent">
        <UserHistorySkeleton />
      </Card>
    );
  }

  return (
    <>
      {userData?.score && (
        <Helmet>
          <title>Name100Women - {userData.score.username}'s Profile</title>
          <meta 
            name="description" 
            content={`View ${userData.score.username}'s game history and stats - ${stats?.totalGames || 0} games played with best time of ${stats ? formatTime(stats.bestTime) : 'N/A'}`} 
          />
        </Helmet>
      )}

      <Card className="p-4 md:p-6 border-0 shadow-none bg-transparent">
        {userData?.score && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>Submitted by</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              <span style={{ color: userData.score.username_color }}>
                {userData.score.username}
              </span>
            </h2>
            <time className="text-sm text-muted-foreground">
              Joined {formatSubmissionDate(userData.history.reduce((earliest, entry) => 
                new Date(entry.submission_date) < new Date(earliest) ? entry.submission_date : earliest,
                userData.history[0].submission_date
              ))}
            </time>
          </motion.div>
        )}

        {stats && (
          <div className="mb-4">
            <AnimatePresence mode="wait">
              <motion.div 
                className="text-base text-muted-foreground space-y-2"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div 
                  custom={0} 
                  variants={textVariants}
                  className="flex items-center gap-1 flex-wrap"
                >
                  <span>This player has completed</span>
                  <span className="font-bold text-foreground">{stats.totalGames} games.</span>
                  {userData?.score && (
                    <>
                      <span>This attempt submitted on</span>
                      <span className="font-bold text-foreground">{formatSubmissionDate(userData.score.submission_date)}</span>
                      <span>took them</span>
                      <span className="font-mono font-bold text-foreground">{formatTime(userData.score.score)}</span>
                      <span>to name {userData.score.name_count} women.</span>
                    </>
                  )}
                </motion.div>

                <motion.div 
                  custom={1} 
                  variants={textVariants}
                  className="flex items-center gap-1 flex-wrap"
                >
                  <span>They have played</span>
                  {Object.entries(stats.gameModeCounts).map(([mode, count], index, arr) => (
                    <span key={mode}>
                      <span className="font-bold text-foreground">{count} games</span>
                      <span>of Name {mode}{index < arr.length - 1 ? ", " : "."}</span>
                    </span>
                  ))}
                </motion.div>

                <motion.div 
                  custom={2} 
                  variants={textVariants}
                  className="flex items-center gap-1 flex-wrap"
                >
                  {Object.entries(stats.percentiles).map(([mode, percentile], index) => (
                    <span key={mode}>
                      {index === 0 ? "Their " : "and their "}
                      <span>best Name {mode} time ranks in the</span>
                      <span className="font-bold text-foreground">top {100 - percentile}%</span>
                      <span>of all players{index === Object.entries(stats.percentiles).length - 1 ? "." : ", "}</span>
                    </span>
                  ))}
                </motion.div>

                <motion.div 
                  custom={3} 
                  variants={textVariants}
                  className="flex items-center gap-1 flex-wrap"
                >
                  <span>Their fastest completion time is</span>
                  <span className="font-mono font-bold text-foreground">{formatTime(stats.bestTime)}</span>
                  <span>and their slowest is</span>
                  <span className="font-mono font-bold text-foreground">{formatTime(stats.worstTime)}</span>
                  <span>with an average completion time of</span>
                  <span className="font-mono font-bold text-foreground">{formatTime(stats.averageTime)}</span>
                  <span>.</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-header text-glow">
              <span className="material-icons">history</span>
              Recent Games
            </h3>
            <div className="flex items-center gap-1 text-sm">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-muted/50 rounded disabled:opacity-50"
              >
                <span className="material-icons text-sm">navigate_before</span>
              </button>
              <span className="px-2">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-muted/50 rounded disabled:opacity-50"
              >
                <span className="material-icons text-sm">navigate_next</span>
              </button>
            </div>
          </div>
          {paginatedHistory?.map((entry, index) => (
            <Link 
              key={entry.id}
              to={`/scores/${entry.id}`}
              className={`block hover:bg-muted transition-colors ${index % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'}`}
            >
              <div className="flex items-center justify-between py-2 px-3 rounded-lg">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium leading-tight">Name {entry.name_count}</span>
                  <span className="text-sm text-muted-foreground leading-tight">
                    {formatSubmissionDate(entry.submission_date)}
                  </span>
                </div>
                <span className="font-mono text-lg font-medium">
                  {formatTime(entry.score)}
                </span>
              </div>
            </Link>
          ))}
        </motion.div>
      </Card>
    </>
  );
} 