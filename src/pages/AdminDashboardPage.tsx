import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  return (
    <section className="card">
      <h1>Admin dashboard</h1>
      <p>Manage users and inspect all notes.</p>
      <div className="row">
        <Link className="btn" to="/admin/users">
          User management
        </Link>
        <Link className="btn secondary" to="/admin/notes">
          All notes
        </Link>
      </div>
    </section>
  );
}
