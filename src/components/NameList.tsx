import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { NameCard } from './NameCard';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { type NameStats } from '@/services/api';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

interface NameListProps {
  stats: NameStats[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 10;

export function NameList({ stats, isLoading }: NameListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const selectedNameRef = useRef<HTMLTableRowElement>(null);

  const filteredStats = stats.filter(stat => 
    stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stat.variants.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredStats.length / ITEMS_PER_PAGE);
  const paginatedStats = filteredStats.slice(
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

  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Name Frequencies</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search names..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-8"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading names...</div>
      ) : (
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Variations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStats.map((stat) => (
                <TableRow
                  key={stat.name}
                  ref={selectedName === stat.name ? selectedNameRef : undefined}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedName(stat.name)}
                >
                  <TableCell className="font-medium">{stat.name}</TableCell>
                  <TableCell>{stat.count.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {stat.variants.length > 1 
                      ? stat.variants.slice(0, 2).join(', ') + 
                        (stat.variants.length > 2 ? '...' : '')
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4">
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <NameCard
            name={selectedName || ''}
            isOpen={!!selectedName}
            onClose={() => setSelectedName(null)}
            triggerRef={selectedNameRef}
          />
        </div>
      )}
    </Card>
  );
} 