import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/services/api';
import type { Note } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function NoteFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const { token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    void (async () => {
      try {
        const res = await api<{ note: Note }>(`/notes/${id}`, { token });
        setTitle(res.data.note.title);
        setContent(res.data.note.content);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id, token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await api('/notes', { method: 'POST', token, body: { title, content } });
        toast.success('Note created', 'Your private note was saved.');
      } else {
        await api(`/notes/${id}`, { method: 'PATCH', token, body: { title, content } });
        toast.success('Note updated', 'Your changes were saved.');
      }
      navigate('/notes');
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error('Could not save note', message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading note...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backTo="/notes"
        backLabel="Back to My Notes"
        breadcrumb={mode === 'create' ? 'My Notes / Create' : 'My Notes / Edit'}
        title={mode === 'create' ? 'Create note' : 'Edit note'}
        description="Notes are private to your account unless viewed by an admin."
      />

      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'New note' : 'Update note'}</CardTitle>
          <CardDescription>Title and content are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? 'Saving...' : 'Save note'}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/notes">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
