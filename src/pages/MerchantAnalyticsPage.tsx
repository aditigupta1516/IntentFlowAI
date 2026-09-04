import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ShoppingBag, ArrowUpRight, ShieldCheck, Filter } from 'lucide-react';
import { TiltCard } from '../components/common/TiltCard';

const REVENUE_TIMELINE = [
  { month: 'Apr', rev: 4.2, intents: 1840 },
  { month: 'May', rev: 5.8, intents: 2420 },
  { month: 'Jun', rev: 6.9, intents: 2950 },
  { month: 'Jul', rev: 8.4, intents: 3890 },
  { month: 'Aug', rev: 10.2, intents: 4680 },
  { month: 'Sep', rev: 12.7, intents: 5410 }
];

const TOP_INTENT_PATTERNS = [
  { query: 'Oily skin routine under ₹2,000', volume: 1420, convRate: '68.4%', aov: '₹1,840' },
  { query: 'Coding developer monitor & mechanical keyboard under ₹80k', volume: 980, convRate: '54.2%', aov: '₹34,200' },
  { query: 'Travel carry-on backpack under ₹5,000', volume: 840, convRate: '61.0%', aov: '₹3,450' },
  { query: 'Casual summer brunch dress under ₹600', volume: 760, convRate: '59.8%', aov: '₹540' },
  { query: 'Wireless gaming mouse & headset combo under ₹6,000', volume: 620, convRate: '63.5%', aov: '₹4,990' }
];

const PLATFORM_PERFORMANCE = [
  { platform: 'Amazon India', share: '44%', convRate: '64.2%', rating: '4.8/5' },
  { platform: 'Nykaa Beauty', share: '28%', convRate: '71.0%', rating: '4.9/5' },
  { platform: 'Flipkart', share: '18%', convRate: '58.4%', rating: '4.6/5' },
  { platform: 'Meesho', share: '10%', convRate: '52.1%', rating: '4.4/5' }
];

