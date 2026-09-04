import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, Eye, EyeOff, Store, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TiltCard } from '../../components/common/TiltCard';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, openEmailOtpModal, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await login(email.trim(), password);
    navigate('/');
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 sm:px-8 py-12 max-w-6xl mx-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Side (7 cols): Venture-grade Visual & Live Multi-Store Connectors */}
        <div className="lg:col-span-7 space-y-6 hidden lg:block pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-xs font-mono font-bold shadow-glow-blue">
            <Sparkles className="w-3.5 h-3.5" />
            Venture-Grade Agentic Security · Track 1
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your personal AI shopping agent with multi-store links.
          </h1>

          <p className="text-dim text-sm leading-relaxed max-w-xl">
            Authenticate to access your customized skin routines, budget guardrails, verified 1-click buy links on <b className="text-white">Amazon, Nykaa, Myntra, Savana, and Flipkart</b>, and cryptographic Decision Receipts.
          </p>

          <div className="grid grid-cols-2 gap-3.5 pt-2 text-xs font-mono text-dim max-w-lg">
            <div className="p-3 rounded-xl bg-bg-panel border border-border flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-status-good flex-shrink-0" />
              <span>Zero credential exposure to stores</span>
            </div>
            <div className="p-3 rounded-xl bg-bg-panel border border-border flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span>Sha-256 Decision Receipt ledger</span>
            </div>
          </div>
        </div>

        {/* Right Side (5 cols): Expanded Login Card */}
        <div className="lg:col-span-5 w-full">
          <TiltCard className="p-8 sm:p-10 border-border-hi shadow-2xl space-y-6" glowColor="rgba(91, 140, 255, 0.25)">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Sign In</h2>
              <p className="text-xs text-dim mt-1">Select your Google Account or enter credentials</p>
            </div>

            {/* SMTP 6-DIGIT EMAIL OTP LOGIN */}
            <button
              type="button"
              onClick={() => openEmailOtpModal(email)}
              className="w-full py-3 px-4 rounded-xl bg-brand-blue/15 hover:bg-brand-blue/25 text-brand-blue border border-brand-blue/30 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <span>⚡</span>
              <span>Sign In with 6-Digit Email & SMS OTP</span>
            </button>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <span className="relative px-3 bg-[#0a0d1a] text-[10px] font-mono text-dim2 uppercase tracking-wider">
                OR SIGN IN WITH PASSWORD
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-dim">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full py-2.5 pl-9 pr-3 text-white"
                  />
                  <Mail className="w-4 h-4 text-dim2 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-dim">Password</label>
                  <span className="text-[11px] text-brand-blue cursor-pointer hover:underline">Forgot?</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full py-2.5 pl-9 pr-10 text-white font-mono"
                  />
                  <Lock className="w-4 h-4 text-dim2 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-dim hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold shadow-glow-blue mt-2"
              >
                {loading ? 'Authenticating…' : 'Sign In to Dashboard →'}
              </button>
            </form>

            <div className="text-center text-xs text-dim pt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-blue font-semibold hover:underline">
                Create Account
              </Link>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
