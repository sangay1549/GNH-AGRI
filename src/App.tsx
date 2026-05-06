import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { MarketChart } from './components/MarketChart';
import { ActionFeed } from './components/ActionFeed';
import { TopHeader } from './components/TopHeader';
import { WeatherStation } from './components/WeatherStation';
import { SoilHealth } from './components/SoilHealth'; 
import { CropAdvisor } from './components/CropAdvisor';
import PestRiskMeter from './components/PestRiskMeter'; 
import { DzongkhagSearch } from './components/DzongkhagSearch';
import BuyProducts from './components/BuyProducts'; 
import SellProduct from './components/SellProduct';
import RentEquipments from './components/RentEquipments';
import BrowseEquipment from './components/BrowseEquipment';

// Import your asset
import bannerImg from './assets/farming.jpeg';

// 1. Interfaces
export interface ForecastDay {
  date: string;
  avgTemp: number;
  condition: string;
  rainChance: number;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  pressure?: number;
  visibility?: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  moisture: number;
  name: string;
  forecast: ForecastDay[];
}

// 2. Dashboard Component
const DashboardHome = ({ weather }: { weather: WeatherData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div className="lg:col-span-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PestRiskMeter 
          temp={weather.temp} 
          humidity={weather.humidity} 
          locationName={weather.name} 
        />
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-700">Irrigation Alert</h3>
            <p className="text-3xl font-bold text-slate-800">{weather.moisture}%</p>
            <p className="text-xs text-slate-500">Soil Moisture Level</p>
          </div>
          <button className="w-full py-3 bg-sky-600 text-white rounded-xl mt-4">Manual Override</button>
        </div>
      </div>
    </div>
    <div className="lg:col-span-4">
      <ActionFeed />
    </div>
  </div>
);

// 3. Main App
const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temp: 0,
    humidity: 0,
    moisture: 0,
    name: '',
    forecast: []
  });

  const getWeatherCondition = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code <= 3) return "Partly Cloudy";
    if (code >= 51) return "Rainy";
    return "Cloudy";
  };

  const updateDashboardLocation = async (locationName: string) => {
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationName}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        console.error("Location not found in Geocoding API");
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,precipitation_probability_max&timezone=auto&forecast_days=4`;
      
      const res = await fetch(weatherURL);
      const data = await res.json();

      const mappedForecast = data.daily.time.map((date: string, i: number) => ({
        date: date,
        avgTemp: Math.round(data.daily.temperature_2m_max[i]),
        condition: getWeatherCondition(data.daily.weather_code[i]),
        rainChance: data.daily.precipitation_probability_max[i],
        icon: "https://cdn-icons-png.flaticon.com/512/3222/3222800.png",
        humidity: i === 0 ? data.current.relative_humidity_2m : undefined,
        windSpeed: i === 0 ? Math.round(data.current.wind_speed_10m) : undefined,
        pressure: i === 0 ? Math.round(data.current.surface_pressure) : undefined,
        visibility: i === 0 ? 10 : undefined,
      }));

      setWeatherData({
        name: locationName,
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        moisture: data.current.precipitation > 0 ? 85 : 62,
        forecast: mappedForecast
      });

    } catch (err) {
      console.error("App: Search/Fetch Error:", err);
    }
  };

  const handleLocationSelect = (loc: any) => {
    const placeName = loc.gewog || loc.dzongkhag;
    if (placeName) {
      updateDashboardLocation(placeName);
    }
  };

  useEffect(() => {
    updateDashboardLocation("Thimphu");
  }, []);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* --- FIXED HEADER SECTION --- */}
        <div 
          className="relative w-full rounded-[0rem] overflow-hidden mb-5 shadow-xl border border-white/5"
          style={{
            backgroundImage: `url(${bannerImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 90%',
          }}
        >
          {/* Readability Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />

          {/* Unified Content Layer */}
          <div className="relative z-20 p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <TopHeader /> 
            <div className="w-full max-w-sm">
              <DzongkhagSearch onSelect={handleLocationSelect} />
            </div>
          </div>
        </div>
        {/* --- END FIXED HEADER SECTION --- */}
        
        <Routes>
          <Route path="/" element={<DashboardHome weather={weatherData} />} />
          <Route 
            path="/weather" 
            element={<WeatherStation location={weatherData.name} forecast={weatherData.forecast} />} 
          />
          <Route path="/soil" element={<SoilHealth />} />
          <Route path="/market" element={<MarketChart location={weatherData.name} />} />
          <Route path="/advisor" element={<CropAdvisor />} />
          <Route path="/buy-products" element={<BuyProducts />} />
          <Route path="/Agri-connect/sell" element={<SellProduct />} />
          <Route path="/sell-product" element={<SellProduct />} />
          <Route path="/rent-equipments" element={<RentEquipments />} />
          <Route path="/browse-equipments" element={<BrowseEquipment />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;