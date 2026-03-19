import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Languages, RefreshCw, ChevronRight } from 'lucide-react';

export default function RecommendationPanel({ smeId, scoreData, lang }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  useEffect(() => {
    if (smeId) fetchLatest();
  }, [smeId]);

  const fetchLatest = async () => {
    try {
      const res = await fetch(`/api/recommendations/${smeId}`);
      const data = await res.json();
      if (data.recommendation_text) {
        parseRecommendations(data.recommendation_text);
        setLastGenerated(data.generated_at);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parseRecommendations = (text) => {
    const lines = text.split('\n').filter(l => l.trim().match(/^\d\./));
    setRecommendations(lines.map((l, i) => ({
      text: l.replace(/^\d\.\s*/, ''),
    })));
  };

  const generateNew = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sme_id: smeId })
      });
      const data = await res.json();
      parseRecommendations(data.recommendation_text);
      setLastGenerated(new Date().toISOString());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const translate = async () => {
    setLoading(true);
    try {
      const currentText = recommendations.map((r, i) => `${i+1}. ${r.text}`).join('\n');
      const res = await fetch('/api/recommendations/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sme_id: smeId, text: currentText })
      });
      const data = await res.json();
      parseRecommendations(data.recommendation_text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neon-green text-black rounded-2xl shadow-[0_0_20px_rgba(0,255,0,0.3)]">
            <Sparkles size={20} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
            {lang === 'en' ? 'AI Optimization' : 'Mapendekezo ya AI'}
          </h3>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={translate}
            disabled={loading || recommendations.length === 0}
            className="p-3 text-white/40 hover:text-neon-green hover:bg-white/5 rounded-2xl transition-all disabled:opacity-50"
          >
            <Languages size={20} />
          </button>
          <button 
            onClick={generateNew}
            disabled={loading}
            className={`p-3 text-white/40 hover:text-neon-green hover:bg-white/5 rounded-2xl transition-all disabled:opacity-50 ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((rec, i) => (
              <motion.div 
                key={i}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className="group p-8 rounded-[2rem] border border-white/5 hover:border-neon-green/30 hover:bg-white/5 transition-all cursor-default relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-green/20 group-hover:bg-neon-green transition-colors" />
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono font-bold text-white/40 group-hover:bg-neon-green group-hover:text-black transition-all">
                    0{i + 1}
                  </div>
                  <div className="space-y-3">
                    <p className="text-base font-bold text-white leading-relaxed tracking-wide group-hover:text-neon-green transition-colors">
                      {rec.text}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-neon-green uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                      Execute Action <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-white/5 rounded-[3rem]">
            <Sparkles className="text-white/10 mb-6" size={48} />
            <p className="text-xs font-black text-white/20 uppercase tracking-[0.5em]">
              {lang === 'en' ? 'No data streams detected' : 'Hakuna mapendekezo bado'}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
            {lang === 'en' ? 'Powered by Gemini 1.5 Pro' : 'Imewezeshwa na Gemini AI'}
          </span>
          {lastGenerated && (
            <span className="text-[10px] font-mono text-neon-green/40 uppercase tracking-widest mt-1">
              Last Sync: {new Date(lastGenerated).toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-cyber-black bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
