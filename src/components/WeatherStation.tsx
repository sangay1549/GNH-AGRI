import React from 'react';

// 1. Interface for the forecast data
export interface ForecastDay {
  date: string;
  avgTemp: number;
  condition: string;
  rainChance: number;
  icon: string;
  // Optional stats for the main card
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  visibility?: number;
  elevation?: number; // New field for elevation data
}

interface WeatherStationProps {
  location: string;
  forecast: ForecastDay[]; 
}

export const WeatherStation: React.FC<WeatherStationProps> = ({ location, forecast }) => {
  // Use the first day of the forecast for the "Live" data card
  const today = forecast && forecast.length > 0 ? forecast[0] : null;

  if (!today) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm animate-pulse text-center">
        <p className="text-slate-400">Loading Weather Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Station Card */}
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">
              Live {location} Data
            </span>
            <h2 className="text-2xl font-bold text-slate-800">
              {location}, Bhutan
            </h2>
            <p className="text-slate-500 capitalize">
              {today.condition}
            </p>
          </div>
          <div className="text-5xl font-bold text-emerald-600 tabular-nums">
            {Math.round(today.avgTemp)}°C
          </div>
        </div>

        {/* Stats Grid - Now linked to data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <WeatherStatCard 
            label="Humidity" 
            value={today.humidity ? `${today.humidity}%` : '--'} 
          />
          <WeatherStatCard 
            label="Wind Speed" 
            value={today.windSpeed ? `${today.windSpeed} km/h` : '--'} 
          />
          <WeatherStatCard 
            label="Pressure" 
            value={today.pressure ? `${today.pressure} hPa` : '--'} 
          />
          <WeatherStatCard 
            label="Visibility" 
            value={today.visibility ? `${today.visibility} km` : '--'} 
          />
          {today.elevation !== undefined && (
            <WeatherStatCard 
              label="Elevation" 
              value={`${today.elevation} m`} 
            />
          )}
        </div>
      </div>

      {/* Forecast Section */}
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
          Agricultural Outlook (Next 4 Days)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center text-center hover:bg-emerald-50/20 transition-colors">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <img src={day.icon} alt={day.condition} className="w-10 h-10 mb-2" />
              <p className="text-xl font-bold text-slate-700">{Math.round(day.avgTemp)}°C</p>
              <p className="text-[10px] text-slate-500 mb-2 font-medium">{day.condition}</p>
              <div className="w-full pt-2 border-t border-slate-200 mt-2">
                <p className="text-[10px] font-bold text-blue-600 uppercase">
                  {day.rainChance}% Rain
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Internal Helper Component for Stats
const WeatherStatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl transition-colors hover:bg-emerald-50/30">
    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-tight">{label}</p>
    <p className="text-lg font-bold text-slate-700">{value}</p>
  </div>
);