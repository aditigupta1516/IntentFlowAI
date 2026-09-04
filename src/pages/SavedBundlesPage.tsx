import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAgent } from '../context/AgentContext';
import { OptimizedBundle } from '../types';
import { TiltCard } from '../components/common/TiltCard';

export const SavedBundlesPage: React.FC = () => {
  const [bundles, setBundles] = useState<OptimizedBundle[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const { launchAgent } = useAgent();
  const navigate = useNavigate();

  useEffect(() => {
    setBundles(storageService.getSavedBundles());
  }, []);

  const handleDelete = (id: string) => {
    storageService.deleteBundle(id);
    setBundles(storageService.getSavedBundles());
  };

  const handleOpen = (bundle: OptimizedBundle) => {
    launchAgent(bundle.name);
    navigate('/agent');
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-8 max-w-[1550px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-brand-purple uppercase tracking-wider font-bold">
            <Bookmark className="w-4 h-4" />
            Inventory & Memory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Saved Product Bundles
          </h1>
          <p className="text-xs text-dim">
            Preserved routine configurations, discounted totals, and multi-merchant listings
          </p>
        </div>

        <button
          onClick={() => navigate('/agent')}
          className="btn-primary text-xs py-2 px-4 flex-shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Create New Bundle
        </button>
      </div>

      {/* Grid */}
      {bundles.length === 0 ? (
        <div className="glass-panel p-16 text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 text-brand-purple flex items-center justify-center mx-auto text-2xl">
            🔖
          </div>
          <h3 className="text-base font-bold text-white">No Saved Bundles Found</h3>
          <p className="text-xs text-dim leading-relaxed">
            When the agent generates an optimized routine or shopping setup, click "Save Bundle" to preserve it here.
          </p>
          <button onClick={() => navigate('/agent')} className="btn-primary text-xs py-2 px-4">
            Launch AI Workspace →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bundles.map((bundle) => (
            <TiltCard key={bundle.id} className="p-5 space-y-4" glowColor="rgba(155, 123, 255, 0.2)">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-brand-purple/20 text-brand-purple font-bold">
                    {bundle.items.length} Products
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 line-clamp-1">{bundle.name}</h3>
                </div>
                <button
                  onClick={() => handleDelete(bundle.id)}
                  className="p-1.5 rounded-lg text-dim hover:text-status-bad hover:bg-status-bad-bg transition-colors"
                  title="Delete bundle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Products List Preview */}
              <div className="space-y-2 py-2 border-y border-border/50 text-xs">
                {bundle.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-dim">
                    <span className="flex items-center gap-1.5 truncate pr-2 text-white">
                      <span>{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono text-white flex-shrink-0">₹{item.bestPrice}</span>
                  </div>
                ))}
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between font-mono text-xs pt-1">
                <div>
                  <div className="text-[10px] text-dim">Final Bundle Total</div>
                  <div className="text-base font-bold text-brand-blue">
                    ₹{bundle.finalTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleOpen(bundle)}
                  className="btn-primary text-xs py-1.5 px-3.5 flex items-center gap-1"
                >
                  Open in Workspace <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
};
