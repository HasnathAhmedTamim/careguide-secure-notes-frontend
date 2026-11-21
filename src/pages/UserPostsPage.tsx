import { useState, type FormEvent } from 'react';
import { Loader2, Search, GitMerge } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { UserPostsLookup } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function UserPostsPage() {
  const { token, user } = useAuth();
  const [userId, setUserId] = useState(user?.id || '');
  const [result, setResult] = useState<UserPostsLookup | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api<UserPostsLookup>(`/users/${userId}/posts`, { token });
      setResult(res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">User posts lookup</h1>
        <p className="mt-1 text-muted-foreground">
          Scenario 2 — one aggregation pipeline with{' '}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">$lookup</code> from users to posts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitMerge className="size-5" />
            Run `$lookup`
          </CardTitle>
          <CardDescription>Defaults to your own user id. Paste another user id to compare.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
              Fetch posts
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{result.user.name}</CardTitle>
              <CardDescription className="flex flex-wrap gap-2">
                <span>{result.user.email}</span>
                <Badge variant="secondary" className="capitalize">
                  {result.user.role}
                </Badge>
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-3">
            {result.posts.map((p) => (
              <Card key={p._id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{p.content}</p>
                </CardContent>
              </Card>
            ))}
            {result.posts.length === 0 && (
              <p className="text-sm text-muted-foreground">This user has no posts.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
