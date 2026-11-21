import { useCallback, useState } from 'react';
import type { PaginationMeta } from '@/components/Pagination';

const defaultMeta: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export function usePagination(initialLimit = 10) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [meta, setMeta] = useState<PaginationMeta>({
    ...defaultMeta,
    limit: initialLimit,
  });

  const applyMeta = useCallback((next?: PaginationMeta) => {
    if (!next) {
      setMeta({ ...defaultMeta, page, limit });
      return;
    }
    setMeta(next);
  }, [page, limit]);

  const changePage = useCallback((nextPage: number) => {
    setPage(Math.max(1, nextPage));
  }, []);

  const changeLimit = useCallback((nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    limit,
    meta,
    applyMeta,
    changePage,
    changeLimit,
    reset,
    query: `page=${page}&limit=${limit}`,
  };
}
