import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { User } from '../types';

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
    <section className="card">
      <h1>Admin user management</h1>
      <form onSubmit={onCreate} className="form grid">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        <input
          placeholder="Interests"
          value={form.interests}
          onChange={(e) => setForm({ ...form, interests: e.target.value })}
        />
        <button type="submit">Add user</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <ul className="list">
        {users.map((u) => (
          <li key={u.id}>
            <strong>{u.name}</strong> · {u.email} · {u.role}
            <div className="row">
              <button type="button" onClick={() => void toggleRole(u)}>
                Make {u.role === 'admin' ? 'user' : 'admin'}
              </button>
              <button type="button" className="danger" onClick={() => void remove(u)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
