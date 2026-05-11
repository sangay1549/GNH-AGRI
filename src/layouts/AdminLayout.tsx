import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Clock, Package, Check, X, LogOut, Loader2 } from 'lucide-react';

// Define the interface so TypeScript doesn't complain
export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  image_url?: string;
  description: string;
  status: string; // Add this line!
  created_at?: string;
}

const AdminLayout = () => {
  const [pendingItems, setPendingItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'pending');

      if (error) throw error;
      setPendingItems(data || []);
    } catch (err: any) {
      console.error("Error fetching:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

 const handleAction = async (id: number, newStatus: 'available' | 'rejected') => {
  try {
    // Force the client to treat this as an 'any' call to bypass the strict check
    const { error } = await (supabase.from('products') as any)
      .update({ status: newStatus })
      .eq('id', id);

    if (error) throw error;
    setPendingItems(prev => prev.filter(item => item.id !== id));
  } catch (err: any) {
    alert("Action failed: " + err.message);
  }
};
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col flex-shrink-0">
        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
            <h2 className="text-xl font-bold text-emerald-400 tracking-tight">ADMIN PANEL</h2>
          </div>
          <nav className="space-y-4 text-sm font-semibold">
            <div className="text-emerald-400 bg-emerald-400/10 p-2 rounded-lg cursor-pointer flex items-center gap-2">
              <Clock size={16} /> Product Approvals
            </div>
            <div className="text-slate-500 hover:text-slate-300 p-2 cursor-pointer transition-colors">User Management</div>
            <div className="text-slate-500 hover:text-slate-300 p-2 cursor-pointer transition-colors">System Logs</div>
            <div className="text-slate-500 hover:text-slate-300 p-2 cursor-pointer transition-colors text-market-price">Market Price Control</div>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-3 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-wider group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <p className="text-slate-400 text-sm mt-1">GNH Agri-Tech Management Dashboard</p>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Total Farmers</p>
            <p className="text-4xl font-black mt-2">1,240</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Pending Review</p>
            <p className="text-4xl font-black mt-2 text-amber-400">{pendingItems.length}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">System Health</p>
            <p className="text-4xl font-black mt-2 text-emerald-400">100%</p>
          </div>
        </div>

        <section className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="text-amber-400" size={20} />
              Pending Approvals
            </h2>
            <button onClick={fetchPendingProducts} className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
               {loading && <Loader2 size={12} className="animate-spin" />} Refresh List
            </button>
          </div>

          <div className="p-0">
            {pendingItems.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-700/50">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price/Unit</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                  {pendingItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center"><Package size={16}/></div>
                          )}
                          <span className="font-bold text-slate-200">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-medium">{item.category}</td>
                      <td className="px-6 py-4 text-slate-200 font-bold">Nu. {item.price}/{item.unit}</td>
                      <td className="px-6 py-4 text-slate-400">{item.stock} {item.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleAction(item.id, 'available')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><Check size={18} /></button>
                          <button onClick={() => handleAction(item.id, 'rejected')} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-500">
                <Package className="mx-auto mb-4 opacity-20" size={48} />
                <p className="font-medium">No pending products to review.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;