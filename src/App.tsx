import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { AdminNotesPage } from '@/pages/AdminNotesPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AdminEditUserPage } from '@/pages/AdminEditUserPage';
import { AdminUserDetailsPage } from '@/pages/AdminUserDetailsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { NoteFormPage } from '@/pages/NoteFormPage';
import { NotesListPage } from '@/pages/NotesListPage';
import { PostsPage } from '@/pages/PostsPage';
import { InterestsPage } from '@/pages/InterestsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <NoteFormPage mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:id/edit"
          element={
            <ProtectedRoute>
              <NoteFormPage mode="edit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <PostsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notes"
          element={
            <ProtectedRoute adminOnly>
              <AdminNotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <AdminEditUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute adminOnly>
              <AdminUserDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interests"
          element={
            <ProtectedRoute adminOnly>
              <InterestsPage />
            </ProtectedRoute>
          }
        />

        {/* Legacy redirects */}
        <Route path="/aggregations/interests" element={<Navigate to="/admin/interests" replace />} />
        <Route path="/aggregations/user-posts" element={<Navigate to="/admin/users" replace />} />
      </Route>
    </Routes>
  );
}
