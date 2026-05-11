import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Components
import { Sidebar } from '../components/Sidebar';
import { MarketChart } from '../components/MarketChart';
import { ActionFeed } from '../components/ActionFeed';
import { WeatherStation } from '../components/WeatherStation';
import { SoilHealth } from '../components/SoilHealth'; 
import { CropAdvisor } from '../components/CropAdvisor';
import PestRiskMeter from '../components/PestRiskMeter'; 
import { DzongkhagSearch } from '../components/DzongkhagSearch';
import BuyProducts from '../components/BuyProducts'; 
import SellProduct from '../components/SellProduct';
import RentEquipments from '../components/RentEquipments';
import BrowseEquipment from '../components/BrowseEquipment';
import CropScheduler from '../components/CropScheduler';

// Assets
import bannerImg from '../assets/farming.jpeg';

interface WeatherData {
  temp: number;
  humidity: number;
  moisture: number;
  name: string;
  forecast: any[];
  elevation?: number;
  recommendedCrops: any[];
}

const DashboardHome = ({ weather }: { weather: WeatherData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
    <div className="lg:col-span-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PestRiskMeter temp={weather.temp} humidity={weather.humidity} locationName={weather.name} />
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">Irrigation Alert</h3>
            <p className="text-4xl font-bold text-slate-800 mt-2">{weather.moisture}%</p>
            <p className="text-xs text-slate-500">Estimated Soil Moisture</p>
          </div>
          <button className="w-full py-3 bg-sky-600 hover:bg-sky-700 transition-colors text-white font-medium rounded-xl mt-4">
            Manual Override
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CropScheduler elevation={weather.elevation} crops={weather.recommendedCrops} />
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">🪲 Pest ID Guide</h3>
          <div className="grid grid-cols-2 gap-2">
             <div className="aspect-square bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400">Pest Visual 1</div>
             <div className="aspect-square bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[10px] text-slate-400">Pest Visual 2</div>
          </div>
        </div>
      </div>
    </div>
    <div className="lg:col-span-4 space-y-6">
      <div className="bg-emerald-900 p-6 rounded-3xl text-white shadow-lg shadow-emerald-900/20">
        <h3 className="font-bold mb-1">Quick Actions</h3>
        <p className="text-[10px] text-emerald-300 mb-4 uppercase font-semibold">GNH Agri-Connect</p>
        <button className="w-full bg-emerald-500 py-3 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-all shadow-md">Post New Update</button>
      </div>
      <ActionFeed />
    </div>
  </div>
);

export const FarmerLayout: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temp: 0, humidity: 0, moisture: 0, name: 'Loading...', forecast: [], recommendedCrops: [], elevation: 0
  });

  const updateLocation = async (locName: string) => {
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locName}&count=1&language=en&format=json`).then(r => r.json());
      if (!geo.results?.[0]) return;
      const { latitude, longitude, name } = geo.results[0];
      const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`).then(r => r.json());
      
      setWeatherData(prev => ({
        ...prev,
        name,
        temp: Math.round(wRes.current.temperature_2m),
        humidity: wRes.current.relative_humidity_2m,
        moisture: wRes.current.precipitation > 0 ? 85 : 62,
      }));
    } catch (e) { console.error("Weather fetch failed:", e); }
  };

  useEffect(() => { updateLocation("Thimphu"); }, []);

  return (
  <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-8">
      <Routes>
        {/* Changed: We use index to tell React this is ONLY for the base path */}
        <Route index element={
          <>
            <div className="relative w-full h-[270px] rounded-[2rem] overflow-hidden flex items-center px-12 shadow-xl shadow-emerald-100/50"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="relative z-20">
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">GNH <span className="text-emerald-400">AGRI-TECH.</span></h1>
          <p className="text-white text-lg font-medium opacity-90 mb-6">Modernizing Bhutanese Agriculture</p>
          <div className="w-full max-w-sm">
            <DzongkhagSearch onSelect={(l: any) => updateLocation(typeof l === 'string' ? l : (l.name || l.dzongkhag))} />
          </div>
        </div>
      </div>
      <div className="mt-8"><DashboardHome weather={weatherData} /></div>
    </>
  } />
          {/* Sub Routes */}
        {/* Feature Routes - Use absolute paths to match the Sidebar */}
  <Route path="weather" element={<WeatherStation location={weatherData.name} forecast={weatherData.forecast} />} />
  <Route path="soil" element={<SoilHealth />} />
<Route path="market" element={<MarketChart />} />  <Route path="advisor" element={<CropAdvisor />} />
  <Route path="sell-product" element={<SellProduct />} />
  <Route path="rent-equipments" element={<RentEquipments />} />
  <Route path="buy-products" element={<BuyProducts />} />
  <Route path="browse-equipments" element={<BrowseEquipment />} />
  <Route path="browse-rentals" element={<BrowseEquipment />} />
  

  {/* Add others as needed */}
</Routes>
    </main>
  </div>
);
};