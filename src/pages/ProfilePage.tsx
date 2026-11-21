import { Tags } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const homePath = user.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="space-y-6">
      <PageHeader
        backTo={homePath}
        backLabel={user.role === 'admin' ? 'Back to Admin Dashboard' : 'Back to Dashboard'}
        title="My profile"
        description="Your account details from the authenticated session."
      />

      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</p>
            <Badge variant="secondary" className="mt-1 capitalize">
              {user.role}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(user.interests || []).length === 0 ? (
                <p className="text-sm text-muted-foreground">No interests listed.</p>
              ) : (
                user.interests.map((interest) => (
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
    </div>
  );
}
