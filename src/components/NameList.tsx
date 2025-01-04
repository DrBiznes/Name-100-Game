import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { NameCard } from './NameCard';
import { type NameStats } from '@/services/api';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import nameDatabase from '@/lib/womendatabase.json';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

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

function NameListSkeleton() {
  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-8">
          <Skeleton className="h-5 w-32 bg-muted" /> {/* Header - Name */}
          <Skeleton className="h-5 w-24 bg-muted" /> {/* Header - Frequency */}
          <Skeleton className="h-5 w-48 bg-muted" /> {/* Header - Variations */}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
            className={`flex items-center space-x-8 p-4 ${
              i % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'
            }`}
          >
            <Skeleton className="h-4 w-36 bg-muted" /> {/* Name */}
            <Skeleton className="h-4 w-20 bg-muted" /> {/* Frequency */}
            <Skeleton className="h-4 w-64 bg-muted" /> {/* Variations */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

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
        <div className="font-medium text-foreground">
          {findProperName(row.original.name)}
        </div>
      ),
      size: 200,
    },
    {
      accessorKey: "count",
      header: "Frequency",
      cell: ({ row }) => (
        <div className="text-foreground">
          {row.original.count.toLocaleString()}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "variants",
      header: "Misspellings",
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
        <h2 className="text-3xl font-bold font-['Chonburi'] text-header leading-none text-glow flex items-center gap-3">
          <span className="material-icons text-header text-3xl">military_tech</span>
          Most Popular Names
        </h2>
        <div className="relative w-64 -mt-2">
          <span className="material-icons absolute left-2 top-1 h-4 w-4 text-muted-foreground text-base">search</span>
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
        <NameListSkeleton />
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
              if (selectedNameRef.current) {
                selectedNameRef.current.click();
              }
            }}
            rowProps={(row: NameStats, index: number) => ({
              ref: selectedName === row.name ? selectedNameRef : undefined,
              className: `cursor-pointer border-border transition-colors ${
                index % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'
              } hover:bg-accent hover:bg-opacity-20 hover:text-accent-foreground ${
                selectedName === row.name ? 'bg-accent/20' : ''
              }`
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