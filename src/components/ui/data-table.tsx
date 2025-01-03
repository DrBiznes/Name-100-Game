import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  gameMode?: '20' | '50' | '100'
  onGameModeChange?: (mode: '20' | '50' | '100') => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount = 1,
  currentPage = 1,
  onPageChange,
  gameMode,
  onGameModeChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const renderPaginationItems = () => {
    const items = []
    
    for (let i = 1; i <= pageCount; i++) {
      if (
        i === 1 ||
        i === pageCount ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange?.(i)}
              isActive={currentPage === i}
              className="font-['Alegreya'] hover:bg-accent hover:text-accent-foreground"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (
        i === currentPage - 2 ||
        i === currentPage + 2
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis className="font-['Alegreya'] text-muted-foreground" />
          </PaginationItem>
        )
      }
    }
    return items
  }

  return (
    <div className="space-y-4">
      {gameMode && onGameModeChange && (
        <div className="flex justify-center">
          <Select
            value={gameMode}
            onValueChange={(value) => onGameModeChange(value as '20' | '50' | '100')}
          >
            <SelectTrigger className="w-[200px] font-['Alegreya'] bg-card text-card-foreground border-border">
              <SelectValue>
                Name {gameMode} Mode
              </SelectValue>
            </SelectTrigger>
            <SelectContent 
              className="bg-card text-card-foreground border-border"
              position="popper"
              sideOffset={4}
            >
              <SelectItem value="20" className="font-['Alegreya'] hover:bg-accent hover:text-accent-foreground">Name 20 Mode</SelectItem>
              <SelectItem value="50" className="font-['Alegreya'] hover:bg-accent hover:text-accent-foreground">Name 50 Mode</SelectItem>
              <SelectItem value="100" className="font-['Alegreya'] hover:bg-accent hover:text-accent-foreground">Name 100 Mode</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-accent/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className="font-['Alegreya'] text-header font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-border hover:bg-accent/50 ${
                    row.index % 2 === 0 ? 'bg-[var(--table-row-light)]' : 'bg-[var(--table-row-dark)]'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="font-['Alegreya'] text-card-foreground"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-['Alegreya'] text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent className="font-['Alegreya']">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              className={`hover:bg-accent hover:text-accent-foreground ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
            />
          </PaginationItem>
          
          {renderPaginationItems()}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange?.(Math.min(pageCount, currentPage + 1))}
              className={`hover:bg-accent hover:text-accent-foreground ${currentPage === pageCount ? 'pointer-events-none opacity-50' : ''}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
} 