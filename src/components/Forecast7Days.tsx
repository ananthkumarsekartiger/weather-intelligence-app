import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Snowflake,
  Droplets,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { DailyForecast, TemperatureUnit } from '../types/weather';
import {
  getWeatherCodeInfo,
  formatTemperature,
  formatDateDayName,
  getUVIndexCategory
} from '../utils/weatherUtils';

interface Forecast7DaysProps {
  daily: DailyForecast;
  tempUnit: TemperatureUnit;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const Forecast7Days: React.FC<Forecast7DaysProps> = ({
  daily,
  tempUnit,
  selectedDayIndex,
  onSelectDay
}) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  // Calculate overall 7-day min and max temperatures to render proportional range bars
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const tempSpan = Math.max(allMax - allMin, 1);

  const renderWeatherIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-sky-400`} />;
      case 'Cloud':
        return <Cloud className={`${className} text-slate-400`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-blue-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-teal-400`} />;
      case 'CloudSnow':
      case 'Snowflake':
        return <Snowflake className={`${className} text-sky-300`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-purple-400`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-zinc-400`} />;
      default:
        return <CloudSun className={`${className} text-sky-400`} />;
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              7-Day Forecast
            </h2>
            <p className="text-xs text-slate-400">Click any day card to view hourly trends below</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono hidden sm:block">
          7 Days Extended
        </div>
      </div>

      {/* Grid of Daily Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
        {daily.time.slice(0, 7).map((timeStr, index) => {
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const code = daily.weather_code[index];
          const codeInfo = getWeatherCodeInfo(code, 1);
          const precipProb = daily.precipitation_probability_max?.[index] ?? 0;
          const uvMax = daily.uv_index_max?.[index] ?? 0;
          const isSelected = selectedDayIndex === index;

          // Calculate left % and width % for the relative bar
          const leftPct = ((minTemp - allMin) / tempSpan) * 100;
          const rightPct = ((maxTemp - allMin) / tempSpan) * 100;
          const widthPct = Math.max(rightPct - leftPct, 8);

          return (
            <button
              key={timeStr}
              onClick={() => onSelectDay(index)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-500/20 to-indigo-500/20 border-sky-500 shadow-lg shadow-sky-500/10 scale-[1.02]'
                  : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400" />
              )}

              {/* Day Name */}
              <div>
                <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                  {formatDateDayName(timeStr)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  {new Date(timeStr).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                </div>
              </div>

              {/* Icon & Condition */}
              <div className="my-3 flex items-center justify-between sm:flex-col sm:items-start gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    {renderWeatherIcon(codeInfo.iconName, 'w-6 h-6')}
                  </div>
                  <span className="text-xs font-medium text-slate-200 line-clamp-1 sm:hidden">
                    {codeInfo.label}
                  </span>
                </div>

                {/* Rain Chance Pill */}
                {precipProb > 15 && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{precipProb}%</span>
                  </div>
                )}
              </div>

              {/* Temperature High / Low */}
              <div className="mt-auto pt-2 border-t border-slate-800/80 w-full space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    {formatTemperature(maxTemp, tempUnit)}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {formatTemperature(minTemp, tempUnit)}
                  </span>
                </div>

                {/* Temperature Range Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{
                      left: `${Math.max(0, Math.min(100, leftPct))}%`,
                      width: `${Math.max(5, Math.min(100, widthPct))}%`
                    }}
                  />
                </div>
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
};
