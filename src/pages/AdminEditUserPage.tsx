import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader2, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/services/api';
import type { User } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

export function AdminEditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
    interests: '',
  });

  useEffect(() => {
    if (!id) return;
    void (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api<{ user: User }>(`/admin/users/${id}`, { token });
        const u = res.data.user;
        setForm({
          name: u.name,
          email: u.email,
          role: u.role,
          interests: (u.interests || []).join(', '),
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api(`/admin/users/${id}`, {
        method: 'PATCH',
        token,
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          interests: form.interests
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      toast.success('User updated', 'Changes were saved successfully.');
      navigate('/admin/users');
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error('Update failed', message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading user...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit user"
        description="Update member details using the admin users API."
      />

      <Card>
        <CardHeader>
          <CardTitle>User details</CardTitle>
          <CardDescription>Password is not shown and is left unchanged unless set elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as 'user' | 'admin' })}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="chess, reading"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/admin/users">
                  <X />
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
