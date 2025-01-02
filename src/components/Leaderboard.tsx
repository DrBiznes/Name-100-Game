import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from './ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { formatTime, formatSubmissionDate } from '@/lib/utils';
import { QUERY_KEYS, leaderboardApi, LeaderboardEntry } from '@/services/api';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Separator } from './ui/separator';

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

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = leaderboardData?.totalPages || 0;
    
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
              className="font-['Alegreya']"
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
            <PaginationEllipsis className="font-['Alegreya']" />
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode as '20' | '50' | '100');
    setCurrentPage(1);
  };

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
            onClick={() => handleModeSelect('20')}
          >
            Name 20 Leaderboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-48 font-['Alegreya']"
            onClick={() => handleModeSelect('50')}
          >
            Name 50 Leaderboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-48 font-['Alegreya']"
            onClick={() => handleModeSelect('100')}
          >
            Name 100 Leaderboard
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <Select
              value={selectedMode}
              onValueChange={handleModeSelect}
            >
              <SelectTrigger className="w-[200px] font-['Alegreya']">
                <SelectValue placeholder="Select game mode">
                  Name {selectedMode} Leaderboard
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20" className="font-['Alegreya']">Name 20 Leaderboard</SelectItem>
                <SelectItem value="50" className="font-['Alegreya']">Name 50 Leaderboard</SelectItem>
                <SelectItem value="100" className="font-['Alegreya']">Name 100 Leaderboard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 font-['Alegreya']">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 font-['Alegreya']">
              {error instanceof Error ? error.message : 'An error occurred'}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 font-['Alegreya']">Rank</TableHead>
                    <TableHead className="font-['Alegreya']">ID</TableHead>
                    <TableHead className="font-['Alegreya']">Username</TableHead>
                    <TableHead className="font-['Alegreya']">Time</TableHead>
                    <TableHead className="text-right font-['Alegreya']">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-['Alegreya']">
                  {leaderboardData?.data.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
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
                <PaginationContent className="font-['Alegreya']">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(leaderboardData?.totalPages || 0, p + 1))}
                      className={`${currentPage === leaderboardData?.totalPages ? 'pointer-events-none opacity-50' : ''}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </>
      )}
    </div>
  );
} 