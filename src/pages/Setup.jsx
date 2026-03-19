import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Facebook,
  Instagram,
  MessageCircle,
  Globe,
  Layout,
  Clock,
  ThumbsUp,
  Percent,
  Calculator,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const categories = ["Food & Beverage", "Retail/Fashion", "Technology", "Services", "Agriculture", "Other"];
const responseTimes = [
  { value: 0.5, label: "Under 1 hour" },
  { value: 3, label: "1–6 hours" },
  { value: 15, label: "6–24 hours" },
  { value: 36, label: "Over 24 hours" },
  { value: 72, label: "I rarely respond" }
];

export default function Setup({ onComplete, lang }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    category: 'Food & Beverage',
    location: '',
    platforms: {
      Facebook: false,
      Instagram: false,
      'WhatsApp Business': false,
      'Google My Business': false,
      Website: false,
    },
    setupStatus: {},
    posts_per_week: 0,
    avg_response_hours: 15,
    avg_engagement: 0,
    profile_completeness_pct: 50
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    try {
      // 1. Create SME
      const smeRes = await fetch('/api/smes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          owner_name: formData.owner_name,
          category: formData.category,
          location: formData.location,
          platforms: Object.keys(formData.platforms)
            .filter(p => formData.platforms[p])
            .map(p => ({ name: p, isActive: true }))
        })
      });
      const { id: sme_id } = await smeRes.json();

      // 2. Calculate LDVS
      const activeCount = Object.values(formData.platforms).filter(Boolean).length;
      await fetch('/api/ldvs/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sme_id,
          profile_completeness_pct: formData.profile_completeness_pct,
          posts_per_week: formData.posts_per_week,
          avg_engagement: formData.avg_engagement,
          avg_response_hours: formData.avg_response_hours,
          active_platforms: activeCount
        })
      });

      // 3. Generate Recommendations
      await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sme_id })
      });

      onComplete();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during setup.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-neon-green text-cyber-black rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.3)]">
            <Building2 size={16} />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-green">
            {lang === 'en' ? 'Business Onboarding' : 'Kuanza Biashara'}
          </h2>
        </div>
        <h1 className="text-6xl font-display text-white tracking-tighter mb-4 leading-[0.9]">
          {lang === 'en' ? 'INITIALIZE PROFILE.' : 'ANZISHA WASIFU.'}
        </h1>
        <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-lg">
          {lang === 'en' ? 'Complete these 4 steps to calculate your initial visibility score.' : 'Kamilisha hatua hizi 4 ili kuhesabu alama yako ya kwanza ya uwepo.'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-3 mb-12">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-neon-green shadow-[0_0_10px_rgba(0,255,0,0.5)]' : 'bg-white/10'}`} 
          />
        ))}
      </div>

      <div className="glass-panel p-10 min-h-[500px] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent" />
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-6">
                <Input label="Business Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="e.g. Mama Njeri's Kitchen" />
                <Input label="Owner Name" value={formData.owner_name} onChange={v => setFormData({...formData, owner_name: v})} placeholder="e.g. Jane Doe" />
                
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-1 focus:ring-neon-green outline-none transition-all appearance-none cursor-pointer"
                  >
                    {categories.map(c => <option key={c} value={c} className="bg-cyber-black">{c}</option>)}
                  </select>
                </div>

                <Input label="Location" value={formData.location} onChange={v => setFormData({...formData, location: v})} placeholder="e.g. Nairobi, CBD" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8 flex-1"
            >
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(formData.platforms).map(p => (
                  <div 
                    key={p}
                    onClick={() => setFormData({
                      ...formData, 
                      platforms: { ...formData.platforms, [p]: !formData.platforms[p] }
                    })}
                    className={`p-6 rounded-[1.5rem] border transition-all flex items-center justify-between group cursor-pointer ${
                      formData.platforms[p] ? 'border-neon-green bg-neon-green/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.platforms[p] ? 'bg-neon-green text-cyber-black shadow-[0_0_15px_rgba(0,255,0,0.3)]' : 'bg-white/5 text-white/20'}`}>
                        {p === 'Facebook' && <Facebook size={20} />}
                        {p === 'Instagram' && <Instagram size={20} />}
                        {p === 'WhatsApp Business' && <MessageCircle size={20} />}
                        {p === 'Google My Business' && <MapPin size={20} />}
                        {p === 'Website' && <Globe size={20} />}
                      </div>
                      <span className={`font-black uppercase tracking-wider text-sm ${formData.platforms[p] ? 'text-white' : 'text-white/20'}`}>{p}</span>
                    </div>
                    {formData.platforms[p] && <CheckCircle2 className="text-neon-green" size={20} strokeWidth={3} />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-8">
                <Input label="Posts per week" type="number" value={formData.posts_per_week} onChange={v => setFormData({...formData, posts_per_week: Number(v)})} />
                
                <div>
                  <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-3">Avg Response Time</label>
                  <select 
                    value={formData.avg_response_hours}
                    onChange={e => setFormData({...formData, avg_response_hours: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-1 focus:ring-neon-green outline-none transition-all appearance-none cursor-pointer"
                  >
                    {responseTimes.map(rt => <option key={rt.value} value={rt.value} className="bg-cyber-black">{rt.label}</option>)}
                  </select>
                </div>

                <Input label="Avg Likes/Comments per post" type="number" value={formData.avg_engagement} onChange={v => setFormData({...formData, avg_engagement: Number(v)})} />

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Profile Completeness</label>
                    <span className="text-xs font-black text-neon-green">{formData.profile_completeness_pct}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={formData.profile_completeness_pct}
                    onChange={e => setFormData({...formData, profile_completeness_pct: Number(e.target.value)})}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8 flex-1"
            >
              <div className="bg-white/5 rounded-[1.5rem] p-8 space-y-4 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Business</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Category</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider">{formData.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Platforms</span>
                  <span className="text-sm font-black text-neon-green uppercase tracking-wider">
                    {Object.values(formData.platforms).filter(Boolean).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Posts/Week</span>
                  <span className="text-sm font-black text-white uppercase tracking-wider">{formData.posts_per_week}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-neon-green text-cyber-black rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                <Sparkles size={16} className="mt-1 flex-shrink-0" />
                <p className="text-[10px] font-black leading-relaxed uppercase tracking-widest">
                  {lang === 'en' 
                    ? 'By clicking below, we will calculate your Local Digital Visibility Score and generate AI recommendations.' 
                    : 'Kwa kubofya hapa chini, tutahesabu Alama yako ya Uwepo Kidijitali na kutoa mapendekezo ya AI.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-12 pt-10 border-t border-white/5">
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="flex-1 py-5 rounded-2xl bg-white/5 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <ArrowLeft size={16} strokeWidth={3} />
              Back
            </button>
          )}
          <button 
            onClick={step === 4 ? handleSubmit : nextStep}
            className="flex-[2] py-5 rounded-2xl bg-neon-green text-cyber-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,255,0,0.2)] flex items-center justify-center gap-2"
          >
            {step === 4 ? 'CALCULATE LDVS' : 'CONTINUE'}
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:ring-1 focus:ring-neon-green outline-none transition-all placeholder:text-white/10"
      />
    </div>
  );
}
