import React from 'react';
import { X, Sliders, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const ControlCenterModal: React.FC = () => {
  const { isControlCenterOpen, setIsControlCenterOpen, guardrails, updateGuardrails, parsed } = useAgent();

  if (!isControlCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-hi max-w-lg w-full p-6 border-border-hi shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-blue">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agent Control Center</h3>
              <p className="text-xs text-dim">Define strict bounds & rules for autonomous reasoning</p>
            </div>
          </div>
          <button
            onClick={() => setIsControlCenterOpen(false)}
            className="p-1.5 rounded-lg bg-bg-panel hover:bg-bg-panel-hi text-dim hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5 py-4 text-xs">
          {/* Customer Rules */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-brand-blue font-bold mb-3">
              Customer Boundary Rules
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-panel border border-border">
                <div>
                  <div className="font-semibold text-white">Hard Budget Cap (₹)</div>
                  <div className="text-[11px] text-dim">Recalculates bundle recommendations instantly</div>
                </div>
                <input
                  type="number"
                  min="200"
                  step="100"
                  value={guardrails.maxBudget}
                  onChange={(e) => updateGuardrails({ maxBudget: parseFloat(e.target.value) || 100 })}
                  className="glass-input w-24 px-2.5 py-1 text-right font-mono font-bold"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-panel border border-border">
                <div>
                  <div className="font-semibold text-white">Require Approval Before Transaction</div>
                  <div className="text-[11px] text-dim">No payment authorization without explicit user click</div>
                </div>
                <input
                  type="checkbox"
                  checked={guardrails.requireApproval}
                  onChange={(e) => updateGuardrails({ requireApproval: e.target.checked })}
                  className="w-4 h-4 accent-brand-blue rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-panel border border-border">
                <div>
                  <div className="font-semibold text-white">Allow Recommendations Above Budget</div>
                  <div className="text-[11px] text-dim">Surfaces premium alternative options when relevant</div>
                </div>
                <input
                  type="checkbox"
                  checked={guardrails.allowAboveBudget}
                  onChange={(e) => updateGuardrails({ allowAboveBudget: e.target.checked })}
                  className="w-4 h-4 accent-brand-blue rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Merchant Guardrails */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-brand-purple font-bold mb-3">
              Merchant & Optimization Policy
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-bg-panel border border-border space-y-2">
                <div className="flex justify-between font-semibold text-white">
                  <span>Maximum AI Discount Allowance</span>
                  <span className="text-brand-purple font-mono">{guardrails.maxDiscountPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={guardrails.maxDiscountPct}
                  onChange={(e) => updateGuardrails({ maxDiscountPct: parseInt(e.target.value) })}
                  className="w-full accent-brand-purple"
                />
              </div>

              <div className="p-3 rounded-xl bg-bg-panel border border-border space-y-2">
                <div className="flex justify-between font-semibold text-white">
                  <span>Maximum Products Per Routine/Setup</span>
                  <span className="text-brand-purple font-mono">{guardrails.maxBundleSize} items</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={guardrails.maxBundleSize}
                  onChange={(e) => updateGuardrails({ maxBundleSize: parseInt(e.target.value) })}
                  className="w-full accent-brand-purple"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
          <span className="text-dim text-[11px] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-status-good" />
            Bounded Agent Constraints Active
          </span>
          <button
            onClick={() => setIsControlCenterOpen(false)}
            className="btn-primary text-xs py-1.5 px-4"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
