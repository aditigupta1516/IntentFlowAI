import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertOctagon, RefreshCw, Bookmark, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAgent } from '../../context/AgentContext';
import { storageService } from '../../services/storageService';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, bundle, addOn, addOnAccepted, decisionReceipt, intentText } = useAgent();
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'authorizing' | 'success' | 'failed'>('idle');
  const [orderId, setOrderId] = useState<string>('');

  if (!isCheckoutOpen || !bundle) return null;

  const totalAmount = bundle.finalTotal + (addOnAccepted && addOn ? addOn.item.bestPrice : 0);

  const simulatePayment = (outcome: 'success' | 'failed') => {
    setPaymentState('processing');
    setTimeout(() => {
      setPaymentState('authorizing');
      setTimeout(() => {
        if (outcome === 'success') {
          const generatedOrderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
          setOrderId(generatedOrderId);
          setPaymentState('success');

          // Trigger celebratory confetti
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#5b8cff', '#9b7bff', '#34d399']
          });

          // Save purchase event
          storageService.confirmPurchase({
            orderId: generatedOrderId,
            bundleId: bundle.id,
            intentText,
            totalAmount,
            itemCount: bundle.items.length + (addOnAccepted ? 1 : 0),
            items: bundle.items.map(i => ({ name: i.name, price: i.bestPrice }))
          });
        } else {
          setPaymentState('failed');
        }
      }, 900);
    }, 900);
  };

  const resetCheckout = () => {
    setPaymentState('idle');
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-hi max-w-lg w-full p-6 border-border-hi shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center text-brand-blue font-bold">
              ₹
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Razorpay Secure Checkout</h3>
              <p className="text-[11px] text-dim font-mono">Simulated Merchant Gateway · IntentFlow AI</p>
            </div>
          </div>
          {paymentState !== 'processing' && paymentState !== 'authorizing' && (
            <button
              onClick={resetCheckout}
              className="p-1.5 rounded-lg bg-bg-panel hover:bg-bg-panel-hi text-dim hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content States */}
        <div className="py-6">
          {paymentState === 'idle' && (
            <div className="text-center space-y-5">
              <div>
                <div className="text-xs text-dim mb-1 font-mono uppercase tracking-wider">Total Authorized Payable</div>
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-status-good mt-1 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Budget Constraint Verified (≤ ₹{decisionReceipt?.budget.toLocaleString('en-IN')})
                </div>
              </div>

              {/* Summary breakdown box */}
              <div className="p-3.5 rounded-xl bg-bg-panel border border-border text-xs text-left space-y-2">
                <div className="flex justify-between text-dim">
                  <span>Selected Products ({bundle.items.length})</span>
                  <span className="text-white font-mono">₹{bundle.finalTotal.toLocaleString('en-IN')}</span>
                </div>
                {addOnAccepted && addOn && (
                  <div className="flex justify-between text-brand-purple">
                    <span>+ Add-on: {addOn.item.name}</span>
                    <span className="font-mono">₹{addOn.item.bestPrice.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex justify-between font-bold text-white">
                  <span>Authorized Merchant Total</span>
                  <span className="text-brand-blue font-mono">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Simulation triggers */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => simulatePayment('success')}
                  className="btn-primary w-full justify-center py-2.5 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Simulate Successful Payment (200 OK)
                </button>
                <button
                  onClick={() => simulatePayment('failed')}
                  className="btn-secondary w-full justify-center py-2 text-xs text-dim hover:text-white"
                >
                  Simulate Bank Failure / Recovery Flow
                </button>
              </div>
            </div>
          )}

          {(paymentState === 'processing' || paymentState === 'authorizing') && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-border border-t-brand-blue animate-spin mx-auto" />
              <div>
                <h4 className="text-base font-bold text-white">
                  {paymentState === 'processing' ? 'Encrypting & Routing Transaction…' : 'Authorizing with Issuing Bank…'}
                </h4>
                <p className="text-xs text-dim font-mono mt-1">Please keep this window open</p>
              </div>
            </div>
          )}

          {paymentState === 'success' && (
            <div className="text-center space-y-4 animate-scale-up">
              <div className="w-14 h-14 rounded-full bg-status-good-bg text-status-good border border-status-good/40 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Transaction Confirmed ✓</h3>
                <p className="text-xs text-dim">Your optimized bundle has been securely fulfilled.</p>
              </div>

              <div className="p-4 rounded-xl bg-bg-panel border border-border text-xs text-left font-mono space-y-2">
                <div className="flex justify-between"><span className="text-dim">Order ID</span><b className="text-white">{orderId}</b></div>
                <div className="flex justify-between"><span className="text-dim">Decision ID</span><b className="text-brand-blue">{decisionReceipt?.decisionId}</b></div>
                <div className="flex justify-between"><span className="text-dim">Settled Amount</span><b className="text-white">₹{totalAmount.toLocaleString('en-IN')}</b></div>
                <div className="flex justify-between"><span className="text-dim">Products Fulfilled</span><b className="text-white">{bundle.items.length + (addOnAccepted ? 1 : 0)} items</b></div>
              </div>

              <button
                onClick={resetCheckout}
                className="btn-primary w-full justify-center py-2.5 text-xs font-semibold"
              >
                Done & Return to Workspace
              </button>
            </div>
          )}

          {paymentState === 'failed' && (
            <div className="space-y-4 animate-scale-up">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-status-bad-bg text-status-bad border border-status-bad/40 flex items-center justify-center mx-auto mb-2 text-xl">
                  ✕
                </div>
                <h3 className="text-base font-bold text-white">IntentFlow Recovery Agent</h3>
                <p className="text-xs text-dim">Card declined by issuing bank. No duplicate charge created.</p>
              </div>

              <div className="space-y-2 text-xs">
                <div
                  onClick={() => simulatePayment('success')}
                  className="p-3 rounded-xl border border-border hover:border-brand-blue bg-bg-panel hover:bg-brand-blue/10 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">Retry Transaction with UPI / Netbanking</div>
                    <div className="text-[11px] text-dim">Instant zero-fee retry route</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-brand-blue" />
                </div>

                <div
                  onClick={() => {
                    storageService.saveBundle(bundle);
                    resetCheckout();
                  }}
                  className="p-3 rounded-xl border border-border hover:border-brand-purple bg-bg-panel hover:bg-brand-purple/10 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-semibold text-white">Save Optimized Bundle for Later</div>
                    <div className="text-[11px] text-dim">Preserve items, discounts and verified prices</div>
                  </div>
                  <Bookmark className="w-4 h-4 text-brand-purple" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bg-panel border border-border text-[11px] text-dim">
                <span className="font-bold text-white">Agent Recovery State: </span>
                Cart state safely locked in memory. You will never be charged twice.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
