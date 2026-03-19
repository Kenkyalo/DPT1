import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-cyber-black border border-neon-green/30 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-mono font-bold text-neon-green tracking-tighter">
            {payload[0].value}
          </span>
          <span className="text-[10px] uppercase font-black text-white/20 tracking-widest">Score</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ smeId, lang }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (smeId) fetchHistory();
  }, [smeId]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/ldvs/${smeId}/history`);
      const history = await res.json();
      const formatted = history.map(h => ({
        date: new Date(h.computed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: Math.round(h.total_ldvs)
      }));
      setData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 9, fontWeight: 800, fill: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }} 
            dy={15}
          />
          <YAxis 
            hide
            domain={[0, 100]} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0, 255, 0, 0.2)', strokeWidth: 2 }} />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#00FF00" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorScore)"
            animationDuration={2500}
            dot={{ r: 4, fill: '#00FF00', strokeWidth: 2, stroke: '#000' }}
            activeDot={{ r: 6, fill: '#00FF00', strokeWidth: 0, filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.8))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
