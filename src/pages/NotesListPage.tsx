import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Note } from '../types';

export function NotesListPage() {
  const { token } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api<Note[]>('/notes?page=1&limit=50', { token });
      setNotes(res.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  async function remove(id: string) {
    setMessage('');
    setError('');
    try {
      await api(`/notes/${id}`, { method: 'DELETE', token });
      setMessage('Note deleted');
      await load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section className="card">
      <div className="row between">
        <h1>My notes</h1>
        <Link className="btn" to="/notes/new">
          Create note
        </Link>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <ul className="list">
        {notes.map((n) => (
          <li key={n._id}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <div className="row">
              <Link to={`/notes/${n._id}/edit`}>Edit</Link>
              <button type="button" className="danger" onClick={() => void remove(n._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {!loading && notes.length === 0 && <p className="muted">No notes yet.</p>}
    </section>
  );
}
