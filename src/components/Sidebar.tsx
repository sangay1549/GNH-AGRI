import { NavLink } from 'react-router-dom';
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
  MapPin
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
      { icon: ShoppingBag, label: "Buy Products", path: "/buy-products" }, // NEW (add route later)
      { icon: ShoppingBasket, label: "Sell Product", path: "/sell-product" },
      { icon: Tractor, label: "Rent Equipments", path: "/rent-equipments" },
      { icon: ShoppingCart, label: "Market Prices", path: "/market" },
      { icon: MapPin, label: "Nearby Listings", path: "/nearby" }, // NEW
    ],
  },
  {
    title: "",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
    ],
  },
];

export const Sidebar = () => (
  <aside className="w-64 bg-white border-r border-slate-200 h-screen p-4 flex flex-col justify-between">
    
    {/* Top */}
    <div>
      <div className="p-4 mb-6 flex items-center gap-2">
        <div className="bg-emerald-700 p-2 rounded-lg text-white">
          <Sprout size={24} />
        </div>
        <span className="font-bold text-slate-800">SAT-D Dashboard</span>
      </div>

      {/* Sections */}
      <nav className="space-y-4">
        {navSections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="text-xs text-slate-400 px-4 mb-2">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>

    {/* Bottom CTA */}
    <div className="mt-4">
      <NavLink
        to="/Agri-connect"
        className="block text-center bg-emerald-600 text-white py-3 rounded-xl font-medium shadow hover:bg-emerald-700 transition"
      >
        ➕ Post Product
      </NavLink>
    </div>

  </aside>
);