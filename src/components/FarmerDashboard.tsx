import React from 'react';
import { Search, Plus, CloudSun, Droplets, Bug, ArrowUpRight, TrendingUp } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Professional Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kuzuzangpo!</h1>
          <p className="text-slate-500 font-medium mt-1">System status: <span className="text-emerald-600 font-bold">All sensors active</span></p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          List New Harvest
        </button>
      </div>

      {/* Modern Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><CloudSun size={28}/></div>
            <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Thimphu</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Outdoor Temp</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-4xl font-black text-slate-900">18°C</p>
            <span className="text-slate-400 text-sm font-bold">Stable</span>
          </div>
        </div>

        {/* Soil Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Droplets size={28}/></div>
            <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Optimal</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Soil Moisture</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-4xl font-black text-slate-900">64%</p>
            <span className="text-emerald-500 text-sm font-bold">Perfect</span>
          </div>
        </div>

        {/* Pest Risk Status */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Bug size={28}/></div>
            <span className="text-[10px] font-black text-orange-600 uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Caution</span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pest Risk</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-4xl font-black text-slate-900">Low</p>
            <span className="text-orange-400 text-sm font-bold">Monitor Field 3</span>
          </div>
        </div>
      </div>

      {/* Main Tools Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Search */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search market prices, equipment, or buyers..." 
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent focus:border-emerald-500 rounded-[2rem] outline-none shadow-sm transition-all font-medium text-slate-600" 
            />
          </div>
          
          {/* Activity Placeholder */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 border-dashed flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-slate-400 font-bold">Waiting for recent harvest data...</p>
              <p className="text-slate-300 text-sm">Your activity will appear here once you post an update.</p>
            </div>
          </div>
        </div>
        
        {/* Market Insights Box */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="relative z-10 space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold">Market Watch</h3>
               <ArrowUpRight className="text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </div>
             <p className="text-slate-400 text-sm leading-relaxed">
               Potato prices in **Phuentsholing** are up **12%** this morning. We suggest listing your harvest now to maximize profit.
             </p>
             <div className="pt-4 border-t border-slate-800">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                 <span className="text-slate-500">Demand Index</span>
                 <span className="text-emerald-400">High Demand</span>
               </div>
               <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
               </div>
             </div>
           </div>
           {/* Decorative background element */}
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;