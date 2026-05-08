import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import { Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import { Sidebar } from './components/Sidebar';
import { MarketChart } from './components/MarketChart';
import { ActionFeed } from './components/ActionFeed';
import { WeatherStation } from './components/WeatherStation';
import { SoilHealth } from './components/SoilHealth'; 
import { CropAdvisor } from './components/CropAdvisor';
import PestRiskMeter from './components/PestRiskMeter'; 
import { DzongkhagSearch } from './components/DzongkhagSearch';
import BuyProducts from './components/BuyProducts'; 
import SellProduct from './components/SellProduct';
import RentEquipments from './components/RentEquipments';
import BrowseEquipment from './components/BrowseEquipment';
import CropScheduler from './components/CropScheduler';

// Page Import
import Login from './pages/Login'; 

// Assets
import bannerImg from './assets/farming.jpeg';

// --- Interfaces ---
export interface ForecastDay {
  date: string;
  avgTemp: number;
  condition: string;
  rainChance: number;
  icon: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  moisture: number;
  name: string;
  forecast: ForecastDay[];
  elevation?: number;
  recommendedCrops: any[];
}

// --- Sub-component: DashboardHome ---
const DashboardHome = ({ weather }: { weather: WeatherData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
    <div className="lg:col-span-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PestRiskMeter 
          temp={weather.temp} 
          humidity={weather.humidity} 
          locationName={weather.name} 
        />
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-slate-700">Irrigation Alert</h3>
              <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[10px] font-bold rounded-lg uppercase">Active</span>
            </div>
            <p className="text-4xl font-bold text-slate-800 mt-2">{weather.moisture}%</p>
            <p className="text-xs text-slate-500">Current Soil Moisture</p>
          </div>
          <button className="w-full py-3 bg-sky-600 hover:bg-sky-700 transition-colors text-white font-medium rounded-xl mt-4">
            Manual Override
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CropScheduler elevation={weather.elevation} crops={weather.recommendedCrops} />
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span>🪲</span> GNH Pest ID Guide
          </h3>
          <div className="grid grid-cols-2 gap-2">
             <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400">Pest Image</div>
             <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400">Pest Image</div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 italic">Theory: Match visual symptoms to organic solutions.</p>
        </div>
      </div>
    </div>

    <div className="lg:col-span-4 space-y-6">
      <div className="bg-emerald-900 p-6 rounded-3xl text-white shadow-lg">
        <h3 className="font-bold mb-2">Quick Actions</h3>
        <p className="text-xs text-emerald-200 mb-4">Manage your farm operations instantly.</p>
        <button className="w-full bg-emerald-500 py-2 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all">Post New Update</button>
      </div>
      <ActionFeed />
    </div>
  </div>
);

// --- Main App ---
const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temp: 0, humidity: 0, moisture: 0, name: 'Loading...', 
    forecast: [], recommendedCrops: [], elevation: 0
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
      if (!geoData.results || geoData.results.length === 0) return;
      const { latitude, longitude, name: officialName } = geoData.results[0];

      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=weather_code,temperature_2m_max,precipitation_probability_max&timezone=auto&forecast_days=4`;
      const res = await fetch(weatherURL);
      const weatherJson = await res.json();
      const currentTemp = Math.round(Number(weatherJson.current.temperature_2m));

      const { data: cropsFromDb } = await supabase
        .from('agricultural_products') 
        .select('name, status, progress, modern_window, market_demand_level')
        .lte('min_temp', currentTemp) 
        .gte('max_temp', currentTemp);

      const mappedForecast = weatherJson.daily.time.map((date: string, i: number) => ({
        date,
        avgTemp: Math.round(weatherJson.daily.temperature_2m_max[i]),
        condition: getWeatherCondition(weatherJson.daily.weather_code[i]),
        rainChance: weatherJson.daily.precipitation_probability_max[i],
        icon: "https://cdn-icons-png.flaticon.com/512/3222/3222800.png",
      }));

      setWeatherData({
        name: officialName,
        temp: currentTemp,
        humidity: weatherJson.current.relative_humidity_2m,
        moisture: weatherJson.current.precipitation > 0 ? 85 : 62,
        elevation: weatherJson.elevation,
        forecast: mappedForecast,
        recommendedCrops: cropsFromDb || []
      });
    } catch (err) {
      console.error("Error linking weather and crops:", err);
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    updateDashboardLocation("Thimphu");

    return () => subscription.unsubscribe();
  }, []);

  const handleLocationSelect = (loc: any) => {
    const name = typeof loc === 'string' ? loc : (loc.name || loc.gewog || loc.dzongkhag);
    if (name) updateDashboardLocation(name);
  };

  if (authLoading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-emerald-700 font-bold tracking-widest uppercase animate-pulse">
      GNH Agri-Tech Initializing...
    </div>
  );

  // AUTH GUARD: If no session, show ONLY login
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // LOGGED IN LAYOUT
  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          {/* Dashboard Home - Includes Banner */}
          <Route path="/" element={
            <>
              <div className="relative w-full h-[270px] rounded-[2rem] overflow-hidden flex items-center px-12 lg:px-16 shadow-lg shadow-emerald-100/50"
                style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center 100%' }}>
                <div className="absolute inset-0 bg-black/35 z-10" />
                <div className="relative z-20 w-full flex flex-col items-start text-left">
                  <div className="mb-8">
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
                      GNH <span className="text-emerald-400">AGRI-TECH.</span>
                    </h1>
                    <p className="text-slate-100 text-lg lg:text-xl font-medium opacity-90">Precision farming for the Kingdom.</p>
                  </div>
                  <div className="w-full max-w-3xl">
                     <DzongkhagSearch onSelect={handleLocationSelect} />
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <DashboardHome weather={weatherData} />
              </div>
            </>
          } />

          {/* Sub-pages - No Banner */}
          <Route path="/weather" element={<WeatherStation location={weatherData.name} forecast={weatherData.forecast} />} />
          <Route path="/soil" element={<SoilHealth />} />
          <Route path="/market" element={<MarketChart location={weatherData.name} />} />
          <Route path="/advisor" element={<CropAdvisor />} />
          <Route path="/buy-products" element={<BuyProducts />} />
          <Route path="/Agri-connect/sell" element={<SellProduct />} />
          <Route path="/sell-product" element={<SellProduct />} />
          <Route path="/rent-equipments" element={<RentEquipments />} />
          <Route path="/browse-equipments" element={<BrowseEquipment />} />
          <Route path="/crop-scheduler" element={<CropScheduler />} />
          
          {/* Redirect any accidental /login hits to home since user is logged in */}
          <Route path="/login" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;