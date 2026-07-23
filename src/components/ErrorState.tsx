import React from 'react';
import { AlertCircle, RefreshCw, MapPin, Search } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onResetSearch?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onResetSearch
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-8 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Weather Data Unavailable
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 transition-all shadow-lg shadow-sky-500/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {onResetSearch && (
          <button
            onClick={onResetSearch}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>Search Tokyo / Popular Cities</span>
          </button>
        )}
      </div>
    </div>
  );
};
