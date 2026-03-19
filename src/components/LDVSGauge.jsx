import React from 'react';
import { motion } from 'motion/react';

export default function LDVSGauge({ score, lang }) {
  const normalizedScore = Math.min(100, Math.max(0, score || 0));
  
  const color = '#00FF00'; // Neon Green
  const label = normalizedScore >= 80 ? (lang === 'en' ? 'OPTIMIZED' : 'BORA') : 
                normalizedScore >= 50 ? (lang === 'en' ? 'STABLE' : 'WASTANI') : 
                (lang === 'en' ? 'CRITICAL' : 'MBAYA');

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-12">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-neon-green/10 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          {/* Track */}
          <circle
            cx="144"
            cy="144"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Progress */}
          <motion.circle
            cx="144"
            cy="144"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            strokeLinecap="butt"
            style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 0, 0.5))' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-9xl font-display text-white leading-none"
          >
            {Math.round(normalizedScore)}
          </motion.span>
          <span className="text-[10px] font-black text-neon-green uppercase tracking-[0.5em] mt-2">Index</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">System Status</span>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-ping" />
          <span className="text-2xl font-display text-white uppercase tracking-widest">
            {label}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