export const MerchantAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const maxRev = Math.max(...REVENUE_TIMELINE.map(r => r.rev));

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-8 max-w-[1550px] mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-wider font-bold">
            <BarChart3 className="w-4 h-4" />
            Merchant & Platform Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Agentic Commerce Analytics
          </h1>
          <p className="text-xs text-dim">
            Real-time intent demand signals, conversion funnels, and platform orchestration metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
                timeRange === range
                  ? 'bg-brand-blue/20 border-brand-blue text-brand-blue font-bold'
                  : 'bg-bg-panel border-border text-dim hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TiltCard className="p-5 space-y-2" glowColor="rgba(91, 140, 255, 0.2)">
          <div className="flex justify-between items-center text-dim font-mono text-xs">
            <span>Customer Intents</span>
            <Users className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">12,480</div>
          <div className="text-[11px] text-status-good font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +38.4% vs last period
          </div>
        </TiltCard>

        <TiltCard className="p-5 space-y-2" glowColor="rgba(155, 123, 255, 0.2)">
          <div className="flex justify-between items-center text-dim font-mono text-xs">
            <span>Agent Revenue Influenced</span>
            <DollarSign className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">₹38.2 Lakh</div>
          <div className="text-[11px] text-status-good font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +42.1% net expansion
          </div>
        </TiltCard>

        <TiltCard className="p-5 space-y-2" glowColor="rgba(52, 211, 153, 0.2)">
          <div className="flex justify-between items-center text-dim font-mono text-xs">
            <span>Bundle Acceptance Rate</span>
            <ShoppingBag className="w-4 h-4 text-status-good" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">74.2%</div>
          <div className="text-[11px] text-status-good font-mono flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 3.2 avg items/bundle
          </div>
        </TiltCard>

        <TiltCard className="p-5 space-y-2" glowColor="rgba(34, 211, 238, 0.2)">
          <div className="flex justify-between items-center text-dim font-mono text-xs">
            <span>4-Gate Cross-Sell Rate</span>
            <ArrowUpRight className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">38.6%</div>
          <div className="text-[11px] text-dim font-mono">Zero friction opt-in</div>
        </TiltCard>
      </div>

      {/* Revenue Influenced Bar Chart & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Bar Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Monthly GMV Influenced (₹ Lakhs)
              </h3>
              <p className="text-xs text-dim">Autonomous commerce checkout and merchant redirects</p>
            </div>
            <span className="text-xs font-mono text-status-good font-bold">+198% YoY</span>
          </div>

          <div className="h-64 flex items-end gap-4 pt-8 px-2">
            {REVENUE_TIMELINE.map((item) => {
              const heightPct = (item.rev / maxRev) * 100;

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-mono text-dim group-hover:text-white transition-colors">
                    ₹{item.rev}L
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-blue2 to-brand-purple hover:brightness-125 transition-all relative cursor-pointer"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-bg-panel-hi border border-border px-1.5 py-0.5 rounded text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.intents} intents
                    </div>
                  </div>
                  <div className="text-xs font-mono text-dim">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Conversion Funnel (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-4 font-mono text-xs">
          <div className="pb-2 border-b border-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Agent Decision Funnel
            </h3>
            <p className="text-xs text-dim font-sans">Conversion efficiency through agent steps</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-dim mb-1">
                <span>01. Intent Parsed</span>
                <span className="text-white font-bold">12,480 (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-dim mb-1">
                <span>02. Discovered & Scored</span>
                <span className="text-white font-bold">11,230 (90.0%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full w-[90%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-dim mb-1">
                <span>03. Bundle Assembled</span>
                <span className="text-white font-bold">9,260 (74.2%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-brand-purple rounded-full w-[74%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-dim mb-1">
                <span>04. Receipt Approved</span>
                <span className="text-white font-bold">7,940 (63.6%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-status-good rounded-full w-[64%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-dim mb-1">
                <span>05. Payment Settled / Redirected</span>
                <span className="text-white font-bold">7,660 (61.4%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-status-good rounded-full w-[61%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Intent Patterns Table */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Top Customer Intent Patterns
            </h3>
            <p className="text-xs text-dim">Highest volume commercial search semantics</p>
          </div>
          <span className="text-xs font-mono text-dim">{TOP_INTENT_PATTERNS.length} High-Affinity Clusters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-dim uppercase text-[10px]">
                <th className="py-2.5 px-3">Intent Pattern</th>
                <th className="py-2.5 px-3">Query Volume</th>
                <th className="py-2.5 px-3">Conversion</th>
                <th className="py-2.5 px-3">Average Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {TOP_INTENT_PATTERNS.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-sans font-semibold text-white">{item.query}</td>
                  <td className="py-3 px-3 text-dim">{item.volume.toLocaleString()}</td>
                  <td className="py-3 px-3 text-status-good font-bold">{item.convRate}</td>
                  <td className="py-3 px-3 text-brand-blue font-bold">{item.aov}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Connectors Share */}
      <div className="glass-panel p-6 space-y-4">
        <div className="pb-2 border-b border-border">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Platform Connectors Distribution
          </h3>
          <p className="text-xs text-dim">Traffic and fulfillment breakdown across verified marketplace partners</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_PERFORMANCE.map((p) => (
            <div key={p.platform} className="p-4 rounded-xl bg-bg-panel border border-border space-y-2 font-mono text-xs">
              <div className="font-bold text-white text-sm font-sans">{p.platform}</div>
              <div className="flex justify-between text-dim">
                <span>Market Share</span>
                <span className="text-brand-blue font-bold">{p.share}</span>
              </div>
              <div className="flex justify-between text-dim">
                <span>Conversion</span>
                <span className="text-status-good font-bold">{p.convRate}</span>
              </div>
              <div className="flex justify-between text-dim">
                <span>Connector Health</span>
                <span className="text-white font-bold">{p.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
