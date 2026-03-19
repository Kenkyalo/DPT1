import React from 'react';
import { motion } from 'motion/react';

const indicators = [
  { key: 'profile_score', label: 'Profile Completeness', labelSw: 'Kukamilika kwa Wasifu', weight: '20%' },
  { key: 'posting_score', label: 'Posting Consistency', labelSw: 'Uthabiti wa Kuchapisha', weight: '20%' },
  { key: 'engagement_score', label: 'Engagement Level', labelSw: 'Kiwango cha Ushiriki', weight: '25%' },
  { key: 'responsiveness_score', label: 'Responsiveness', labelSw: 'Kujibu Haraka', weight: '20%' },
  { key: 'platform_score', label: 'Platform Presence', labelSw: 'Uwepo wa Majukwaa', weight: '15%' },
];

export default function ScoreBreakdown({ scoreData, lang }) {
  if (!scoreData) return null;

  return (
    <div className="space-y-10">
      <div className="space-y-8">
        {indicators.map((ind, idx) => {
          const val = Math.round(scoreData[ind.key] || 0);
          return (
            <div key={ind.key} className="group">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">
                    {ind.weight} Weight
                  </span>
                  <span className="text-sm font-bold text-white uppercase tracking-widest group-hover:text-neon-green transition-colors">
                    {lang === 'en' ? ind.label : ind.labelSw}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-neon-green tracking-tighter">{val}</span>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">/ 100</span>
                </div>
              </div>
              
              <div className="h-1 w-full bg-white/5 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full bg-neon-green relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
