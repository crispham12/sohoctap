import React from 'react';
import './SectionCard.css';

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children, action }) => {
  return (
    <div className="section-card bg-surface">
      {(title || action) && (
        <div className="section-card-header">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {action && <div className="section-card-action">{action}</div>}
        </div>
      )}
      <div className="section-card-body">
        {children}
      </div>
    </div>
  );
};
