import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="brand">
          CareGuide Secure Notes
        </Link>
        {user && (
          <nav className="nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/notes">Notes</NavLink>
            <NavLink to="/notes/new">New note</NavLink>
            {user.role === 'admin' && (
              <>
                <NavLink to="/admin">Admin</NavLink>
                <NavLink to="/admin/users">Users</NavLink>
                <NavLink to="/admin/notes">All notes</NavLink>
              </>
            )}
            <button type="button" className="linkish" onClick={logout}>
              Logout
            </button>
          </nav>
        )}
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
