import React from 'react';
import './PageContainer.css';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <main className="page-container">
      {children}
    </main>
  );
};
