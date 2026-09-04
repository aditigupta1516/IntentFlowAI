import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Download, Share2, Sparkles } from 'lucide-react';
import { DecisionReceipt, OptimizedBundle } from '../../types';

interface DecisionReceiptCardProps {
  receipt: DecisionReceipt;
  bundle: OptimizedBundle;
  onApprove: () => void;
  onProceedCheckout: () => void;
  isApproved: boolean;
}

export const DecisionReceiptCard: React.FC<DecisionReceiptCardProps> = ({
  receipt,
  bundle,
  onApprove,
  onProceedCheckout,
  isApproved
}) => {
  const downloadReceipt = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ receipt, bundle }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `IntentFlow-Receipt-${receipt.decisionId}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="glass-panel p-5 border-border-hi font-mono text-xs space-y-4 relative shadow-card-3d">
      {/* Receipt Title */}
      <div className="flex items-center justify-between pb-3 border-b border-dashed border-border">
        <div>
          <div className="flex items-center gap-1.5 text-brand-blue font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            DECISION RECEIPT
          </div>
          <div className="text-[10px] text-dim2">{receipt.decisionId}</div>
        </div>
        <span
          className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
            isApproved ? 'bg-status-good-bg text-status-good border border-status-good/30' : 'bg-status-warn-bg text-status-warn border border-status-warn/30'
          }`}
        >
          {isApproved ? '✓ Approved' : '⏳ Awaiting Consent'}
        </span>
      </div>

      {/* Target Intent */}
      <div>
        <div className="text-[10px] text-dim2 uppercase">Customer Intent</div>
        <div className="text-white font-sans text-xs font-semibold mt-0.5 line-clamp-2">
          "{receipt.intentText}"
        </div>
      </div>

      {/* Financials & Metrics */}
      <div className="space-y-1.5 py-2 border-y border-dashed border-border text-[11px]">
        <div className="flex justify-between text-dim">
          <span>Stated Budget</span>
          <span className="text-white font-bold">₹{receipt.budget.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-dim">
          <span>Optimized Bundle Cost</span>
          <span className="text-brand-blue font-bold">₹{receipt.bundleCost.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-dim">
          <span>Remaining Budget Unspent</span>
          <span className="text-status-good font-bold">+₹{receipt.remainingBudget.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-dim">
          <span>AI Bundled Savings</span>
          <span className="text-brand-purple font-bold">−₹{(bundle.individualTotal - bundle.finalTotal).toLocaleString('en-IN')} ({bundle.discountPct}%)</span>
        </div>
      </div>

      {/* Security and Integrity Info */}
      <div className="space-y-1 text-[10px] text-dim2">
        <div className="flex justify-between">
          <span>Safety & Synergy Status</span>
          <span className="text-status-good font-bold">Passed (100%)</span>
        </div>
        <div className="flex justify-between">
          <span>Verified Merchant Platforms</span>
          <span className="text-white font-bold">{receipt.platformCount} Connectors</span>
        </div>
        <div className="flex justify-between">
          <span>Timestamp</span>
          <span className="text-dim">{receipt.timestamp}</span>
        </div>
        <div className="truncate text-[9px] text-dim2 pt-1">
          Hash: <span className="text-brand-purple">{receipt.decisionHash}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 font-sans">
        {!isApproved ? (
          <button
            onClick={onApprove}
            className="btn-primary w-full justify-center text-xs py-2 font-bold shadow-glow-blue"
          >
            <ShieldCheck className="w-4 h-4" />
            Approve & Authorize Bundle
          </button>
        ) : (
          <button
            onClick={onProceedCheckout}
            className="btn-primary w-full justify-center text-xs py-2.5 font-bold shadow-glow-blue bg-gradient-to-r from-status-good to-brand-blue text-bg"
          >
            <Lock className="w-4 h-4" />
            Proceed to Secure Checkout →
          </button>
        )}

        <div className="flex gap-2 mt-2">
          <button
            onClick={downloadReceipt}
            className="btn-secondary flex-1 justify-center text-[11px] py-1.5"
            title="Download JSON Receipt"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'IntentFlow Decision Receipt', text: `Optimized Bundle: ₹${receipt.bundleCost}` });
              }
            }}
            className="btn-secondary flex-1 justify-center text-[11px] py-1.5"
            title="Share Decision Receipt"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};
