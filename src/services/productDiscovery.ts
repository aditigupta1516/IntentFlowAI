import { Product, ParsedIntent } from '../types';
import { PRODUCTS_CATALOG } from '../data/catalog';
import { extractUniversalProducts } from './universalProductExtractor';

const SKIN_PROFILES = {
  oily: { prefer: ['oily', 'matte', 'acne', 'brightening'], avoid: ['dry'] },
  dry: { prefer: ['dry', 'hydration', 'gentle'], avoid: ['oily', 'matte'] },
  combination: { prefer: ['combination', 'hydration', 'oily'], avoid: [] },
  sensitive: { prefer: ['sensitive', 'gentle'], avoid: ['acne'] }
};

export function scoreProductForIntent(prod: Product, parsed: ParsedIntent): number {
  let score = prod.rating * 12; // Base 42-60
  const lowerRaw = parsed.raw.toLowerCase();
  
  // 1. Direct Keyword / Name / Brand Hit (High Priority)
  const prodNameLower = prod.name.toLowerCase();
  const prodBrandLower = prod.brand.toLowerCase();
  const rawWords = lowerRaw.split(/\s+/).filter(w => w.length > 2);

  let directWordHits = 0;
  for (const word of rawWords) {
    if (prodNameLower.includes(word) || prodBrandLower.includes(word) || prod.tags.includes(word)) {
      directWordHits++;
    }
  }
  if (directWordHits > 0) {
    score += directWordHits * 25; // Massive boost for specific product requests
  }

  // 2. Category match bonus
  if (prod.category.toLowerCase() === parsed.category.toLowerCase()) {
    score += 20;
  }

  // 3. Skincare personalization match
  if (parsed.category === 'skincare' && parsed.skinType) {
    const profile = SKIN_PROFILES[parsed.skinType.toLowerCase() as keyof typeof SKIN_PROFILES];
    if (profile) {
      const prefHits = profile.prefer.filter(t => prod.tags.includes(t)).length;
      const avoidHits = profile.avoid.filter(t => prod.tags.includes(t)).length;
      score += prefHits * 14 - avoidHits * 18;
    }
  }

  // 4. Budget fit score
  if (prod.price <= parsed.budget * 0.4) {
    score += 8;
  } else if (prod.price > parsed.budget) {
    score -= 25;
  }

  // Deterministic seed variance for diversity
  const seed = (prod.id.charCodeAt(1) || 0) % 7;
  score += seed;

  return Math.max(40, Math.min(99, Math.round(score)));
}

export function discoverProductsForIntent(parsed: ParsedIntent): Product[] {
  const lowerRaw = parsed.raw.toLowerCase().trim();
  
  // 1. Check if static catalog has direct keyword matches
  const directCatalogMatches = PRODUCTS_CATALOG.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(lowerRaw) || lowerRaw.includes(p.name.toLowerCase());
    const tagMatch = p.tags.some(t => lowerRaw.includes(t));
    const wordMatches = lowerRaw.split(/\s+/).some(w => w.length > 3 && (p.name.toLowerCase().includes(w) || p.tags.includes(w)));
    return nameMatch || tagMatch || wordMatches;
  });

  // 2. Check if the category is a pre-defined catalog domain (skincare, fashion, desk coding, travel, gaming)
  const isPredefinedDomain = ['skincare', 'fashion', 'coding', 'gaming', 'travel'].includes(parsed.category.toLowerCase());

  if (isPredefinedDomain && directCatalogMatches.length >= 2) {
    let pool = PRODUCTS_CATALOG.filter(p => p.category === parsed.category);
    if (directCatalogMatches.length > 0) {
      const directIds = new Set(directCatalogMatches.map(m => m.id));
      pool = [...directCatalogMatches, ...pool.filter(p => !directIds.has(p.id))];
    }
    return pool
      .map(p => {
        const matchScore = scoreProductForIntent(p, parsed);
        return {
          ...p,
          matchScore,
          confidenceScore: Math.min(98, matchScore + 2)
        };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }

  // 3. For ANY other search (washing machine, toy, air fryer, sports, perfumes, or anything under the sun):
  // Invoke Universal Multi-Store Extractor
  const universal = extractUniversalProducts(parsed);
  if (universal.products && universal.products.length > 0) {
    return universal.products;
  }

  // Fallback to pool
  return PRODUCTS_CATALOG.slice(0, 8);
}
