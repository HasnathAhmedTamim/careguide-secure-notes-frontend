import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Pencil, Tags, Newspaper } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { UserPostsLookup } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminUserDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState<UserPostsLookup | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        // Uses the assessment $lookup aggregation endpoint
        const res = await api<UserPostsLookup>(`/users/${id}/posts`, { token });
        setData(res.data);
      } catch (err) {
        setError((err as Error).message);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading user details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/admin/users">Back to users</Link>
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">
            {data.user.name}&apos;s profile
          </h1>
          <p className="mt-1 text-muted-foreground">User details and public posts.</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/admin/users/${id}/edit`}>
            <Pencil />
            Edit user
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{data.user.name}</CardTitle>
          <CardDescription>{data.user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
          <Newspaper className="size-5" />
          Posts
        </h2>
        {data.posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">This user has no posts.</p>
        ) : (
          <div className="grid gap-3">
            {data.posts.map((p) => (
              <Card key={p._id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{p.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Button asChild variant="outline">
        <Link to="/admin/users">Back to users</Link>
      </Button>
    </div>
  );
}
