import React from 'react';

interface Crop {
  name: string;
  status: string;
  modern_window: string;
  progress: number;
  market_demand_level:string;
}

interface CropSchedulerProps {
  elevation?: number;
  crops?: Crop[];
}

const CropScheduler: React.FC<CropSchedulerProps> = ({ elevation, crops }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📅</span> Planting Schedule
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            {elevation ? `${Math.round(elevation)}m Altitude` : 'Updating...'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {crops && crops.length > 0 ? (
          crops.map((crop, index) => (
            <div key={index} className="group border-b border-slate-50 last:border-0 pb-5 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">{crop.name}</h4>
                  {/* Market Demand Badge */}
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter ${
                    crop.market_demand_level?.toLowerCase() === 'high' 
                      ? 'bg-rose-100 text-rose-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {crop.market_demand_level} Demand
                  </span>
                </div>
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tight ${
                  crop.status?.toLowerCase().includes('optimal') 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  {crop.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 px-0.5">
                  <span>Season Progress</span>
                  <span>{crop.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${
                      crop.status?.toLowerCase().includes('optimal') ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} 
                    style={{ width: `${crop.progress}%` }} 
                  />
                </div>
              </div>

              {/* Modern Window Info */}
              <div className="flex justify-between mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Modern Window</span>
                <span className="text-[10px] text-slate-700 font-black">{crop.modern_window}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-sm text-slate-400 italic">No specific crops for this temperature.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CropScheduler;