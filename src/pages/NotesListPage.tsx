import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, Loader2, StickyNote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/services/api';
import type { Note } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from '@/components/PageHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NotesListPage() {
  const { token } = useAuth();
  const toast = useToast();
  const { meta, applyMeta, changePage, changeLimit, query } = usePagination(10);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api<Note[]>(`/notes?${query}`, { token });
      setNotes(res.data);
      applyMeta(res.pagination);
    } catch (err) {
      setError((err as Error).message);
      setNotes([]);
      applyMeta(undefined);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token, query]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setError('');
    setDeleting(true);
    try {
      await api(`/notes/${pendingDelete._id}`, { method: 'DELETE', token });
      toast.success('Note deleted', 'The note was removed from your list.');
      setPendingDelete(null);
      await load();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error('Delete failed', message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My notes"
        description="Your private notes — visible only to you and admins."
        actions={
          <Button asChild>
            <Link to="/notes/new">
              <PlusCircle />
              Create note
            </Link>
          </Button>
        }
      />

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
            <p className="text-muted-foreground">No notes yet. Create your first one.</p>
            <Button asChild variant="outline">
              <Link to="/notes/new">New note</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3">
            {notes.map((n) => (
              <Card key={n._id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{n.title}</CardTitle>
                  <CardDescription>{new Date(n.createdAt).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {n.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/notes/${n._id}/edit`}>
                        <Pencil />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setPendingDelete(n)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination
            meta={meta}
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete note?"
        description={
          pendingDelete
            ? `Delete “${pendingDelete.title}”? This cannot be undone.`
            : 'This cannot be undone.'
        }
        confirmLabel="Delete note"
        loading={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
