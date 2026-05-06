import { useState } from 'react';
import { useCropAdvice } from '../hooks/useAgriData';
import { Thermometer, Calendar, Banknote, ChevronDown, ChevronUp } from 'lucide-react';

// Added locationName and currentTemp as props to drive the data fetch
export const CropAdvisor = ({ currentTemp = 28, locationName = 'Gelephu' }) => {
  
  // FIX: Pass BOTH arguments to the hook so it refreshes when the location changes
  const { data: recommendations, isLoading } = useCropAdvice(locationName, currentTemp);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="animate-spin mb-4 flex justify-center">
          <Thermometer className="text-emerald-500" size={32} />
        </div>
        <p className="text-slate-500 font-medium">Analyzing climate matches for {locationName}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info - Now dynamically reflects the searched location */}
      <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Climate Recommendations</h2>
          <p className="text-xs text-emerald-700">
            Suitable for current <span className="font-bold">{currentTemp}°C</span> in <span className="font-bold">{locationName}</span>
          </p>
        </div>
        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          {recommendations?.length || 0} Crops Found
        </span>
      </div>

      {recommendations && recommendations.length > 0 ? (
        recommendations.map((crop: any) => (
          <div 
            key={crop.id} 
            className={`bg-white rounded-3xl border-2 transition-all duration-300 ${
              expandedId === crop.id ? 'border-emerald-500 shadow-lg' : 'border-slate-100 shadow-sm'
            }`}
          >
            {/* Main Card Content */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {crop.category || 'Product'}
                    </span>
                    <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-tight">
                      • {crop.h_max ? `Humidity Max: ${crop.h_max}%` : 'Ideal Climate'}
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800">{crop.name}</h4>
                </div>
                
                <button 
                  onClick={() => setExpandedId(expandedId === crop.id ? null : crop.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    expandedId === crop.id 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                >
                  {expandedId === crop.id ? <><ChevronUp size={16} /> Close</> : <><ChevronDown size={16} /> View Guide</>}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                  <Banknote className="text-emerald-500" size={18} />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Price</p>
                    <p className="text-sm font-bold text-slate-700">Nu. {crop.average_price_per_kg || crop.price || 'Market'}/kg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                  <Calendar className="text-sky-500" size={18} />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Growth</p>
                    <p className="text-sm font-bold text-slate-700">{crop.growth_duration_days || crop.growth_days || '90+'} Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Guide Section */}
            {expandedId === crop.id && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="flex items-center gap-2 font-bold text-sm text-slate-800 mb-4">
                      <span className="w-1.5 h-4 bg-emerald-500 rounded-full" /> Cultivation Steps
                    </h5>
                    <ul className="space-y-4">
                      {crop.steps ? crop.steps.map((step: string, i: number) => (
                        <li key={i} className="flex gap-4 text-sm text-slate-600 leading-relaxed">
                          <span className="bg-white border border-slate-200 text-slate-400 w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold flex-shrink-0 shadow-sm">{i + 1}</span>
                          {step}
                        </li>
                      )) : <p className="text-xs text-slate-400">Steps coming soon...</p>}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className="font-bold text-sm text-slate-800 mb-3">Required Tools</h5>
                      <div className="flex flex-wrap gap-2">
                        {crop.tools?.map((tool: string) => (
                          <span key={tool} className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-emerald-200">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                      <h5 className="font-bold text-xs text-slate-500 uppercase mb-2">Expert Advice</h5>
                      <p className="text-sm text-slate-700 italic">
                        {crop.recommendation_reason || `Based on current conditions in ${locationName}, this crop is highly likely to yield a strong harvest.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No crops found matching {currentTemp}°C in {locationName}.</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for a different location or check your SQL temperature ranges.</p>
        </div>
      )}
    </div>
  );
};