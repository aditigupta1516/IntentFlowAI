import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Clock,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Plus,
  Check,
  Zap,
  Send,
  Eye,
  Bookmark,
  ShoppingBag,
  Store,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent, PIPELINE_STEPS } from '../context/AgentContext';
import { Pipeline3D } from '../components/3d/Pipeline3D';
import { DecisionReceiptCard } from '../components/common/DecisionReceiptCard';
import { storageService } from '../services/storageService';
import { SupportedPlatform } from '../types';
import { extractUniversalProducts } from '../services/universalProductExtractor';

export const AgentWorkspacePage: React.FC = () => {
  const {
    intentText,
    parsed,
    discovered,
    bundle,
    addOn,
    addOnAccepted,
    setAddOnAccepted,
    guardrails,
    reasoningSteps,
    chatMessages,
    sendUserMessage,
    isPipelineRunning,
    isApproved,
    decisionReceipt,
    openWhyId,
    setOpenWhyId,
    setCompareProductId,
    setIsControlCenterOpen,
    setIsLedgerOpen,
    setIsCheckoutOpen,
    simMode,
    setSimMode,
    launchAgent,
    toggleBundleItem,
    approveDecision,
    selectedCategoryTab,
    setSelectedCategoryTab
  } = useAgent();

  const { requireAuthOrProceed, user } = useAuth();
  const [inputVal, setInputVal] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    if (!requireAuthOrProceed()) return;
    launchAgent(inputVal.trim());
    setInputVal('');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!requireAuthOrProceed()) return;
    sendUserMessage(chatInput.trim());
    setChatInput('');
  };

  const bundleIds = new Set(bundle?.items.map((i) => i.id) || []);
  const budgetSpent = (bundle?.finalTotal || 0) + (addOnAccepted && addOn ? addOn.item.bestPrice : 0);
  const budgetOk = budgetSpent <= guardrails.maxBudget;

  const categoryTabs = React.useMemo(() => {
    if (!parsed) return [{ id: 'all', label: 'All Products' }];
    const universal = extractUniversalProducts(parsed);
    if (universal.subCategoryTabs && universal.subCategoryTabs.length > 0) {
      return universal.subCategoryTabs;
    }
    return [
      { id: 'all', label: `All ${parsed.category.replace(/_/g, ' ')}` },
      { id: 'top_rated', label: 'Top Rated & Best Sellers' },
      { id: 'budget', label: 'Budget Friendly' }
    ];
  }, [parsed]);

  // Filter products based on sub-category tab
  const filteredProducts = discovered.filter((p) => {
    if (selectedCategoryTab === 'all') return true;
    return (
      p.tags.includes(selectedCategoryTab) ||
      p.subCategory?.toLowerCase() === selectedCategoryTab.toLowerCase() ||
      (selectedCategoryTab === 'sunscreen' && p.tags.includes('spf')) ||
      (selectedCategoryTab === 'oily' && (p.tags.includes('oily') || p.tags.includes('acne'))) ||
      (selectedCategoryTab === 'sensitive' && (p.tags.includes('sensitive') || p.tags.includes('gentle')))
    );
  });

  const quickPrompts = [
    'I also have sensitive skin',
    'Make it cheaper under ₹1,500',
    'Add an SPF sunscreen stick',
    'Show me fashion outfits for casual brunch'
  ];

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-6 max-w-[1550px] mx-auto space-y-6">
      {/* Top Workspace Query Bar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-border-hi">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type any shopping goal (e.g. Oily skincare routine under ₹1800, Developer coding setup...)"
              className="glass-input w-full py-2.5 pl-9 pr-4 text-xs sm:text-sm text-white font-sans placeholder-dim2"
            />
            <Sparkles className="w-4 h-4 text-brand-blue absolute left-3 top-3" />
          </div>
          <button type="submit" className="btn-primary text-xs py-2.5 px-4 flex-shrink-0 font-bold">
            Ask Agent →
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setSimMode(!simMode)}
            className={`btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-mono ${
              simMode ? 'border-brand-blue bg-brand-blue/15 text-white' : ''
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-brand-blue" />
            {simMode ? 'Hide Graph' : 'Watch Pipeline'}
          </button>

          <button
            onClick={() => setIsControlCenterOpen(true)}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-mono"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-purple" />
            Guardrails
          </button>

          <button
            onClick={() => setIsLedgerOpen(true)}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 font-mono"
          >
            <Clock className="w-3.5 h-3.5 text-status-good" />
            Audit Log
          </button>
        </div>
      </div>

      {/* Optional Pipeline Graph Toggle */}
      {simMode && (
        <div className="animate-fade-in">
          <Pipeline3D />
        </div>
      )}

      {/* Master 3-Column AI Operating System Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: AI UNDERSTANDING & MULTI-TURN CHAT ================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* Parsed Intent Chips */}
          <div className="glass-panel p-4 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-dim font-bold flex items-center justify-between">
              <span>Parsed Intent</span>
              <span className="text-brand-blue text-[10px] font-bold">● Active Session</span>
            </div>

            <div className="text-xs text-white font-semibold line-clamp-2">
              "{intentText}"
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
              {parsed ? (
                <>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-dim">
                    Cat: <b className="text-white capitalize">{parsed.category}</b>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-brand-blue/15 border border-brand-blue/30 text-brand-blue">
                    Cap: <b>₹{parsed.budget.toLocaleString('en-IN')}</b>
                  </span>
                  {parsed.skinType && (
                    <span className="px-2 py-0.5 rounded-md bg-brand-purple/15 border border-brand-purple/30 text-brand-purple">
                      Skin: <b>{parsed.skinType}</b>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-status-good-bg text-status-good border border-status-good/30">
                    <b>{parsed.preference}</b>
                  </span>
                </>
              ) : (
                <span className="text-dim">Parsing…</span>
              )}
            </div>
          </div>

          {/* Interactive Multi-Turn AI Chat */}
          <div className="glass-panel p-4 space-y-3 flex flex-col max-h-[360px]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-dim font-bold flex items-center gap-1.5 text-brand-blue">
              <Sparkles className="w-3.5 h-3.5" />
              Chat with Shopping Agent
            </div>

            {/* Message Stream */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 text-xs font-sans max-h-[220px]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-blue/20 text-white ml-4 border border-brand-blue/30'
                      : 'bg-white/5 text-dim mr-2 border border-white/10'
                  }`}
                >
                  <div className="text-[9px] font-mono text-dim2 uppercase mb-0.5">
                    {msg.sender === 'user' ? 'You' : 'IntentFlow Agent'}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1 pt-1 border-t border-border/50">
              {quickPrompts.slice(0, 2).map((qp) => (
                <button
                  key={qp}
                  onClick={() => sendUserMessage(qp)}
                  className="text-[10px] px-2 py-1 rounded bg-bg-panel hover:bg-brand-blue/15 border border-border text-dim hover:text-white transition-all text-left truncate"
                >
                  + {qp}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="relative pt-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask follow-up (e.g. add sunscreen stick...)"
                className="glass-input w-full py-1.5 pl-3 pr-8 text-xs text-white"
              />
              <button
                type="submit"
                className="absolute right-2 top-2.5 text-brand-blue hover:text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Reasoning & Trust Layer */}
          <div className="glass-panel p-4 space-y-3 font-mono text-xs">
            <div className="text-[11px] uppercase tracking-wider text-dim font-bold">
              Trust & Bounded Guardrails
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-dim">Agent Status</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-status-good-bg text-status-good font-bold">
                  🟢 Bounded Safe
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-dim">Budget Check</span>
                <span className="text-white font-bold">
                  ₹{budgetSpent.toLocaleString('en-IN')} / ₹{guardrails.maxBudget.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-dim">Verified Stores</span>
                <span className="text-brand-blue font-bold">Amazon, Nykaa, Myntra, Savana</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-dim">Payment Gate</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isApproved ? 'bg-brand-blue/20 text-brand-blue' : 'bg-status-bad-bg text-status-bad'}`}>
                  {isApproved ? '🔓 Unlocked' : '🔒 Locked'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CENTER COLUMN: PRODUCT DISCOVERY CANVAS & DIRECT BUY LINKS ================= */}
        <div className="lg:col-span-6 space-y-5">
          {/* Products Decision Canvas */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Store className="w-4 h-4 text-brand-blue" />
                  Product Discovery & Direct Store Links
                </h3>
                <p className="text-xs text-dim">
                  Click any verified store link to purchase directly on Amazon, Nykaa, Myntra, or Savana
                </p>
              </div>
              <span className="text-xs font-mono text-dim px-2 py-0.5 rounded bg-white/5 border border-white/10 self-start sm:self-auto">
                {filteredProducts.length} Verified Options
              </span>
            </div>

            {/* Quick Filter Tabs for Variety */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategoryTab(tab.id)}
                  className={`px-3 py-1 rounded-lg transition-all flex-shrink-0 ${
                    selectedCategoryTab === tab.id
                      ? 'bg-brand-blue text-bg font-bold shadow-glow-blue'
                      : 'bg-bg-panel border border-border text-dim hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Product Cards Grid or Live Scanning Loader */}
            {isPipelineRunning ? (
              <div className="space-y-4 animate-fade-in">
                {/* High-Tech Live Multi-Store Scanning Status Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-blue/15 via-brand-purple/10 to-brand-cyan/15 border border-brand-blue/40 shadow-glow-blue space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                      <Sparkles className="w-4 h-4 text-brand-blue animate-spin" />
                      <span>AI Agent Live Multi-Store Scanning…</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-bold animate-pulse">
                      ● Active Search
                    </span>
                  </div>

                  <div className="text-xs text-dim">
                    Querying real-time catalogs for: <span className="text-white font-bold font-sans">"{intentText}"</span>
                  </div>

                  {/* Store Live Feed Badges */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {[
                      { name: 'Amazon', icon: '📦' },
                      { name: 'Flipkart', icon: '🛒' },
                      { name: 'Myntra', icon: '🛍️' },
                      { name: 'Nykaa', icon: '💄' },
                      { name: 'Savana', icon: '👗' },
                      { name: 'Meesho', icon: '🏷️' }
                    ].map((store, i) => (
                      <span
                        key={store.name}
                        style={{ animationDelay: `${i * 120}ms` }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-bg-panel border border-brand-blue/30 text-white font-mono flex items-center gap-1.5 animate-pulse"
                      >
                        <span>{store.icon}</span>
                        <span>{store.name}</span>
                        <span className="text-[9px] text-emerald-400">●</span>
                      </span>
                    ))}
                  </div>

                  {/* Stepped progress bar */}
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan animate-pulse w-3/4 rounded-full" />
                  </div>
                </div>

                {/* 4 Skeleton Loading Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="glass-panel p-4 rounded-xl border border-white/5 space-y-3 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-white/10" />
                        <div className="w-7 h-7 rounded-lg bg-white/10" />
                      </div>
                      <div className="w-20 h-3 bg-white/10 rounded" />
                      <div className="w-full h-4 bg-white/10 rounded" />
                      <div className="w-3/4 h-4 bg-white/10 rounded" />
                      <div className="w-full h-8 bg-white/10 rounded-lg mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
                {filteredProducts.map((product) => {
                  const inBundle = bundleIds.has(product.id);
                  const isWhyOpen = openWhyId === product.id;
                  const bestListing = product.listings[0];

                  return (
                    <div
                      key={product.id}
                      className={`glass-panel p-4 rounded-xl border relative transition-all duration-200 flex flex-col justify-between ${
                        inBundle
                          ? 'border-brand-blue/80 bg-brand-blue/[0.08] shadow-glow-blue'
                          : 'border-border hover:border-border-hi'
                      }`}
                    >
                    <div>
                      {/* Top badge & bundle toggle */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                          {product.icon}
                        </div>

                        <button
                          onClick={() => toggleBundleItem(product.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                            inBundle
                              ? 'bg-brand-blue text-bg shadow-glow-blue'
                              : 'bg-bg-panel border border-border text-dim hover:text-white'
                          }`}
                          title={inBundle ? 'Remove from bundle' : 'Add to bundle'}
                        >
                          {inBundle ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Title & Brand */}
                      <div className="text-[10px] font-mono text-dim uppercase tracking-wider">{product.brand}</div>
                      <h4 className="text-xs font-bold text-white tracking-tight leading-tight line-clamp-2 mt-0.5">
                        {product.name}
                      </h4>

                      {/* Best Verified Price & Platform Pill */}
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-border/50 font-mono">
                        <div>
                          <span className="text-sm font-bold text-white">₹{product.bestPrice.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-dim ml-1">on {product.bestPlatformName}</span>
                        </div>
                        <span className="text-[11px] font-bold text-status-good">
                          {product.matchScore}% Match
                        </span>
                      </div>

                      {/* Multi-Platform Price Pills */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {product.listings.slice(0, 4).map((l) => (
                          <span
                            key={l.platform}
                            className="text-[11px] px-2 py-0.5 rounded bg-bg-panel border border-border text-dim flex items-center gap-1 font-mono"
                            title={`${l.platformName}: ₹${l.price}`}
                          >
                            <span>{l.icon}</span>
                            <span>₹{l.price}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* DIRECT MULTI-STORE BUY BUTTON (THE CORE USER VALUE) */}
                    <div className="pt-3 mt-3 border-t border-border/60 space-y-2">
                      <a
                        href={product.bestPlatformUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          storageService.recordStoreClick({
                            productId: product.id,
                            productName: product.name,
                            brand: product.brand,
                            platform: product.bestPlatform,
                            platformName: product.bestPlatformName,
                            price: product.bestPrice,
                            productUrl: product.bestPlatformUrl
                          })
                        }
                        className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-brand-blue to-brand-purple text-bg text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 shadow-glow-blue transition-all"
                      >
                        <span>⚡ Buy on {product.bestPlatformName} (₹{product.bestPrice})</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <div className="flex items-center justify-between text-[11px] font-mono text-dim">
                        <button
                          onClick={() => setOpenWhyId(isWhyOpen ? null : product.id)}
                          className="text-brand-blue hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> {isWhyOpen ? 'Hide rationale' : 'Why this?'}
                        </button>

                        <button
                          onClick={() => setCompareProductId(product.id)}
                          className="text-brand-purple hover:underline flex items-center gap-1"
                        >
                          ⇄ Compare all ({product.listings.length} stores)
                        </button>
                      </div>

                      {/* Why this explainability drawer */}
                      {isWhyOpen && (
                        <div className="mt-2 p-2.5 rounded-lg bg-bg-subtle border border-border text-[11px] space-y-1.5 animate-fade-in font-sans">
                          <div className="font-bold text-white font-mono text-[10px] uppercase text-brand-blue">
                            Autonomous Verification Rationale
                          </div>
                          <ul className="space-y-1 text-dim">
                            {(product.whyThis || []).map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-status-good">•</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="text-[10px] text-dim2 pt-1 border-t border-border">
                            {product.desc}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center rounded-xl border border-dashed border-border space-y-2">
              <p className="text-xs text-dim">No verified products found for this category or filter.</p>
            </div>
          )}
          </div>

          {/* AI-Optimized Bundle Summary with Direct Links */}
          {bundle && (
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    AI-Optimized Complete Routine Bundle
                  </h3>
                  <p className="text-xs text-dim">Combinatorial synergy calculated across Amazon, Nykaa & Myntra</p>
                </div>
                <button
                  onClick={() => storageService.saveBundle(bundle)}
                  className="btn-secondary text-[11px] py-1 px-2.5 font-mono flex items-center gap-1"
                >
                  <Bookmark className="w-3 h-3 text-brand-purple" /> Save Routine
                </button>
              </div>

              {/* Connected Bundle Node Visualizer */}
              <div className="flex items-center flex-wrap gap-2 py-1">
                {bundle.items.map((item, i) => (
                  <React.Fragment key={item.id}>
                    <a
                      href={item.bestPlatformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 rounded-lg bg-bg-panel hover:bg-brand-blue/15 border border-border hover:border-brand-blue text-white font-medium flex items-center gap-1.5 transition-all group"
                      title={`Buy ${item.name} on ${item.bestPlatformName}`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name.split(' ').slice(0, 2).join(' ')}</span>
                      <ExternalLink className="w-3 h-3 text-dim group-hover:text-brand-blue ml-0.5" />
                    </a>
                    {i < bundle.items.length - 1 && (
                      <span className="text-dim2 text-xs font-mono">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Price Calculation Table */}
              <div className="space-y-1.5 pt-2 border-t border-border text-xs font-mono">
                <div className="flex justify-between text-dim">
                  <span>Combined Separate Prices</span>
                  <span className="text-white font-bold">₹{bundle.individualTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-status-good">
                  <span>AI Synergy Discount ({bundle.discountPct}%)</span>
                  <span className="font-bold">−₹{(bundle.individualTotal - bundle.finalTotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-border">
                  <span>Final Bundle Total</span>
                  <span className="text-brand-blue">₹{bundle.finalTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-dim text-[11px]">
                  <span>Remaining Under Stated Budget</span>
                  <span className="text-status-good font-bold">+₹{Math.max(0, bundle.remaining).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: GROWTH ENGINE & DECISION RECEIPT ================= */}
        <div className="lg:col-span-3 space-y-5">
          {/* Ethical 4-Gate Growth Engine */}
          <div className="glass-panel p-4 space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-dim font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-brand-purple">
                <Zap className="w-3.5 h-3.5" />
                4-Gate Growth Add-On
              </span>
              <span className="text-[10px] text-dim2 font-mono">Zero Markup</span>
            </div>

            {addOn ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-xs">{addOn.item.name}</div>
                    <div className="text-[11px] text-dim font-mono">{addOn.allowedCategory}</div>
                  </div>
                  <span className="font-mono font-bold text-brand-blue text-sm">
                    ₹{addOn.item.bestPrice}
                  </span>
                </div>

                <p className="text-dim text-[11px] leading-relaxed">{addOn.reason}</p>

                {/* 4 Checks */}
                <div className="space-y-1 text-[10px] text-status-good font-mono bg-bg-subtle p-2.5 rounded-lg border border-border">
                  <div>✓ Relevant to {parsed?.category}</div>
                  <div>✓ Fits unspent budget (₹{guardrails.maxBudget})</div>
                  <div>✓ Verified store listing ({addOn.item.bestPlatformName})</div>
                  <div>✓ No aggressive push</div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={addOn.item.bestPlatformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-bg-panel hover:bg-white/10 border border-border text-center text-[11px] font-mono text-white flex items-center justify-center gap-1"
                  >
                    <span>View on {addOn.item.bestPlatformName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => setAddOnAccepted(!addOnAccepted)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      addOnAccepted
                        ? 'bg-status-good-bg text-status-good border border-status-good/40'
                        : 'btn-primary'
                    }`}
                  >
                    {addOnAccepted ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-dim text-xs py-3 text-center">
                Routine is fully complete within budget.
              </div>
            )}
          </div>

          {/* Decision Receipt Card */}
          {decisionReceipt && bundle && (
            <DecisionReceiptCard
              receipt={decisionReceipt}
              bundle={bundle}
              onApprove={approveDecision}
              onProceedCheckout={() => setIsCheckoutOpen(true)}
              isApproved={isApproved}
            />
          )}
        </div>
      </div>
    </div>
  );
};
