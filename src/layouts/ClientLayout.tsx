import { Routes, Route, Navigate } from 'react-router-dom';
import { ShoppingBag, Search, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';
// Import your existing BuyProducts component
import BuyProducts from '../components/BuyProducts'; 

const ClientSidebar = () => {
  const handleSignOut = () => supabase.auth.signOut();
  return (
    <aside className="w-72 h-screen bg-white border-r flex flex-col shadow-sm">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-orange-500 p-2 rounded-xl text-white"><ShoppingBag size={24}/></div>
        <span className="text-xl font-black text-slate-800 uppercase">GNH Market</span>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 font-bold">
          <Search size={18} /> <span className="text-sm">Browse Products</span>
        </div>
        {/* Add more Buyer-specific links here later */}
      </nav>
      <div className="p-4 border-t">
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 rounded-xl font-semibold">
          <LogOut size={18} /> <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export const ClientLayout = () => {
  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto p-10">
        <Routes>
          {/* Default view for buyers is the shop */}
          <Route path="/" element={<BuyProducts />} /> 
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};