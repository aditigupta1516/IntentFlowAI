import React from 'react';
import { X, Clock, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAgent } from '../../context/AgentContext';

export const ActivityLedgerModal: React.FC = () => {
  const { isLedgerOpen, setIsLedgerOpen, auditTrail, intentText } = useAgent();

  if (!isLedgerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-hi max-w-2xl w-full p-6 border-border-hi shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Agent Activity Ledger</h3>
              <p className="text-xs text-dim">Immutable, timestamped audit trail of autonomous reasoning</p>
            </div>
          </div>
          <button
            onClick={() => setIsLedgerOpen(false)}
            className="p-1.5 rounded-lg bg-bg-panel hover:bg-bg-panel-hi text-dim hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Intent Ribbon */}
        <div className="my-3 p-3 rounded-xl bg-bg-panel border border-border text-xs font-mono flex-shrink-0">
          <span className="text-dim">Tracking Session: </span>
          <span className="text-white font-semibold truncate">"{intentText}"</span>
        </div>

        {/* Timeline body */}
        <div className="overflow-y-auto space-y-4 pr-1 flex-1 text-xs">
          {auditTrail.length === 0 ? (
            <div className="py-12 text-center text-dim">
              No audit entries recorded yet. Launch an agent request to record activity.
            </div>
          ) : (
            auditTrail.map((entry, idx) => (
              <div key={entry.id || idx} className="flex items-start gap-3.5 relative">
                {idx < auditTrail.length - 1 && (
                  <div className="absolute left-[17px] top-6 bottom-0 w-[1px] bg-border" />
                )}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 z-10 ${
                    entry.status === 'warn'
                      ? 'bg-status-warn-bg text-status-warn border border-status-warn/40'
                      : entry.status === 'bad'
                      ? 'bg-status-bad-bg text-status-bad border border-status-bad/40'
                      : 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30'
                  }`}
                >
                  {entry.status === 'warn' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : entry.status === 'bad' ? (
                    <ShieldAlert className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 p-3 rounded-xl bg-bg-panel border border-border">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="font-bold text-white">{entry.action}</span>
                    <span className="text-dim2">{entry.time}</span>
                  </div>
                  <p className="text-dim text-xs leading-relaxed">{entry.detail}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex justify-between items-center text-xs flex-shrink-0">
          <span className="text-dim2 font-mono text-[11px]">
            Total Actions Logged: {auditTrail.length}
          </span>
          <button
            onClick={() => setIsLedgerOpen(false)}
            className="btn-secondary text-xs py-1.5 px-4"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
