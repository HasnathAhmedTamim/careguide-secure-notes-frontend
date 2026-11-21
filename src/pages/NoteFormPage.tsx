import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { Note } from '../types';

export function NoteFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    void (async () => {
      try {
        const res = await api<{ note: Note }>(`/notes/${id}`, { token });
        setTitle(res.data.note.title);
        setContent(res.data.note.content);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id, token]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await api('/notes', { method: 'POST', token, body: { title, content } });
      } else {
        await api(`/notes/${id}`, { method: 'PATCH', token, body: { title, content } });
      }
      navigate('/notes');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section className="card">
      <h1>{mode === 'create' ? 'Create note' : 'Edit note'}</h1>
      <form onSubmit={onSubmit} className="form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Content
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </section>
  );
}
