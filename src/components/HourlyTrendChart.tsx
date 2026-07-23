import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Thermometer, CloudRain, Wind, Sun, Clock, Sparkles } from 'lucide-react';
import { ForecastResponse, TemperatureUnit, WindSpeedUnit } from '../types/weather';
import {
  formatHourOnly,
  convertTemperatureValue,
  getWeatherCodeInfo,
  formatWindSpeed
} from '../utils/weatherUtils';

interface HourlyTrendChartProps {
  weather: ForecastResponse;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  selectedDayIndex: number;
}

type MetricTab = 'temperature' | 'precipitation' | 'wind' | 'uv';

export const HourlyTrendChart: React.FC<HourlyTrendChartProps> = ({
  weather,
  tempUnit,
  windUnit,
  selectedDayIndex
}) => {
  const [activeTab, setActiveTab] = useState<MetricTab>('temperature');

  if (!weather || !weather.hourly || !weather.hourly.time) {
    return null;
  }

  // Filter 24 hours corresponding to the selected day index (index * 24 to index * 24 + 24)
  const startIndex = selectedDayIndex * 24;
  const endIndex = startIndex + 24;

  const times = weather.hourly.time.slice(startIndex, endIndex);
  const temps = weather.hourly.temperature_2m.slice(startIndex, endIndex);
  const apparentTemps = weather.hourly.apparent_temperature.slice(startIndex, endIndex);
  const precipProbs = weather.hourly.precipitation_probability.slice(startIndex, endIndex);
  const windSpeeds = weather.hourly.wind_speed_10m.slice(startIndex, endIndex);
  const uvIndices = weather.hourly.uv_index.slice(startIndex, endIndex);
  const weatherCodes = weather.hourly.weather_code.slice(startIndex, endIndex);

  // Prepare chart dataset
  const chartData = times.map((t, idx) => {
    const rawTemp = temps[idx];
    const rawApparent = apparentTemps[idx];
    const code = weatherCodes[idx];
    const codeInfo = getWeatherCodeInfo(code, 1);

    return {
      time: t,
      timeFormatted: formatHourOnly(t),
      temp: convertTemperatureValue(rawTemp, tempUnit),
      apparentTemp: convertTemperatureValue(rawApparent, tempUnit),
      precipitation: precipProbs[idx] ?? 0,
      wind: windUnit === 'mph' ? Math.round((windSpeeds[idx] ?? 0) * 0.621371) : Math.round(windSpeeds[idx] ?? 0),
      uv: Math.round((uvIndices[idx] ?? 0) * 10) / 10,
      condition: codeInfo.label
    };
  });

  const selectedDateStr = weather.daily?.time?.[selectedDayIndex]
    ? new Date(weather.daily.time[selectedDayIndex]).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    : 'Selected Day';

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-3 rounded-2xl shadow-2xl text-xs space-y-1.5 min-w-[150px]">
          <div className="flex items-center justify-between text-slate-400 font-semibold border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" />
              {data.timeFormatted}
            </span>
            <span className="text-slate-300 font-medium">{data.condition}</span>
          </div>

          {activeTab === 'temperature' && (
            <div className="space-y-1 pt-0.5">
              <div className="text-amber-400 font-bold flex items-center justify-between">
                <span>Temp:</span>
                <span>{data.temp}°{tempUnit === 'fahrenheit' ? 'F' : 'C'}</span>
              </div>
              <div className="text-sky-400 font-medium flex items-center justify-between text-[11px]">
                <span>Feels like:</span>
                <span>{data.apparentTemp}°{tempUnit === 'fahrenheit' ? 'F' : 'C'}</span>
              </div>
            </div>
          )}

          {activeTab === 'precipitation' && (
            <div className="text-sky-400 font-bold flex items-center justify-between pt-0.5">
              <span>Rain Chance:</span>
              <span>{data.precipitation}%</span>
            </div>
          )}

          {activeTab === 'wind' && (
            <div className="text-indigo-400 font-bold flex items-center justify-between pt-0.5">
              <span>Wind Speed:</span>
              <span>{data.wind} {windUnit}</span>
            </div>
          )}

          {activeTab === 'uv' && (
            <div className="text-purple-400 font-bold flex items-center justify-between pt-0.5">
              <span>UV Index:</span>
              <span>{data.uv}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-xl">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                24-Hour Weather Intelligence Chart
              </h2>
              <p className="text-xs text-slate-400">
                Detailed hourly trend for <span className="text-sky-400 font-semibold">{selectedDateStr}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800/90 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              activeTab === 'temperature'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => setActiveTab('precipitation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              activeTab === 'precipitation'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain %</span>
          </button>

          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              activeTab === 'wind'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>

          <button
            onClick={() => setActiveTab('uv')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
              activeTab === 'uv'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV Index</span>
          </button>
        </div>
      </div>

      {/* Chart Visualization Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Temperature Gradient */}
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>

              {/* Feels Like Gradient */}
              <linearGradient id="apparentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Rain Gradient */}
              <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>

              {/* Wind Gradient */}
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>

              {/* UV Gradient */}
              <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />

            <XAxis
              dataKey="timeFormatted"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={2}
            />

            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Render chart according to active tab */}
            {activeTab === 'temperature' && (
              <>
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                  name="Temperature"
                />
                <Area
                  type="monotone"
                  dataKey="apparentTemp"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#apparentGradient)"
                  name="Feels Like"
                />
              </>
            )}

            {activeTab === 'precipitation' && (
              <Area
                type="monotone"
                dataKey="precipitation"
                stroke="#0284c7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#rainGradient)"
                name="Rain Probability (%)"
              />
            )}

            {activeTab === 'wind' && (
              <Area
                type="monotone"
                dataKey="wind"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#windGradient)"
                name="Wind Speed"
              />
            )}

            {activeTab === 'uv' && (
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#a855f7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#uvGradient)"
                name="UV Index"
              />
            )}

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
