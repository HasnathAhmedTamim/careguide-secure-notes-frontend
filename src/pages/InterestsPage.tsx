import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Tags } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { InterestGroup } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function InterestsPage() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await api<InterestGroup[]>('/users/grouped-by-interests', { token });
        setGroups(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Users by Interests</h1>
        <p className="mt-1 text-muted-foreground">
          Members grouped by shared interests. Open a user to view their profile and posts.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading interests...
        </div>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No interest groups found.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((g) => (
            <Card key={g._id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tags className="size-4" />
                  {g._id}
                </CardTitle>
                <CardDescription>
                  {g.users.length === 1 ? '1 member' : `${g.users.length} members`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {g.users.map((member) => (
                  <Button key={`${g._id}-${member.id}`} asChild variant="secondary" size="sm">
                    <Link to={`/admin/users/${member.id}`}>{member.name}</Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
