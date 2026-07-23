import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, Globe, History, ArrowRight } from 'lucide-react';
import { LocationResult } from '../types/weather';
import { searchLocations } from '../services/openMeteoApi';

interface SearchBarProps {
  onSelectLocation: (location: LocationResult) => void;
  currentLocationName?: string;
}

const QUICK_CITIES: { name: string; country: string; lat: number; lon: number }[] = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectLocation, currentLocationName }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<LocationResult[]>(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic using Open-Meteo Geocoding API
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const timer = setTimeout(async () => {
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        setIsOpen(true);
        if (locations.length === 0) {
          setErrorMessage(`No matching city found for "${query}". Please check your spelling.`);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error searching city.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (location: LocationResult) => {
    onSelectLocation(location);
    setQuery('');
    setIsOpen(false);
    setResults([]);

    // Update recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== location.id);
      const updated = [location, ...filtered].slice(0, 6);
      try {
        localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  };

  const handleQuickCityClick = (city: typeof QUICK_CITIES[0]) => {
    const loc: LocationResult = {
      id: Math.abs(city.lat * 1000 + city.lon * 1000),
      name: city.name,
      country: city.country,
      latitude: city.lat,
      longitude: city.lon,
      timezone: 'auto',
    };
    handleSelect(loc);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('weather_recent_searches');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={wrapperRef}>
      
      {/* Input Box */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl blur-md group-hover:blur-lg transition-all opacity-70 group-focus-within:opacity-100" />
        
        <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 group-focus-within:border-sky-500/80 rounded-2xl shadow-xl transition-all overflow-hidden">
          <div className="pl-4 text-slate-400">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search city by name (e.g., London, Tokyo, Chicago, Mumbai)..."
            className="w-full py-3.5 pl-3 pr-10 bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            id="city-search-input"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setErrorMessage(null);
              }}
              className="pr-4 text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Auto-complete Dropdown Results */}
        {isOpen && (query.trim().length >= 2 || recentSearches.length > 0) && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto divide-y divide-slate-800">
            
            {/* API Search Results */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  Matching Locations ({results.length})
                </div>
                {results.map((loc) => (
                  <button
                    key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-sky-500/10 hover:border-sky-500/20 border border-transparent transition-all flex items-center justify-between group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 group-hover/item:bg-sky-500 group-hover/item:text-slate-950 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-100 group-hover/item:text-sky-300 transition-colors">
                          {loc.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-slate-500 flex items-center gap-2">
                      <span className="hidden sm:inline text-[11px] font-mono bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {loc.latitude.toFixed(1)}°, {loc.longitude.toFixed(1)}°
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover/item:text-sky-400 group-hover/item:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Error Message when no results */}
            {errorMessage && results.length === 0 && !isLoading && (
              <div className="p-4 text-center">
                <p className="text-sm text-rose-400 font-medium">{errorMessage}</p>
                <p className="text-xs text-slate-400 mt-1">Try searching with country or state name (e.g. "Paris, France").</p>
              </div>
            )}

            {/* Recent Searches Section */}
            {recentSearches.length > 0 && query.trim().length < 2 && (
              <div className="p-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-indigo-400" />
                    Recent Searches
                  </span>
                  <button
                    onClick={clearRecent}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((loc) => (
                  <button
                    key={`recent-${loc.id}`}
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-indigo-500/10 transition-colors flex items-center justify-between text-slate-300 hover:text-white"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{loc.name}</span>
                      <span className="text-xs text-slate-500">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Quick City Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
          Popular:
        </span>
        {QUICK_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => handleQuickCityClick(city)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-sky-500/20 hover:text-sky-300 hover:border-sky-500/40 text-slate-300 border border-slate-700/80 transition-all font-medium"
          >
            {city.name}
          </button>
        ))}
      </div>

    </div>
  );
};
