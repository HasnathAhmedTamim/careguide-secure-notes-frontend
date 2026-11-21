import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, UserPlus, Trash2, ShieldCheck, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import type { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
    try {
      const res = await api<User[]>('/admin/users?page=1&limit=50', { token });
      setUsers(res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
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
      setMessage('User created');
      setForm({ name: '', email: '', password: '', role: 'user', interests: '' });
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function toggleRole(user: User) {
    setError('');
    try {
      await api(`/admin/users/${user.id}`, {
        method: 'PATCH',
        token,
        body: { role: user.role === 'admin' ? 'user' : 'admin' },
      });
      setMessage('User updated');
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function remove(user: User) {
    setError('');
    try {
      await api(`/admin/users/${user.id}`, { method: 'DELETE', token });
      setMessage('User deleted');
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">User management</h1>
        <p className="mt-1 text-muted-foreground">Create accounts and adjust roles.</p>
      </div>

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
      {message && (
        <Alert variant="success">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading users...
        </div>
      ) : (
        <div className="grid gap-3">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground break-all">ID: {u.id}</p>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void navigator.clipboard.writeText(u.id)}
                  >
                    <Copy />
                    Copy ID
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => void toggleRole(u)}>
                    <ShieldCheck />
                    Make {u.role === 'admin' ? 'user' : 'admin'}
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
      )}
    </div>
  );
}
