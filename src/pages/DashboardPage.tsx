import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Clock,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ShoppingBag,
  Store,
  Filter,
  Send,
  Layers,
  Heart,
  Search,
  Lock,
  UserCheck,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAgent } from '../context/AgentContext';
import { storageService } from '../services/storageService';
import { TiltCard } from '../components/common/TiltCard';
import { OptimizedBundle, ParsedIntent } from '../types';
import { PRODUCTS_CATALOG } from '../data/catalog';

export const DashboardPage: React.FC = () => {
  const { user, loginWithGoogle, openLoginModal, openSignupModal, requireAuthOrProceed, logout } = useAuth();
  const { launchAgent } = useAgent();
  const navigate = useNavigate();

  const [recentIntents, setRecentIntents] = useState<Array<{ text: string; parsed: ParsedIntent; timestamp: string }>>([]);
  const [savedBundles, setSavedBundles] = useState<OptimizedBundle[]>([]);
  const [queryInput, setQueryInput] = useState<string>('');
  const [chatInput, setChatInput] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setRecentIntents(storageService.getRecentIntents());
    setSavedBundles(storageService.getSavedBundles());
  }, []);

  const handleLaunch = (text?: string) => {
    const q = text || queryInput.trim();
    if (!q) return;
    if (!requireAuthOrProceed()) return;
    launchAgent(q);
    navigate('/agent');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!requireAuthOrProceed()) return;
    launchAgent(chatInput.trim());
    navigate('/agent');
  };

  const handleDeleteIntent = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteRecentIntent(text);
    setRecentIntents(storageService.getRecentIntents());
  };

  const handleDeleteBundle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteBundle(id);
    setSavedBundles(storageService.getSavedBundles());
  };

  const categories = [
    { id: 'all', label: 'All Categories', icon: '✨', count: 'Unlimited' },
    { id: 'skincare', label: 'Skincare Routines', icon: '🧴', count: '12 items' },
    { id: 'fashion', label: 'Fashion & Outfits', icon: '👗', count: '10 items' },
    { id: 'electronics', label: 'Appliances & Gadgets', icon: '⚡', count: '14 items' },
    { id: 'gaming', label: 'Gaming Gears', icon: '🎮', count: '6 items' },
    { id: 'travel', label: 'Travel Kits', icon: '🎒', count: '6 items' }
  ];

  const storeConnectors = [
    { name: 'Amazon India', status: 'Active 200 OK', icon: '📦', color: 'text-amber-400' },
    { name: 'Flipkart Super', status: 'Active 200 OK', icon: '🛒', color: 'text-blue-400' },
    { name: 'Myntra Fashion', status: 'Active 200 OK', icon: '🛍️', color: 'text-rose-400' },
    { name: 'Nykaa Beauty', status: 'Active 200 OK', icon: '💄', color: 'text-pink-400' },
    { name: 'Savana / Urbanic', status: 'Active 200 OK', icon: '👗', color: 'text-purple-400' },
    { name: 'Meesho Direct', status: 'Active 200 OK', icon: '🏷️', color: 'text-fuchsia-400' }
  ];

  const trendingIntents = [
    { title: 'Washing machine under ₹25,000 (LG, Samsung, Bosch)', growth: '+56% Velocity', category: 'Appliances' },
    { title: 'Kids remote control monster truck toy & LEGO box', growth: '+44% Velocity', category: 'Toys' },
    { title: 'I have oily & acne-prone skin. Build skincare under ₹2,000', growth: '+48% Velocity', category: 'Skincare' },
    { title: 'Digital air fryer with rapid air technology under ₹7,000', growth: '+38% Velocity', category: 'Kitchen' },
    { title: 'English willow cricket bat & Yonex badminton racket', growth: '+31% Velocity', category: 'Sports' }
  ];

  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-8 max-w-[1550px] mx-auto space-y-8">
      {/* Top Banner: Professional SaaS Header & Auth Gateway */}
      <div className="glass-panel p-6 sm:p-10 border-border-hi shadow-card-3d relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-blue font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>IntentFlow Autonomous Commerce Intelligence</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-status-good-bg text-status-good border border-status-good/30 font-bold">
                ● 8 Live Store Feeds
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              One search. All stores. Best price.
            </h1>

            <p className="text-dim text-xs sm:text-base leading-relaxed">
              Stop switching between 10 apps. Type <b>whatever product you need</b> (skincare, washing machines, toys, air fryers, clothes, gadgets) and IntentFlow extracts verified listings across <b className="text-white">Amazon, Flipkart, Myntra, Nykaa, and Meesho</b> with direct 1-click links to buy.
            </p>

            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <Link
                to="/pitch"
                className="btn-primary text-xs py-2 px-4 flex items-center gap-2 font-bold shadow-glow-blue"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>▶ Watch 5-Min AI Pitch Demo</span>
              </Link>
              <Link
                to="/overview"
                className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 font-mono"
              >
                <span>Architecture</span>
              </Link>
            </div>
          </div>

          {/* Right Status Panel */}
          <div className="flex-shrink-0">
            {user ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-bg-panel border border-border flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple text-white font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
                  {user.avatarInitial || user.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{user.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-blue/20 text-brand-blue font-semibold">
                      Verified Vault
                    </span>
                  </div>
                  <div className="text-xs text-dim font-mono">{user.email}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono">
                    <Link to="/settings" className="text-brand-blue hover:underline font-semibold">
                      My Private Vault
                    </Link>
                    <span className="text-dim2">•</span>
                    <button
                      onClick={logout}
                      className="text-rose-400 hover:text-rose-300 hover:underline cursor-pointer font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1020] border border-border-hi space-y-3 shadow-lg max-w-xs text-xs font-mono">
                <div className="flex items-center justify-between text-[11px] text-dim border-b border-border/60 pb-2">
                  <span className="flex items-center gap-1.5 text-brand-blue font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Zero Credential Leak
                  </span>
                  <span className="text-emerald-400 font-bold">● Active</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-dim">Store Connectors:</span>
                    <span className="text-white font-bold">8 Live Feeds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">Price Intelligence:</span>
                    <span className="text-brand-blue font-bold">Real-Time</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dim">Vault Encryption:</span>
                    <span className="text-emerald-400 font-bold">AES-256 Bit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3-Step Professional Walkthrough Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 mt-4 border-t border-border/60 text-xs">
          <div className="p-3.5 rounded-xl bg-bg-panel border border-border flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-blue/20 text-brand-blue font-bold flex items-center justify-center flex-shrink-0 font-mono">
              1
            </span>
            <div>
              <div className="font-bold text-white">Search Any Product</div>
              <div className="text-[11px] text-dim">Type what you want in plain English (e.g. washing machine, toy, skincare).</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-panel border border-border flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-brand-purple/20 text-brand-purple font-bold flex items-center justify-center flex-shrink-0 font-mono">
              2
            </span>
            <div>
              <div className="font-bold text-white">AI Scans 8+ Stores</div>
              <div className="text-[11px] text-dim">Compares Amazon, Flipkart, Myntra & Nykaa for the lowest verified price.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-panel border border-border flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-status-good-bg text-status-good font-bold flex items-center justify-center flex-shrink-0 font-mono">
              3
            </span>
            <div>
              <div className="font-bold text-white">1-Click Direct Purchase</div>
              <div className="text-[11px] text-dim">Click the store link to buy directly from the official website in 1 second.</div>
            </div>
          </div>
        </div>

        {/* Master AI Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLaunch();
          }}
          className="pt-6 mt-2 flex flex-col sm:flex-row items-center gap-3 relative z-10"
        >
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search anything (e.g. washing machine, kids toy, oily skincare under ₹2000, air fryer, cricket bat...)"
              className="glass-input w-full py-3.5 pl-11 pr-4 text-xs sm:text-sm text-white font-sans placeholder-dim2"
            />
            <Sparkles className="w-5 h-5 text-brand-blue absolute left-3.5 top-3.5" />
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto py-3.5 px-8 text-xs sm:text-sm font-bold flex-shrink-0 shadow-glow-blue">
            Find Across All Stores →
          </button>
        </form>

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 text-xs font-mono">
          <span className="text-dim text-[11px]">Instant Examples:</span>
          {trendingIntents.slice(0, 4).map((item) => (
            <button
              key={item.title}
              onClick={() => handleLaunch(item.title)}
              className="text-[11px] px-3 py-1 rounded-full bg-white/5 hover:bg-brand-blue/15 border border-border hover:border-brand-blue text-dim hover:text-white transition-all text-left truncate max-w-[320px]"
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Spacious 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT 3 COLUMNS: EXPLORE CATEGORIES & STORE STATUS ================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* Categories Selector */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-mono font-bold text-dim uppercase tracking-wider">
                Explore Categories
              </h3>
              <span className="text-[10px] text-dim2 font-mono">Any Search</span>
            </div>

            <div className="space-y-1.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                      isActive
                        ? 'bg-brand-blue/15 border-brand-blue text-white shadow-glow-blue font-bold'
                        : 'bg-bg-panel border-border text-dim hover:text-white hover:border-border-hi'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-xs">
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-dim2">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Verified Multi-Store Connectors */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-mono font-bold text-dim uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-brand-blue" />
                Verified Stores
              </h3>
              <span className="text-[10px] font-mono text-status-good font-bold">● Active Feeds</span>
            </div>

            <div className="space-y-2">
              {storeConnectors.map((store) => (
                <div
                  key={store.name}
                  className="p-2.5 rounded-xl bg-bg-panel border border-border flex items-center justify-between text-xs font-mono"
                >
                  <span className="flex items-center gap-2 text-white">
                    <span>{store.icon}</span>
                    <span className="font-sans font-medium">{store.name}</span>
                  </span>
                  <span className="text-[10px] text-status-good font-bold">{store.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CENTER 6 COLUMNS: CONVERSATIONAL AGENT & PRODUCT CANVAS ================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Conversational Quick Chat Assistant */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-blue" />
                <h3 className="text-sm font-bold text-white">Ask IntentFlow AI Shopping Assistant</h3>
              </div>
              <span className="text-[10px] font-mono text-dim">Autonomous Multi-Store Search</span>
            </div>

            <p className="text-xs text-dim">
              Ask for anything (e.g. "I need a 7kg front load washing machine" or "Best educational toy for 6 year old under ₹1500") to get real-time price comparisons across Amazon, Flipkart, and Myntra.
            </p>

            <form onSubmit={handleChatSubmit} className="relative pt-1">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask the shopping agent anything..."
                className="glass-input w-full py-2.5 pl-3.5 pr-10 text-xs sm:text-sm text-white font-sans"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-3 text-brand-blue hover:text-white transition-colors"
                title="Send to Agent"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Product Variety Canvas with Direct Store Buy Links */}
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-purple" />
                  Verified Product Comparison Feed ({filteredProducts.length})
                </h3>
                <p className="text-xs text-dim">
                  Click any "⚡ Buy on [Store]" button to order directly from official website
                </p>
              </div>

              <Link
                to="/agent"
                className="btn-secondary text-xs py-1.5 px-3 font-mono flex items-center gap-1"
              >
                Open Full Workspace →
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.slice(0, 8).map((product) => {
                const bestListing = product.listings[0];

                return (
                  <TiltCard
                    key={product.id}
                    className="p-4 space-y-3 flex flex-col justify-between border-border hover:border-brand-blue/50"
                    glowColor="rgba(91, 140, 255, 0.2)"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                          {product.icon}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-status-good-bg text-status-good font-bold">
                          {product.rating} ★ ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-dim uppercase tracking-wider">{product.brand}</div>
                      <h4 className="text-xs font-bold text-white tracking-tight line-clamp-2 mt-0.5">
                        {product.name}
                      </h4>

                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-border/50 font-mono">
                        <div>
                          <span className="text-sm font-bold text-white">₹{product.bestPrice.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-dim ml-1">on {product.bestPlatformName}</span>
                        </div>
                      </div>

                      {/* Store Listings Pills */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {product.listings.slice(0, 3).map((l) => (
                          <span
                            key={l.platform}
                            className="text-[10px] px-2 py-0.5 rounded bg-bg-panel border border-border text-dim flex items-center gap-1 font-mono"
                          >
                            <span>{l.icon}</span>
                            <span>₹{l.price}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct Single-Click Store Link */}
                    <div className="pt-2 border-t border-border/50 space-y-1.5">
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
                    </div>
                  </TiltCard>
                );
              })}
            </div>

            {filteredProducts.length > 8 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => navigate('/agent')}
                  className="btn-secondary text-xs py-2 px-6 font-mono"
                >
                  View All Products in AI Workspace →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT 3 COLUMNS: TRENDING DEMAND & RECENT SEARCHES ================= */}
        <div className="lg:col-span-3 space-y-6">
          {/* Trending Shopping Intents */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-status-good" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Trending Searches
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {trendingIntents.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleLaunch(item.title)}
                  className="p-3 rounded-xl bg-bg-panel border border-border hover:border-brand-blue/50 cursor-pointer transition-all"
                >
                  <div className="text-xs text-white font-medium line-clamp-2 hover:text-brand-blue">
                    "{item.title}"
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-dim mt-1.5">
                    <span>{item.category}</span>
                    <span className="text-status-good font-bold">{item.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-blue" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Recent Searches
                </h3>
              </div>
              <span className="text-[10px] font-mono text-dim">{recentIntents.length}</span>
            </div>

            {recentIntents.length === 0 ? (
              <div className="py-6 text-center text-xs text-dim">
                No recent searches. Search any product above to start!
              </div>
            ) : (
              <div className="space-y-2">
                {recentIntents.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLaunch(item.text)}
                    className="p-3 rounded-xl bg-bg-panel border border-border hover:border-border-hi cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="text-xs font-semibold text-white group-hover:text-brand-blue truncate">
                        "{item.text}"
                      </div>
                      <div className="text-[10px] font-mono text-dim">
                        Max ₹{item.parsed?.budget.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteIntent(item.text, e)}
                      className="text-dim hover:text-status-bad p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Bundles */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-brand-purple" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Saved Routines & Bundles
                </h3>
              </div>
              <Link to="/bundles" className="text-[10px] font-mono text-brand-purple hover:underline">
                View All →
              </Link>
            </div>

            {savedBundles.length === 0 ? (
              <div className="py-6 text-center text-xs text-dim">
                No saved routines yet. Save any routine inside the AI workspace.
              </div>
            ) : (
              <div className="space-y-2">
                {savedBundles.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      launchAgent(b.name);
                      navigate('/agent');
                    }}
                    className="p-3 rounded-xl bg-bg-panel border border-border hover:border-brand-purple/50 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span className="truncate">{b.name}</span>
                      <span className="font-mono text-brand-blue">₹{b.finalTotal}</span>
                    </div>
                    <div className="text-[10px] font-mono text-dim">
                      {b.items.length} verified products
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
