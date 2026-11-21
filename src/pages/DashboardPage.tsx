import { Link, Navigate } from 'react-router-dom';
import { StickyNote, PlusCircle, Megaphone, UserRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Hi {user?.name}. Manage your private notes and browse community posts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {user?.role}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/notes">
                <StickyNote />
                My Notes
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/notes/new">
                <PlusCircle />
                Create Note
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/profile">
                <UserRound />
                My Profile
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/posts">
                <Megaphone />
                Public Posts
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
