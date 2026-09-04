import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-bg/90 backdrop-blur-md pt-12 pb-8 px-4 lg:px-8 text-xs font-mono text-dim2">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-sm text-white">
            <span className="text-brand-blue font-black">◆</span> IntentFlow AI
          </div>
          <p className="text-dim leading-relaxed text-[11px]">
            From Customer Intent to Trusted Transaction. The Agentic Commerce Intelligence Layer built for next-generation shopping.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px]">
            <Sparkles className="w-3 h-3" />
            Razorpay AI Builder 2026
          </div>
        </div>

        <div>
          <div className="font-bold text-white mb-3 text-[11px] uppercase tracking-wider text-dim">Product</div>
          <ul className="space-y-2 text-dim">
            <li><Link to="/agent" className="hover:text-white transition-colors">AI Workspace</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">User Dashboard</Link></li>
            <li><Link to="/bundles" className="hover:text-white transition-colors">Saved Bundles</Link></li>
            <li><Link to="/analytics" className="hover:text-white transition-colors">Merchant Intelligence</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-white mb-3 text-[11px] uppercase tracking-wider text-dim">Architecture</div>
          <ul className="space-y-2 text-dim">
            <li><span className="text-dim">Deterministic Intent Parser</span></li>
            <li><span className="text-dim">Combinatorial Bundle Optimizer</span></li>
            <li><span className="text-dim">4-Gate Growth Engine</span></li>
            <li><span className="text-dim">Cryptographic Decision Receipts</span></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-white mb-3 text-[11px] uppercase tracking-wider text-dim">Trust & Ethics</div>
          <ul className="space-y-2 text-dim">
            <li><span className="text-dim">Zero Hidden Markup</span></li>
            <li><span className="text-dim">Transparent Scoring Weights</span></li>
            <li><span className="text-dim">Explicit Customer Authorization</span></li>
            <li><span className="text-dim">Non-Intrusive Add-On Policy</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 IntentFlow AI Inc. · Track 1 — AI Growth & Agentic Commerce.
        </div>
        <div className="flex items-center gap-1 text-[11px] text-dim">
          <span>Engineered with</span>
          <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink mx-0.5 inline" />
          <span>for trusted autonomous transactions.</span>
        </div>
      </div>
    </footer>
  );
};
