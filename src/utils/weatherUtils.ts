import {
  TemperatureUnit,
  WindSpeedUnit,
  CurrentWeather,
  DailyForecast,
  WeatherRecommendation
} from '../types/weather';

export interface WeatherCodeInfo {
  label: string;
  iconName: 'Sun' | 'CloudSun' | 'Cloud' | 'CloudRain' | 'CloudDrizzle' | 'CloudSnow' | 'CloudLightning' | 'CloudFog' | 'Snowflake';
  bgGradient: string;
  cardBg: string;
  themeColor: string;
  isRain: boolean;
  isSnow: boolean;
  isStorm: boolean;
  isClear: boolean;
}

export function getWeatherCodeInfo(code: number, isDay: number = 1): WeatherCodeInfo {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        iconName: 'Sun',
        bgGradient: isDay
          ? 'from-amber-500/20 via-sky-400/10 to-indigo-500/10'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        cardBg: isDay ? 'bg-amber-50/80 dark:bg-amber-950/20' : 'bg-slate-900/80',
        themeColor: '#f59e0b',
        isRain: false,
        isSnow: false,
        isStorm: false,
        isClear: true,
      };
    case 1:
      return {
        label: isDay ? 'Mainly Clear' : 'Mostly Clear Night',
        iconName: 'CloudSun',
        bgGradient: isDay
          ? 'from-sky-400/20 via-blue-500/10 to-indigo-400/10'
          : 'from-slate-900 via-slate-800 to-indigo-950',
        cardBg: 'bg-sky-50/80 dark:bg-sky-950/20',
        themeColor: '#38bdf8',
        isRain: false,
        isSnow: false,
        isStorm: false,
        isClear: true,
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        iconName: 'CloudSun',
        bgGradient: 'from-blue-400/20 via-slate-400/10 to-sky-300/10',
        cardBg: 'bg-slate-100/80 dark:bg-slate-800/40',
        themeColor: '#0284c7',
        isRain: false,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 3:
      return {
        label: 'Overcast',
        iconName: 'Cloud',
        bgGradient: 'from-slate-500/20 via-slate-600/10 to-gray-400/10',
        cardBg: 'bg-slate-200/80 dark:bg-slate-800/60',
        themeColor: '#64748b',
        isRain: false,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 45:
    case 48:
      return {
        label: code === 45 ? 'Foggy' : 'Depositing Rime Fog',
        iconName: 'CloudFog',
        bgGradient: 'from-gray-400/20 via-slate-400/20 to-zinc-500/10',
        cardBg: 'bg-zinc-100/80 dark:bg-zinc-900/40',
        themeColor: '#9ca3af',
        isRain: false,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 51:
    case 53:
    case 55:
      return {
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-teal-500/20 via-cyan-600/10 to-blue-500/10',
        cardBg: 'bg-teal-50/80 dark:bg-teal-950/20',
        themeColor: '#0d9488',
        isRain: true,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-cyan-400/20 via-blue-500/20 to-indigo-400/10',
        cardBg: 'bg-cyan-50/80 dark:bg-cyan-950/20',
        themeColor: '#06b6d4',
        isRain: true,
        isSnow: true,
        isStorm: false,
        isClear: false,
      };
    case 61:
      return {
        label: 'Slight Rain',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-500/20 via-sky-600/10 to-indigo-500/10',
        cardBg: 'bg-blue-50/80 dark:bg-blue-950/20',
        themeColor: '#2563eb',
        isRain: true,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 63:
      return {
        label: 'Moderate Rain',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600/25 via-indigo-600/15 to-slate-700/10',
        cardBg: 'bg-blue-100/80 dark:bg-blue-950/40',
        themeColor: '#1d4ed8',
        isRain: true,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 65:
      return {
        label: 'Heavy Rain',
        iconName: 'CloudRain',
        bgGradient: 'from-indigo-700/30 via-blue-800/20 to-slate-900/20',
        cardBg: 'bg-indigo-100/80 dark:bg-indigo-950/50',
        themeColor: '#4338ca',
        isRain: true,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        iconName: 'CloudRain',
        bgGradient: 'from-sky-500/20 via-cyan-600/20 to-indigo-600/10',
        cardBg: 'bg-sky-100/80 dark:bg-sky-950/40',
        themeColor: '#0284c7',
        isRain: true,
        isSnow: true,
        isStorm: false,
        isClear: false,
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        iconName: 'Snowflake',
        bgGradient: 'from-indigo-300/20 via-sky-200/20 to-slate-300/20',
        cardBg: 'bg-sky-50/90 dark:bg-slate-800/80',
        themeColor: '#38bdf8',
        isRain: false,
        isSnow: true,
        isStorm: false,
        isClear: false,
      };
    case 80:
    case 81:
    case 82:
      return {
        label: code === 80 ? 'Light Showers' : code === 81 ? 'Moderate Showers' : 'Violent Rain Showers',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600/25 via-sky-500/20 to-indigo-600/10',
        cardBg: 'bg-blue-50/90 dark:bg-blue-950/30',
        themeColor: '#2563eb',
        isRain: true,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        iconName: 'CloudSnow',
        bgGradient: 'from-sky-300/25 via-blue-400/20 to-indigo-300/10',
        cardBg: 'bg-slate-100/90 dark:bg-slate-800/70',
        themeColor: '#0284c7',
        isRain: false,
        isSnow: true,
        isStorm: false,
        isClear: false,
      };
    case 95:
    case 96:
    case 99:
      return {
        label: code === 95 ? 'Thunderstorm' : 'Thunderstorm with Hail',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900/30 via-slate-900/40 to-amber-600/20',
        cardBg: 'bg-purple-950/20 dark:bg-purple-950/60',
        themeColor: '#a855f7',
        isRain: true,
        isSnow: false,
        isStorm: true,
        isClear: false,
      };
    default:
      return {
        label: 'Variable Weather',
        iconName: 'CloudSun',
        bgGradient: 'from-slate-400/20 via-sky-400/10 to-indigo-400/10',
        cardBg: 'bg-slate-100/80 dark:bg-slate-800/40',
        themeColor: '#0284c7',
        isRain: false,
        isSnow: false,
        isStorm: false,
        isClear: false,
      };
  }
}

// Temperature Conversion
export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (isNaN(celsius)) return '--';
  const val = unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;
  return `${Math.round(val)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function convertTemperatureValue(celsius: number, unit: TemperatureUnit): number {
  if (isNaN(celsius)) return 0;
  return unit === 'fahrenheit' ? Math.round(((celsius * 9) / 5 + 32) * 10) / 10 : Math.round(celsius * 10) / 10;
}

// Wind Speed Conversion
export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  if (isNaN(kmh)) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  } else if (unit === 'ms') {
    return `${Math.round((kmh / 3.6) * 10) / 10} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

// Wind Cardinal Direction Helper
export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
}

// Date Formatting Helpers
export function formatDateDayName(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatTimeShort(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatHourOnly(timeStr: string): string {
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

// UV Index Descriptor
export function getUVIndexCategory(uv: number): { label: string; colorClass: string } {
  if (uv <= 2) return { label: 'Low', colorClass: 'text-emerald-500 bg-emerald-500/10' };
  if (uv <= 5) return { label: 'Moderate', colorClass: 'text-amber-500 bg-amber-500/10' };
  if (uv <= 7) return { label: 'High', colorClass: 'text-orange-500 bg-orange-500/10' };
  if (uv <= 10) return { label: 'Very High', colorClass: 'text-rose-500 bg-rose-500/10' };
  return { label: 'Extreme', colorClass: 'text-purple-600 bg-purple-500/10' };
}

// Weather Intelligence Recommendation Engine
export function generateWeatherRecommendations(
  current: CurrentWeather,
  daily: DailyForecast
): WeatherRecommendation[] {
  const recommendations: WeatherRecommendation[] = [];
  const tempC = current.temperature_2m;
  const apparentTempC = current.apparent_temperature;
  const windKmh = current.wind_speed_10m;
  const uvMax = daily.uv_index_max?.[0] ?? 0;
  const rainProb = daily.precipitation_probability_max?.[0] ?? 0;
  const precipSum = daily.precipitation_sum?.[0] ?? 0;
  const codeInfo = getWeatherCodeInfo(current.weather_code, current.is_day);

  // 1. Outfit & Layering Guide
  if (tempC <= 0) {
    recommendations.push({
      id: 'outfit-freezing',
      title: 'Freezing Weather Outerwear',
      description: 'Heavy insulated jacket, thermal layers, scarf, gloves, and winter beanie essential.',
      category: 'outfit',
      severity: 'alert',
      icon: 'Shirt',
      badge: 'Freezing',
    });
  } else if (tempC <= 12) {
    recommendations.push({
      id: 'outfit-chilly',
      title: 'Warm Layering Recommended',
      description: 'Chilly outdoors! Wear a cozy coat or heavy jacket with trousers.',
      category: 'outfit',
      severity: 'info',
      icon: 'Shirt',
      badge: 'Chilly',
    });
  } else if (tempC <= 21) {
    recommendations.push({
      id: 'outfit-mild',
      title: 'Comfortable Light Layers',
      description: 'Mild weather. A light sweater, hoodie, or stylish windbreaker is perfect.',
      category: 'outfit',
      severity: 'success',
      icon: 'Shirt',
      badge: 'Mild & Pleasant',
    });
  } else if (tempC <= 29) {
    recommendations.push({
      id: 'outfit-warm',
      title: 'Warm Summer Attire',
      description: 'Warm & comfortable! Light t-shirt, shorts/breathable pants, and comfortable footwear.',
      category: 'outfit',
      severity: 'success',
      icon: 'Shirt',
      badge: 'Warm',
    });
  } else {
    recommendations.push({
      id: 'outfit-hot',
      title: 'Hot Weather Advisory',
      description: 'Lightweight, loose-fitting cotton clothing. Stay hydrated and seek shade during peak heat.',
      category: 'outfit',
      severity: 'warning',
      icon: 'Shirt',
      badge: 'Hot Weather',
    });
  }

  // 2. Umbrella & Rain Preparation
  if (codeInfo.isRain || precipSum > 2 || rainProb >= 60) {
    recommendations.push({
      id: 'umbrella-needed',
      title: 'Umbrella & Waterproof Gear',
      description: `High likelihood of precipitation (${rainProb}% chance, ~${precipSum}mm). Carry an umbrella or waterproof jacket!`,
      category: 'umbrella',
      severity: rainProb > 80 || codeInfo.isStorm ? 'alert' : 'warning',
      icon: 'Umbrella',
      badge: 'Rain Expected',
    });
  } else if (rainProb >= 30) {
    recommendations.push({
      id: 'umbrella-possible',
      title: 'Possible Passing Showers',
      description: `Moderate chance of localized rain (${rainProb}%). Keeping a compact umbrella nearby is recommended.`,
      category: 'umbrella',
      severity: 'info',
      icon: 'Umbrella',
      badge: '30%+ Chance',
    });
  } else {
    recommendations.push({
      id: 'umbrella-clear',
      title: 'No Rain Gear Needed',
      description: 'Low precipitation chance. Enjoy dry conditions throughout the day!',
      category: 'umbrella',
      severity: 'success',
      icon: 'Umbrella',
      badge: 'Dry Day',
    });
  }

  // 3. Outdoor Activity & Picnic Score
  if (!codeInfo.isRain && !codeInfo.isStorm && windKmh < 25 && tempC >= 16 && tempC <= 27) {
    recommendations.push({
      id: 'activity-picnic-perfect',
      title: 'Prime Outdoor & Picnic Day',
      description: 'Ideal conditions for picnics, outdoor dining, hiking, and park strolls!',
      category: 'activity',
      severity: 'success',
      icon: 'Sparkles',
      badge: 'Ideal Outdoors',
    });
  } else if (codeInfo.isStorm) {
    recommendations.push({
      id: 'activity-storm-indoor',
      title: 'Indoor Activities Recommended',
      description: 'Thunderstorms in vicinity. Stay indoors and avoid open outdoor elevated areas.',
      category: 'activity',
      severity: 'alert',
      icon: 'Home',
      badge: 'Storm Caution',
    });
  } else if (windKmh > 35) {
    recommendations.push({
      id: 'activity-wind-warning',
      title: 'Breezy & Gusty Winds',
      description: `Wind gusts up to ${Math.round(current.wind_gusts_10m || windKmh)} km/h. Secure loose outdoor objects and exercise caution if cycling.`,
      category: 'activity',
      severity: 'warning',
      icon: 'Wind',
      badge: 'Gusty Winds',
    });
  } else {
    recommendations.push({
      id: 'activity-standard',
      title: 'Outdoor Running & Fitness',
      description: `Fair outdoor conditions for workouts. Temperature feels like ${Math.round(apparentTempC)}°C.`,
      category: 'activity',
      severity: 'info',
      icon: 'Activity',
      badge: 'Fair Outdoor',
    });
  }

  // 4. Sun & UV Protection
  if (uvMax >= 6) {
    recommendations.push({
      id: 'sun-protection-high',
      title: 'High UV Index Alert',
      description: `Peak UV Index reaches ${uvMax.toFixed(1)}. Apply SPF 30+ broad-spectrum sunscreen and wear UV-blocking sunglasses.`,
      category: 'sun',
      severity: uvMax >= 8 ? 'alert' : 'warning',
      icon: 'Sun',
      badge: `UV ${uvMax.toFixed(0)}`,
    });
  } else if (uvMax >= 3) {
    recommendations.push({
      id: 'sun-protection-moderate',
      title: 'Moderate Sun Exposure',
      description: 'Moderate UV levels. Sunglasses and light sunscreen are recommended during midday outdoor stay.',
      category: 'sun',
      severity: 'info',
      icon: 'Sun',
      badge: `UV ${uvMax.toFixed(0)}`,
    });
  }

  // 5. Driving & Travel Visibility
  if (current.weather_code === 45 || current.weather_code === 48) {
    recommendations.push({
      id: 'travel-fog',
      title: 'Foggy Driving Conditions',
      description: 'Dense fog detected. Drive with low-beam headlights, increase follow distance, and reduce speed.',
      category: 'travel',
      severity: 'warning',
      icon: 'Car',
      badge: 'Low Visibility',
    });
  }

  return recommendations;
}
