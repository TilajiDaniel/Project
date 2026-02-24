import React from 'react';
import NavHeader from './NavHeader';
import FabButton from './FabButton';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children, showNav = true }) {
  const { token } = useAuth();
  
  return (
    <div className="app-layout">
      {showNav && token && <NavHeader />}
      <main className="main-content">
        {children}
      </main>
      <FabButton />
    </div>
  );
}
