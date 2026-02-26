// src/components/FabButton.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/FabButton.css';

export default function FabButton() {
  return (
    <NavLink to="/about" className="fab-button" title="További lépések">
      <span>ℹ️</span>
    </NavLink>
  );

}
