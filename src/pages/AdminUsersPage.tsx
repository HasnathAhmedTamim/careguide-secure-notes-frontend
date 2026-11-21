import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, UserPlus, Trash2, Pencil, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { api } from '@/services/api';
import type { User } from '@/types';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminUsersPage() {
  const { token } = useAuth();
  const toast = useToast();
  const { meta, applyMeta, changePage, changeLimit, query, reset } = usePagination(10);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    interests: '',
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api<User[]>(`/admin/users?${query}`, { token });
      setUsers(res.data);
      applyMeta(res.pagination);
    } catch (err) {
      setError((err as Error).message);
      setUsers([]);
      applyMeta(undefined);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token, query]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api('/admin/users', {
        method: 'POST',
        token,
        body: {
          ...form,
          interests: form.interests
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      toast.success('User created', `${form.name} was added successfully.`);
      setForm({ name: '', email: '', password: '', role: 'user', interests: '' });
      reset();
      if (meta.page === 1) await load();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error('Could not create user', message);
    }
  }

  async function remove(user: User) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    setError('');
    try {
      await api(`/admin/users/${user.id}`, { method: 'DELETE', token });
      toast.success('User deleted', `${user.name} was removed.`);
      await load();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error('Could not delete user', message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage users"
        description="Create accounts, open details, or edit member info."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5" />
            Add user
          </CardTitle>
          <CardDescription>Admins can create both user and admin accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Interests</Label>
              <Input
                value={form.interests}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="chess, reading"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">
                <UserPlus />
                Add user
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

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-muted-foreground">No users found.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {users.map((u) => (
              <Card key={u.id}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {u.role}
                      </Badge>
                      {(u.interests || []).map((i) => (
                        <Badge key={i} variant="outline">
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/users/${u.id}`}>
                        <Eye />
                        Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/admin/users/${u.id}/edit`}>
                        <Pencil />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => void remove(u)}>
                      <Trash2 />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination meta={meta} onPageChange={changePage} onLimitChange={changeLimit} />
        </>
      )}
    </div>
  );
}
