import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, updatePreferences } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Skincare', 'Electronics']);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['Value for Money', 'Best Quality']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Amazon', 'Nykaa', 'Flipkart']);
  const [skinType, setSkinType] = useState<string>('Oily');

  if (!isOnboardingOpen) return null;

  const interestsList = ['Skincare', 'Beauty', 'Electronics', 'Gaming', 'Travel', 'Fashion', 'Productivity', 'Home'];
  const prioritiesList = ['Best Price', 'Best Quality', 'Value for Money', 'Fast Delivery', 'Sustainability', 'Trending'];
  const platformsList = ['Amazon', 'Flipkart', 'Nykaa', 'Meesho', 'Ajio'];
  const skinTypesList = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const togglePriority = (item: string) => {
    setSelectedPriorities(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const togglePlatform = (item: string) => {
    setSelectedPlatforms(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleFinish = () => {
    updatePreferences({
      interests: selectedInterests,
      shoppingPriorities: selectedPriorities,
      preferredPlatforms: selectedPlatforms,
      skinType
    });
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-hi max-w-xl w-full p-6 sm:p-8 border-border-hi shadow-2xl relative">
        {/* Step indicator */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-blue text-bg text-xs font-bold flex items-center justify-center font-mono">
              {step}
            </span>
            <span className="text-xs font-mono text-dim uppercase tracking-wider">Step {step} of 4</span>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-xs text-dim hover:text-white"
          >
            Skip for now
          </button>
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">What do you usually shop for?</h3>
            <p className="text-xs text-dim">Select the categories you'd like your shopping agent to specialize in.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {interestsList.map(item => {
                const active = selectedInterests.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      active
                        ? 'bg-brand-blue/20 border-brand-blue text-white shadow-glow-blue'
                        : 'bg-bg-panel border-border text-dim hover:border-border-hi'
                    }`}
                  >
                    {active && '✓ '} {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Shopping Priorities */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">What matters most when you shop?</h3>
            <p className="text-xs text-dim">We use these weights in product scoring and bundle optimization.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              {prioritiesList.map(item => {
                const active = selectedPriorities.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => togglePriority(item)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      active
                        ? 'bg-brand-purple/20 border-brand-purple text-white shadow-glow-purple'
                        : 'bg-bg-panel border-border text-dim hover:border-border-hi'
                    }`}
                  >
                    {active && '✓ '} {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Platform Preferences */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Preferred Shopping Platforms</h3>
            <p className="text-xs text-dim">IntentFlow compares prices across these verified marketplace feeds.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {platformsList.map(item => {
                const active = selectedPlatforms.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => togglePlatform(item)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      active
                        ? 'bg-brand-blue/20 border-brand-blue text-white'
                        : 'bg-bg-panel border-border text-dim hover:border-border-hi'
                    }`}
                  >
                    {active && '✓ '} {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Skin Profile (Optional Personalization) */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Personalize for Skincare Routines</h3>
            <p className="text-xs text-dim">Used strictly for ingredient safety and formulation matching.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {skinTypesList.map(item => {
                const active = skinType === item;
                return (
                  <button
                    key={item}
                    onClick={() => setSkinType(item)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      active
                        ? 'bg-status-good-bg border-status-good text-status-good font-bold'
                        : 'bg-bg-panel border-border text-dim hover:border-border-hi'
                    }`}
                  >
                    {active && '● '} {item} Skin
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              ← Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary text-xs py-1.5 px-4"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="btn-primary text-xs py-1.5 px-5 font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Complete Setup & Enter Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
