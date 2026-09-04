import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TiltCard } from '../../components/common/TiltCard';

export const SignupPage: React.FC = () => {
  const { signup, loginWithGoogle, openEmailOtpModal, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    await signup(name.trim(), email.trim(), password);
    navigate('/');
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
  };

  const strength = password.length >= 8 ? (password.length >= 12 ? 'Strong' : 'Medium') : 'Weak';

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 sm:px-8 py-12 max-w-6xl mx-auto">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Side (7 cols): Information */}
        <div className="lg:col-span-7 space-y-6 hidden lg:block pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-brand-purple text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Get Started Free · Autonomous Shopping
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Stop searching across 10 apps. Let your AI agent handle it.
          </h1>

          <p className="text-dim text-sm leading-relaxed max-w-xl">
            Create an account to save custom skin sensitivities, budget ceilings, and get single-click buy links on Amazon, Nykaa, Myntra, Savana, and Flipkart.
          </p>

          <div className="space-y-3 pt-2 text-xs font-mono text-dim">
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-status-good" />
              <span>Full access to 50+ multi-category catalog items</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Check className="w-4 h-4 text-status-good" />
              <span>Chemical conflict detection & ingredient safety scoring</span>
            </div>
          </div>
        </div>

        {/* Right Side (5 cols): Registration Card */}
        <div className="lg:col-span-5 w-full">
          <TiltCard className="p-8 sm:p-10 border-border-hi shadow-2xl space-y-6" glowColor="rgba(155, 123, 255, 0.25)">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
              <p className="text-xs text-dim mt-1">One-click Google authentication or manual sign up</p>
            </div>

            {/* SMTP 6-DIGIT EMAIL OTP SIGNUP */}
            <button
              type="button"
              onClick={() => openEmailOtpModal(email)}
              className="w-full py-3 px-4 rounded-xl bg-brand-purple/15 hover:bg-brand-purple/25 text-brand-purple border border-brand-purple/30 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <span>⚡</span>
              <span>Register with 6-Digit Email & SMS OTP</span>
            </button>

            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <span className="relative px-3 bg-[#0a0d1a] text-[10px] font-mono text-dim2 uppercase tracking-wider">
                OR REGISTER WITH PASSWORD
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-dim">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full py-2.5 pl-9 pr-3 text-white"
                  />
                  <User className="w-4 h-4 text-dim2 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-dim">Work or Personal Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="aditi@company.com"
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
                  {password && (
                    <span className={`text-[10px] font-mono font-bold ${strength === 'Strong' ? 'text-status-good' : strength === 'Medium' ? 'text-status-warn' : 'text-status-bad'}`}>
                      {strength}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full py-2.5 pl-9 pr-3 text-white font-mono"
                  />
                  <Lock className="w-4 h-4 text-dim2 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-2.5 text-xs font-bold shadow-glow-blue mt-2"
              >
                {loading ? 'Creating Account…' : 'Create Free Account →'}
              </button>
            </form>

            <div className="text-center text-xs text-dim pt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-blue font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
};
