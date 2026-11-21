import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="card">
      <h1>User dashboard</h1>
      <p>
        Signed in as <strong>{user?.name}</strong> ({user?.role})
      </p>
      <p className="muted">{user?.email}</p>
      <p>Interests: {(user?.interests || []).join(', ') || 'none'}</p>
      <div className="row">
        <Link className="btn" to="/notes">
          My notes
        </Link>
        <Link className="btn secondary" to="/notes/new">
          Create note
        </Link>
        {user?.role === 'admin' && (
          <Link className="btn secondary" to="/admin">
            Admin dashboard
          </Link>
        )}
      </div>
    </section>
  );
}
