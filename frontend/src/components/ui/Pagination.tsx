import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import { Icons } from './Icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showTotal?: boolean;
  total?: number;
  limit?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, showTotal, total, limit }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="Go to first page"
      >
        <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
      </Button>

      {pages.map((page, index) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          aria-label={page === currentPage ? `Page ${page}, current` : `Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page === '...' ? '...' : page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <Icons.chevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Go to last page"
      >
        <Icons.chevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>

      {showTotal && total && limit && (
        <span className="text-sm text-muted-foreground ml-4">
          Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} results
        </span>
      )}
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  const maxVisible = 5;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);

  return pages;
}