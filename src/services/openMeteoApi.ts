import { LocationResult, GeocodingResponse, ForecastResponse } from '../types/weather';

const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_BASE = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search for cities using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<LocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_API_BASE}?name=${encodeURIComponent(trimmed)}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server responded with status: ${response.status}`);
    }
    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (err: any) {
    console.error('Error fetching geocoding data:', err);
    throw new Error(err.message || 'Failed to search city location.');
  }
}

/**
 * Fetch detailed weather forecast using latitude and longitude
 */
export async function fetchWeatherData(
  lat: number,
  lon: number,
  timezone: string = 'auto'
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max'
    ].join(','),
    timezone: timezone || 'auto'
  });

  const url = `${FORECAST_API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast service error code: ${response.status}`);
    }
    const data: ForecastResponse = await response.json();
    return data;
  } catch (err: any) {
    console.error('Error fetching weather data:', err);
    throw new Error(err.message || 'Failed to load weather forecast.');
  }
}

/**
 * Helper to get user location name via reverse geocoding or fallback
 */
export async function reverseGeocodeLocation(lat: number, lon: number): Promise<LocationResult> {
  try {
    // Open-Meteo geocoding search with coordinates is approximated by searching nearest or fallback
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`
    );
    if (res.ok) {
      const data: GeocodingResponse = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
    }
  } catch {
    // Ignore error
  }

  // Fallback location result
  return {
    id: Date.now(),
    name: 'Current Location',
    latitude: lat,
    longitude: lon,
    timezone: 'auto'
  };
}
