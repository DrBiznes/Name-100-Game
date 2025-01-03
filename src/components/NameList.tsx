import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { NameCard } from './NameCard';
import { type NameStats } from '@/services/api';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import nameDatabase from '@/lib/womendatabase.json';

interface NameListProps {
  stats: NameStats[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 10;

// Helper function to normalize names for comparison (same as nameValidationService.ts)
function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .replace(/-/g, ' ')               // Replace hyphens with spaces
    .replace(/\./g, '')              // Remove periods
    .trim();                          // Remove leading/trailing whitespace
}

// Helper function to capitalize name parts
const capitalizeNameParts = (name: string) => {
  return name.split(' ').map(part => {
    // Handle hyphenated names
    if (part.includes('-')) {
      return part.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('-');
    }
    // Handle names with periods (like initials)
    if (part.includes('.')) {
      return part.toUpperCase();
    }
    // Regular capitalization
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  }).join(' ');
};

// Helper function to find proper name from database
const findProperName = (name: string): string => {
  const normalizedInputName = normalizeNameForComparison(name);
  
  const databaseMatch = nameDatabase.names.find(dbName => 
    normalizeNameForComparison(dbName) === normalizedInputName
  );
  
  return databaseMatch || capitalizeNameParts(name);
};

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

  const columns: ColumnDef<NameStats>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {findProperName(row.original.name)}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "count",
      header: "Frequency",
      cell: ({ row }) => row.original.count.toLocaleString(),
      size: 150,
    },
    {
      accessorKey: "variants",
      header: "Variations",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.original.variants.length > 1 
            ? row.original.variants.slice(0, 2).join(', ') + 
              (row.original.variants.length > 2 ? '...' : '')
            : '-'
          }
        </div>
      ),
      size: 300,
    },
  ];

  return (
    <Card className="p-4 md:p-6 bg-transparent border-0 shadow-none">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold font-['Chonburi'] text-header leading-none">Name Frequencies</h2>
        <div className="relative w-64 -mt-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search names..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-8 font-['Alegreya'] bg-muted text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-8"
          />
        </div>
      </div>

      <div className="mb-6">
        <Separator className="my-2" />
      </div>

      {isLoading ? (
        <div className="text-center py-8 font-['Alegreya'] text-muted-foreground">Loading names...</div>
      ) : (
        <div className="relative">
          <DataTable
            columns={columns}
            data={paginatedStats}
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onRowClick={(row: NameStats) => {
              setSelectedName(row.name);
              // Update the ref for the NameCard
              if (selectedNameRef.current) {
                selectedNameRef.current.click();
              }
            }}
            rowProps={(row: NameStats) => ({
              ref: selectedName === row.name ? selectedNameRef : undefined,
              className: "cursor-pointer"
            })}
          />

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