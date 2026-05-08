import { NavLink } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Adjust path if necessary
import {
  LayoutDashboard,
  Cloud,
  ShoppingCart,
  TestTube2,
  Sprout,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  Tractor,
  MapPin,
  LogOut
} from "lucide-react";

const navSections = [
  {
    title: "",
    items: [
      { icon: LayoutDashboard, label: "Home", path: "/" },
    ],
  },
  {
    title: "FARM INSIGHTS",
    items: [
      { icon: Cloud, label: "Weather", path: "/weather" },
      { icon: TestTube2, label: "Soil Health", path: "/soil" },
      { icon: Sprout, label: "Crop Advisor", path: "/advisor" },
    ],
  },
  {
    title: "MARKETPLACE",
    items: [
      { icon: ShoppingBag, label: "Buy Products", path: "/buy-products" },
      { icon: ShoppingBasket, label: "Sell Product", path: "/sell-product" },
      { icon: Tractor, label: "Rent Equipments", path: "/rent-equipments" },
      { icon: ShoppingCart, label: "Market Prices", path: "/market" },
      { icon: MapPin, label: "Nearby Listings", path: "/nearby" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

export const Sidebar = () => {
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen p-4 flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <div className="p-4 mb-6 flex items-center gap-2">
          <div className="bg-emerald-700 p-2 rounded-lg text-white shadow-lg shadow-emerald-100">
            <Sprout size={24} />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">SAT-D Dashboard</span>
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.title && (
                <p className="text-[10px] font-bold text-slate-400 px-4 mb-3 uppercase tracking-widest">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
    <>
      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
      {item.label}
    </>
  )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Logout */}
      <div className="pt-4 border-t border-slate-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>

    </aside>
  );
};