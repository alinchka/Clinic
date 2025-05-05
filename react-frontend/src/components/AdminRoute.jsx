import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user'));
      setIsAdmin(user?.roles?.includes('ADMIN') || false);
      setIsChecking(false);
    }, []);
  
    if (isChecking) {
      return <div>Проверка прав доступа...</div>;
    }
  
    return isAdmin ? children : <Navigate to="/" replace />;
  };

export default AdminRoute;