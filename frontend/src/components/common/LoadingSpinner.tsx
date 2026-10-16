import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Cargando información...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-6 space-y-3"
    >
      <div
        className={`${sizeClasses} border-blue-600 border-t-transparent rounded-full animate-spin`}
        aria-hidden="true"
      />
      <span className="text-sm font-medium text-slate-700">{message}</span>
    </div>
  );
};
