import React from 'react';
import { Shield, Sparkles, Cpu, Search, Dna, CheckCircle2, Lock, ArrowRight, Zap, Target } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const PIPELINE_NODES = [
  { id: 'intent', label: 'Customer Intent', icon: Target, desc: 'Natural language input & semantic extraction' },
  { id: 'parser', label: 'Intent Parser', icon: Cpu, desc: 'Structured JSON & constraints extraction' },
  { id: 'constraint', label: 'Guardrail Engine', icon: Shield, desc: 'Budget, platform & safety rules' },
  { id: 'discovery', label: 'Product Discovery', icon: Search, desc: 'Multi-platform catalog intelligence' },
  { id: 'bundle', label: 'Bundle Optimizer', icon: Dna, desc: 'Combinatorial value & synergy scoring' },
  { id: 'growth', label: 'Growth Engine', icon: Zap, desc: '4-gate ethical cross-sell discovery' },
  { id: 'trust', label: 'Trust Layer', icon: Lock, desc: 'Audit logging & decision confidence' },
  { id: 'approval', label: 'User Approval', icon: CheckCircle2, desc: 'Human-in-the-loop explicit consent' },
  { id: 'checkout', label: 'Razorpay Checkout', icon: Sparkles, desc: 'Trusted transaction authorization' }
];

export const Pipeline3D: React.FC = () => {
  const { activePipelineNode, auditTrail } = useAgent();

  return (
    <div className="glass-panel p-6 border-border-hi shadow-card-3d overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            Live Decision Pipeline
          </div>
          <h3 className="text-base font-bold text-white mt-1">Watch the Agent Reason</h3>
        </div>
        <span className="text-[11px] font-mono text-dim px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
          9 Autonomous Modules
        </span>
      </div>

      <div className="overflow-x-auto pb-4 pt-2">
        <div className="flex items-center gap-2 min-w-[880px]">
          {PIPELINE_NODES.map((node, i) => {
            const Icon = node.icon;
            const isActive = activePipelineNode === node.id;
            const hasAudited = auditTrail.some(a => a.node === node.id);

            return (
              <React.Fragment key={node.id}>
                <div
                  className={`flex-1 p-3.5 rounded-xl border text-center transition-all duration-300 relative group cursor-pointer ${
                    isActive
                      ? 'bg-brand-blue/15 border-brand-blue shadow-glow-blue scale-[1.03]'
                      : hasAudited
                      ? 'bg-bg-panel border-status-good/40 text-white'
                      : 'bg-bg-panel border-border text-dim hover:border-border-hi'
                  }`}
                >
                  {isActive && (
                    <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-brand-blue animate-ping" />
                  )}
                  <div
                    className={`w-9 h-9 rounded-lg mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive
                        ? 'bg-brand-blue text-bg'
                        : hasAudited
                        ? 'bg-status-good-bg text-status-good border border-status-good/30'
                        : 'bg-white/5 text-dim'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-white tracking-tight truncate">{node.label}</div>
                  <div className="text-[10px] text-dim2 font-mono mt-0.5">
                    {isActive ? 'Reasoning…' : hasAudited ? '✓ Complete' : 'Idle'}
                  </div>
                </div>

                {i < PIPELINE_NODES.length - 1 && (
                  <div className="text-dim2 text-xs flex-shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
