
import React from 'react';

export const LoadingSpinner: React.FC<{ size?: string }> = ({ size = 'h-12 w-12' }) => {
  return (
    <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 border-hnai-teal`}></div>
  );
};
