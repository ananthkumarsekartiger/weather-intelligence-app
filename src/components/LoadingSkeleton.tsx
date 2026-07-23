import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="h-72 rounded-3xl bg-slate-800/60 border border-slate-800 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-700/60 rounded-xl" />
            <div className="h-4 w-32 bg-slate-700/40 rounded-lg" />
          </div>
          <div className="h-10 w-28 bg-slate-700/60 rounded-xl" />
        </div>

        <div className="flex justify-between items-center my-4">
          <div className="h-20 w-44 bg-slate-700/80 rounded-2xl" />
          <div className="h-16 w-36 bg-slate-700/60 rounded-2xl" />
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700/40 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="h-48 rounded-3xl bg-slate-800/60 border border-slate-800 p-6">
        <div className="h-6 w-36 bg-slate-700/60 rounded-lg mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-700/40 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Hourly Chart Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-800/60 border border-slate-800 p-6">
        <div className="h-6 w-48 bg-slate-700/60 rounded-lg mb-4" />
        <div className="h-44 w-full bg-slate-700/30 rounded-2xl" />
      </div>
    </div>
  );
};
