import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, Loader2, AlertCircle } from 'lucide-react';

// Exactly what a product looks like
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  description: string;
  seller_id: string; // Changed to match your database column name
  status: string;
}

const BuyProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available'); // ONLY show approved items

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-600 mb-2" />
        <p className="text-slate-500 font-medium">Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Available Produce</h2>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
          {products.length} Items Found
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex gap-2 items-center text-sm font-bold">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center p-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
          <ShoppingBag className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-medium">No items for sale yet. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="aspect-square bg-slate-50 rounded-2xl mb-4 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">No Image</div>
                )}
              </div>
              <div className="px-2">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{item.category}</span>
                <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-black text-slate-900">Nu. {item.price}</p>
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyProducts;