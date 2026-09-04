import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Sliders, Clock, User, LogOut, Menu, X, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAgent } from '../../context/AgentContext';

export const Navbar: React.FC = () => {
  const { user, openLoginModal, openSignupModal, loginWithGoogle, logout } = useAuth();
  const { setIsControlCenterOpen, setIsLedgerOpen } = useAgent();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'AI Agent Workspace', path: '/agent' },
    { label: 'Saved Bundles', path: '/bundles' },
    { label: 'Merchant Analytics', path: '/analytics' },
    { label: 'Architecture Overview', path: '/overview' }
  ];

  return (
    <nav className="sticky top-0 z-40 px-4 sm:px-8 lg:px-12 py-3.5 bg-[#05060b]/90 backdrop-blur-xl border-b border-border w-full">
      <div className="max-w-[1550px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue via-brand-purple to-brand-cyan p-[1.5px] shadow-glow-blue group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#05060b] rounded-[10px] flex items-center justify-center font-black text-brand-blue text-lg">
              ◆
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 font-extrabold text-lg text-white tracking-tight">
              <span>IntentFlow</span>
              <span className="text-brand-blue">AI</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                Live OS
              </span>
            </div>
            <div className="text-[10px] text-dim font-mono hidden sm:block">
              AGENTIC COMMERCE INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-dim">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-white transition-colors relative py-1 ${
                location.pathname === link.path ? 'text-brand-blue font-bold' : ''
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-blue to-brand-purple rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Action Tools & Auth Links (EXACT REPLICA OF USER IMAGE 1: Log in | Sign Up) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsControlCenterOpen(true)}
            className="btn-secondary text-xs py-2 px-3 hidden lg:flex items-center gap-1.5 font-mono"
            title="Agent Guardrails"
          >
            <Sliders className="w-3.5 h-3.5 text-brand-purple" />
            Guardrails
          </button>

          <button
            onClick={() => setIsLedgerOpen(true)}
            className="btn-secondary text-xs py-2 px-3 hidden lg:flex items-center gap-1.5 font-mono"
            title="Audit Ledger"
          >
            <Clock className="w-3.5 h-3.5 text-status-good" />
            Audit Ledger
          </button>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/agent"
                className="btn-primary text-xs py-2 px-4 hidden sm:inline-flex shadow-glow-blue font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Launch Agent
              </Link>

              {/* User Profile Badge */}
              <Link
                to="/settings"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-panel hover:bg-bg-panel-hi border border-border hover:border-brand-blue/40 transition-colors group cursor-pointer"
                title="View My Profile & Private Vault"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {user.avatarInitial || user.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors line-clamp-1">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-dim font-mono truncate max-w-[120px]">{user.email}</div>
                </div>
              </Link>

              {/* Explicit Log Out Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
                title="Log out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              {/* EXACT TEXT BUTTONS FROM USER SCREENSHOT 1: Log in | Sign Up */}
              <button
                onClick={openLoginModal}
                className="text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-white/5"
              >
                Log in
              </button>

              <button
                onClick={openSignupModal}
                className="text-xs sm:text-sm font-bold text-[#5b8cff] hover:text-[#9b7bff] transition-colors cursor-pointer px-3.5 py-1.5 rounded-xl bg-[#5b8cff]/15 hover:bg-[#5b8cff]/25 border border-[#5b8cff]/30 shadow-glow-blue"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl bg-bg-panel border border-border text-dim md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-border space-y-2 text-xs font-mono">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className="block p-2.5 rounded-lg hover:bg-bg-panel text-dim hover:text-brand-blue"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="p-2.5 rounded-lg bg-bg-panel text-white font-sans text-xs">
                <div className="font-bold">{user.name}</div>
                <div className="text-[10px] text-dim">{user.email}</div>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center gap-2 text-xs font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openLoginModal();
                  }}
                  className="btn-secondary flex-1 text-center justify-center py-2 text-xs"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openSignupModal();
                  }}
                  className="btn-primary flex-1 text-center justify-center py-2 text-xs"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
