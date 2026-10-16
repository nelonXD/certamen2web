import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  fieldErrors,
  onClose,
}) => {
  const styles = {
    error: {
      container: 'bg-red-50 border-red-300 text-red-900',
      icon: <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />,
      role: 'alert' as const,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />,
      role: 'status' as const,
    },
    warning: {
      container: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />,
      role: 'alert' as const,
    },
    info: {
      container: 'bg-blue-50 border-blue-300 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />,
      role: 'status' as const,
    },
  }[type];

  return (
    <div
      role={styles.role}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`border rounded-lg p-4 flex gap-3 ${styles.container} shadow-xs mb-4`}
    >
      {styles.icon}
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold text-base mb-1">{title}</p>}
        <p>{message}</p>
        {fieldErrors && Object.keys(fieldErrors).length > 0 && (
          <ul className="mt-2 list-disc list-inside space-y-1">
            {Object.entries(fieldErrors).map(([field, errs]) => (
              <li key={field}>
                <span className="font-medium capitalize">{field}: </span>
                {errs.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar notificación"
          className="text-slate-500 hover:text-slate-800 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          ✕
        </button>
      )}
    </div>
  );
};
