import { useEffect, useState } from 'react';
import { Loader2, UserRound, StickyNote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { Note } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminNotesPage() {
  const { token } = useAuth();
  const { meta, applyMeta, changePage, changeLimit, query } = usePagination(10);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api<Note[]>(`/admin/notes?${query}`, { token });
        setNotes(res.data);
        applyMeta(res.pagination);
      } catch (err) {
        setError((err as Error).message);
        setNotes([]);
        applyMeta(undefined);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">All notes</h1>
        <p className="mt-1 text-muted-foreground">Admin view across every user account.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <StickyNote className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">No notes found.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3">
            {notes.map((n) => {
              const owner =
                typeof n.userId === 'object' && n.userId
                  ? n.userId.name || n.userId.email || ''
                  : String(n.userId);
              return (
                <Card key={n._id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{n.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <UserRound className="size-3" />
                        {owner}
                      </Badge>
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{n.content}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Pagination meta={meta} onPageChange={changePage} onLimitChange={changeLimit} />
        </>
      )}
    </div>
  );
}
