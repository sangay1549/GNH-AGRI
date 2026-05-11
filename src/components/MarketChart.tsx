import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this path is correct
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const MarketChart: React.FC = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchCropsOnly = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('name, price, category')
      // Only include actual farm produce
      .in('category', ['Seeds', 'Vegetables', 'Grains', 'Fruits', 'Cash Crops']) 
      .order('price', { ascending: false });
      
    if (!error && data) {
      setChartData(data);
    }
    setLoading(false);
  };

  fetchCropsOnly();
}, []);

  if (loading) return <div className="h-full flex items-center justify-center text-slate-400">Fetching Data...</div>;

  return (
    <div className="h-[400px] w-full bg-white p-6 rounded-[2rem]">
      <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Live Market Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
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
            formatter={(value: any) => [`Nu. ${value}`, 'Current Price']}
          />          
          <Bar dataKey="price" radius={[6, 6, 0, 0]} barSize={35}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#059669' : '#10b981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};