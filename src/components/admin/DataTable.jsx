import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/primitives';
import { Pagination } from '@/components/common/Pagination';
import { EmptyState } from '@/components/common/EmptyState';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * columns: [{ key, header, render?(row), className? }]
 * rows: array of data objects (must have an `id` field, or pass rowKey)
 */
export function DataTable({
  columns,
  rows,
  isLoading,
  rowKey = (row) => row.id,
  page,
  totalPages,
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search…',
  selectable = false,
  selectedIds = [],
  onSelectedIdsChange,
  bulkActions,
  emptyTitle = 'No results',
  emptyMessage = 'Try adjusting your search or filters.',
}) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;

  const toggleAll = () => {
    onSelectedIdsChange?.(allSelected ? [] : rows.map(rowKey));
  };

  const toggleOne = (id) => {
    onSelectedIdsChange?.(
      selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]
    );
  };

  return (
    <div className="rounded-md border border-border bg-white">
      {(onSearchChange || (selectable && selectedIds.length > 0)) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          {onSearchChange ? (
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <Input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 pl-10"
              />
            </div>
          ) : (
            <div />
          )}
          {selectable && selectedIds.length > 0 && (
            <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:flex-nowrap">
              <span className="text-xs font-semibold text-ink/60">{selectedIds.length} selected</span>
              {bulkActions}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink/50">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className={cn('px-4 py-3', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className="px-4 py-3.5">
                      <Skeleton className="h-4 w-4" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading &&
              rows.map((row) => {
                const id = rowKey(row);
                return (
                  <tr key={id} className="transition-colors hover:bg-surface-muted/60">
                    {selectable && (
                      <td className="px-4 py-3.5">
                        <Checkbox checked={selectedIds.includes(id)} onCheckedChange={() => toggleOne(id)} />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3.5 text-ink/80', col.className)}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>

        {!isLoading && rows.length === 0 && <EmptyState title={emptyTitle} description={emptyMessage} />}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border p-4">
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
