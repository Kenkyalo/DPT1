import React from 'react';
import { Facebook, Instagram, MessageCircle, Globe, MapPin, CheckCircle2, XCircle, Plus } from 'lucide-react';

const icons = {
  'Facebook': Facebook,
  'Instagram': Instagram,
  'WhatsApp Business': MessageCircle,
  'Google My Business': MapPin,
  'Website': Globe,
};

export default function PlatformCard({ name, data, lang }) {
  const isActive = data?.is_active;
  const Icon = icons[name] || Globe;

  return (
    <div className={`glass-panel rounded-3xl p-6 border transition-all duration-500 group relative overflow-hidden ${
      isActive 
        ? 'border-white/10 hover:border-neon-green/50' 
        : 'border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
    }`}>
      {isActive && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-[40px] rounded-full -mr-16 -mt-16 group-hover:bg-neon-green/10 transition-colors" />
      )}
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className={`p-4 rounded-2xl transition-all duration-500 ${
          isActive ? 'bg-neon-green text-black scale-110 shadow-[0_0_20px_rgba(0,255,0,0.3)]' : 'bg-white/5 text-white/20'
        }`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        
        {isActive ? (
          <div className="flex items-center gap-2 text-[10px] font-black text-neon-green uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-ping" />
            {lang === 'en' ? 'Online' : 'Inatumika'}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            <XCircle size={12} strokeWidth={2.5} />
            {lang === 'en' ? 'Offline' : 'Haipo'}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <h4 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-1 group-hover:text-neon-green transition-colors">
          {name}
        </h4>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
          {isActive ? 'Data Stream Active' : 'Connection Required'}
        </p>
      </div>
      
      {!isActive && (
        <button className="mt-8 w-full py-3 rounded-xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2">
          <Plus size={14} />
          {lang === 'en' ? 'Initialize' : 'Unganisha'}
        </button>
      )}

      {isActive && (
        <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-neon-green/20 w-2/3 group-hover:w-full transition-all duration-1000" />
        </div>
      )}
    </div>
  );
}
