import { useState } from 'react';
import { History } from 'lucide-react';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { QUERY_KEYS, recentScoresApi, LeaderboardEntry } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Helmet } from 'react-helmet-async';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { UsernameBadge } from './ui/UsernameBadge';

const ITEMS_PER_PAGE = 10;

interface RecentScoresResponse {
  data: LeaderboardEntry[];
  totalPages: number;
}

// Separate table component to prevent full remounts
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
    return <div className="text-center py-8 font-['Alegreya'] text-muted-foreground">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8 font-['Alegreya']">
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }

  const paginatedData = data?.data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DataTable
      columns={columns}
      data={paginatedData || []}
      pageCount={data?.totalPages || 1}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onRowClick={(row) => navigate(`/scores/${(row as LeaderboardEntry).id}`)}
      rowProps={(_, index) => ({
        className: `cursor-pointer border-border transition-colors ${
          index % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'
        } hover:bg-accent hover:bg-opacity-20 hover:text-accent-foreground`
      })}
    />
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
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-2 font-['Chonburi']">
          <History className="h-6 w-6" />
          Recent Scores
        </h2>
        <div className="flex justify-center">
          <Separator className="my-2 w-2/3" />
        </div>

        <div className="flex justify-center items-center gap-2 mb-4">
          <Select
            value={selectedMode}
            onValueChange={(value) => {
              setSelectedMode(value as '20' | '50' | '100');
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] font-['Alegreya']">
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
              <div className="flex gap-2 items-start">
                <span className="material-icons text-header text-lg">info</span>
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
      </div>
    </>
  );
} 