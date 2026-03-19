import React, { useEffect, useState } from 'react';
import { MapPin, User, RefreshCw, LayoutDashboard, TrendingUp, BarChart3 } from 'lucide-react';
import LDVSGauge from '../components/LDVSGauge';
import ScoreBreakdown from '../components/ScoreBreakdown';
import PlatformCard from '../components/PlatformCard';
import TrendChart from '../components/TrendChart';
import RecommendationPanel from '../components/RecommendationPanel';

export default function Home({ smeId, lang }) {
  const [sme, setSme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (smeId) fetchSmeData();
  }, [smeId]);

  const fetchSmeData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/smes/${smeId}`);
      const data = await res.json();
      setSme(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-white/10 border-t-neon-green rounded-full animate-spin" />
    </div>
  );

  if (!sme) return (
    <div className="text-center py-32 glass-panel rounded-[3rem] border-white/5 slam-in">
      <LayoutDashboard className="text-white/10 mx-auto mb-8" size={80} />
      <h2 className="text-4xl font-display text-white mb-4 uppercase">No Business Selected</h2>
      <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Select a business from the sidebar to initialize tracking.</p>
    </div>
  );

  const score = sme.latestScore?.total_ldvs || 0;

  return (
    <div className="space-y-24 slam-in">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-neon-green text-black text-[10px] font-black uppercase tracking-widest">Live Status</span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{sme.category}</span>
          </div>
          
          <h1 className="text-[12vw] lg:text-[10vw] leading-[0.8] font-display uppercase break-words">
            {sme.name}
          </h1>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-neon-green" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">{sme.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-neon-green" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">{sme.owner_name}</span>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 bg-neon-green/20 blur-[100px] rounded-full" />
          <LDVSGauge score={score} />
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel rounded-[2.5rem] p-10 border-white/5">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Visibility Breakdown</h3>
            <BarChart3 size={16} className="text-neon-green" />
          </div>
          <ScoreBreakdown scoreData={sme.latestScore} />
        </div>

        <div className="glass-panel rounded-[2.5rem] p-10 border-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Performance Trend</h3>
            <TrendingUp size={16} className="text-neon-green" />
          </div>
          <div className="flex-1 min-h-[250px]">
            <TrendChart smeId={smeId} />
          </div>
        </div>
      </section>

      {/* Platforms & Recommendations */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-8">Connected Channels</h3>
          <div className="grid grid-cols-1 gap-4">
            {sme.platforms?.map(p => (
              <PlatformCard key={p.id} name={p.platform_name} data={p} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass-panel rounded-[3rem] p-12 border-neon-green/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[80px] rounded-full -mr-32 -mt-32" />
            <RecommendationPanel smeId={smeId} lang={lang} scoreData={sme.latestScore} />
          </div>
        </div>
      </section>
    </div>
  );
}
