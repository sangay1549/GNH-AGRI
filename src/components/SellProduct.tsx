import React, { useState, useEffect, type ChangeEvent } from 'react';
import { supabase } from '../supabaseClient';
import { PackagePlus, Loader2, ImagePlus, X, Bell } from 'lucide-react'; // Added Bell here


const SellProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [myItems, setMyItems] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'kg',
    category: 'Seeds',
    stock: '',
    description: ''
  });

  const fetchMyItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setMyItems(data);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

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

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in");

      let imagePath = '';
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        imagePath = data.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('products' as any)
        .insert([
          { 
            name: formData.name,
            price: parseFloat(formData.price),
            unit: formData.unit,
            category: formData.category,
            stock: parseInt(formData.stock),
            description: formData.description,
            image_url: imagePath,
            seller_id: user.id, 
            status: 'pending'
          }
        ] as any);

      if (dbError) throw dbError;

      alert("Product posted successfully!");
      setFormData({ name: '', price: '', unit: 'kg', category: 'Seeds', stock: '', description: '' });
      setPreviewUrl(null);
      setImageFile(null);
      fetchMyItems();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-sm mt-10 border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <header className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
            <PackagePlus size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Post a New Product</h2>
        </header>

        {/* Image Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Product Image</label>
          <div 
            onClick={() => document.getElementById('imageInput')?.click()}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden"
          >
            {previewUrl ? (
              <div className="relative w-full h-40">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setImageFile(null); }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <ImagePlus className="text-slate-400 mb-2" size={32} />
                <p className="text-xs text-slate-400 font-medium">Click to upload product photo</p>
              </>
            )}
            <input id="imageInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Product Name</label>
          <input 
            required 
            placeholder="e.g., Organic Potatoes"
            className="w-full p-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Price, Unit, and Stock Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Price (Nu.)</label>
            <input 
              required type="number"
              className="w-full p-3 border rounded-xl bg-slate-50"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Unit</label>
            <select 
              className="w-full p-3 border rounded-xl bg-slate-50"
              value={formData.unit}
              onChange={e => setFormData({...formData, unit: e.target.value})}
            >
              <option value="kg">per kg</option>
              <option value="bundle">per bundle</option>
              <option value="piece">per piece</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Stock</label>
            <input 
              required type="number"
              className="w-full p-3 border rounded-xl bg-slate-50"
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: e.target.value})}
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Category</label>
          <select 
            className="w-full p-3 border rounded-xl bg-slate-50"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Seeds">Seeds</option>
            <option value="Grains">Grains</option>
          </select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600">Description</label>
          <textarea 
            placeholder="Tell buyers about your product..."
            className="w-full p-3 border rounded-xl bg-slate-50 h-24 outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "List Product Now"}
        </button>
      </form>

      {/* Your Listings Section */}
<div className="mt-12 pt-8 border-t border-slate-100">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-xl font-bold text-slate-800">Sales Overview</h3>
    <button className="relative p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
      <Bell size={20} />
      {/* Red Dot Notification Badge */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
    </button>
  </div>
  
  <div className="grid gap-4">
    {myItems.length > 0 ? (
  myItems.map((item: any) => (
    <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-3">
        {item.image_url && (
          <img src={item.image_url} alt="" className="w-14 h-14 object-cover rounded-lg bg-slate-50" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-700">{item.name}</h4>
            {/* --- STATUS BADGE INSERTED HERE --- */}
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
              item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
              item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
              'bg-red-100 text-red-700'
            }`}>
              {item.status === 'approved' ? 'Live' : item.status || 'Pending'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Nu. {item.price} per {item.unit}</p>
        </div>
        <div className="text-right">
          <span className="block text-lg font-bold text-emerald-600">{item.sold_count || 0}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sold</span>
        </div>
      </div>
      
      {/* Progress Bar for Stock */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>Stock remaining</span>
          <span>{item.stock} left</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-500" 
            style={{ width: `${(item.stock / (item.stock + (item.sold_count || 0))) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  ))
) : (
  <p className="text-center text-slate-400 py-4 text-sm italic">No products listed yet.</p>
)}
  </div>
</div>
</div>
  );
};

export default SellProduct;