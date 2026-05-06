import React, { useState, ChangeEvent } from 'react';
import { supabase } from '../supabaseClient';
import { PackagePlus, Loader2, ImagePlus, X } from 'lucide-react';

const SellProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: 'Seeds',
    stock: '',
    description: ''
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imagePath = '';

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        imagePath = data.publicUrl;
      }

      // Fixed Supabase syntax for v2
      const { error: dbError } = await supabase
        .from('products')
        .insert([
          { 
            name: formData.name,
            price: parseFloat(formData.price),
            unit: formData.unit,
            category: formData.category,
            stock: parseInt(formData.stock),
            description: formData.description,
            image_url: imagePath 
          }
        ]);

      if (dbError) throw dbError;

      alert("Product posted successfully!");
      setFormData({ name: '', price: '', unit: 'kg', category: 'Seeds', stock: '', description: '' });
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-slate-100 shadow-sm mt-10">
      <header className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
          <PackagePlus size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Post a New Product</h2>
          <p className="text-slate-500 text-sm">List your items with a photo</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area - FIXED RATIO */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Product Image</label>
          <div className="relative group">
            {previewUrl ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover object-center" 
                />
                <button 
                  type="button"
                  onClick={() => {setPreviewUrl(null); setImageFile(null);}}
                  className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImagePlus className="text-slate-400 mb-2 group-hover:text-emerald-500" size={32} />
                  <p className="text-sm text-slate-500">Click to upload product photo</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Name</label>
            <input 
              required
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Red Rice"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Price (Nu.)</label>
            <input 
              type="number"
              required
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 500"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
            <input 
              type="number"
              required
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="10"
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Unit (kg/pkt)</label>
            <select 
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={formData.unit}
              onChange={e => setFormData({...formData, unit: e.target.value})}
            >
              <option value="kg">per kg</option>
              <option value="pkt">per packet</option>
              <option value="ton">per ton</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "List Product Now"}
        </button>
      </form>
    </div>
  );
};

export default SellProduct;