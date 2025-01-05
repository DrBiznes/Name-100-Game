import { useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { NameInput } from './NameInput';
import { formatTime } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS, leaderboardApi, LeaderboardEntry, ScoreData } from '@/services/api';
import { Button } from './ui/button';
import { toast } from "sonner";
import { UsernameBadge } from './ui/UsernameBadge';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const sharedAnimationVariants = {
  initial: { 
    opacity: 0,
    y: 20,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const gridVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

function ScoreViewSkeleton() {
  return (
    <motion.div 
      className="space-y-6"
      variants={sharedAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-center flex items-center gap-2">
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 bg-card/50">
            <Skeleton className="h-4 w-16 bg-muted" /> {/* Username */}
          </div>
          <span className="text-glow">Named XX in{' '}
            <span className="font-['Chonburi'] font-mono opacity-50">0:00</span>
          </span>
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          disabled
          className="rounded-full bg-transparent border-0 shadow-none opacity-50 -mt-3"
        >
          <span className="material-icons text-foreground/80">ios_share</span>
        </Button>
      </div>

      {/* Name Grid Skeleton */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        variants={gridVariants}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
          >
            <div className="relative flex items-center bg-[var(--table-row-light)] rounded-md p-2 border border-border/50">
              <div className="absolute left-2 flex items-center gap-2">
                <span className="material-icons text-muted-foreground text-base">check</span>
              </div>
              <Skeleton className="h-6 ml-8 w-[calc(100%-2rem)] bg-muted rounded-sm" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// Helper function to convert hex to RGB
function hexToRGB(hex: string) {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

export function ScoreView() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  
  const { data: userData, isLoading, error } = useQuery<ScoreData, Error>({
    queryKey: QUERY_KEYS.userScore(id || ''),
    queryFn: async () => {
      // First, try to find the complete score in existing user history queries
      const historyQueries = queryClient.getQueriesData<{ scores: Record<string, ScoreData> }>({ 
        queryKey: ['userHistory'] 
      });
      
      for (const [, data] of historyQueries) {
        if (data?.scores?.[id!]) {
          return data.scores[id!];
        }
      }

      // Then check leaderboard caches for partial data
      const leaderboardModes = ['20', '50', '100'] as const;
      for (const mode of leaderboardModes) {
        const leaderboardData = queryClient.getQueryData<{ leaderboard: LeaderboardEntry[] }>(
          QUERY_KEYS.leaderboard(mode)
        );
        const scoreFromLeaderboard = leaderboardData?.leaderboard.find(entry => entry.id === id);
        if (scoreFromLeaderboard) {
          // Found in leaderboard, but need to fetch full data
          const result = await leaderboardApi.getUserHistory(id || '');
          return result.score;
        }
      }

      // Check recent scores cache
      for (const mode of leaderboardModes) {
        const recentData = queryClient.getQueryData<LeaderboardEntry[]>(
          QUERY_KEYS.recentScores(mode)
        );
        const scoreFromRecent = recentData?.find(entry => entry.id === id);
        if (scoreFromRecent) {
          // Found in recent scores, but need to fetch full data
          const result = await leaderboardApi.getUserHistory(id || '');
          return result.score;
        }
      }
      
      // If not found in any cache, fetch it
      const result = await leaderboardApi.getUserHistory(id || '');
      return result.score;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes to match server cache
  });

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Score',
        url: window.location.href
      });
      toast.success('Shared successfully!');
    } catch (err) {
      // If Web Share API fails or isn't supported, fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (clipboardErr) {
        toast.error('Failed to share or copy link');
      }
    }
  };

  return (
    <Card className="p-4 md:p-6 h-full overflow-auto border-0 shadow-none bg-transparent">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <ScoreViewSkeleton key="skeleton" />
        ) : error ? (
          <motion.div
            key="error"
            variants={sharedAnimationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Error: {error instanceof Error ? error.message : 'Failed to load score'}
          </motion.div>
        ) : !userData ? (
          <motion.div
            key="not-found"
            variants={sharedAnimationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            Score not found
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={sharedAnimationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-center flex items-center gap-2">
                {(() => {
                  const rgb = hexToRGB(userData.username_color);
                  return (
                    <UsernameBadge 
                      username={userData.username}
                      color={userData.username_color}
                      className="text-sm [text-shadow:0_0_10px_rgba(var(--badge-glow-r),var(--badge-glow-g),var(--badge-glow-b),0.3),0_0_20px_rgba(var(--badge-glow-r),var(--badge-glow-g),var(--badge-glow-b),0.2)] [box-shadow:0_0_10px_rgba(var(--badge-glow-r),var(--badge-glow-g),var(--badge-glow-b),0.3),0_0_20px_rgba(var(--badge-glow-r),var(--badge-glow-g),var(--badge-glow-b),0.2)]"
                      style={{ 
                        borderColor: userData.username_color,
                        color: userData.username_color,
                        '--badge-glow-r': rgb.r,
                        '--badge-glow-g': rgb.g,
                        '--badge-glow-b': rgb.b,
                      } as React.CSSProperties}
                    />
                  );
                })()}
                <span className="text-glow">Named {userData.name_count} in{' '}
                <span className="font-['Chonburi']">{formatTime(userData.score)}</span></span>
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleShare}
                className="rounded-full bg-transparent hover:bg-accent/10 border-0 shadow-none -mt-3"
              >
                <span className="material-icons text-foreground/80 hover:text-foreground">ios_share</span>
              </Button>
            </div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={gridVariants}
            >
              {userData.completed_names.map((name: string, index: number) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                >
                  <NameInput
                    input={{
                      index,
                      value: name,
                      status: 'valid'
                    }}
                    index={index}
                    isGameActive={false}
                    inputRef={() => {}}
                    onInputChange={() => {}}
                    onKeyDown={() => {}}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 