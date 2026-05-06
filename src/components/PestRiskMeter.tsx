import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface PestRiskProps {
  temp: number;
  humidity: number;
  locationName?: string; // ADDED: Dynamic location prop to fix the static label
}

const PestRiskMeter: React.FC<PestRiskProps> = ({ temp, humidity, locationName = "Station Data" }) => {
  // Logic: Fungal and pest risks increase with high humidity and moderate heat
  const calculateRisk = () => {
    let score = 20; // Base baseline risk
    if (humidity > 75) score += 30;
    if (humidity > 85) score += 25;
    if (temp > 24 && temp < 30) score += 25;
    return Math.min(score, 100);
  };

  // This score recalculates automatically whenever the temp or humidity props change
  const riskScore = calculateRisk();

  const getRiskLevel = (score: number) => {
    if (score < 45) return { 
      label: 'Low', 
      color: 'text-emerald-500', 
      stroke: '#10b981', 
      bg: 'bg-emerald-50',
      desc: 'Safe conditions.' 
    };
    if (score < 75) return { 
      label: 'Moderate', 
      color: 'text-amber-500', 
      stroke: '#f59e0b', 
      bg: 'bg-amber-50',
      desc: 'Monitor for aphids.' 
    };
    return { 
      label: 'High', 
      color: 'text-rose-500', 
      stroke: '#f43f5e', 
      bg: 'bg-rose-50',
      desc: 'Blight risk detected!' 
    };
  };

  const { label, color, stroke, bg, desc } = getRiskLevel(riskScore);
  
  // SVG Path constants for the semi-circle gauge
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-slate-700">Pest & Disease Risk</h3>
          {/* UPDATED: Uses locationName prop instead of hardcoded 'Gelephu' */}
          <p className="text-xs text-slate-500">{locationName}, Bhutan</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${bg} ${color}`}>
          {label}
        </span>
      </div>

      <div className="relative flex justify-center py-4">
        <svg width="180" height="100" viewBox="0 0 180 100">
          {/* Background Track */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Risk Indicator Track */}
          <path
            d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke={stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-4 text-center">
          <span className="text-2xl font-bold text-slate-800">{riskScore}%</span>
        </div>
      </div>

      <div className={`flex items-center gap-3 p-3 rounded-xl ${bg}`}>
        {riskScore > 70 ? (
          <AlertTriangle size={18} className={color} />
        ) : (
          <ShieldCheck size={18} className={color} />
        )}
        <div className="flex flex-col">
          <p className={`text-xs font-bold ${color}`}>{desc}</p>
          {/* UPDATED: Displays dynamic values from props */}
          <p className="text-[10px] text-slate-500">{temp}°C | {humidity}% Humidity</p>
        </div>
      </div>
    </div>
  );
};

export default PestRiskMeter;