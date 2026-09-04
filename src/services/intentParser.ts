import { ParsedIntent } from '../types';
import { PRODUCTS_CATALOG } from '../data/catalog';

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  washing_machine: [
    'washing machine', 'washing', 'washer', 'dryer', 'front load', 'top load', 'laundry'
  ],
  toys: [
    'toy', 'toys', 'kids', 'lego', 'action figure', 'doll', 'car toy', 'monster truck', 'board game', 'nerf', 'puzzle', 'drone'
  ],
  kitchen: [
    'air fryer', 'fryer', 'microwave', 'oven', 'mixer', 'grinder', 'juicer', 'blender', 'toaster', 'sandwich', 'induction', 'cooker', 'coffee', 'espresso', 'purifier', 'kettle'
  ],
  sports: [
    'cricket', 'bat', 'football', 'badminton', 'racket', 'gym', 'dumbbell', 'yoga', 'fitness', 'exercise', 'treadmill', 'sports'
  ],
  electronics: [
    'electric', 'appliance', 'kitchen', 'heater', 'geyser', 'iron',
    'coding', 'code', 'setup', 'developer', 'keyboard', 'monitor', 'laptop', 'webcam', 'dock', 'programmer', 'desk', 'mouse', 'audio', 'headphones', 'earbuds', 'speaker', 'smartwatch', 'charger', 'gadget', 'phone', 'iphone', 'tablet'
  ],
  skincare: [
    'skincare', 'skin', 'cleanser', 'serum', 'sunscreen', 'acne', 'moisturizer', 'pores', 'glow', 'oily', 'dry', 'cream', 'face wash', 'facewash', 'toner', 'exfoliant', 'barrier', 'lip balm', 'cica', 'retinol', 'niacinamide', 'hyaluronic', 'salicylic'
  ],
  fashion: [
    'dress', 'kurti', 'top', 't-shirt', 'tshirt', 'jacket', 'sandals', 'sneakers', 'earrings', 'bag', 'outfit', 'fashion', 'wear', 'clothing', 'saree', 'heels', 'shoes', 'jeans', 'trousers', 'suit', 'hoodie', 'jewellery'
  ],
  gaming: [
    'gaming', 'game', 'gamer', 'esports', 'controller', 'rgb', 'headset', 'mousepad', 'playstation', 'xbox'
  ],
  travel: [
    'travel', 'trip', 'vacation', 'backpack', 'flight', 'luggage', 'packing', 'cubes', 'neck pillow', 'adapter', 'suitcase'
  ],
  productivity: [
    'productivity', 'focus', 'work from home', 'wfh', 'ergonomic', 'study', 'converter', 'lamp', 'planner', 'timer'
  ]
};

const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  washing_machine: 25000,
  kitchen: 4500,
  electronics: 5000,
  toys: 2000,
  sports: 2500,
  skincare: 2000,
  fashion: 1500,
  gaming: 3500,
  travel: 4000,
  productivity: 3000
};

export function parseCustomerIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase().trim();
  
  // 1. Keyword Match against Category Dictionaries
  let category: string = 'skincare';
  let maxKeywordHits = 0;
  for (const [catKey, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hits = keywords.filter(k => lower.includes(k)).length;
    if (hits > maxKeywordHits) {
      maxKeywordHits = hits;
      category = catKey;
    }
  }

  // 2. Budget Extraction (Lakhs, K, Rupee signs, bare numbers)
  let defaultBud = DEFAULT_CATEGORY_BUDGETS[category] || 2000;
  let budget = defaultBud;

  const lakhMatch = lower.match(/([\d.]+)\s*lakh/);
  const kMatch = lower.match(/₹?\s*([\d,.]+)\s*k\b/);
  const rupeeMatch = lower.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
  const plainUnderMatch = lower.match(/(?:under|below|within|budget of|max|around)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i);

  if (lakhMatch) {
    budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (kMatch) {
    budget = Math.round(parseFloat(kMatch[1].replace(/,/g, '')) * 1000);
  } else if (plainUnderMatch) {
    budget = parseInt(plainUnderMatch[1].replace(/,/g, ''), 10);
  } else if (rupeeMatch) {
    budget = parseInt(rupeeMatch[1].replace(/,/g, ''), 10);
  }

  // 3. Fallback: Check direct catalog match if no category keywords matched
  if (maxKeywordHits === 0) {
    const matchedProduct = PRODUCTS_CATALOG.find(p => {
      const nameMatch = p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase());
      const tagMatch = p.tags.some(t => lower.includes(t));
      const brandMatch = lower.includes(p.brand.toLowerCase());
      return nameMatch || tagMatch || brandMatch;
    });

    if (matchedProduct) {
      category = matchedProduct.category;
    } else {
      // Clean subject as general category name
      const cleanSubject = lower
        .replace(/^(i need|i want|find me|show me|build me|give me|buy|get|looking for|search for|a|an|the)\s+/i, '')
        .replace(/\s+(under|below|within|budget|for|in|with)\s+.*$/i, '')
        .trim();
      if (cleanSubject) {
        category = cleanSubject;
      }
    }
  }

  // 4. Skincare attributes (only if skincare)
  let skinType: ParsedIntent['skinType'] = null;
  if (category === 'skincare') {
    if (lower.includes('oily')) skinType = 'Oily';
    else if (lower.includes('dry')) skinType = 'Dry';
    else if (lower.includes('combination')) skinType = 'Combination';
    else if (lower.includes('sensitive')) skinType = 'Sensitive';
  }

  const concerns: string[] = [];
  if (category === 'skincare') {
    if (lower.includes('acne') || lower.includes('pimple')) concerns.push('Acne');
    if (lower.includes('pore') || lower.includes('blackhead')) concerns.push('Enlarged Pores');
    if (lower.includes('dark spot') || lower.includes('pigmentation')) concerns.push('Pigmentation');
    if (lower.includes('dull') || lower.includes('glow')) concerns.push('Dullness');
    if (lower.includes('redness') || lower.includes('irritat')) concerns.push('Redness');
  }

  const missingFields: string[] = [];
  if (category === 'skincare' && !skinType) {
    missingFields.push('skinType');
  }
  if (!lower.includes('under') && !lower.includes('budget') && !rupeeMatch && !lakhMatch && !kMatch) {
    missingFields.push('budget');
  }

  const priority = lower.includes('complete') || lower.includes('routine') || lower.includes('setup') || lower.includes('kit')
    ? 'Complete Optimized Bundle'
    : 'Best Matched Product';

  return {
    raw: text,
    category,
    budget: Math.max(100, budget),
    currency: 'INR',
    skinType,
    concerns: concerns.length ? concerns : undefined,
    experienceLevel: lower.includes('beginner') ? 'Beginner' : lower.includes('advanced') ? 'Advanced' : 'Intermediate',
    priority,
    preference: lower.includes('quality') ? 'Best Quality' : lower.includes('fast') ? 'Fastest Delivery' : 'Value for Money',
    missingFields
  };
}
