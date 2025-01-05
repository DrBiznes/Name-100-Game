import { useState } from 'react';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { QUERY_KEYS, recentScoresApi, leaderboardApi, LeaderboardEntry } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Helmet } from 'react-helmet-async';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { UsernameBadge } from './ui/UsernameBadge';
import { Skeleton } from './ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ITEMS_PER_PAGE = 10;

const tableAnimationVariants = {
  initial: { 
    opacity: 0,
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
};

const rowVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

interface RecentScoresResponse {
  data: LeaderboardEntry[];
  totalPages: number;
}

function RecentScoresSkeleton() {
  return (
    <motion.div
      variants={tableAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="rounded-md border border-border bg-card"
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-16 bg-muted" /> {/* ID */}
          <Skeleton className="h-5 w-32 bg-muted" /> {/* Username */}
          <Skeleton className="h-5 w-20 bg-muted" /> {/* Time */}
          <Skeleton className="h-5 w-24 bg-muted" /> {/* Date */}
        </div>
      </div>
      <motion.div className="divide-y divide-border">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <motion.div
            key={i}
            variants={rowVariants}
            className={`flex items-center space-x-4 p-4 ${
              i % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'
            }`}
          >
            <Skeleton className="h-4 w-12 bg-muted" /> {/* ID */}
            <Skeleton className="h-4 w-40 bg-muted" /> {/* Username */}
            <Skeleton className="h-4 w-24 bg-muted" /> {/* Time */}
            <Skeleton className="h-4 w-32 bg-muted" /> {/* Date */}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function RecentScoresTable({
  data,
  isLoading,
  error,
  currentPage,
  onPageChange
}: {
  data: RecentScoresResponse | undefined;
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRowClick = async (row: LeaderboardEntry) => {
    // Prefetch the score data
    await queryClient.prefetchQuery({
      queryKey: ['score', row.id],
      queryFn: () => leaderboardApi.getUserHistory(row.id, true),
    });
    navigate(`/scores/${row.id}`);
  };

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row: { original } }) => (
        <span className="text-peach">
          #{original.id}
        </span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row: { original } }) => (
        <UsernameBadge 
          username={original.username}
          color={original.username_color}
        />
      ),
    },
    {
      accessorKey: "score",
      header: "Time",
      cell: ({ row: { original } }) => formatTime(Number(original.score)),
    },
    {
      accessorKey: "submission_date",
      header: "Date",
      cell: ({ row: { original } }) => formatSubmissionDate(original.submission_date),
    },
  ];

  if (isLoading) {
    return <RecentScoresSkeleton />;
  }

  if (error) {
    return (
      <motion.div 
        variants={tableAnimationVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-center text-red-500 py-8 font-['Alegreya']"
      >
        {error instanceof Error ? error.message : 'An error occurred'}
      </motion.div>
    );
  }

  const paginatedData = data?.data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      variants={tableAnimationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <DataTable
        columns={columns}
        data={paginatedData || []}
        pageCount={data?.totalPages || 1}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onRowClick={handleRowClick}
        rowProps={(_, index) => ({
          className: `cursor-pointer border-border transition-colors ${
            index % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'
          } hover:bg-accent hover:bg-opacity-20 hover:text-accent-foreground`
        })}
      />
    </motion.div>
  );
}

export function RecentScores() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMode, setSelectedMode] = useState<'20' | '50' | '100'>('100');

  const { data: recentScoresData, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.recentScores(selectedMode)],
    queryFn: async (): Promise<RecentScoresResponse> => {
      try {
        const response = await recentScoresApi.getRecentScores(selectedMode);
        const totalPages = Math.ceil(response.length / ITEMS_PER_PAGE);
        
        return { 
          data: response,
          totalPages 
        };
      } catch (err) {
        toast.error("Failed to load recent scores");
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <>
      <Helmet>
        <title>Name100Women - Recent Scores (Name {selectedMode})</title>
        <meta 
          name="description" 
          content={`View recent scores for Name${selectedMode} mode - See how others performed in the Name100Women challenge`} 
        />
      </Helmet>

      <div className="text-lg pt-4 font-['Alegreya']">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-2 font-['Chonburi'] text-glow">
          <span className="material-icons text-header">history</span>
          Recent Scores
        </h2>
        <div className="flex justify-center">
          <Separator className="my-2 w-2/3" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key="recent-scores-content"
            variants={tableAnimationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="flex justify-center items-center gap-2 mb-4">
              <Select
                value={selectedMode}
                onValueChange={(value) => {
                  setSelectedMode(value as '20' | '50' | '100');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[155px] font-['Alegreya']">
                  <SelectValue>
                    Name {selectedMode}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header" disabled className="font-['Alegreya'] font-semibold text-muted-foreground">
                    Game Mode
                  </SelectItem>
                  <SelectItem value="20" className="font-['Alegreya']">Name 20</SelectItem>
                  <SelectItem value="50" className="font-['Alegreya']">Name 50</SelectItem>
                  <SelectItem value="100" className="font-['Alegreya']">Name 100</SelectItem>
                </SelectContent>
              </Select>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="material-icons text-muted-foreground hover:text-header cursor-help transition-colors">info</span>
                </HoverCardTrigger>
                <HoverCardContent 
                  className="w-80 bg-card text-card-foreground border-border shadow-lg"
                  sideOffset={8}
                >
                  <div className="flex gap-2 items-center">
                    <span className="material-icons text-header">info</span>
                    <p className="text-sm font-['Alegreya'] text-card-foreground">
                      Click anywhere on a row to view the detailed score
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <RecentScoresTable
              data={recentScoresData}
              isLoading={isLoading}
              error={error}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
} 