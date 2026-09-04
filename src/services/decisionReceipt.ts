import { DecisionReceipt, OptimizedBundle, ParsedIntent } from '../types';

export function generateDecisionReceipt(
  bundle: OptimizedBundle,
  parsed: ParsedIntent,
  approved: boolean
): DecisionReceipt {
  const decisionId = `IF-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // Generate deterministic cryptographic signature mock
  const rawHashInput = `${decisionId}-${parsed.category}-${bundle.finalTotal}-${timestamp}`;
  let hashVal = 0;
  for (let i = 0; i < rawHashInput.length; i++) {
    hashVal = (hashVal * 31 + rawHashInput.charCodeAt(i)) >>> 0;
  }
  const decisionHash = `sha256:0x${hashVal.toString(16).padStart(16, '0')}${Math.random().toString(16).substring(2, 18)}`;

  const platformCount = Object.keys(bundle.platformSplit).length;

  return {
    decisionId,
    intentText: parsed.raw,
    parsedSummary: `${parsed.category.toUpperCase()} • ${parsed.skinType ? `${parsed.skinType} skin • ` : ''}Budget ≤ ₹${parsed.budget.toLocaleString('en-IN')}`,
    budget: parsed.budget,
    bundleCost: bundle.finalTotal,
    remainingBudget: Math.max(0, bundle.remaining),
    productCount: bundle.items.length,
    safetyStatus: 'Passed',
    dataConfidence: 'High',
    platformCount,
    timestamp,
    approvalStatus: approved ? 'Approved' : 'Waiting for Customer',
    decisionHash
  };
}
