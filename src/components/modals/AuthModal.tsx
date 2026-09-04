import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Phone, Sparkles, Check, ArrowRight, ShieldCheck, RefreshCw, KeyRound, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { emailAuthService } from '../../services/emailAuthService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { login, signup, loginWithGoogle, loading } = useAuth();
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [otpChannel, setOtpChannel] = useState<'email' | 'sms'>('email');
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  // OTP Verification state
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [targetInput, setTargetInput] = useState<string>('ananyaditi32@gmail.com');
  const [otpFullName, setOtpFullName] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(0);
  const [latestOtpReceived, setLatestOtpReceived] = useState<string | null>(null);

  // Password Login state
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(true);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(true);

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpStep('request');
    setOtpDigits(['', '', '', '', '', '']);
    setLatestOtpReceived(null);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  // 1. Send OTP via SMTP Email or SMS
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = targetInput.trim();
    if (!clean) {
      setErrorMsg(otpChannel === 'email' ? 'Please enter your email address' : 'Please enter your phone number');
      return;
    }

    setSubmitting(true);
    try {
      const res = await emailAuthService.sendOtp(clean, otpChannel);
      setOtpStep('verify');
      setLatestOtpReceived(res.otpCode);
      setCountdown(45);
      setSuccessMsg(res.message);

      setTimeout(() => {
        pinRefs.current[0]?.focus();
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch verification code');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Handle 6-Digit PIN input
  const handlePinChange = (index: number, val: string) => {
    const num = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = num;
    setOtpDigits(newDigits);
    setErrorMsg('');

    if (num && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }

    if (num && index === 5 && newDigits.every((d) => d.length === 1)) {
      handleVerifyPin(newDigits.join(''));
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    if (pasted.length === 6) {
      pinRefs.current[5]?.focus();
      handleVerifyPin(pasted);
    }
  };

  const handleAutoFillOtp = () => {
    if (!latestOtpReceived) return;
    const digits = latestOtpReceived.split('');
    setOtpDigits(digits);
    handleVerifyPin(latestOtpReceived);
  };

  const handleVerifyPin = async (code: string) => {
    setSubmitting(true);
    setErrorMsg('');

    const res = emailAuthService.verifyOtp(targetInput, code);
    if (res.success) {
      setSuccessMsg('Code verified! Logging you in…');
      setTimeout(async () => {
        const cleanName = otpFullName.trim() || targetInput.split('@')[0];
        await signup(cleanName, targetInput.toLowerCase());
        onClose();
      }, 400);
    } else {
      setErrorMsg(res.error || 'Invalid 6-digit code');
      setSubmitting(false);
    }
  };

  // 3. Handle traditional password login/signup
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        if (!username.trim() || !email.trim() || !password.trim()) {
          setErrorMsg('Please fill in all required fields.');
          return;
        }
        if (password !== repeatPassword) {
          setErrorMsg('Passwords do not match.');
          return;
        }
        if (!acceptTerms) {
          setErrorMsg('Please accept the Terms and Conditions.');
          return;
        }
        await signup(username.trim(), email.trim(), password);
      } else {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter your email and password.');
          return;
        }
        await login(email.trim(), password);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleClick = () => {
    onClose();
    loginWithGoogle();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#ffffff] text-[#1a1a1a] max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row border border-black/10 min-h-[600px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-black transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= LEFT BRAND PANEL (IntentFlow AI SaaS Branding) ================= */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#0c0e18] via-[#111424] to-[#0a0d1a] p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative text-white">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#5b8cff] font-bold">
              <span>◆ Live Agentic OS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
              IntentFlow <span className="text-[#5b8cff]">AI</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              From Customer Intent to Trusted Multi-Store Transaction.
            </p>
          </div>

          {/* Center Brand Highlights */}
          <div className="py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] p-[1.5px] shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full bg-[#0d1020] rounded-[14px] flex items-center justify-center font-black text-[#5b8cff] text-xl">
                ◆
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span>Instant 6-Digit Email & SMS OTP Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                <span>256-Bit Cryptographic Device Data Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>Zero Password Phishing Exposure</span>
              </div>
            </div>
          </div>

          {/* Bottom toggle link */}
          <div className="text-xs text-gray-400 pt-4 border-t border-white/10">
            {mode === 'signup' ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('login');
                  }}
                  className="font-bold text-[#8ab4f8] hover:underline cursor-pointer"
                >
                  Log in now
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setMode('signup');
                  }}
                  className="font-bold text-[#8ab4f8] hover:underline cursor-pointer"
                >
                  Register now
                </button>
              </span>
            )}
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className="md:w-7/12 bg-[#ffffff] p-7 sm:p-9 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div>
            {/* Top Tabs: [ ⚡ 6-Digit OTP Verification ] vs [ 🔒 Password ] */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('otp');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMethod === 'otp'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>⚡</span>
                <span>Instant OTP Code</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">Fast</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('password');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMethod === 'password'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
            </div>

            {/* Error or Success notification */}
            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                {successMsg}
              </div>
            )}

            {/* ================= METHOD 1: 6-DIGIT EMAIL / SMS OTP AUTHENTICATION ================= */}
            {authMethod === 'otp' ? (
              <div>
                {/* Live Toast showing dispatched OTP for instant 1-click testing */}
                {latestOtpReceived && otpStep === 'verify' && (
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between animate-fade-in shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {otpChannel === 'email' ? 'SMTP Code Delivered:' : 'SMS Code Delivered:'}{' '}
                          <span className="text-blue-600 font-mono font-black text-sm tracking-widest">{latestOtpReceived}</span>
                        </div>
                        <div className="text-[10px] text-gray-500">Security code sent to {targetInput}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="py-1 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-transform active:scale-95 cursor-pointer shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Auto-Fill</span>
                    </button>
                  </div>
                )}

                {otpStep === 'request' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-xs font-sans">
                    {/* Channel Selector: Email (SMTP) vs Mobile SMS */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpChannel('email');
                          setTargetInput('ananyaditi32@gmail.com');
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          otpChannel === 'email'
                            ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email (SMTP Relay)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpChannel('sms');
                          setTargetInput('+91 98765 43210');
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          otpChannel === 'sms'
                            ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>SMS Mobile Message</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                        YOUR FULL NAME (OPTIONAL)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aditi Gupta"
                        value={otpFullName}
                        onChange={(e) => setOtpFullName(e.target.value)}
                        className="w-full py-2.5 px-3 text-sm text-black border border-gray-300 rounded-xl focus:border-black outline-none bg-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                        {otpChannel === 'email' ? 'EMAIL ADDRESS (*)' : 'MOBILE NUMBER (*)'}
                      </label>
                      <input
                        type={otpChannel === 'email' ? 'email' : 'tel'}
                        required
                        placeholder={otpChannel === 'email' ? 'name@gmail.com' : '+91 98765 43210'}
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        className="w-full py-2.5 px-3 text-sm text-black border border-gray-300 rounded-xl focus:border-black outline-none bg-transparent transition-colors"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        We will send a 6-digit cryptographic security code to this {otpChannel === 'email' ? 'email' : 'phone'}.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-4 rounded-xl bg-[#1d1d1f] hover:bg-[#000000] text-white font-bold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Security OTP…</span>
                        </span>
                      ) : (
                        <span>Send 6-Digit Verification Code →</span>
                      )}
                    </button>
                  </form>
                ) : (
                  /* 6-Digit PIN Verification Screen */
                  <div className="space-y-4 text-xs font-sans">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">Enter Verification Code</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Sent to <span className="font-semibold text-gray-800">{targetInput}</span>
                      </div>
                    </div>

                    {/* 6 Individual PIN Boxes */}
                    <div className="flex justify-center gap-2.5 pt-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            pinRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handlePinChange(idx, e.target.value)}
                          onKeyDown={(e) => handlePinKeyDown(idx, e)}
                          onPaste={handlePinPaste}
                          className={`w-11 h-13 text-center text-lg font-bold font-mono rounded-xl border ${
                            digit ? 'border-blue-600 bg-blue-50/50 text-blue-900' : 'border-gray-300 text-gray-900'
                          } outline-none focus:border-black transition-all`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleVerifyPin(otpDigits.join(''))}
                      disabled={submitting || otpDigits.some((d) => !d)}
                      className="w-full py-3 px-4 rounded-xl bg-[#1d1d1f] hover:bg-[#000000] text-white font-bold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? 'Verifying…' : 'Verify & Log In →'}
                    </button>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <button
                        type="button"
                        onClick={() => setOtpStep('request')}
                        className="text-gray-600 hover:text-black hover:underline cursor-pointer"
                      >
                        ← Change {otpChannel === 'email' ? 'Email' : 'Number'}
                      </button>

                      <button
                        type="button"
                        disabled={countdown > 0 || submitting}
                        onClick={() => handleSendOtp()}
                        className={`font-semibold cursor-pointer ${
                          countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
                        }`}
                      >
                        {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ================= METHOD 2: TRADITIONAL PASSWORD AUTHENTICATION ================= */
              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs font-sans">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      FULL NAME (*)
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. Aditi Gupta"
                      className="w-full py-2 px-1 text-sm text-black border-b border-gray-300 focus:border-black outline-none bg-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full py-2 px-1 text-sm text-black border-b border-gray-300 focus:border-black outline-none bg-transparent"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full py-2 px-1 text-sm text-black border-b border-gray-300 focus:border-black outline-none bg-transparent font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-2 text-gray-400 hover:text-black"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      REPEAT PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full py-2 px-1 text-sm text-black border-b border-gray-300 focus:border-black outline-none bg-transparent font-mono"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#1d1d1f] hover:bg-[#000000] text-white font-bold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer mt-2"
                >
                  {loading ? 'Authenticating…' : mode === 'signup' ? 'Create Account' : 'Log in'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
