import { useEffect, useState } from 'react';
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
import { formatTime } from '@/lib/utils';
import { API_URL } from '@/config';

interface LeaderboardEntry {
  id: string;
  username: string;
  color: string;
  completion_time: number;
  submitted_at: string;
}

interface LeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  cacheTimestamp: string;
  cacheExpiresIn: number;
}

const ITEMS_PER_PAGE = 10;
const CACHE_PREFIX = 'leaderboard_cache_';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

export function Leaderboard() {
  const [selectedMode, setSelectedMode] = useState<'20' | '50' | '100' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async (gameMode: string) => {
    const cacheKey = `${CACHE_PREFIX}${gameMode}`;
    const now = Date.now();
    
    // Check cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (now - timestamp < CACHE_DURATION) {
        setLeaderboardData(data);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/leaderboard/${gameMode}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      
      const data: LeaderboardResponse = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.leaderboard);
        
        // Cache the response
        localStorage.setItem(cacheKey, JSON.stringify({
          data: data.leaderboard,
          timestamp: now
        }));
      } else {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMode) {
      fetchLeaderboard(selectedMode);
    }
  }, [selectedMode]);

  const totalPages = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE);
  const paginatedData = leaderboardData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationItems = () => {
    const items = [];
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

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode as '20' | '50' | '100');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Trophy className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      {!selectedMode ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <Button
            variant="outline"
            size="lg"
            className="w-48"
            onClick={() => handleModeSelect('20')}
          >
            Name 20 Leaderboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-48"
            onClick={() => handleModeSelect('50')}
          >
            Name 50 Leaderboard
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-48"
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
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select game mode">
                  Name {selectedMode} Leaderboard
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">Name 20 Leaderboard</SelectItem>
                <SelectItem value="50">Name 50 Leaderboard</SelectItem>
                <SelectItem value="100">Name 100 Leaderboard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((entry, index) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
                      <TableCell>
                        <span style={{ color: entry.color }}>
                          {entry.username}
                        </span>
                      </TableCell>
                      <TableCell>{formatTime(entry.completion_time)}</TableCell>
                      <TableCell className="text-right">
                        {new Date(entry.submitted_at).toLocaleDateString()}
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
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
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