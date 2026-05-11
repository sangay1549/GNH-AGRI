import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Truck, Loader2, ImagePlus, X,  } from 'lucide-react';

const RentEquipments: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [myListings, setMyListings] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    price_per_day: '',
    equipment_type: 'Tractor',
    location: '',
    description: ''
  });

  const fetchMyListings = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data } = await supabase
      .from('equipment_rentals')
      .select('*')
      .eq('owner_id', user.id) // This ensures you only see YOUR stuff here
      .order('created_at', { ascending: false });
    
    if (data) setMyListings(data);
  }
};

useEffect(() => {
  fetchMyListings();
}, []);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to post equipment");

      // 2. Handle Image Upload
      let imagePath = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `rentals/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        imagePath = data.publicUrl;
      }

      // 3. Insert into Database
      const { error } = await supabase
  .from('equipment_rentals')
  .insert([{ // Add the array brackets here if they are missing
    owner_id: user.id,
    title: formData.title,
    price_per_day: parseFloat(formData.price_per_day),
    equipment_type: formData.equipment_type,
    location: formData.location,
    description: formData.description,
    image_url: imagePath,
  }] as any); // The "as any" bypasses the 'never' error
      if (error) throw error;
      
      alert("Equipment listed successfully!");
      // Reset form
      setFormData({ title: '', price_per_day: '', equipment_type: 'Tractor', location: '', description: '' });
      setPreviewUrl(null);
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm mt-10">
      <header className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
          <Truck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Rent Your Equipment</h2>
          <p className="text-slate-500 text-sm font-medium">Share your machinery with the community</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div className="group relative h-48 w-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center transition-all hover:border-blue-400 overflow-hidden bg-slate-50">
          {previewUrl ? (
            <>
              <img src={previewUrl} className="h-full w-full object-cover" alt="Preview" />
              <button 
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-red-500 shadow-lg"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <label className="cursor-pointer flex flex-col items-center">
              <ImagePlus className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
              <span className="text-sm font-bold text-slate-500">Upload Machinery Photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            value={formData.title}
            placeholder="Equipment Title (e.g. Kubota Tractor)" 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
          />
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Nu.</span>
            <input 
              value={formData.price_per_day}
              placeholder="Price per Day" 
              type="number"
              className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium"
              onChange={e => setFormData({...formData, price_per_day: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select 
            value={formData.equipment_type}
            className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={e => setFormData({...formData, equipment_type: e.target.value})}
          >
            <option value="Tractor">Tractor</option>
            <option value="Power Tiller">Power Tiller</option>
            <option value="Harvestor">Harvester</option>
            <option value="Irrigation Pump">Irrigation Pump</option>
          </select>
          <input 
            value={formData.location}
            placeholder="Your Location (e.g. Paro)" 
            className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium"
            onChange={e => setFormData({...formData, location: e.target.value})}
            required
          />
        </div>

        <textarea 
          value={formData.description}
          placeholder="Brief description of the machinery's condition..."
          className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 font-medium min-h-[120px]"
          onChange={e => setFormData({...formData, description: e.target.value})}
        />

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Post Rental Machinery"}
        </button>
      </form>
      {/* --- List of items I have posted --- */}
<div className="mt-12">
  <h3 className="text-xl font-bold text-slate-800 mb-4">My Machinery for Rent</h3>
  <div className="space-y-4">
    {myListings.map((item: any) => (
      <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <img src={item.image_url} className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <p className="font-bold text-slate-800">{item.title}</p>
            <p className="text-xs text-slate-500">Nu. {item.price_per_day}/day</p>
          </div>
        </div>
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
          Live
        </span>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default RentEquipments;