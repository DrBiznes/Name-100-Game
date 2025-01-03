import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { QUERY_KEYS, leaderboardApi, LeaderboardEntry } from '@/services/api';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const ITEMS_PER_PAGE = 10;

interface LeaderboardResponse {
  data: LeaderboardEntry[];
  totalPages: number;
}

export function Leaderboard() {
  const [selectedMode, setSelectedMode] = useState<'20' | '50' | '100' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.leaderboard(selectedMode || ''), currentPage],
    queryFn: async (): Promise<LeaderboardResponse> => {
      if (!selectedMode) return { data: [], totalPages: 0 };
      
      try {
        const response = await leaderboardApi.getLeaderboard(selectedMode);
        const sortedData = [...response].sort((a, b) => a.score - b.score);
        const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
        const paginatedData = sortedData.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        );
        
        return { 
          data: paginatedData, 
          totalPages 
        };
      } catch (err) {
        toast.error("Failed to load leaderboard");
        throw err;
      }
    },
    enabled: !!selectedMode,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row: { original, index } }) => (
        <Link 
          to={`/scores/${original.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
        </Link>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row: { original } }) => (
        <Link 
          to={`/scores/${original.id}`}
          className="hover:underline"
        >
          <span style={{ color: original.username_color }}>
            {original.username}
          </span>
        </Link>
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

  return (
    <div className="text-lg pt-4 font-['Alegreya']">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-2 font-['Chonburi']">
        <Trophy className="h-6 w-6" />
        Leaderboard
      </h2>
      <div className="flex justify-center">
        <Separator className="my-2 w-2/3" />
      </div>

      {!selectedMode ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <Button
            variant="outline"
            size="lg"
            className="w-48 font-['Alegreya']"
            onClick={() => setSelectedMode('20')}
          >
            Name 20 Leaderboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-48 font-['Alegreya']"
            onClick={() => setSelectedMode('50')}
          >
            Name 50 Leaderboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-48 font-['Alegreya']"
            onClick={() => setSelectedMode('100')}
          >
            Name 100 Leaderboard
          </Button>
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="text-center py-8 font-['Alegreya']">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 font-['Alegreya']">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          ) : (
            <>
              <div className="text-center text-muted-foreground mb-4 font-['Alegreya']">
                Click on any rank number or username to view the detailed score
              </div>
              <DataTable
                columns={columns}
                data={leaderboardData?.data || []}
                pageCount={leaderboardData?.totalPages || 1}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                gameMode={selectedMode}
                onGameModeChange={(mode) => {
                  setSelectedMode(mode);
                  setCurrentPage(1);
                }}
              />
            </>
          )}
        </>
      )}
    </div>
  );
} 