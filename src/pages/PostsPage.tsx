import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Megaphone, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { Post } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export function PostsPage() {
  const { token } = useAuth();
  const { meta, applyMeta, changePage, changeLimit, query, reset } = usePagination(10);
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api<Post[]>(`/posts?${query}`, { token });
      setPosts(res.data);
      applyMeta(res.pagination);
    } catch (err) {
      setError((err as Error).message);
      setPosts([]);
      applyMeta(undefined);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token, query]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await api('/posts', { method: 'POST', token, body: { title, content } });
      setTitle('');
      setContent('');
      setMessage('Post published');
      reset();
      if (meta.page === 1) await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Community posts</h1>
        <p className="mt-1 text-muted-foreground">
          Share updates with other members. Keep private details in your notes instead.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="size-5" />
            Publish post
          </CardTitle>
          <CardDescription>Posts are visible to all signed-in members.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Megaphone />}
              {saving ? 'Publishing...' : 'Publish'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert variant="success">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No public posts yet.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {posts.map((p) => {
              const author =
                typeof p.userId === 'object' && p.userId
                  ? p.userId.name || p.userId.email || ''
                  : String(p.userId);
              return (
                <Card key={p._id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{author}</Badge>
                      <span>{new Date(p.createdAt).toLocaleString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.content}</p>
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
