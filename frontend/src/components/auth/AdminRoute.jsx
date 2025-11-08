import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // ✅ check both `isAdmin` and `role`
  const isAdmin =
    user &&
    (user.isAdmin === true ||
      user.role === 'admin' ||
      user?.user?.role === 'admin');

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
