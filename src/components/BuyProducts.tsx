import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingCart, Leaf, Tag, Truck } from 'lucide-react';

// 1. Define the combined interface
interface MarketplaceItem {
  id: string;
  name?: string;          // From products table
  title?: string;         // From rentals table
  price?: number;         // From products table
  price_per_day?: number; // From rentals table
  image_url: string;
  description: string;
  category?: string;
  equipment_type?: string;
  unit?: string;
  stock?: number;
  listingType: 'sale' | 'rent'; 
}

const BuyProducts: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      // 2. Fetch both tables in parallel
      const [productsRes, rentalsRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('equipment_rentals').select('*')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (rentalsRes.error) throw rentalsRes.error;

      // 3. Combine the data and add listingType tags
      const combinedItems: MarketplaceItem[] = [
        ...(productsRes.data || []).map(p => ({ ...p, listingType: 'sale' as const })),
        ...(rentalsRes.data || []).map(r => ({ ...r, listingType: 'rent' as const }))
      ];

      setItems(combinedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-emerald-600 font-medium">Loading marketplace...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">Error: {error}</div>;

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Agri-Marketplace</h1>
          <p className="text-slate-500 mt-2">Browse for seeds, tools, and machinery in one place.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const isRent = item.listingType === 'rent';
            const displayName = isRent ? item.title : item.name;
            const displayPrice = isRent ? item.price_per_day : item.price;
            const displayBadge = isRent ? item.equipment_type : item.category;

            return (
              <div 
                key={`${item.listingType}-${item.id}`} 
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                {/* Image Section */}
                <div className="h-48 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                  {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={displayName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-300">
                      {isRent ? <Truck size={48} /> : <Leaf size={48} />}
                      <span className="text-xs mt-2 font-medium">No Image</span>
                    </div>
                  )}
                  
                  {/* Category & Status Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm text-white ${
                      isRent ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}>
                      {isRent ? 'Rent' : 'Buy'}
                    </span>
                    <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                      {displayBadge}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{displayName}</h2>
                    {!isRent && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        Stock: {item.stock}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div>
                      <span className="text-2xl font-black text-slate-900">Nu. {displayPrice}</span>
                      <span className="text-slate-400 text-sm ml-1">
                        {isRent ? '/day' : `/${item.unit}`}
                      </span>
                    </div>
                    
                    <button className={`p-3 rounded-2xl shadow-lg transition-all active:scale-95 text-white ${
                      isRent ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                    }`}>
                      {isRent ? <Truck size={20} /> : <ShoppingCart size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BuyProducts;