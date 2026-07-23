import React, { useState, useEffect, useCallback } from 'react';
import {
  LocationResult,
  ForecastResponse,
  TemperatureUnit,
  WindSpeedUnit,
  FavoriteLocation
} from './types/weather';
import { fetchWeatherData, reverseGeocodeLocation, searchLocations } from './services/openMeteoApi';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { Forecast7Days } from './components/Forecast7Days';
import { HourlyTrendChart } from './components/HourlyTrendChart';
import { RecommendationsGrid } from './components/RecommendationsGrid';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ErrorState } from './components/ErrorState';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { CloudSun, Sparkles, MapPin, Compass, ShieldCheck } from 'lucide-react';

// Default initial location: London
const DEFAULT_LOCATION: LocationResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.5074,
  longitude: -0.1278,
  country: 'United Kingdom',
  admin1: 'England',
  timezone: 'auto'
};

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Preference Settings
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>('celsius');
  const [windUnit, setWindUnit] = useState<WindSpeedUnit>('kmh');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Favorites state
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(() => {
    try {
      const saved = localStorage.getItem('weather_intel_favorites');
      return saved ? JSON.parse(saved) : [
        {
          id: '2643743',
          name: 'London',
          country: 'United Kingdom',
          latitude: 51.5074,
          longitude: -0.1278,
          timezone: 'auto'
        },
        {
          id: '1850147',
          name: 'Tokyo',
          country: 'Japan',
          latitude: 35.6895,
          longitude: 139.6917,
          timezone: 'auto'
        },
        {
          id: '5128581',
          name: 'New York',
          country: 'United States',
          latitude: 40.7128,
          longitude: -74.006,
          timezone: 'auto'
        }
      ];
    } catch {
      return [];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('weather_intel_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore write error
    }
  }, [favorites]);

  // Load weather for location
  const loadWeather = useCallback(async (location: LocationResult, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchWeatherData(location.latitude, location.longitude, location.timezone);
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve weather forecast from Open-Meteo API.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch initial forecast on mount or location change
  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation, loadWeather]);

  // Handle location selection
  const handleSelectLocation = (loc: LocationResult) => {
    setSelectedLocation(loc);
    setSelectedDayIndex(0);
  };

  // Browser Geolocation Trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const loc = await reverseGeocodeLocation(latitude, longitude);
          handleSelectLocation(loc);
        } catch {
          handleSelectLocation({
            id: Date.now(),
            name: 'My GPS Location',
            latitude,
            longitude,
            timezone: 'auto'
          });
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setError('Location permission was denied. Please use the search bar above to look up your city.');
        } else {
          setError('Could not determine your GPS location. Please search for your city by name.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Favorite toggle logic
  const isFavorite = favorites.some((f) => f.name.toLowerCase() === selectedLocation.name.toLowerCase());

  const handleToggleFavorite = () => {
    if (isFavorite) {
      setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== selectedLocation.name.toLowerCase()));
    } else {
      const newFav: FavoriteLocation = {
        id: selectedLocation.id?.toString() || Date.now().toString(),
        name: selectedLocation.name,
        country: selectedLocation.country,
        admin1: selectedLocation.admin1,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timezone: selectedLocation.timezone || 'auto'
      };
      setFavorites((prev) => [newFav, ...prev]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-slate-950 flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        tempUnit={tempUnit}
        onToggleTempUnit={setTempUnit}
        windUnit={windUnit}
        onToggleWindUnit={setWindUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        favoritesCount={favorites.length}
        onToggleFavoritesDrawer={() => setIsFavoritesOpen(true)}
        onRefresh={() => loadWeather(selectedLocation, true)}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* City Search Bar */}
        <section>
          <SearchBar
            onSelectLocation={handleSelectLocation}
            currentLocationName={selectedLocation.name}
          />
        </section>

        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState
            message={error}
            onRetry={() => loadWeather(selectedLocation)}
            onResetSearch={() => handleSelectLocation(DEFAULT_LOCATION)}
          />
        )}

        {/* Weather Dashboard View */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Hero Current Weather */}
            <section>
              <CurrentWeatherCard
                weather={weatherData}
                location={selectedLocation}
                tempUnit={tempUnit}
                windUnit={windUnit}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </section>

            {/* Smart Recommendations Grid */}
            <section>
              <RecommendationsGrid weather={weatherData} />
            </section>

            {/* 7-Day Forecast Cards */}
            <section>
              <Forecast7Days
                daily={weatherData.daily}
                tempUnit={tempUnit}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={setSelectedDayIndex}
              />
            </section>

            {/* 24-Hour Trend Chart */}
            <section>
              <HourlyTrendChart
                weather={weatherData}
                tempUnit={tempUnit}
                windUnit={windUnit}
                selectedDayIndex={selectedDayIndex}
              />
            </section>

          </div>
        )}

      </main>

      {/* Favorites Side Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={handleSelectLocation}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-slate-300">Weather Intelligence Platform</span>
            <span>• Powered by Open-Meteo REST APIs</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>Free & Open Data</span>
            <span>•</span>
            <span>WMO Weather Interpretation Codes</span>
            <span>•</span>
            <span>No API Key Required</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
