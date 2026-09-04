import React, { useState, useEffect } from 'react';
import { X, UserPlus, ShieldCheck, Mail, User, Trash2, Globe, CheckCircle2, ChevronRight } from 'lucide-react';

export interface GoogleAccountItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarUrl?: string;
  bgColor: string;
}

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string; avatarUrl?: string; avatar: string; color: string }) => void;
}

const DEFAULT_DEVICE_ACCOUNTS: GoogleAccountItem[] = [
  {
    id: 'acc_default_1',
    name: 'Ananya Aditi',
    email: 'ananyaditi32@gmail.com',
    avatar: 'A',
    bgColor: 'bg-[#7c3aed]'
  }
];

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount
}) => {
  // Device-specific saved Google accounts
  const [deviceAccounts, setDeviceAccounts] = useState<GoogleAccountItem[]>(() => {
    try {
      const stored = localStorage.getItem('intentflow_device_saved_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_DEVICE_ACCOUNTS;
  });

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    setIsAddingNew(false);
    try {
      const stored = localStorage.getItem('intentflow_device_saved_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDeviceAccounts(parsed);
        }
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const saveAndSelectAccount = (name: string, email: string, avatarUrl?: string, bgColor?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address (e.g. name@gmail.com)');
      return;
    }

    const cleanName = name.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const colors = ['bg-[#7c3aed]', 'bg-[#2563eb]', 'bg-[#059669]', 'bg-[#dc2626]', 'bg-[#d97706]', 'bg-[#4f46e5]'];
    const chosenColor = bgColor || colors[Math.floor(Math.random() * colors.length)];

    const accountItem: GoogleAccountItem = {
      id: `acc_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: cleanName.charAt(0).toUpperCase(),
      avatarUrl,
      bgColor: chosenColor
    };

    // Save to device storage
    const updated = [accountItem, ...deviceAccounts.filter((a) => a.email !== cleanEmail)];
    setDeviceAccounts(updated);
    try {
      localStorage.setItem('intentflow_device_saved_google_accounts', JSON.stringify(updated));
    } catch {}

    onSelectAccount({
      name: accountItem.name,
      email: accountItem.email,
      avatarUrl: accountItem.avatarUrl,
      avatar: accountItem.avatar,
      color: accountItem.bgColor
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your Google email address');
      return;
    }
    saveAndSelectAccount(nameInput, emailInput);
  };

  const removeDeviceAccount = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = deviceAccounts.filter((a) => a.email !== email);
    setDeviceAccounts(filtered);
    try {
      localStorage.setItem('intentflow_device_saved_google_accounts', JSON.stringify(filtered));
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans select-none">
      {/* AUTHENTIC GOOGLE IDENTITY / OAUTH MODAL */}
      <div className="bg-[#202124] text-[#e8eaed] max-w-[440px] w-full rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.85)] border border-[#3c4043] overflow-hidden relative">
        
        {/* Top Google Header */}
        <div className="pt-7 pb-4 px-6 relative flex flex-col items-center text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Authentic Google "G" Logo */}
          <div className="w-12 h-12 rounded-full bg-[#303134] border border-[#3c4043] flex items-center justify-center shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </div>

          <h2 className="text-[20px] font-normal text-white mt-3 tracking-normal">
            Sign in with Google
          </h2>
          <p className="text-[13px] text-[#9aa0a6] mt-1">
            Choose an account to continue to <span className="text-[#8ab4f8] font-medium">IntentFlow AI</span>
          </p>
        </div>

        {/* View 1: Authentic Google Account Chooser List */}
        {!isAddingNew ? (
          <div className="px-6 pb-6">
            <div className="divide-y divide-[#3c4043] rounded-2xl border border-[#3c4043] bg-[#282a2d] overflow-hidden mb-3">
              {deviceAccounts.map((acc) => (
                <div
                  key={acc.email}
                  onClick={() =>
                    saveAndSelectAccount(acc.name, acc.email, acc.avatarUrl, acc.bgColor)
                  }
                  className="w-full py-3.5 px-4 flex items-center justify-between hover:bg-[#35373b] transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    <div className={`w-10 h-10 rounded-full ${acc.bgColor} text-white font-semibold text-base flex items-center justify-center flex-shrink-0 shadow-md`}>
                      {acc.avatar}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="text-[14px] font-medium text-white group-hover:text-[#8ab4f8] transition-colors truncate">
                        {acc.name}
                      </div>
                      <div className="text-[12px] text-[#9aa0a6] truncate font-mono mt-0.5">
                        {acc.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
                      Ready
                    </span>
                    {deviceAccounts.length > 1 && (
                      <span
                        onClick={(e) => removeDeviceAccount(acc.email, e)}
                        title="Remove from this device"
                        className="p-1.5 rounded-full hover:bg-white/10 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#9aa0a6] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}

              {/* Use Another Account Option */}
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(true);
                  setErrorMsg('');
                }}
                className="w-full py-3.5 px-4 flex items-center gap-3.5 text-left hover:bg-[#35373b] transition-colors group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#303134] border border-[#3c4043] text-gray-300 font-medium flex items-center justify-center flex-shrink-0 group-hover:border-[#8ab4f8] transition-colors">
                  <UserPlus className="w-4 h-4 text-[#8ab4f8]" />
                </div>
                <div>
                  <div className="text-[13px] font-medium text-white group-hover:text-[#8ab4f8] transition-colors">
                    Use another Google account
                  </div>
                  <div className="text-[11px] text-[#9aa0a6]">
                    Sign in with any email on this device
                  </div>
                </div>
              </button>
            </div>

            {/* Quick 1-Click Guest Option */}
            <button
              type="button"
              onClick={() =>
                saveAndSelectAccount('Public Shopper', 'public.shopper@intentflow.ai', undefined, 'bg-[#0284c7]')
              }
              className="w-full py-2.5 px-4 rounded-xl bg-[#282a2d] hover:bg-[#35373b] border border-[#3c4043] text-left flex items-center justify-between text-xs text-[#8ab4f8] font-medium transition-colors cursor-pointer mb-4"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#8ab4f8]" />
                <span>Explore as Public Demo Shopper</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#8ab4f8]" />
            </button>

            {/* Google Notice Text */}
            <p className="text-[11px] text-[#9aa0a6] leading-relaxed mb-4 text-center">
              To continue, Google will share your name, email address, and profile preferences with IntentFlow AI.
            </p>

            {/* Footer Status */}
            <div className="pt-3 border-t border-[#3c4043] flex items-center justify-between text-[11px] text-[#9aa0a6]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted Vault
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Add New Google Account Form */
          <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
            <div className="text-sm font-medium text-white">
              Enter your Google Account email:
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-[11px] text-[#9aa0a6] mb-1">Your Full Name (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Aditi Gupta"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-[#282a2d] border border-[#3c4043] text-white text-xs outline-none focus:border-[#8ab4f8]"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[#9aa0a6] mb-1">Google Email Address (*)</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 rounded-xl bg-[#282a2d] border border-[#3c4043] text-white text-xs outline-none focus:border-[#8ab4f8]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Will authenticate and create your private isolated data vault on this device.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-[#3c4043] hover:bg-[#35373b] text-xs text-[#e8eaed] cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] py-2.5 px-4 rounded-xl bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Continue with Google →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
