import { Link } from 'react-router-dom';
import { Users, NotebookPen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Admin overview</h1>
        <p className="mt-1 text-muted-foreground">Manage users and inspect every note in the system.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="size-5" />
              Users
            </CardTitle>
            <CardDescription>Create, update, and remove accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/admin/users">Open user management</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotebookPen className="size-5" />
              All notes
            </CardTitle>
            <CardDescription>Review notes across every user.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/admin/notes">View all notes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex items-start gap-3 py-6">
          <Shield className="mt-0.5 size-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Admin permissions are enforced by the API. Frontend route guards are only for UX.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
