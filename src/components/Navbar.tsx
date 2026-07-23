import React from 'react';
import { CloudSun, Navigation, RefreshCw, Bookmark, Thermometer } from 'lucide-react';
import { TemperatureUnit, WindSpeedUnit } from '../types/weather';

interface NavbarProps {
  tempUnit: TemperatureUnit;
  onToggleTempUnit: (unit: TemperatureUnit) => void;
  windUnit: WindSpeedUnit;
  onToggleWindUnit: (unit: WindSpeedUnit) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  favoritesCount: number;
  onToggleFavoritesDrawer: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  tempUnit,
  onToggleTempUnit,
  windUnit,
  onToggleWindUnit,
  onUseCurrentLocation,
  isLocating,
  favoritesCount,
  onToggleFavoritesDrawer,
  onRefresh,
  isRefreshing,
  lastUpdated
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 shadow-lg text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CloudSun className="w-6 h-6 text-sky-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                WeatherIntel
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Open-Meteo Intelligence Platform</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Geolocation Button */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            title="Use My Current GPS Location"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-sky-300 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">My Location</span>
          </button>

          {/* Temperature Unit Toggle */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => onToggleTempUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                tempUnit === 'celsius'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => onToggleTempUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                tempUnit === 'fahrenheit'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Wind Unit Selector (Hidden on mobile) */}
          <div className="hidden sm:flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => onToggleWindUnit('kmh')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                windUnit === 'kmh' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              km/h
            </button>
            <button
              onClick={() => onToggleWindUnit('mph')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                windUnit === 'mph' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              mph
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title={lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Refresh Weather Data'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesDrawer}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
            title="Saved Favorite Locations"
          >
            <Bookmark className="w-4 h-4 fill-amber-400/20" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                {favoritesCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
