import { Search } from 'lucide-react';

export const SearchCard = () => {
  return (
    <section className="bg-[#f0f9f4] p-6 rounded-3xl border border-emerald-100 relative shadow-sm overflow-hidden">
      <h3 className="text-slate-700 font-bold mb-4 text-lg">Crop Suitability Search</h3>
      
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Search Dzongkhag (e.g., Paro)" 
          className="w-full p-4 pl-6 pr-12 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-emerald-500 text-slate-800"
        />
        <Search className="absolute right-4 top-4 text-slate-400" size={20} />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm mb-2">Local Climate Profile (Paro):</h4>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            Zone: Warm Temperate, 2200m Alt, Cool Winters, Moderate Rainfall, 18°C Avg (Summer).
          </p>
          <h5 className="font-bold text-emerald-800 text-xs uppercase mb-2">Traditional & Local Crops</h5>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
            <li>• Potato (98% Match)</li>
            <li>• Maize (92% Match)</li>
            <li>• Buckwheat (88% Match)</li>
            <li>• Apple (85% Match)</li>
          </ul>
        </div>
        
        <div className="bg-[#1e617d] text-white p-5 rounded-xl md:w-72">
          <h5 className="font-bold text-xs uppercase tracking-wider mb-3">High-Value Export Opportunities</h5>
          <ul className="space-y-3 text-xs">
            <li className="flex flex-col">
              <span className="font-bold text-sky-200">Quinoa (94% Match)</span>
              <span>Nu 350/kg (GMC Hub/SG)</span>
            </li>
            <li className="flex flex-col border-t border-sky-700/50 pt-2">
              <span className="font-bold text-sky-200">Walnuts (91% Match)</span>
              <span>Nu 550/kg (EU/Dubai)</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};