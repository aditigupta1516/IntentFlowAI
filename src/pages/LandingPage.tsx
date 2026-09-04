import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Lock, BarChart2, CheckCircle2, Store, ExternalLink } from 'lucide-react';
import { Hero3DOrbs } from '../components/3d/Hero3DOrbs';
import { TiltCard } from '../components/common/TiltCard';
import { Pipeline3D } from '../components/3d/Pipeline3D';
import { useAgent } from '../context/AgentContext';

const ROTATING_PROMPTS = [
  'I have oily and acne-prone skin. Build me a complete skincare routine under ₹2,000.',
  'Find me a floral brunch dress under ₹500 across Myntra, Savana and Meesho.',
  'Build me a high-performance coding desk setup under ₹80,000.',
  'Build a lightweight flight-approved travel kit under ₹5,000 with packing cubes.'
];

const SUPPORTED_STORES = [
  { name: 'Amazon India', icon: '📦', color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300' },
  { name: 'Nykaa Beauty', icon: '💄', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300' },
  { name: 'Myntra Fashion', icon: '🛍️', color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-300' },
  { name: 'Savana / Urbanic', icon: '👗', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300' },
  { name: 'Flipkart', icon: '🛒', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300' },
  { name: 'Renee Cosmetics', icon: '✨', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-300' },
  { name: 'Meesho', icon: '🏷️', color: 'from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30 text-fuchsia-300' },
  { name: 'Ajio Trends', icon: '👖', color: 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-300' }
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { launchAgent } = useAgent();
  const [promptIdx, setPromptIdx] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setPromptIdx((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleLaunch = (textToLaunch?: string) => {
    const query = textToLaunch || inputValue.trim() || ROTATING_PROMPTS[promptIdx];
    launchAgent(query);
    navigate('/agent');
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Hero Section */}
      <section className="relative pt-20 pb-16 px-4 lg:px-8 text-center overflow-hidden">
        <Hero3DOrbs />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-xs font-mono font-bold shadow-glow-blue">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping" />
            Your Autonomous AI Shopping Agent · Track 1: AI Growth & Commerce
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Stop switching tabs.<br />
            <span className="text-gradient">Start asking IntentFlow.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-dim text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Describe what you need in plain English. IntentFlow compares verified listings across <b className="text-white">Amazon, Nykaa, Myntra, Savana, and Flipkart</b>, optimizes your budget, verifies ingredient safety, and gives you direct 1-click links to buy.
          </p>

          {/* Central AI Search / Prompt Input */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="glass-panel-hi p-2 pl-4 rounded-2xl border-border-hi shadow-card-3d flex items-center gap-3 relative focus-within:border-brand-blue transition-all">
              <Sparkles className="w-5 h-5 text-brand-blue flex-shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLaunch()}
                placeholder={ROTATING_PROMPTS[promptIdx]}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-dim2 outline-none font-sans"
              />
              <button
                onClick={() => handleLaunch()}
                className="btn-primary flex-shrink-0 py-2.5 px-5 text-xs sm:text-sm font-bold"
              >
                Find Best Deals →
              </button>
            </div>

            {/* Clickable Example Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {ROTATING_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleLaunch(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-bg-panel hover:bg-brand-blue/15 border border-border hover:border-brand-blue text-dim hover:text-white transition-all font-mono text-left line-clamp-1"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Supported Store Connectors Strip */}
          <div className="pt-8 border-t border-border/50 max-w-3xl mx-auto">
            <div className="text-[11px] font-mono text-dim uppercase tracking-wider mb-3">
              Aggregating & Comparing Real-Time verified listings across
            </div>
            <div className="flex items-center justify-center flex-wrap gap-2">
              {SUPPORTED_STORES.map((store) => (
                <span
                  key={store.name}
                  className={`text-xs px-3 py-1.5 rounded-xl border bg-gradient-to-r ${store.color} font-medium flex items-center gap-1.5 shadow-sm`}
                >
                  <span>{store.icon}</span>
                  <span>{store.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / 4-Step Architecture */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue">
            Autonomous Decision Architecture
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How IntentFlow Saves Hours of Manual Shopping
          </h2>
          <p className="text-dim text-xs sm:text-sm">
            You don't have to open 10 apps. We orchestrate research, price comparison, compatibility checks, and verified merchant links in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TiltCard className="p-6 space-y-3" glowColor="rgba(91, 140, 255, 0.2)">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">State Any Intent</h3>
            <p className="text-dim text-xs leading-relaxed">
              Tell IntentFlow your skin profile, budget ceiling, or specific aesthetic goals in natural conversational language.
            </p>
          </TiltCard>

          <TiltCard className="p-6 space-y-3" glowColor="rgba(155, 123, 255, 0.2)">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center text-brand-purple font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">Compare All Stores</h3>
            <p className="text-dim text-xs leading-relaxed">
              Scans Amazon, Nykaa, Myntra, Savana, and Flipkart simultaneously to locate the lowest verified prices and fastest deliveries.
            </p>
          </TiltCard>

          <TiltCard className="p-6 space-y-3" glowColor="rgba(34, 211, 238, 0.2)">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">Verify Compatibility</h3>
            <p className="text-dim text-xs leading-relaxed">
              Automated chemical conflict detection ensures your routine has no duplicate harsh actives or conflicting ingredients.
            </p>
          </TiltCard>

          <TiltCard className="p-6 space-y-3" glowColor="rgba(52, 211, 153, 0.2)">
            <div className="w-10 h-10 rounded-xl bg-status-good-bg border border-status-good/30 flex items-center justify-center text-status-good font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-white">1-Click Direct Purchase</h3>
            <p className="text-dim text-xs leading-relaxed">
              Click direct store links to buy directly from official websites with your routine state saved securely.
            </p>
          </TiltCard>
        </div>
      </section>

      {/* Live Pipeline Preview */}
      <section className="py-10 px-4 lg:px-8 max-w-7xl mx-auto">
        <Pipeline3D />
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Experience AI-Powered Shopping
        </h2>
        <p className="text-dim text-sm max-w-xl mx-auto">
          No sign up required to test. Enter any shopping dilemma and watch your personalized routine assemble in real-time.
        </p>
        <div>
          <button
            onClick={() => handleLaunch()}
            className="btn-primary text-sm py-3.5 px-8 font-bold shadow-glow-blue"
          >
            Launch Agent Workspace →
          </button>
        </div>
      </section>
    </div>
  );
};
