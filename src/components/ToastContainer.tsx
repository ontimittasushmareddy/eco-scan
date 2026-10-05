import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        };

        const bgStyles = {
          success: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10',
          warning: 'bg-white border-amber-200 text-slate-800 shadow-amber-500/10',
          error: 'bg-white border-rose-200 text-slate-800 shadow-rose-500/10',
          info: 'bg-white border-blue-200 text-slate-800 shadow-blue-500/10',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${
              bgStyles[toast.type]
            }`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-sm leading-tight text-slate-900">{toast.title}</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
