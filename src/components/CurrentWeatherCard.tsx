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
  Wind,
  Droplets,
  Gauge,
  Sunrise,
  Sunset,
  Eye,
  Bookmark,
  MapPin,
  Sparkles,
  Compass
} from 'lucide-react';
import {
  ForecastResponse,
  LocationResult,
  TemperatureUnit,
  WindSpeedUnit
} from '../types/weather';
import {
  getWeatherCodeInfo,
  formatTemperature,
  formatWindSpeed,
  getWindDirectionLabel,
  getUVIndexCategory,
  formatTimeShort
} from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  weather: ForecastResponse;
  location: LocationResult;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  location,
  tempUnit,
  windUnit,
  isFavorite,
  onToggleFavorite
}) => {
  const current = weather.current;
  const daily = weather.daily;
  const codeInfo = getWeatherCodeInfo(current.weather_code, current.is_day);

  const highTemp = daily.temperature_2m_max?.[0] ?? current.temperature_2m;
  const lowTemp = daily.temperature_2m_min?.[0] ?? current.temperature_2m;
  const uvMax = daily.uv_index_max?.[0] ?? 0;
  const uvCategory = getUVIndexCategory(uvMax);

  const sunriseTime = daily.sunrise?.[0] ? formatTimeShort(daily.sunrise[0]) : '--';
  const sunsetTime = daily.sunset?.[0] ? formatTimeShort(daily.sunset[0]) : '--';

  const renderWeatherIcon = (iconName: string, className: string = 'w-12 h-12') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-400 animate-spin-slow`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-sky-400`} />;
      case 'Cloud':
        return <Cloud className={`${className} text-slate-300`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-blue-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-teal-400`} />;
      case 'CloudSnow':
      case 'Snowflake':
        return <Snowflake className={`${className} text-sky-300 animate-pulse`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-purple-400 animate-bounce-short`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-zinc-300`} />;
      default:
        return <CloudSun className={`${className} text-sky-400`} />;
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-800 shadow-2xl bg-gradient-to-br ${codeInfo.bgGradient} p-6 sm:p-8 backdrop-blur-xl transition-all`}>
      
      {/* Decorative Glow Orb */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: codeInfo.themeColor }}
      />

      {/* Top Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <MapPin className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {location.name}
            </h1>
            {location.country && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/80">
                {location.country}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 pl-8">
            {[location.admin1, location.admin2].filter(Boolean).join(', ')}
            {location.elevation !== undefined && ` • Elev. ${Math.round(location.elevation)}m`}
          </p>
        </div>

        {/* Favorite Bookmark Toggle */}
        <button
          onClick={onToggleFavorite}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700 hover:text-white'
          }`}
          id="favorite-location-btn"
        >
          <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{isFavorite ? 'Saved Location' : 'Save Location'}</span>
        </button>
      </div>

      {/* Main Temperature & Visual Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6 relative z-10">
        
        {/* Left: Temp Big Display */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-6xl sm:text-7xl font-black text-white tracking-tighter drop-shadow-md">
              {formatTemperature(current.temperature_2m, tempUnit)}
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              <span>Feels like {formatTemperature(current.apparent_temperature, tempUnit)}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-semibold">H: {formatTemperature(highTemp, tempUnit)}</span>
              <span className="text-sky-400 font-semibold">L: {formatTemperature(lowTemp, tempUnit)}</span>
            </div>
          </div>
        </div>

        {/* Right: Weather Condition Badge & Icon */}
        <div className="flex items-center md:justify-end gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 shadow-inner">
            {renderWeatherIcon(codeInfo.iconName, 'w-14 h-14')}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-white">
              {codeInfo.label}
            </div>
            <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{current.is_day ? 'Daytime Weather' : 'Nighttime Weather'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Metrics Bar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 relative z-10 text-xs">
        
        {/* Wind */}
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Wind</span>
            <Wind className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white">
              {formatWindSpeed(current.wind_speed_10m, windUnit)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Compass className="w-3 h-3 text-slate-500" />
              <span>{getWindDirectionLabel(current.wind_direction_10m)} ({Math.round(current.wind_direction_10m)}°)</span>
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Humidity</span>
            <Droplets className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white">
              {current.relative_humidity_2m}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Dew point ~{Math.round(current.temperature_2m - ((100 - current.relative_humidity_2m) / 5))}°C
            </div>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>UV Max</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white">
              {uvMax.toFixed(1)}
            </div>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded mt-0.5 ${uvCategory.colorClass}`}>
              {uvCategory.label}
            </span>
          </div>
        </div>

        {/* Air Pressure */}
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Pressure</span>
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white">
              {Math.round(current.pressure_msl || current.surface_pressure)} hPa
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Sea level
            </div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Cloud Cover</span>
            <Cloud className="w-3.5 h-3.5 text-slate-300" />
          </div>
          <div className="mt-2">
            <div className="text-sm font-bold text-white">
              {current.cloud_cover}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {current.cloud_cover > 70 ? 'Overcast' : current.cloud_cover > 30 ? 'Partly cloudy' : 'Clear skies'}
            </div>
          </div>
        </div>

        {/* Sun Journey */}
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Solar Journey</span>
            <Sunrise className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="mt-2 text-[11px]">
            <div className="text-slate-200 font-medium flex items-center justify-between">
              <span>Rise:</span> <span className="font-bold text-white">{sunriseTime}</span>
            </div>
            <div className="text-slate-200 font-medium flex items-center justify-between mt-0.5">
              <span>Set:</span> <span className="font-bold text-white">{sunsetTime}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
