import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Truck, Loader2, ImagePlus, X } from 'lucide-react';

const RentEquipments: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    price_per_day: '',
    equipment_type: 'Tractor',
    location: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagePath = '';
      if (imageFile) {
        const filePath = `rentals/${Math.random()}.${imageFile.name.split('.').pop()}`;
        await supabase.storage.from('product-images').upload(filePath, imageFile);
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        imagePath = data.publicUrl;
      }

      const { error } = await supabase.from('equipment_rentals').insert([{
        ...formData,
        price_per_day: parseFloat(formData.price_per_day),
        image_url: imagePath
      }]);

      if (error) throw error;
      alert("Equipment listed for rent!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-slate-100 shadow-sm mt-10">
      <header className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-2xl text-blue-700">
          <Truck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rent Your Equipment</h2>
          <p className="text-slate-500 text-sm">Help others by sharing your machinery</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reuse the Image Upload logic from SellProduct here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            placeholder="Equipment Title" 
            className="w-full p-3 rounded-xl border border-slate-200"
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
          <input 
            placeholder="Price per Day" 
            type="number"
            className="w-full p-3 rounded-xl border border-slate-200"
            onChange={e => setFormData({...formData, price_per_day: e.target.value})}
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Post Rental Machinery"}
        </button>
      </form>
    </div>
  );
};

export default RentEquipments;