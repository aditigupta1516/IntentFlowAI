import React from 'react';
import { X, ExternalLink, Star, Truck, Check, ShieldCheck } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const ComparePricesModal: React.FC = () => {
  const { compareProductId, setCompareProductId, discovered } = useAgent();

  if (!compareProductId) return null;

  const product = discovered.find(p => p.id === compareProductId);
  if (!product) return null;

  const cheapestListing = product.listings[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-hi max-w-xl w-full p-6 border-border-hi shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
              {product.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{product.name}</h3>
              <p className="text-xs text-dim">Cross-Platform Verified Listings & Pricing</p>
            </div>
          </div>
          <button
            onClick={() => setCompareProductId(null)}
            className="p-1.5 rounded-lg bg-bg-panel hover:bg-bg-panel-hi text-dim hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Banner */}
        <div className="my-4 p-3 rounded-xl bg-bg-panel border border-border flex items-center justify-between text-xs">
          <div>
            <span className="text-dim">Brand: </span>
            <span className="text-white font-bold">{product.brand}</span>
            <span className="text-dim ml-3">Catalog Base: </span>
            <span className="text-white font-mono">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1 text-status-good font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Verified Feeds
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-2.5 my-4">
          {product.listings.map((l, idx) => {
            const isBest = idx === 0;

            return (
              <div
                key={l.platform}
                className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                  isBest
                    ? 'bg-status-good-bg/40 border-status-good/50 shadow-glow-good'
                    : 'bg-bg-panel border-border hover:border-border-hi'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{l.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{l.platformName}</span>
                      {isBest && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-status-good-bg text-status-good font-bold border border-status-good/30">
                          Best Verified Price
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-dim mt-0.5">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-status-warn fill-status-warn" />
                        {l.rating.toFixed(1)} ({l.reviewCount.toLocaleString()})
                      </span>
                      <span className="flex items-center gap-1 text-dim2">
                        <Truck className="w-3 h-3" />
                        {l.delivery}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <div className="text-base font-bold font-mono text-white">
                    ₹{l.price.toLocaleString('en-IN')}
                  </div>
                  <a
                    href={l.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-lg bg-brand-blue/20 hover:bg-brand-blue text-brand-blue hover:text-bg font-bold inline-flex items-center gap-1 transition-all"
                  >
                    Open on {l.platformName} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-dim2 font-mono text-center">
          IntentFlow aggregates pricing from official feeds and affiliate connectors without web scraping.
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex justify-end">
          <button
            onClick={() => setCompareProductId(null)}
            className="btn-primary text-xs py-1.5 px-4"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
