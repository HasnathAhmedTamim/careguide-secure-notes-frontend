import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Search, Newspaper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { User, UserPostsLookup } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

export function UserPostsPage() {
  const { token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const presetId = searchParams.get('memberId') || user?.id || '';
  const [userId, setUserId] = useState(presetId);
  const [members, setMembers] = useState<User[]>([]);
  const [result, setResult] = useState<UserPostsLookup | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(presetId);
  }, [presetId]);

  useEffect(() => {
    if (user?.role !== 'admin' || !token) return;
    void (async () => {
      try {
        const res = await api<User[]>('/admin/users?page=1&limit=100', { token });
        setMembers(res.data);
      } catch {
        // Non-blocking: admins can still paste an ID
      }
    })();
  }, [user?.role, token]);

  useEffect(() => {
    if (!presetId || !token) return;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api<UserPostsLookup>(`/users/${presetId}/posts`, { token });
        setResult(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [presetId, token]);

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
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Member posts</h1>
        <p className="mt-1 text-muted-foreground">
          Choose a member to read their public posts. Tip: open someone from Interests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="size-5" />
            Find posts by member
          </CardTitle>
          <CardDescription>
            Your member ID is prefilled. Admins can also pick from the member list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {user?.role === 'admin' && members.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="memberSelect">Select member</Label>
                <Select
                  id="memberSelect"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </Select>
              </div>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="userId">Member ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
                Show posts
              </Button>
            </div>
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
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.content}</p>
                </CardContent>
              </Card>
            ))}
            {result.posts.length === 0 && (
              <p className="text-sm text-muted-foreground">
                This member has not published any posts yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
