import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Pencil, Tags, Newspaper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { UserPostsLookup } from '@/types';
import { Modal } from '@/components/Modal';
import { Pagination, type PaginationMeta } from '@/components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type UserDetailsModalProps = {
  userId: string | null;
  open: boolean;
  onClose: () => void;
};

const POSTS_PAGE_SIZE = 5;

export function UserDetailsModal({ userId, open, onClose }: UserDetailsModalProps) {
  const { token } = useAuth();
  const [data, setData] = useState<UserPostsLookup | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: POSTS_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!open || !userId) return;
    setPage(1);
  }, [open, userId]);

  useEffect(() => {
    if (!open || !userId) return;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api<UserPostsLookup>(
          `/users/${userId}/posts?page=${page}&limit=${POSTS_PAGE_SIZE}`,
          { token }
        );
        setData(res.data);
        setPagination(
          res.pagination || {
            page,
            limit: POSTS_PAGE_SIZE,
            total: res.data.posts.length,
            totalPages: 1,
          }
        );
      } catch (err) {
        setError((err as Error).message);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, userId, token, page]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data?.user.name || 'User details'}
      description="Profile and public posts"
      className="max-w-xl"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          {userId && (
            <Button asChild>
              <Link to={`/admin/users/${userId}/edit`} onClick={onClose}>
                <Pencil />
                Edit user
              </Link>
            </Button>
          )}
        </div>
      }
    >
      {loading && !data && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading details...
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <div className="space-y-4">
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
              <p className="text-sm">{data.user.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {data.user.role}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interests</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(data.user.interests || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No interests listed.</p>
                ) : (
                  (data.user.interests || []).map((interest) => (
                    <Badge key={interest} variant="outline" className="gap-1">
                      <Tags className="size-3" />
                      {interest}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Newspaper className="size-4" />
              Posts
              {pagination.total > 0 && (
                <span className="font-normal text-muted-foreground">({pagination.total})</span>
              )}
              {loading && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
            </h3>
            {data.posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">This user has no posts.</p>
            ) : (
              <>
                <div className="grid max-h-[40vh] gap-2 overflow-y-auto pr-1">
                  {data.posts.map((p) => (
                    <Card key={p._id}>
                      <CardHeader className="py-3">
                        <CardTitle className="text-sm">{p.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pb-3 pt-0">
                        <p className="line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground">
                          {p.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Pagination
                  meta={pagination}
                  onPageChange={setPage}
                  pageSizeOptions={[5, 10]}
                />
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
