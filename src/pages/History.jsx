import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  ChevronRight,
  History as HistoryIcon
} from 'lucide-react';

export default function History({ smeId, lang }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (smeId) fetchHistory();
  }, [smeId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ldvs/${smeId}/history`);
      const data = await res.json();
      setHistory(data.reverse()); // Latest first
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Date", "Profile", "Posting", "Engagement", "Responsiveness", "Platform", "Total LDVS"];
    const rows = history.map(h => [
      new Date(h.computed_at).toLocaleDateString(),
      h.profile_score,
      h.posting_score,
      h.engagement_score,
      h.responsiveness_score,
      h.platform_score,
      h.total_ldvs
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ldvs_history_${smeId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/10 border-t-neon-green rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-24 slam-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-green text-black rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.3)]">
              <HistoryIcon size={20} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
              {lang === 'en' ? 'Temporal Analysis' : 'Historia ya Utendaji'}
            </h2>
          </div>
          <h1 className="text-7xl lg:text-8xl font-display text-white uppercase leading-none">
            {lang === 'en' ? 'History Log' : 'Historia ya Utendaji'}
          </h1>
        </div>

        <button 
          onClick={exportCSV}
          disabled={history.length === 0}
          className="flex items-center gap-4 px-10 py-5 rounded-full bg-neon-green text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,0,0.2)] disabled:opacity-50"
        >
          <Download size={18} strokeWidth={3} />
          {lang === 'en' ? 'Export Data' : 'Hamisha CSV'}
        </button>
      </div>

      <div className="glass-panel rounded-[3rem] border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-12 py-10 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Timestamp</th>
                <th className="px-12 py-10 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Index Score</th>
                <th className="px-12 py-10 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Metric Breakdown</th>
                <th className="px-12 py-10 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Trend Vector</th>
                <th className="px-12 py-10 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((row, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-white/5 transition-all"
                >
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-neon-green group-hover:text-black transition-all">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-white uppercase tracking-widest">
                          {new Date(row.computed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">
                          {new Date(row.computed_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display text-white group-hover:text-neon-green transition-colors">
                        {Math.round(row.total_ldvs)}
                      </span>
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">/ 100</span>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex gap-2">
                      {[
                        { label: 'P', val: row.profile_score },
                        { label: 'C', val: row.posting_score },
                        { label: 'E', val: row.engagement_score },
                        { label: 'R', val: row.responsiveness_score },
                        { label: 'S', val: row.platform_score }
                      ].map(item => (
                        <div key={item.label} className="group/item relative">
                          <div className={`w-2 h-8 rounded-full transition-all ${item.val >= 70 ? 'bg-neon-green shadow-[0_0_10px_rgba(0,255,0,0.5)]' : item.val >= 40 ? 'bg-white/20' : 'bg-white/5'}`} />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-cyber-black border border-white/10 text-white text-[10px] font-mono font-bold rounded-lg opacity-0 group-hover/item:opacity-100 transition-all whitespace-nowrap z-50">
                            {item.label}: {Math.round(item.val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-3">
                      {idx < history.length - 1 ? (
                        row.total_ldvs > history[idx + 1].total_ldvs ? (
                          <div className="flex items-center gap-2 text-neon-green">
                            <ArrowUpRight size={18} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ascending</span>
                          </div>
                        ) : row.total_ldvs < history[idx + 1].total_ldvs ? (
                          <div className="flex items-center gap-2 text-white/40">
                            <ArrowDownRight size={18} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Descending</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-white/20">
                            <Minus size={18} strokeWidth={3} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stable</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2 text-white/10">
                          <Minus size={18} strokeWidth={3} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Baseline</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <button className="p-3 text-white/10 hover:text-neon-green transition-all">
                      <ChevronRight size={24} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {history.length === 0 && (
          <div className="p-32 text-center">
            <HistoryIcon className="text-white/5 mx-auto mb-8" size={64} />
            <h3 className="text-2xl font-display text-white uppercase tracking-widest mb-4">No Data Logged</h3>
            <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Temporal tracking initialized. Data will populate after next sync.</p>
          </div>
        )}
      </div>
    </div>
  );
}
