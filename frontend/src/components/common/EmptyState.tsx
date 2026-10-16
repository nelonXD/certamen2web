import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div
      role="region"
      aria-label="Contenido vacío"
      className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-300 rounded-xl text-center my-6 shadow-xs"
    >
      <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-500">
        <Inbox className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-600 mt-1 max-w-sm">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
