import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Truck, MapPin, Info } from 'lucide-react';

const BrowseEquipment: React.FC = () => {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchRentals = async () => {
    // We remove the .eq('status', 'available') just to test if anything shows up
    const { data, error } = await supabase
      .from('equipment_rentals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Fetch Error:", error.message);
    }
    
    if (data) {
      console.log("Found these rentals:", data); // Check your browser console!
      setRentals(data);
    }
    setLoading(false);
  };
  fetchRentals();
}, []);

  if (loading) return <div className="p-10 text-center text-slate-400 font-bold italic">Checking the garage...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Available Machinery</h2>
          <p className="text-slate-500 font-medium">Rent tools from your community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map((item) => (
          <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="h-48 bg-slate-100">
              <img 
                src={item.image_url || 'https://via.placeholder.com/400x300?text=Machinery'} 
                className="w-full h-full object-cover" 
                alt={item.title} 
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">
                  {item.equipment_type}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                <MapPin size={16} className="text-blue-500" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Per Day</span>
                  <span className="text-2xl font-black text-slate-900">Nu. {item.price_per_day}</span>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rentals.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Truck size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-bold italic">No machinery listed in your area yet.</p>
        </div>
      )}
    </div>
  );
};

export default BrowseEquipment;