import { Navigate, useParams } from 'react-router-dom';

/** Deep links redirect into Manage Users with the details modal open. */
export function AdminUserDetailsPage() {
  const { id } = useParams();
  if (!id) return <Navigate to="/admin/users" replace />;
  return <Navigate to={`/admin/users?userId=${id}`} replace />;
}
