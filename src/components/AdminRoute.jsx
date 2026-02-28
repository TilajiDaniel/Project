import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {

  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'Admin') {
    return <Navigate to="/MainPage" replace />;
  }
  return children;
};

export default AdminRoute;