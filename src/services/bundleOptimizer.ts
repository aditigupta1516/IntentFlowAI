import { Product, ParsedIntent, Guardrails, OptimizedBundle } from '../types';

const SLOTS: Record<string, string[]> = {
  skincare: ['cleanser', 'serum', 'spf', 'moisturizer'],
  fashion: ['dress', 'top', 'footwear', 'accessory'],
  electronics: ['kettle', 'keyboard', 'mouse', 'monitor', 'dock', 'accessory', 'appliance'],
  gaming: ['mouse', 'headset', 'accessory'],
  travel: ['backpack', 'organizer', 'essential', 'accessory'],
  productivity: ['desk', 'focus', 'ergonomics', 'accessory']
};

function getProductSlot(prod: Product, category: string): string {
  const slots = SLOTS[category] || [];
  for (const s of slots) {
    if (prod.tags.includes(s) || prod.name.toLowerCase().includes(s)) return s;
  }
  return slots[slots.length - 1] || 'item';
}

export function optimizeBundleForIntent(
  discovered: Product[],
  parsed: ParsedIntent,
  guardrails: Guardrails
): OptimizedBundle {
  const budget = guardrails.maxBudget;
  const slots = SLOTS[parsed.category] || ['accessory'];
  const chosen: Product[] = [];
  const usedSlots = new Set<string>();
  const usedIds = new Set<string>();

  // 1. Pick highest scoring item for each functional slot
  for (const slot of slots) {
    if (slot === 'accessory') continue;
    if (chosen.length >= guardrails.maxBundleSize) break;

    const candidate = discovered.find(p => !usedIds.has(p.id) && getProductSlot(p, parsed.category) === slot);
    if (candidate) {
      const runningTotal = chosen.reduce((acc, c) => acc + c.bestPrice, 0);
      if (runningTotal + candidate.bestPrice <= budget || guardrails.allowAboveBudget) {
        chosen.push(candidate);
        usedIds.add(candidate.id);
        usedSlots.add(slot);
      }
    }
  }

  // 2. Fill remaining budget with highest value complementary items
  for (const p of discovered) {
    if (chosen.length >= guardrails.maxBundleSize) break;
    if (usedIds.has(p.id)) continue;
    const runningTotal = chosen.reduce((acc, c) => acc + c.bestPrice, 0);
    if (runningTotal + p.bestPrice <= budget * 0.94) {
      chosen.push(p);
      usedIds.add(p.id);
    }
  }

  // 3. Guarantee at least 1 product in bundle if discovered exists
  if (chosen.length === 0 && discovered.length > 0) {
    const cheapest = [...discovered].sort((a, b) => a.bestPrice - b.bestPrice)[0];
    if (cheapest.bestPrice <= budget || guardrails.allowAboveBudget) {
      chosen.push(cheapest);
    }
  }

  const individualTotal = chosen.reduce((acc, c) => acc + c.bestPrice, 0);
  const discountPct = Math.min(guardrails.maxDiscountPct, chosen.length >= 3 ? 10 : chosen.length >= 2 ? 6 : 0);
  let finalTotal = Math.round(individualTotal * (1 - discountPct / 100));

  // Trim lowest scored item if strictly exceeding budget
  if (finalTotal > budget && !guardrails.allowAboveBudget) {
    while (finalTotal > budget && chosen.length > 1) {
      chosen.sort((a, b) => (a.matchScore || 0) - (b.matchScore || 0));
      chosen.shift();
      const newInd = chosen.reduce((acc, c) => acc + c.bestPrice, 0);
      finalTotal = Math.round(newInd * (1 - discountPct / 100));
    }
  }

  // Compute platform distribution
  const platformSplit: Record<string, number> = {};
  chosen.forEach(p => {
    const primaryPlat = p.listings[0]?.platformName || 'Amazon';
    platformSplit[primaryPlat] = (platformSplit[primaryPlat] || 0) + 1;
  });

  return {
    id: `BND-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    name: `${parsed.category.toUpperCase()} — Optimized Bundle`,
    items: chosen,
    individualTotal,
    discountPct,
    finalTotal,
    remaining: budget - finalTotal,
    platformSplit,
    createdAt: new Date().toISOString(),
    status: 'draft'
  };
}
