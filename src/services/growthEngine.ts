import { Product, ParsedIntent, Guardrails, OptimizedBundle, GrowthOpportunity } from '../types';
import { PRODUCTS_CATALOG } from '../data/catalog';
import { extractUniversalProducts } from './universalProductExtractor';

const UPSELL_ALLOWED: Record<string, string> = {
  skincare: 'Skincare Accessories & Minis',
  fashion: 'Fashion Accessories & Jewelry',
  electronics: 'Desk & Cable Management Accessories',
  gaming: 'Gaming Accessories & Deskpads',
  travel: 'Travel Essentials & Adapters',
  productivity: 'Desk & Focus Accessories'
};

export function findGrowthOpportunity(
  bundle: OptimizedBundle,
  parsed: ParsedIntent,
  guardrails: Guardrails
): GrowthOpportunity | null {
  const remaining = guardrails.maxBudget - bundle.finalTotal;
  if (remaining <= 0) return null;

  // 1. Check if Universal Extractor provides a tailored growth add-on
  const universal = extractUniversalProducts(parsed);
  if (universal.growthAddOn && universal.growthAddOn.item) {
    const item = universal.growthAddOn.item;
    if (item.bestPrice <= remaining * 1.2 || guardrails.allowAboveBudget) {
      return {
        item,
        relevance: 96,
        predictedAcceptance: 84,
        revenueImpact: item.bestPrice,
        allowedCategory: universal.growthAddOn.allowedCategory,
        reason: universal.growthAddOn.reason
      };
    }
  }

  const usedIds = new Set(bundle.items.map(i => i.id));
  
  // 2. Look for high-affinity accessory items that fit remaining budget from catalog
  const candidates = PRODUCTS_CATALOG.filter(p => {
    const isAccessory = p.tags.includes('accessory') || p.tags.includes('essential');
    const notInBundle = !usedIds.has(p.id);
    const fitsBudget = p.bestPrice <= remaining;
    const matchesCategory = p.category === parsed.category;
    const compatible = bundle.items[0] && p.compat && p.compat.some(t => bundle.items[0].tags.includes(t));
    
    return isAccessory && notInBundle && fitsBudget && (matchesCategory || compatible);
  }).sort((a, b) => a.bestPrice - b.bestPrice);

  if (!candidates.length) return null;

  const item = candidates[0];
  const relevance = Math.min(98, 72 + Math.round(item.rating * 5));
  const predictedAcceptance = Math.round(45 + item.rating * 8);

  return {
    item,
    relevance,
    predictedAcceptance,
    revenueImpact: item.bestPrice,
    allowedCategory: UPSELL_ALLOWED[parsed.category] || `${parsed.category} Accessories`,
    reason: `Complements your ${parsed.category} purchase while remaining well within your unspent ₹${remaining.toLocaleString('en-IN')} budget.`
  };
}
