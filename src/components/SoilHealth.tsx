import { useSoilMetrics } from '../hooks/useAgriData';
import React from 'react';


export const SoilHealth = () => {
  // Use the current dzongkhag
  const { data, isLoading } = useSoilMetrics('Gelephu');

  if (isLoading) return <div>Analyzing Gelephu Soil...</div>;

  const metrics = data || { ph: 0, moisture: 0, nitrogen: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      <MetricCard 
        label="Soil pH" 
        value={metrics.ph} 
        status={metrics.ph >= 6 && metrics.ph <= 7 ? "Optimal" : "Check Soil"} 
      />
      <MetricCard 
        label="Moisture" 
        value={`${metrics.moisture}%`} 
        status={metrics.moisture < 30 ? "Dry" : "Good"} 
      />
      <MetricCard 
        label="Nitrogen" 
        value={metrics.nitrogen} 
        status="Nutrient Level" 
      />
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: number | string;
  status: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, status }) => {
  // Logic to turn text red if attention is needed
  const isWarning = status === "Check Soil" || status === "Dry";
  
  return (
    <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-500">{label}</h4>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <span className={`text-xs font-medium ${isWarning ? 'text-red-500' : 'text-emerald-600'}`}>
        {status}
      </span>
    </div>
  );
};