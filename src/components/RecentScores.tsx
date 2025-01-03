import { useState } from 'react';
import { History } from 'lucide-react';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { QUERY_KEYS, recentScoresApi, LeaderboardEntry } from '@/services/api';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Helmet } from 'react-helmet-async';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const ITEMS_PER_PAGE = 10;

interface RecentScoresResponse {
  data: LeaderboardEntry[];
  totalPages: number;
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

  const paginatedData = recentScoresData?.data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row: { original } }) => (
        <Link 
          to={`/scores/${original.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          #{original.id}
        </Link>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row: { original } }) => (
        <span style={{ color: original.username_color }}>
          {original.username}
        </span>
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
    <>
      <Helmet>
        <title>Name100Women - Recent Scores (Name {selectedMode})</title>
        <meta 
          name="description" 
          content={`View recent scores for Name${selectedMode} mode - See how others performed in the Name100Women challenge`} 
        />
      </Helmet>

      <div className="text-lg pt-4 font-['Alegreya']">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-2 font-['Chonburi']">
          <History className="h-6 w-6" />
          Recent Scores
        </h2>
        <div className="flex justify-center">
          <Separator className="my-2 w-2/3" />
        </div>

        {isLoading ? (
          <div className="text-center py-8 font-['Alegreya']">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 font-['Alegreya']">
            {error instanceof Error ? error.message : 'An error occurred'}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={paginatedData || []}
            pageCount={recentScoresData?.totalPages || 1}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            gameMode={selectedMode}
            onGameModeChange={(mode) => {
              setSelectedMode(mode);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </>
  );
} 