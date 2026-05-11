import { NavLink } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { 
  LayoutDashboard, 
  CloudSun, 
  Droplets, 
  Sprout, 
  Tag, 
  Wrench, 
  BarChart3, 
  MapPin, 
  LogOut,
  Search // <--- Added this for Rental Hub
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/farmer-dashboard' }, 
  { icon: CloudSun, label: 'Weather', path: '/farmer-dashboard/weather' },
  { icon: Droplets, label: 'Soil Health', path: '/farmer-dashboard/soil' },
  { icon: Sprout, label: 'Crop Advisor', path: '/farmer-dashboard/advisor' },
  { icon: Tag, label: 'My Sales', path: '/farmer-dashboard/sell-product' },
  
  // 1. THIS IS THE NEW ONE FOR BROWSING
  { icon: Search, label: 'Rental Hub', path: '/farmer-dashboard/browse-rentals' }, 
  
  // 2. THIS IS YOUR CURRENT FORM PAGE
  { icon: Wrench, label: 'My Equipments', path: '/farmer-dashboard/rent-equipments' }, 
  
  { icon: BarChart3, label: 'Market Trends', path: '/farmer-dashboard/market' },
  { icon: MapPin, label: 'Nearby', path: '/farmer-dashboard/listings' },
];

export const Sidebar = () => {
 const handleSignOut = async () => {
  await supabase.auth.signOut();
  window.location.href = '/login';
};

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-emerald-700 p-2.5 rounded-2xl shadow-lg shadow-emerald-100">
          <Sprout className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 leading-none tracking-tight">SAT-D</h1>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Farmer Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            end={item.path === '/farmer-dashboard'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 mt-6 border-t border-slate-100">
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-4 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all font-bold text-sm group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};