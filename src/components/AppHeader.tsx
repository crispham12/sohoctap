import React from 'react';
import { User } from 'lucide-react';
import { getAuthSession } from '../utils/auth';
import './AppHeader.css';

export const AppHeader: React.FC = () => {
  const session = getAuthSession();
  const date = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <header className="app-header bg-surface">
      <div className="header-content">
        <div>
          <h1 className="text-xl font-bold">Chào {session ? session.split('@')[0] : 'bạn'}! 👋</h1>
          <p className="text-sm text-secondary">{date}</p>
        </div>
        <div className="avatar">
          <User size={24} className="text-secondary" />
        </div>
      </div>
    </header>
  );
};
