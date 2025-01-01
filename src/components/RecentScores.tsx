import { useState } from 'react';
import { History } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { QUERY_KEYS, recentScoresApi, LeaderboardEntry } from '@/services/api';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ITEMS_PER_PAGE = 10;

interface RecentScoresResponse {
  data: LeaderboardEntry[];
  totalPages: number;
}

export function RecentScores() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMode, setSelectedMode] = useState<'20' | '50' | '100'>('100');

  const { data: recentScoresData, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.recentScores(selectedMode), currentPage],
    queryFn: async (): Promise<RecentScoresResponse> => {
      try {
        const response = await recentScoresApi.getRecentScores(selectedMode, ITEMS_PER_PAGE);
        const totalPages = Math.ceil(response.length / ITEMS_PER_PAGE);
        const paginatedData = response.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        );
        
        return { 
          data: paginatedData, 
          totalPages 
        };
      } catch (err) {
        toast.error("Failed to load recent scores");
        throw err;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = recentScoresData?.totalPages || 0;
    
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <History className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Recent Scores</h2>
      </div>

      <div className="flex justify-center">
        <Select
          value={selectedMode}
          onValueChange={(value) => {
            setSelectedMode(value as '20' | '50' | '100');
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select game mode">
              Name {selectedMode} Mode
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">Name 20 Mode</SelectItem>
            <SelectItem value="50">Name 50 Mode</SelectItem>
            <SelectItem value="100">Name 100 Mode</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentScoresData?.data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Link 
                      to={`/scores/${entry.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      #{entry.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: entry.username_color }}>
                      {entry.username}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatTime(Number(entry.score))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatSubmissionDate(entry.submission_date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
                  onClick={() => setCurrentPage(p => Math.min(recentScoresData?.totalPages || 0, p + 1))}
                  className={currentPage === recentScoresData?.totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
} 