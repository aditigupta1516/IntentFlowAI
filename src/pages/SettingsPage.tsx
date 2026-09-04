import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Sliders,
  Download,
  Trash2,
  CheckCircle2,
  Save,
  Key,
  Lock,
  ExternalLink,
  Store,
  Clock,
  Bookmark,
  FileCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { StoreRedirectClick, OptimizedBundle, DecisionReceipt } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, updatePreferences, allUsers, switchUser, loginWithGoogle } = useAuth();

  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [defaultBudget, setDefaultBudget] = useState<number>(user?.defaultBudget || 25000);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const [userIntents, setUserIntents] = useState<Array<{ text: string; timestamp: string }>>([]);
  const [userStoreActivity, setUserStoreActivity] = useState<StoreRedirectClick[]>([]);
  const [userBundles, setUserBundles] = useState<OptimizedBundle[]>([]);
  const [userReceipts, setUserReceipts] = useState<DecisionReceipt[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setDefaultBudget(user.defaultBudget || 25000);
      setUserIntents(storageService.getRecentIntents(user.email));
      setUserStoreActivity(storageService.getStoreActivity(user.email));
      setUserBundles(storageService.getSavedBundles(user.email));
      setUserReceipts(storageService.getDecisionReceipts(user.email));
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({ name, email, defaultBudget });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    if (!user) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(storageService.exportUserDataJSON(user.email));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `IntentFlow-Vault-${user.email}.json`);
    dlAnchor.click();
  };

  const handlePurgeHistory = () => {
    if (!user) return;
    if (window.confirm(`Are you sure you want to permanently erase all search history, saved bundles, and store clicks for ${user.email}? This cannot be undone.`)) {
      storageService.purgeUserData(user.email);
      setUserIntents([]);
      setUserStoreActivity([]);
      setUserBundles([]);
      setUserReceipts([]);
      alert('Your private data vault has been completely erased.');
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-brand-blue uppercase tracking-wider font-bold">
            <Shield className="w-4 h-4" />
            Personal User Profile & Privacy Security Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Account & Private Data Storage
          </h1>
          <p className="text-xs text-dim">
            Isolated cryptographic partition for <b className="text-white">{user?.email || 'Guest'}</b>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loginWithGoogle()}
            className="btn-secondary text-xs py-2 px-3.5 font-mono flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand-purple" />
            Switch Google Account
          </button>
        </div>
      </div>

      {/* User Identity Card with Security Badges */}
      <div className="glass-panel p-6 border-border-hi shadow-card-3d relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue via-brand-purple to-brand-cyan text-white font-black text-2xl flex items-center justify-center shadow-lg">
              {user?.avatarInitial || user?.name?.charAt(0) || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{user?.name}</h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-status-good-bg text-status-good font-bold border border-status-good/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {user?.authProvider === 'google' ? 'Google Verified OAuth' : 'Verified Profile'}
                </span>
              </div>
              <div className="text-xs text-dim font-mono">{user?.email}</div>
              <div className="text-[11px] text-dim2 font-mono flex items-center gap-1.5 pt-0.5">
                <Key className="w-3 h-3 text-brand-blue" />
                <span>Vault Encryption Key: </span>
                <span className="text-white font-mono">{user?.encryptionKeyId || 'ENC-256-AES-GCM-ISOLATED'}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-bg-panel border border-border text-xs font-mono space-y-1 sm:text-right">
            <div className="text-dim text-[10px] uppercase">Data Isolation Status</div>
            <div className="text-status-good font-bold flex items-center sm:justify-end gap-1">
              <Lock className="w-3.5 h-3.5" /> 100% Client-Side Partitioned
            </div>
            <div className="text-dim2 text-[10px]">Zero Cross-User Data Pollution</div>
          </div>
        </div>
      </div>

      {/* 2-Column Section: User Preferences & Multi-Store Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 cols: Profile Form & Guardrail Settings */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSave} className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-blue" />
              Shopping Rules & Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-dim">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-dim">Email Address (Google Identity)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="glass-input w-full p-2.5 text-dim font-mono bg-white/[0.02]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-dim">Default Maximum Budget Ceiling (₹)</label>
                <input
                  type="number"
                  value={defaultBudget}
                  onChange={(e) => setDefaultBudget(parseInt(e.target.value) || 2000)}
                  className="glass-input w-full p-2.5 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-dim">Connected Stores for Search</label>
                <div className="p-2.5 rounded-xl bg-bg-panel border border-border text-[11px] font-mono text-brand-blue">
                  Amazon India, Flipkart, Myntra, Nykaa, Savana, Meesho
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              {savedSuccess ? (
                <span className="text-status-good text-xs font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Updated successfully!
                </span>
              ) : <div />}

              <button type="submit" className="btn-primary text-xs py-2 px-5 font-bold flex items-center gap-1.5">
                <Save className="w-4 h-4" /> Save Preferences
              </button>
            </div>
          </form>

          {/* Privacy & Data Compliance Vault */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-status-good" />
              Privacy & GDPR Right to be Forgotten
            </h3>

            <p className="text-xs text-dim leading-relaxed">
              Every search, routine, and store transaction you perform is stored exclusively in your personal encrypted vault. You can export or erase your history anytime.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleExportData}
                className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-brand-blue" />
                Export My Private Vault (JSON)
              </button>

              <button
                type="button"
                onClick={handlePurgeHistory}
                className="p-2 rounded-lg bg-status-bad-bg border border-status-bad/40 text-status-bad text-xs font-semibold hover:brightness-110 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Erase My Private Data
              </button>
            </div>
          </div>
        </div>

        {/* Right 6 cols: User's Own Search, Store Clicks & Decision Receipts */}
        <div className="lg:col-span-6 space-y-6">
          {/* User's Own Outbound Store Clicks Activity */}
          <div className="glass-panel p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-4 h-4 text-brand-blue" />
                My Store Click & Buy Activity
              </h3>
              <span className="text-[10px] font-mono text-dim">{userStoreActivity.length}</span>
            </div>

            {userStoreActivity.length === 0 ? (
              <div className="py-6 text-center text-xs text-dim">
                No store clicks recorded yet. When you click "⚡ Buy on [Store]" on any product, it will be saved here.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {userStoreActivity.map((click) => (
                  <div
                    key={click.id}
                    className="p-2.5 rounded-xl bg-bg-panel border border-border flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-white truncate">{click.productName}</div>
                      <div className="text-[10px] text-dim font-mono">
                        {click.platformName} · ₹{click.price} · {new Date(click.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <a
                      href={click.productUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-blue hover:text-white p-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Own Recent Searches */}
          <div className="glass-panel p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-purple" />
                My Search History ({user?.name})
              </h3>
              <span className="text-[10px] font-mono text-dim">{userIntents.length}</span>
            </div>

            {userIntents.length === 0 ? (
              <div className="py-6 text-center text-xs text-dim">
                No searches logged in your vault yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {userIntents.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-bg-panel border border-border flex items-center justify-between text-xs"
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-white truncate">"{item.text}"</div>
                      <div className="text-[10px] text-dim font-mono">
                        {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Own Saved Bundles */}
          <div className="glass-panel p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-brand-cyan" />
                My Saved Bundles & Decision Receipts
              </h3>
              <span className="text-[10px] font-mono text-dim">{userBundles.length}</span>
            </div>

            {userBundles.length === 0 ? (
              <div className="py-6 text-center text-xs text-dim">
                No saved routines in this profile.
              </div>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {userBundles.map((b) => (
                  <div
                    key={b.id}
                    className="p-2.5 rounded-xl bg-bg-panel border border-border flex items-center justify-between text-xs"
                  >
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{b.name}</div>
                      <div className="text-[10px] text-dim font-mono">
                        ₹{b.finalTotal.toLocaleString('en-IN')} ({b.items.length} items)
                      </div>
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
