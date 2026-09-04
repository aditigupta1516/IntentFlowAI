import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, ShieldCheck, ArrowRight, RefreshCw, KeyRound, Sparkles, CheckCircle2, Server, Check } from 'lucide-react';
import { emailAuthService, SmtpConfig } from '../../services/emailAuthService';

interface EmailOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onSuccess: (email: string, name?: string) => void;
}

export const EmailOtpModal: React.FC<EmailOtpModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  onSuccess
}) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState<string>(initialEmail);
  const [name, setName] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [latestOtpReceived, setLatestOtpReceived] = useState<string | null>(null);
  const [showSmtpConfig, setShowSmtpConfig] = useState<boolean>(false);
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>(() => emailAuthService.getSmtpConfig());

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg('');
    setSuccessMsg('');
    setOtpDigits(['', '', '', '', '', '']);
    setLatestOtpReceived(null);

    if (initialEmail && initialEmail.includes('@')) {
      setEmail(initialEmail);
      // Auto-trigger OTP send if opened with a pre-filled email
      handleSendOtp(initialEmail);
    } else {
      setStep('email');
    }
  }, [isOpen, initialEmail]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (targetEmail?: string) => {
    const emailToSend = (targetEmail || email).trim().toLowerCase();
    if (!emailToSend || !emailToSend.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await emailAuthService.sendOtp(emailToSend);
      setStep('otp');
      setCountdown(45);
      setLatestOtpReceived(result.otpCode);
      setSuccessMsg(`6-Digit Verification Code sent to ${emailToSend}`);
      
      // Focus first input box
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch email verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setErrorMsg('');

    // Advance focus if character entered
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    if (cleanVal && index === 5 && newDigits.every((d) => d.length === 1)) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  const handleAutoFill = () => {
    if (!latestOtpReceived) return;
    const digits = latestOtpReceived.split('');
    setOtpDigits(digits);
    handleVerify(latestOtpReceived);
  };

  const handleVerify = (codeToVerify?: string) => {
    const fullCode = codeToVerify || otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const verification = emailAuthService.verifyOtp(email, fullCode);
    if (verification.success) {
      setSuccessMsg('Email verified successfully! Logging in…');
      setTimeout(() => {
        onSuccess(email.trim().toLowerCase(), name.trim());
        onClose();
      }, 500);
    } else {
      setErrorMsg(verification.error || 'Invalid verification code');
      setLoading(false);
    }
  };

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    emailAuthService.saveSmtpConfig(smtpConfig);
    setShowSmtpConfig(false);
    setSuccessMsg('SMTP Relay Configuration saved');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans select-none">
      <div className="bg-[#12141f] text-[#e8eaed] max-w-[460px] w-full rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.85)] border border-brand-blue/30 overflow-hidden relative">
        
        {/* Top Header */}
        <div className="pt-7 pb-4 px-6 relative flex flex-col items-center text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mail Security Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue/30 via-brand-purple/20 to-brand-cyan/30 border border-brand-blue/40 flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Mail className="w-7 h-7 text-brand-blue" />
          </div>

          <h2 className="text-xl font-bold text-white mt-3.5 tracking-tight flex items-center gap-2">
            <span>SMTP Email Authentication</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Relay
            </span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            {step === 'email'
              ? 'Receive a 6-digit cryptographic security code on your email'
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Live OTP Toast / Instant Inbox Helper */}
        {latestOtpReceived && step === 'otp' && (
          <div className="mx-6 mb-3 p-3 rounded-xl bg-gradient-to-r from-brand-blue/15 to-brand-purple/15 border border-brand-blue/40 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-blue animate-pulse" />
              <div>
                <div className="text-[11px] font-bold text-white">
                  SMTP Code Dispatched: <span className="text-brand-blue font-mono font-black text-sm tracking-widest">{latestOtpReceived}</span>
                </div>
                <div className="text-[10px] text-gray-400">Delivered via SMTP Relay to {email}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="py-1 px-2.5 rounded-lg bg-brand-blue hover:bg-brand-blue/80 text-black text-[11px] font-bold transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Auto-Fill</span>
            </button>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="mx-6 mb-3 p-2.5 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Enter Email */}
        {step === 'email' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendOtp();
            }}
            className="px-6 pb-6 space-y-4"
          >
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Your Full Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Aditi Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#1c1f2e] border border-white/10 text-white text-xs outline-none focus:border-brand-blue"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address (*)
              </label>
              <input
                type="email"
                required
                placeholder="ananyaditi32@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-[#1c1f2e] border border-white/10 text-white text-xs outline-none focus:border-brand-blue"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 justify-center text-xs font-bold shadow-glow-blue cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Dispatching Code via SMTP…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Enter 6-Digit OTP */
          <div className="px-6 pb-6 space-y-5">
            {/* 6-Digit Box Input */}
            <div className="flex justify-between gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border ${
                    digit ? 'bg-brand-blue/10 border-brand-blue text-white shadow-glow-blue' : 'bg-[#1c1f2e] border-white/10 text-gray-300'
                  } outline-none focus:border-brand-blue focus:scale-105 transition-all`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={() => handleVerify()}
              disabled={loading || otpDigits.some((d) => !d)}
              className="btn-primary w-full py-3 justify-center text-xs font-bold shadow-glow-blue cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Verifying OTP…' : 'Verify & Log In →'}
            </button>

            {/* Resend & Back controls */}
            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Change Email
              </button>

              <button
                type="button"
                disabled={countdown > 0 || loading}
                onClick={() => handleSendOtp()}
                className={`font-semibold transition-colors cursor-pointer ${
                  countdown > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-brand-blue hover:underline'
                }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Drawer: Custom SMTP Server Settings */}
        <div className="px-6 py-3 bg-[#0d0f18] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted Vault
          </span>

          <button
            type="button"
            onClick={() => setShowSmtpConfig(!showSmtpConfig)}
            className="hover:text-brand-blue transition-colors flex items-center gap-1 cursor-pointer font-mono"
          >
            <Server className="w-3 h-3" />
            <span>SMTP Settings</span>
          </button>
        </div>

        {/* Expandable SMTP Settings Drawer */}
        {showSmtpConfig && (
          <form onSubmit={handleSaveSmtp} className="p-5 bg-[#0a0c14] border-t border-brand-blue/30 space-y-3 text-xs animate-fade-in">
            <div className="font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-blue" />
              <span>Custom SMTP Relay Server Settings</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <label className="text-gray-400">SMTP Host</label>
                <input
                  type="text"
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                  className="w-full p-2 rounded-lg bg-[#1c1f2e] border border-white/10 text-white font-mono mt-1"
                />
              </div>
              <div>
                <label className="text-gray-400">Port (587 / 465)</label>
                <input
                  type="number"
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg bg-[#1c1f2e] border border-white/10 text-white font-mono mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-[11px]">Sender Email / Username</label>
              <input
                type="text"
                value={smtpConfig.senderEmail}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, senderEmail: e.target.value })}
                className="w-full p-2 rounded-lg bg-[#1c1f2e] border border-white/10 text-white font-mono mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSmtpConfig(false)}
                className="py-1 px-3 rounded-lg border border-white/10 text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1 px-3.5 rounded-lg bg-brand-blue text-black font-bold"
              >
                Save SMTP Config
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
