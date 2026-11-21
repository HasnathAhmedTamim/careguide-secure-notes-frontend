import { Link } from 'react-router-dom';
import { StickyNote, PlusCircle, Shield, Tags, Megaphone, GitMerge } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Signed in as {user?.name}. Manage notes and account access from here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {user?.role}
            </Badge>
            {(user?.interests || []).map((interest) => (
              <Badge key={interest} variant="outline" className="gap-1">
                <Tags className="size-3" />
                {interest}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/notes">
                <StickyNote />
                My notes
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/notes/new">
                <PlusCircle />
                Create note
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/posts">
                <Megaphone />
                Posts
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/aggregations/interests">
                <Tags />
                Interests
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/aggregations/user-posts">
                <GitMerge />
                Lookup posts
              </Link>
            </Button>
            {user?.role === 'admin' && (
              <Button asChild variant="secondary">
                <Link to="/admin">
                  <Shield />
                  Admin
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
