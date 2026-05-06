import { CheckCircle2, Zap } from 'lucide-react';

const feeds = [
  { time: '10:15 AM', msg: 'Field 3 - Soil moisture 65%', status: 'Validated by Zod' },
  { time: '09:42 AM', msg: 'Market Sync: Ginger prices up 12%', status: 'Live Sync' },
];

export const ActionFeed = () => {
  return (
    <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
      <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
        <Zap size={18} className="text-amber-500" /> Recent Activity
      </h3>
      <div className="space-y-4">
        {feeds.map((feed, i) => (
          <div key={i} className="flex flex-col gap-1 border-l-2 border-emerald-100 pl-4 py-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feed.time}</span>
            <p className="text-sm text-slate-700 font-medium">{feed.msg}</p>
            <div className="flex items-center gap-1">
               <CheckCircle2 size={12} className="text-emerald-500" />
               <span className="text-[10px] text-emerald-600 font-semibold">{feed.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};