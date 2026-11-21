import { Link } from 'react-router-dom';
import { Users, NotebookPen, Tags, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Admin dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage users, review all notes, and explore members by interest.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              Manage Users
            </CardTitle>
            <CardDescription>Create, edit, and review member accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/users">Open users</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotebookPen className="size-5" />
              All Notes
            </CardTitle>
            <CardDescription>View notes across every account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/admin/notes">View all notes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tags className="size-5" />
              Users by Interests
            </CardTitle>
            <CardDescription>Grouped members from the aggregation API.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/admin/interests">Open interests</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <StickyNote className="size-5" />
              My Notes
            </CardTitle>
            <CardDescription>Your own private notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/notes">Open my notes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
