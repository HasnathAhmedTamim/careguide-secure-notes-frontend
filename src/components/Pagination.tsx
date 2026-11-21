import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type PaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
};

export function Pagination({
  meta,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 20],
}: PaginationProps) {
  const { page, limit, total, totalPages } = meta;
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing page <span className="font-medium text-foreground">{page}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages || 1}</span>
        {' · '}
        <span className="font-medium text-foreground">{total}</span> total
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <Label htmlFor="page-size" className="text-xs text-muted-foreground">
              Per page
            </Label>
            <Select
              id="page-size"
              className="h-9 w-[84px]"
              value={String(limit)}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Select>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
