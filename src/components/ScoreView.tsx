import { useParams } from 'react-router-dom';
import { Card } from './ui/card';
import { NameInput } from './NameInput';
import { formatTime } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, leaderboardApi } from '@/services/api';
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
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2 bg-card/50 px-3 py-1.5 rounded-full">
          <Skeleton className="h-5 w-16 bg-muted" /> {/* Username */}
        </div>
        <span className="text-xl">Named</span>
        <span className="text-xl">20</span>
        <span className="text-xl">in</span>
        <span className="font-['Chonburi'] text-xl">
          <Skeleton className="h-6 w-20 bg-muted rounded-md inline-block" /> {/* Time */}
        </span>
        <Button 
          variant="ghost" 
          size="icon"
          disabled
          className="rounded-full bg-transparent border-0 shadow-none opacity-50"
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

export function ScoreView() {
  const { id } = useParams();
  
  const { data: userData, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.userHistory(id || ''),
    queryFn: () => leaderboardApi.getUserHistory(id || ''),
    enabled: !!id,
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
        ) : !userData?.score ? (
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
                <UsernameBadge 
                  username={userData.score.username}
                  color={userData.score.username_color}
                  className="text-sm"
                />
                <span>Named {userData.score.name_count} in{' '}
                <span className="font-['Chonburi']">{formatTime(userData.score.score)}</span></span>
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleShare}
                className="rounded-full bg-transparent hover:bg-accent/10 border-0 shadow-none"
              >
                <span className="material-icons text-foreground/80 hover:text-foreground">ios_share</span>
              </Button>
            </div>

            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={gridVariants}
            >
              {userData.score.completed_names.map((name, index) => (
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