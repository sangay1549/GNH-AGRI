import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useGlobalCommodities } from '../hooks/useAgriData';

interface MarketChartProps {
  location: string;
}

export const MarketChart: React.FC<MarketChartProps> = ({ location }) => {
  const { data, isLoading, error } = useGlobalCommodities();

  if (isLoading) return <div className="h-full flex items-center justify-center text-slate-400 font-medium">Loading Market Data...</div>;
  if (error) return <div className="h-full flex items-center justify-center text-red-400 font-medium">Error fetching Supabase data</div>;

  // FIX: Ensure we use the correct variable name and handle potential undefined data
  // Logic: Filter by 'region' to match the search, or show all if no match found
  const chartData = data?.filter((item: any) => item.region === location) || data || [];
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            interval={0} // Ensures all crop names are visible
          /> 
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(value) => `Nu.${value}`} 
          />
          
          <Tooltip 
  cursor={{ fill: '#f8fafc' }}
  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
  // Fix: Use 'any' or 'ValueType' to satisfy the internal Recharts types
  formatter={(value: any) => [`Nu. ${value}`, 'Current Price']}
/>          

          <Bar 
            dataKey="price" 
            radius={[6, 6, 0, 0]} // Slightly smoother corners
            barSize={35}
          >
            {chartData.map((_entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index % 2 === 0 ? '#059669' : '#10b981'} // Alternating emerald greens
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};