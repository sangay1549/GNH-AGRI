import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { MapPin, Tag, Loader2 } from 'lucide-react';

const BrowseEquipment: React.FC = () => {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      const { data, error } = await supabase
        .from('equipment_rentals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipments(data || []);
    } catch (err: any) {
      console.error("Error fetching:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Available for Rent</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {equipments.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="h-48 bg-slate-100">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
              )}
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-xl text-slate-800">{item.title}</h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                  {item.equipment_type}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                <MapPin size={14} />
                {item.location}
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <span className="text-2xl font-black text-emerald-600">Nu.{item.price_per_day}</span>
                  <span className="text-slate-500 text-sm">/day</span>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800">
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseEquipment;
