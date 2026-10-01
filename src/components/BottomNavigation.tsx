import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, CheckSquare } from 'lucide-react';
import './BottomNavigation.css';

export const BottomNavigation: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {({ isActive }) => <Home size={30} strokeWidth={2.5} fill={isActive ? "currentColor" : "none"} />}
        </NavLink>
        <NavLink to="/formulas" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {({ isActive }) => <BookOpen size={30} strokeWidth={2.5} fill={isActive ? "currentColor" : "none"} />}
        </NavLink>
        <NavLink to="/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {({ isActive }) => <Calendar size={30} strokeWidth={2.5} fill={isActive ? "currentColor" : "none"} />}
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          {({ isActive }) => <CheckSquare size={30} strokeWidth={2.5} fill={isActive ? "currentColor" : "none"} />}
        </NavLink>
      </div>
    </nav>
  );
};
