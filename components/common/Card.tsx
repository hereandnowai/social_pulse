
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl p-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-hnai-teal mb-4 pb-2 border-b border-hnai-yellow">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
