import React from 'react';
import {
  Shirt,
  Umbrella,
  Sun,
  Activity,
  Home,
  Car,
  Wind,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lightbulb
} from 'lucide-react';
import { ForecastResponse } from '../types/weather';
import { generateWeatherRecommendations } from '../utils/weatherUtils';

interface RecommendationsGridProps {
  weather: ForecastResponse;
}

export const RecommendationsGrid: React.FC<RecommendationsGridProps> = ({ weather }) => {
  if (!weather || !weather.current || !weather.daily) {
    return null;
  }

  const recommendations = generateWeatherRecommendations(weather.current, weather.daily);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'Umbrella':
        return <Umbrella className="w-5 h-5 text-sky-400" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Activity':
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-400" />;
      case 'Car':
        return <Car className="w-5 h-5 text-rose-400" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-sky-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'alert':
        return {
          cardBg: 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/40',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          iconBg: 'bg-rose-500/10 text-rose-400',
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-950/20 hover:bg-amber-950/30 border-amber-500/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          iconBg: 'bg-amber-500/10 text-amber-400',
        };
      case 'success':
        return {
          cardBg: 'bg-emerald-950/20 hover:bg-emerald-950/30 border-emerald-500/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          iconBg: 'bg-emerald-500/10 text-emerald-400',
        };
      default:
        return {
          cardBg: 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          iconBg: 'bg-sky-500/10 text-sky-400',
        };
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Weather Intelligence & Planning Recommendations
            </h2>
            <p className="text-xs text-slate-400">
              Smart automated recommendations tailored to real-time atmospheric conditions
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => {
          const styles = getSeverityStyles(rec.severity);

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all duration-200 backdrop-blur-md flex flex-col justify-between ${styles.cardBg}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl border border-white/5 ${styles.iconBg}`}>
                    {getIcon(rec.icon)}
                  </div>
                  {rec.badge && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${styles.badge}`}>
                      {rec.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
