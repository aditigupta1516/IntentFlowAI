import { Product, ProductListing, SupportedPlatform } from '../types';

export const PLATFORMS_META: Record<SupportedPlatform, { name: string; icon: string; badgeColor: string; searchUrl: (q: string) => string }> = {
  amazon: {
    name: 'Amazon India',
    icon: '📦',
    badgeColor: '#ff9900',
    searchUrl: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`
  },
  myntra: {
    name: 'Myntra',
    icon: '🛍️',
    badgeColor: '#ff3f6c',
    searchUrl: (q) => `https://www.myntra.com/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, '-'))}`
  },
  flipkart: {
    name: 'Flipkart',
    icon: '🛒',
    badgeColor: '#2874f0',
    searchUrl: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`
  },
  nykaa: {
    name: 'Nykaa',
    icon: '💄',
    badgeColor: '#fc2779',
    searchUrl: (q) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(q)}`
  },
  renee: {
    name: 'Renee Cosmetics',
    icon: '✨',
    badgeColor: '#d4a373',
    searchUrl: (q) => `https://www.reneecosmetics.in/search?q=${encodeURIComponent(q)}`
  },
  savana: {
    name: 'Savana / Urbanic',
    icon: '👗',
    badgeColor: '#a855f7',
    searchUrl: (q) => `https://www.savana.com/search?keyword=${encodeURIComponent(q)}`
  },
  meesho: {
    name: 'Meesho',
    icon: '🏷️',
    badgeColor: '#f43397',
    searchUrl: (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`
  },
  ajio: {
    name: 'Ajio',
    icon: '👖',
    badgeColor: '#2c4152',
    searchUrl: (q) => `https://www.ajio.com/search/?text=${encodeURIComponent(q)}`
  },
  purplle: {
    name: 'Purplle',
    icon: '💜',
    badgeColor: '#8b5cf6',
    searchUrl: (q) => `https://www.purplle.com/search?q=${encodeURIComponent(q)}`
  },
  tira: {
    name: 'Tira Beauty',
    icon: '🌟',
    badgeColor: '#ec4899',
    searchUrl: (q) => `https://www.tirabeauty.com/search?q=${encodeURIComponent(q)}`
  }
};

const CATEGORY_PLATFORM_MAP: Record<string, SupportedPlatform[]> = {
  skincare: ['nykaa', 'amazon', 'purplle', 'tira', 'flipkart', 'renee', 'meesho'],
  fashion: ['myntra', 'savana', 'ajio', 'meesho', 'amazon', 'flipkart'],
  electronics: ['amazon', 'flipkart'],
  gaming: ['amazon', 'flipkart'],
  productivity: ['amazon', 'flipkart', 'meesho'],
  travel: ['amazon', 'flipkart', 'myntra', 'meesho', 'ajio']
};

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function generateListings(prodId: string, name: string, brand: string, basePrice: number, category: string, baseRating: number): ProductListing[] {
  const allowed = CATEGORY_PLATFORM_MAP[category] || ['amazon', 'flipkart'];
  const seed = seedFromId(prodId);
  const query = `${brand} ${name}`;

  return allowed.map((pid, i) => {
    const meta = PLATFORMS_META[pid];
    const variance = ((seed >> (i * 3)) % 15) - 7; // -7% to +7%
    const price = Math.max(49, Math.round(basePrice * (1 + variance / 100) / 10) * 10 - 1);
    const rating = Math.round((baseRating + (((seed >> (i * 2)) % 5) - 2) / 10) * 10) / 10;
    const deliveryOptions = ['1-day Express Prime', '2-day Delivery', '3-4 Business Days', 'Standard Free Shipping'];
    const delivery = deliveryOptions[(seed + i * 5) % deliveryOptions.length];

    return {
      platform: pid,
      platformName: meta.name,
      icon: meta.icon,
      badgeColor: meta.badgeColor,
      price,
      rating: Math.max(3.6, Math.min(5, rating)),
      reviewCount: 450 + ((seed * (i + 1)) % 4200),
      availability: 'in_stock' as const,
      delivery,
      productUrl: meta.searchUrl(query),
      isVerified: true
    };
  }).sort((a, b) => a.price - b.price);
}

const RAW_CATALOG: Array<Omit<Product, 'listings' | 'bestPrice' | 'bestPlatform' | 'bestPlatformName' | 'bestPlatformUrl'>> = [
  // ==================== SKINCARE: OILY & ACNE PRONE ====================
  {
    id: 'sk1',
    name: 'Salicylic Acid 2% + LHA Cleanser',
    brand: 'Minimalist',
    category: 'skincare',
    subCategory: 'Cleanser',
    price: 299,
    desc: 'Gentle exfoliating foaming cleanser that reduces acne breakouts, unclogs pores, and removes excess sebum without stripping the skin.',
    tags: ['oily', 'acne', 'cleanser', 'matte', 'pores'],
    compat: ['serum', 'sunscreen', 'moisturizer'],
    rating: 4.6,
    reviewCount: 8420,
    merchantApproved: true,
    icon: '🧴',
    ingredients: ['Salicylic Acid 2%', 'Capryloyl Salicylic Acid (LHA)', 'Zinc PCA', 'Panthenol'],
    whyThis: ['Formulated specifically for oily & acne-prone skin', 'Non-comedogenic & fragrance-free', 'Balances excess oil throughout the day']
  },
  {
    id: 'sk2',
    name: 'Niacinamide 10% + Zinc 1% Blemish Serum',
    brand: 'The Ordinary',
    category: 'skincare',
    subCategory: 'Serum',
    price: 599,
    desc: 'High-strength vitamin and mineral blemish formula that regulates sebum production, fades post-acne marks, and visibly tightens pores.',
    tags: ['oily', 'acne', 'serum', 'brightening', 'pores'],
    compat: ['cleanser', 'sunscreen', 'moisturizer'],
    rating: 4.7,
    reviewCount: 15400,
    merchantApproved: true,
    icon: '💧',
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Tamarind Seed Extract'],
    whyThis: ['Reduces visible congestion & redness', 'Clinical grade 10% Niacinamide concentration', 'Works synergistically with matte sunscreens']
  },
  {
    id: 'sk3',
    name: 'Ultra-Matte Dry Touch Sunscreen Gel SPF 50 PA++++',
    brand: 'Re\'equil',
    category: 'skincare',
    subCategory: 'Sunscreen',
    price: 449,
    desc: 'Velvety matte-finish, oil-free gel sunscreen with zero white cast. Water & sweat-resistant, preventing daytime shine on oily skin.',
    tags: ['oily', 'spf', 'matte', 'sunscreen'],
    compat: ['cleanser', 'serum', 'moisturizer'],
    rating: 4.8,
    reviewCount: 9200,
    merchantApproved: true,
    icon: '☀️',
    ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Vitamin E', 'Dimethicone'],
    whyThis: ['Zero white cast & non-greasy texture', 'Complete broad spectrum UVA/UVB protection', 'Absorbs sweat and humidity flawlessly']
  },
  {
    id: 'sk4',
    name: 'Oil-Free Hydro Boost Water Gel',
    brand: 'Neutrogena',
    category: 'skincare',
    subCategory: 'Moisturizer',
    price: 399,
    desc: 'Lightweight hyaluronic acid water gel that instantly quenches skin without clogging pores or leaving oily residue.',
    tags: ['oily', 'combination', 'moisturizer', 'hydration'],
    compat: ['cleanser', 'serum'],
    rating: 4.5,
    reviewCount: 6800,
    merchantApproved: true,
    icon: '🌊',
    ingredients: ['Hyaluronic Acid', 'Glycerin', 'Dimethicone'],
    whyThis: ['Ultra-light water gel texture', 'Non-comedogenic oil-free hydration', 'Fast absorbing in seconds']
  },
  {
    id: 'sk5',
    name: 'Salicylic Acid 2% BHA Serum for Blackheads',
    brand: 'Derma Co',
    category: 'skincare',
    subCategory: 'Serum',
    price: 499,
    desc: 'Oil-soluble BHA liquid exfoliant that penetrates deep into sebum plugs to dissolve blackheads and active pimples.',
    tags: ['oily', 'acne', 'serum', 'pores'],
    compat: ['cleanser', 'sunscreen'],
    rating: 4.4,
    reviewCount: 3900,
    merchantApproved: true,
    icon: '🧪',
    ingredients: ['Salicylic Acid 2%', 'Witch Hazel', 'Willow Bark Extract'],
    whyThis: ['Deep pore unclogging action', 'Soothes active breakouts quickly', 'Improves skin texture']
  },
  {
    id: 'sk6',
    name: 'Green Tea Pore Clarifying Clay Mask',
    brand: 'Plum',
    category: 'skincare',
    subCategory: 'Mask',
    price: 349,
    desc: 'Natural kaolin and bentonite clay mask infused with antioxidant green tea to detoxify pores and absorb excess oil weekly.',
    tags: ['oily', 'mask', 'accessory', 'acne'],
    compat: ['cleanser'],
    rating: 4.3,
    reviewCount: 3100,
    merchantApproved: true,
    icon: '🍵',
    ingredients: ['Green Tea Extract', 'Kaolin Clay', 'Bentonite Clay', 'Glycolic Acid'],
    whyThis: ['Weekly detox treatment', 'Draws out deep impurities', 'Leaves skin feeling soft and matte']
  },

  // ==================== SKINCARE: DRY, SENSITIVE & GLOW ====================
  {
    id: 'sk7',
    name: 'Ceramide Barrier Repair Moisturizing Cream',
    brand: 'Dot & Key',
    category: 'skincare',
    subCategory: 'Moisturizer',
    price: 499,
    desc: 'Deep barrier restoration cream formulated with 5 essential ceramides and probiotics to soothe flakiness and dryness.',
    tags: ['dry', 'sensitive', 'moisturizer', 'gentle'],
    compat: ['cleanser', 'serum'],
    rating: 4.6,
    reviewCount: 4200,
    merchantApproved: true,
    icon: '🛡️',
    ingredients: ['Ceramide NP, AP, EOP', 'Hyaluronic Acid', 'Japanese Rice Water'],
    whyThis: ['Replenishes lipid barrier', 'Fragrance-free formula', 'Soothes stinging and redness']
  },
  {
    id: 'sk8',
    name: 'Centella Asiatica Soothing Gel Moisturizer',
    brand: 'Cosrx',
    category: 'skincare',
    subCategory: 'Moisturizer',
    price: 649,
    desc: 'Lightweight Cica-infused hydrating gel that calms irritated, reactive, or red skin while maintaining a healthy skin barrier.',
    tags: ['sensitive', 'serum', 'gentle', 'moisturizer'],
    compat: ['cleanser', 'sunscreen'],
    rating: 4.7,
    reviewCount: 5100,
    merchantApproved: true,
    icon: '🌿',
    ingredients: ['Centella Asiatica Leaf Water 70%', 'Tea Tree Extract', 'Allantoin'],
    whyThis: ['Calms inflamed acne and redness', 'Hypoallergenic tested', 'Super refreshing texture']
  },
  {
    id: 'sk9',
    name: '10% Vitamin C + E + Ferulic Glow Serum',
    brand: 'Dr. Sheth\'s',
    category: 'skincare',
    subCategory: 'Serum',
    price: 549,
    desc: 'Stabilized ethyl ascorbic acid serum tailored for Indian skin tones to fade dark spots and boost radiant glow.',
    tags: ['brightening', 'serum', 'dry', 'combination'],
    compat: ['cleanser', 'sunscreen'],
    rating: 4.5,
    reviewCount: 3800,
    merchantApproved: true,
    icon: '🍊',
    ingredients: ['Ethyl Ascorbic Acid 10%', 'Ferulic Acid 1%', 'Centella Extract'],
    whyThis: ['Targets hyperpigmentation', 'Protects against UV photo-damage', 'Non-stinging formulation']
  },
  {
    id: 'sk10',
    name: 'Berry Lip Sleeping Mask (Pocket Mini)',
    brand: 'Laneige',
    category: 'skincare',
    subCategory: 'Lip Care',
    price: 199,
    desc: 'Antioxidant-rich berry lip mask that melts away dead skin cells overnight for smooth, supple lips.',
    tags: ['accessory', 'travel', 'hydration', 'lip'],
    compat: ['cleanser', 'serum'],
    rating: 4.8,
    reviewCount: 12000,
    merchantApproved: true,
    icon: '🍓',
    ingredients: ['Berry Complex', 'Vitamin C', 'Shea Butter', 'Coconut Oil'],
    whyThis: ['Instant lip hydration', 'Pocket-friendly price point', 'Cult-favorite formula']
  },
  {
    id: 'sk11',
    name: 'Dewy Finish Sunscreen Stick SPF 50',
    brand: 'Aqualogica',
    category: 'skincare',
    subCategory: 'Sunscreen',
    price: 399,
    desc: 'Mess-free on-the-go sunscreen stick with watermelon and hyaluronic acid for easy reapplication over makeup.',
    tags: ['spf', 'accessory', 'travel', 'sunscreen'],
    compat: ['cleanser', 'serum'],
    rating: 4.4,
    reviewCount: 2900,
    merchantApproved: true,
    icon: '🏖️',
    ingredients: ['Watermelon Extract', 'Hyaluronic Acid', 'Zinc Oxide'],
    whyThis: ['Hands-free reapplication anywhere', 'Leaves a healthy dewy glow', 'Fits in any pocket or purse']
  },
  {
    id: 'sk12',
    name: 'PH 5.5 Gentle Hydrating Cleanser',
    brand: 'Cetaphil',
    category: 'skincare',
    subCategory: 'Cleanser',
    price: 349,
    desc: 'Clinically proven soap-free, non-foaming lotion cleanser that preserves the natural lipid barrier.',
    tags: ['sensitive', 'dry', 'cleanser', 'gentle'],
    compat: ['serum', 'moisturizer'],
    rating: 4.6,
    reviewCount: 18000,
    merchantApproved: true,
    icon: '🥛',
    ingredients: ['Niacinamide', 'Panthenol (Vitamin B5)', 'Hydrating Glycerin'],
    whyThis: ['Recommended by dermatologists worldwide', 'Ideal for eczema & sensitive skin', 'Can be rinsed or wiped off']
  },

  // ==================== FASHION & OUTFITS ====================
  {
    id: 'fa1',
    name: 'Floral Print Wrap Maxi Day Dress',
    brand: 'Vero Moda',
    category: 'fashion',
    subCategory: 'Dress',
    price: 499,
    desc: 'Breathable lightweight cotton-blend wrap dress with flutter sleeves, designed for casual brunches or daytime hangouts.',
    tags: ['dress', 'casual', 'women', 'summer'],
    compat: ['footwear', 'accessory'],
    rating: 4.4,
    reviewCount: 1900,
    merchantApproved: true,
    icon: '👗',
    whyThis: ['Flattering waist-tie wrap fit', 'Breathable fabric for warm weather', 'Easy to dress up or down']
  },
  {
    id: 'fa2',
    name: 'A-Line Pure Cotton Printed Kurti',
    brand: 'Anouk',
    category: 'fashion',
    subCategory: 'Ethnic',
    price: 399,
    desc: 'Handblock printed daily wear cotton kurti with mandarin collar and three-quarter sleeves.',
    tags: ['dress', 'ethnic', 'women', 'casual'],
    compat: ['footwear', 'accessory'],
    rating: 4.3,
    reviewCount: 2400,
    merchantApproved: true,
    icon: '🥻',
    whyThis: ['100% breathable natural cotton', 'Comfortable all-day office/college wear', 'Vibrant colorfast dyes']
  },
  {
    id: 'fa3',
    name: 'Classic White Cushioned Canvas Sneakers',
    brand: 'Red Tape',
    category: 'fashion',
    subCategory: 'Footwear',
    price: 799,
    desc: 'Minimalist low-top white sneakers with memory foam insole and slip-resistant rubber cupsole.',
    tags: ['footwear', 'casual', 'sneakers'],
    compat: ['dress'],
    rating: 4.5,
    reviewCount: 5800,
    merchantApproved: true,
    icon: '👟',
    whyThis: ['Timeless aesthetic that pairs with everything', 'Memory foam comfort for walking', 'Easy to clean']
  },
  {
    id: 'fa4',
    name: 'Oxidised Silver Boho Jhumka Earrings',
    brand: 'Zaveri Pearls',
    category: 'fashion',
    subCategory: 'Jewelry',
    price: 189,
    desc: 'Handcrafted antique silver finish drop earrings with intricate peacock engravings and pearl beads.',
    tags: ['accessory', 'jewellery', 'ethnic'],
    compat: ['dress'],
    rating: 4.5,
    reviewCount: 3400,
    merchantApproved: true,
    icon: '💎',
    whyThis: ['Hypoallergenic nickel-free plating', 'Super lightweight on the ears', 'Budget perfection under ₹200']
  },
  {
    id: 'fa5',
    name: 'Faux Leather Crossbody Sling Bag',
    brand: 'Lavie',
    category: 'fashion',
    subCategory: 'Bag',
    price: 499,
    desc: 'Structured compact shoulder bag with gold-tone hardware and adjustable strap for essentials.',
    tags: ['accessory', 'bag', 'women'],
    compat: ['dress'],
    rating: 4.3,
    reviewCount: 1600,
    merchantApproved: true,
    icon: '👜',
    whyThis: ['Compact size for phone and cards', 'Durable vegan leather', 'Secure zip compartments']
  },
  {
    id: 'fa6',
    name: 'Oversized Vintage Graphic Cotton Tee',
    brand: 'Urban Monkey',
    category: 'fashion',
    subCategory: 'T-Shirt',
    price: 349,
    desc: '220 GSM heavyweight combed cotton oversized t-shirt with drop shoulders and retro screenprint.',
    tags: ['top', 'casual', 'oversized'],
    compat: ['footwear', 'accessory'],
    rating: 4.6,
    reviewCount: 2200,
    merchantApproved: true,
    icon: '👕',
    whyThis: ['Relaxed aesthetic streetwear fit', 'Heavyweight premium cotton', 'Pre-shrunk fabric']
  },

  // ==================== ELECTRONICS & KITCHEN APPLIANCES (ELECTRIC KETTLES, DESKS, GADGETS) ====================
  {
    id: 'kt1',
    name: '1.5L Stainless Steel Electric Kettle (1500W)',
    brand: 'Pigeon by Stovekraft',
    category: 'electronics',
    subCategory: 'Kettle',
    price: 599,
    desc: 'Hygienic 1.5-litre stainless steel cordless electric kettle with auto-cutoff, boil-dry protection, and 360-degree swivel base for rapid boiling.',
    tags: ['kettle', 'electric', 'appliance', 'kitchen', 'tea', 'coffee'],
    compat: ['adapter', 'dock'],
    rating: 4.5,
    reviewCount: 28400,
    merchantApproved: true,
    icon: '🫖',
    whyThis: ['Best-selling 1500W rapid boiling element', 'Automatic shut-off with dry boiling protection', 'Cool-touch handle with single-touch lid lock']
  },
  {
    id: 'kt2',
    name: 'PKOSS 1.5L 1500W Stainless Steel Electric Kettle',
    brand: 'Prestige',
    category: 'electronics',
    subCategory: 'Kettle',
    price: 749,
    desc: 'Durable concealed heating element with elegant stainless steel body, power indicator light, and automatic power cut-off.',
    tags: ['kettle', 'electric', 'appliance', 'kitchen'],
    compat: ['adapter'],
    rating: 4.6,
    reviewCount: 19200,
    merchantApproved: true,
    icon: '☕',
    whyThis: ['Concealed heating element for easy descaling', 'Prestige trusted warranty & service network', 'Sturdy 360-degree swivel power base']
  },
  {
    id: 'kt3',
    name: 'Aqua Plus 1.2L Double Wall Cool-Touch Stainless Kettle',
    brand: 'Havells',
    category: 'electronics',
    subCategory: 'Kettle',
    price: 1299,
    desc: 'Premium double-wall insulated kettle with 304 food-grade stainless steel interior and 100% cool-touch exterior to prevent burns.',
    tags: ['kettle', 'electric', 'appliance', 'kitchen', 'premium'],
    compat: ['adapter'],
    rating: 4.7,
    reviewCount: 8400,
    merchantApproved: true,
    icon: '🫖',
    whyThis: ['Double-wall insulation keeps water hot longer', 'Inner 304 stainless steel with zero plastic contact', '100% outer cool-touch safety']
  },
  {
    id: 'kt4',
    name: 'Regalia 1.8L Glass Electric Kettle with Blue LED',
    brand: 'Wonderchef',
    category: 'electronics',
    subCategory: 'Kettle',
    price: 1499,
    desc: 'Aesthetic heat-resistant borosilicate glass electric kettle with illuminated blue LED light ring while boiling and auto-cutoff.',
    tags: ['kettle', 'electric', 'appliance', 'kitchen', 'glass'],
    compat: ['adapter'],
    rating: 4.6,
    reviewCount: 6200,
    merchantApproved: true,
    icon: '✨',
    whyThis: ['Borosilicate glass body with zero metallic odor', 'Blue LED illumination ring during boiling', 'Large 1.8L family capacity']
  },
  {
    id: 'kt5',
    name: 'Daily Collection HD9306 1.5L Stainless Steel Kettle',
    brand: 'Philips',
    category: 'electronics',
    subCategory: 'Kettle',
    price: 1999,
    desc: 'Precision European engineered food-grade stainless steel kettle with steam sensor and dry boiling prevention.',
    tags: ['kettle', 'electric', 'appliance', 'kitchen'],
    compat: ['dock'],
    rating: 4.8,
    reviewCount: 7800,
    merchantApproved: true,
    icon: '⚡',
    whyThis: ['Philips precision thermostat control', 'Wide opening lid for effortless cleaning', 'Durable 304 stainless steel build']
  },
  {
    id: 'el1',
    name: 'Keychron K2 Wireless Mechanical Keyboard (Hot-Swap)',
    brand: 'Keychron',
    category: 'electronics',
    subCategory: 'Keyboard',
    price: 4999,
    desc: '75% compact wireless mechanical keyboard with tactile pre-lubed Gateron switches, Mac/Windows layout toggle, and Bluetooth 5.1.',
    tags: ['coding', 'desk', 'keyboard'],
    compat: ['mouse', 'monitor', 'dock'],
    rating: 4.8,
    reviewCount: 3400,
    merchantApproved: true,
    icon: '⌨️',
    whyThis: ['Tactile switches reduce typing fatigue', 'Multi-device pairing across 3 devices', 'Premium aluminium chassis']
  },
  {
    id: 'el2',
    name: 'Logitech MX Master 3S Ergonomic Mouse',
    brand: 'Logitech',
    category: 'electronics',
    subCategory: 'Mouse',
    price: 6999,
    desc: '8000 DPI electromagnetic MagSpeed scroll wheel with 90% quieter clicks and customizable thumb wheel.',
    tags: ['coding', 'mouse', 'desk', 'ergonomics'],
    compat: ['keyboard', 'monitor'],
    rating: 4.9,
    reviewCount: 8900,
    merchantApproved: true,
    icon: '🖱️',
    whyThis: ['Prevents RSI wrist strain', 'Infinite 1000 lines/sec scrolling', 'Tracks on glass surfaces']
  },
  {
    id: 'el3',
    name: '27" 1440p QHD 75Hz IPS Monitor with Pivot',
    brand: 'LG UltraFine',
    category: 'electronics',
    subCategory: 'Monitor',
    price: 18999,
    desc: '99% sRGB color-calibrated display with pivot vertical orientation for reading long code stacks and documentation.',
    tags: ['coding', 'monitor', 'desk'],
    compat: ['keyboard', 'dock'],
    rating: 4.7,
    reviewCount: 1200,
    merchantApproved: true,
    icon: '🖥️',
    whyThis: ['Crisp syntax rendering without pixelation', '90-degree pivot for vertical coding', 'USB-C 65W charging']
  },
  {
    id: 'el4',
    name: 'USB-C 8-in-1 Dual 4K Docking Station',
    brand: 'Anker',
    category: 'electronics',
    subCategory: 'Dock',
    price: 2499,
    desc: '10Gbps pass-through hub with dual HDMI, 100W Power Delivery, Gigabit Ethernet, and SD card readers.',
    tags: ['coding', 'dock', 'desk'],
    compat: ['monitor', 'keyboard'],
    rating: 4.5,
    reviewCount: 3100,
    merchantApproved: true,
    icon: '🔌',
    whyThis: ['Single-cable desk setup', '100W laptop fast charging', 'Dual monitor display support']
  },
  {
    id: 'el5',
    name: 'WH-1000XM4 Active Noise Cancelling Headphones',
    brand: 'Sony',
    category: 'electronics',
    subCategory: 'Audio',
    price: 16999,
    desc: 'Industry-leading dual-noise sensor technology for uninterrupted flow state during deep programming work.',
    tags: ['coding', 'audio', 'focus'],
    compat: ['dock'],
    rating: 4.8,
    reviewCount: 14200,
    merchantApproved: true,
    icon: '🎧',
    whyThis: ['Blocks out all background chatter', '30-hour battery life', 'Multi-point Bluetooth switching']
  },
  {
    id: 'el6',
    name: 'Aluminium Ergonomic Laptop Riser Stand',
    brand: 'Portronics',
    category: 'electronics',
    subCategory: 'Accessory',
    price: 999,
    desc: 'Adjustable folding aluminium riser that raises screen to eye-level and prevents neck strain.',
    tags: ['coding', 'desk', 'accessory'],
    compat: ['keyboard'],
    rating: 4.4,
    reviewCount: 4500,
    merchantApproved: true,
    icon: '📐',
    whyThis: ['Improves posture & neck comfort', 'Enhances laptop cooling ventilation', 'Solid unibody aluminium']
  },

  // ==================== GAMING ====================
  {
    id: 'gm1',
    name: 'Razer DeathAdder Essential Gaming Mouse',
    brand: 'Razer',
    category: 'gaming',
    subCategory: 'Mouse',
    price: 1299,
    desc: '6400 DPI optical sensor with 5 programmable Hyperesponse buttons and mechanical switches.',
    tags: ['gaming', 'mouse'],
    compat: ['keyboard', 'headset'],
    rating: 4.6,
    reviewCount: 9800,
    merchantApproved: true,
    icon: '🎮',
    whyThis: ['Ergonomic grip for FPS gaming', 'Proven mechanical switch durability', 'Instant DPI toggle']
  },
  {
    id: 'gm2',
    name: 'Cloud Core 7.1 Surround Sound Gaming Headset',
    brand: 'HyperX',
    category: 'gaming',
    subCategory: 'Headset',
    price: 3499,
    desc: 'Signature memory foam ear cushions with 53mm directional drivers for spatial footsteps detection in games.',
    tags: ['gaming', 'audio', 'headset'],
    compat: ['mouse'],
    rating: 4.7,
    reviewCount: 5400,
    merchantApproved: true,
    icon: '🎙️',
    whyThis: ['Pinpoint spatial audio cues', 'Durable aluminium frame', 'Detachable noise-cancelling mic']
  },
  {
    id: 'gm3',
    name: 'Extended Speed Gaming Mousepad XXL (900x400mm)',
    brand: 'Redragon',
    category: 'gaming',
    subCategory: 'Accessory',
    price: 499,
    desc: 'Micro-textured waterproof cloth surface with stitched anti-fraying edges for smooth mouse glide.',
    tags: ['gaming', 'accessory'],
    compat: ['mouse'],
    rating: 4.5,
    reviewCount: 3100,
    merchantApproved: true,
    icon: '⬛',
    whyThis: ['Low-friction tracking glide', 'Covers full desk area', 'Non-slip rubber base']
  },

  // ==================== TRAVEL ====================
  {
    id: 'tr1',
    name: '40L Flight Approved Expandable Travel Backpack',
    brand: 'Mokobara',
    category: 'travel',
    subCategory: 'Backpack',
    price: 2999,
    desc: 'TSA cabin-approved waterproof backpack with 180-degree suitcase clamshell opening and padded 16" laptop compartment.',
    tags: ['travel', 'backpack'],
    compat: ['organizer', 'adapter'],
    rating: 4.7,
    reviewCount: 1400,
    merchantApproved: true,
    icon: '🎒',
    whyThis: ['Cabin luggage compliant on all airlines', 'Hidden anti-theft passport pocket', 'Breathable lumbar back panel']
  },
  {
    id: 'tr2',
    name: 'Compression Packing Cubes 6-Piece Set',
    brand: 'AmazonBasics',
    category: 'travel',
    subCategory: 'Organizer',
    price: 799,
    desc: 'High-density ripstop nylon organizers that compress clothing volume by 40% for wrinkle-free packing.',
    tags: ['travel', 'organizer', 'essential'],
    compat: ['backpack'],
    rating: 4.6,
    reviewCount: 3800,
    merchantApproved: true,
    icon: '🧳',
    whyThis: ['Maximizes suitcase space', 'Tear-resistant double zippers', 'Mesh breathable windows']
  },
  {
    id: 'tr3',
    name: 'Universal All-in-One Global Travel Adapter with Fast USB-C',
    brand: 'Syska',
    category: 'travel',
    subCategory: 'Adapter',
    price: 699,
    desc: 'Dual USB-C + 2 USB-A smart fast charger compatible in 150+ countries across US, UK, EU, and AU.',
    tags: ['travel', 'essential', 'accessory'],
    compat: ['backpack'],
    rating: 4.5,
    reviewCount: 2900,
    merchantApproved: true,
    icon: '🔌',
    whyThis: ['One plug for all continents', 'Built-in fuse protection', 'Charges 4 devices simultaneously']
  },
  {
    id: 'tr4',
    name: '360 Memory Foam Ergonomic Travel Neck Pillow',
    brand: 'CushionLab',
    category: 'travel',
    subCategory: 'Pillow',
    price: 499,
    desc: '360-degree chin and cervical support pillow with machine-washable cooling modal fabric that packs into a compact pouch.',
    tags: ['travel', 'comfort', 'accessory'],
    compat: ['backpack'],
    rating: 4.4,
    reviewCount: 1800,
    merchantApproved: true,
    icon: '💤',
    whyThis: ['Prevents neck stiffness during flights', 'Rolls up into tiny travel pouch', 'Cooling breathable fabric']
  },

  // ==================== PRODUCTIVITY & WORKSPACE ====================
  {
    id: 'pr1',
    name: 'Adjustable Standing Desk Converter',
    brand: 'Sunon',
    category: 'productivity',
    subCategory: 'Desk',
    price: 6499,
    desc: 'Gas-spring sit-stand riser that elevates laptop and dual monitors smoothly without replacing existing desk.',
    tags: ['productivity', 'desk', 'ergonomics'],
    compat: ['accessory'],
    rating: 4.6,
    reviewCount: 890,
    merchantApproved: true,
    icon: '📐',
    whyThis: ['Effortless height transition', 'Supports dual monitors', 'Solid steel base']
  },
  {
    id: 'pr2',
    name: 'Eye-Care ScreenBar Monitor Light with Touch Sensor',
    brand: 'Baseus',
    category: 'productivity',
    subCategory: 'Lamp',
    price: 1699,
    desc: 'Asymmetrical optical design that illuminates desk workspace without reflecting glare on the monitor screen.',
    tags: ['productivity', 'desk', 'focus'],
    compat: ['desk'],
    rating: 4.7,
    reviewCount: 2300,
    merchantApproved: true,
    icon: '💡',
    whyThis: ['Zero screen reflection', 'Adjustable color temperature (Warm to Cool)', 'USB powered']
  },
  {
    id: 'pr3',
    name: 'Physical Pomodoro Focus Timer Device',
    brand: 'Ticktime',
    category: 'productivity',
    subCategory: 'Focus',
    price: 899,
    desc: 'Hexagonal physical flip timer that keeps you in deep work flow without looking at phone notifications.',
    tags: ['productivity', 'focus', 'accessory'],
    compat: ['desk'],
    rating: 4.5,
    reviewCount: 1400,
    merchantApproved: true,
    icon: '⏱️',
    whyThis: ['Eliminates smartphone distractions', 'Flip to start countdown', 'Rechargeable battery']
  }
];

export const PRODUCTS_CATALOG: Product[] = RAW_CATALOG.map(p => {
  const listings = generateListings(p.id, p.name, p.brand, p.price, p.category, p.rating);
  const best = listings[0];

  return {
    ...p,
    listings,
    bestPrice: best.price,
    bestPlatform: best.platform,
    bestPlatformName: best.platformName,
    bestPlatformUrl: best.productUrl
  };
});
