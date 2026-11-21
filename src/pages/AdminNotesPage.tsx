import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Note } from '../types';

export function AdminNotesPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await api<Note[]>('/admin/notes?page=1&limit=50', { token });
        setNotes(res.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <section className="card">
      <h1>Admin — all notes</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {notes.map((n) => {
          const owner =
            typeof n.userId === 'object' && n.userId
              ? n.userId.name || n.userId.email || ''
              : String(n.userId);
          return (
            <li key={n._id}>
              <h3>{n.title}</h3>
              <p>{n.content}</p>
              <p className="muted">Owner: {owner}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
