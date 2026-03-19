import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  LayoutDashboard, 
  History as HistoryIcon, 
  Settings, 
  ChevronRight, 
  Globe, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  MapPin,
  PlusCircle,
  RefreshCw,
  Languages
} from 'lucide-react';
import Home from './pages/Home';
import Setup from './pages/Setup';
import History from './pages/History';

const translations = {
  en: {
    dashboard: "Dashboard",
    setup: "Setup",
    history: "History",
    presenceTracker: "Digital Presence Tracker",
    switchLanguage: "Translate to Swahili",
    selectSME: "Select Business"
  },
  sw: {
    dashboard: "Dashibodi",
    setup: "Usanidi",
    history: "Historia",
    presenceTracker: "Kifuatiliaji cha Uwepo wa Kidijitali",
    switchLanguage: "Tafsiri kwa Kiingereza",
    selectSME: "Chagua Biashara"
  }
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [lang, setLang] = useState('en');
  const [smes, setSmes] = useState([]);
  const [selectedSmeId, setSelectedSmeId] = useState(null);

  const t = translations[lang];

  useEffect(() => {
    fetchSmes();
  }, []);

  const fetchSmes = async () => {
    try {
      const res = await fetch('/api/smes');
      const data = await res.json();
      setSmes(data);
      if (data.length > 0 && !selectedSmeId) {
        setSelectedSmeId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch SMEs", err);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home smeId={selectedSmeId} lang={lang} />;
      case 'setup': return <Setup onComplete={() => { fetchSmes(); setCurrentPage('home'); }} lang={lang} />;
      case 'history': return <History smeId={selectedSmeId} lang={lang} />;
      default: return <Home smeId={selectedSmeId} lang={lang} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans overflow-x-hidden cyber-grid">
      {/* Immersive Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-green/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Floating Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 glass-panel rounded-full border border-white/10">
        <NavButton active={currentPage === 'home'} onClick={() => setCurrentPage('home')} icon={<LayoutDashboard size={18} />} label={t.dashboard} />
        <div className="w-px h-4 bg-white/10 mx-2" />
        <NavButton active={currentPage === 'setup'} onClick={() => setCurrentPage('setup')} icon={<PlusCircle size={18} />} label={t.setup} />
        <div className="w-px h-4 bg-white/10 mx-2" />
        <NavButton active={currentPage === 'history'} onClick={() => setCurrentPage('history')} icon={<HistoryIcon size={18} />} label={t.history} />
      </nav>

      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 w-full h-24 flex items-center justify-between px-12 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neon-green flex items-center justify-center text-black font-black text-xl italic skew-x-[-12deg]">
            D
          </div>
          <h1 className="text-2xl font-display tracking-tighter glow-text">DPT.</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 glass-panel rounded-xl border border-white/5">
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] whitespace-nowrap">{t.selectSME}</p>
            <select 
              value={selectedSmeId || ''} 
              onChange={(e) => setSelectedSmeId(Number(e.target.value))}
              className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
            >
              <option value="" disabled className="bg-cyber-black">{t.selectSME}</option>
              {smes.map(sme => (
                <option key={sme.id} value={sme.id} className="bg-cyber-black">{sme.name}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
            className="w-10 h-10 flex items-center justify-center glass-panel rounded-xl hover:bg-white/10 transition-all"
          >
            <Languages size={18} className="text-neon-green" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-8 lg:px-12 max-w-[1600px] mx-auto min-h-screen">
        {renderPage()}
      </main>

      {/* Bottom Marquee */}
      <div className="fixed bottom-0 left-0 w-full h-12 bg-neon-green text-black flex items-center border-t border-black/10 z-50 overflow-hidden">
        <div className="marquee">
          <div className="marquee-content py-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-8 px-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Digital Presence Tracker v2.0</span>
                <div className="w-1 h-1 bg-black rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Kenyan SME Growth Engine</span>
                <div className="w-1 h-1 bg-black rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Powered Visibility</span>
                <div className="w-1 h-1 bg-black rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-white/10 px-6 py-4 flex justify-around items-center z-50 lg:hidden rounded-t-3xl">
        <NavButton active={currentPage === 'home'} onClick={() => setCurrentPage('home')} icon={<LayoutDashboard size={20} />} label={t.dashboard} />
        <NavButton active={currentPage === 'setup'} onClick={() => setCurrentPage('setup')} icon={<PlusCircle size={20} />} label={t.setup} />
        <NavButton active={currentPage === 'history'} onClick={() => setCurrentPage('history')} icon={<HistoryIcon size={20} />} label={t.history} />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-6 py-2.5 rounded-full flex items-center gap-3 transition-all duration-500 ${
        active 
          ? 'bg-neon-green text-black font-black shadow-[0_0_20px_rgba(0,255,102,0.4)]' 
          : 'text-white/40 hover:text-white hover:bg-white/5 font-bold'
      }`}
    >
      <span className={active ? 'scale-110 transition-transform' : ''}>{icon}</span>
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}
