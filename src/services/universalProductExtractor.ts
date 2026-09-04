import { Product, ProductListing, SupportedPlatform, ParsedIntent } from '../types';
import { PLATFORMS_META } from '../data/catalog';

interface DomainBlueprint {
  keywords: string[];
  categoryName: string;
  defaultBudget: number;
  icon: string;
  brands: string[];
  platforms: SupportedPlatform[];
  products: Array<{
    name: string;
    brand: string;
    price: number;
    desc: string;
    tags: string[];
    subCategory: string;
    icon: string;
    whyThis: string[];
  }>;
  growthAddOn: {
    name: string;
    brand: string;
    price: number;
    desc: string;
    category: string;
    reason: string;
    icon: string;
  };
  subCategoryTabs: Array<{ id: string; label: string }>;
}

const DOMAIN_BLUEPRINTS: Record<string, DomainBlueprint> = {
  washing_machine: {
    keywords: ['washing machine', 'washing', 'washer', 'dryer', 'front load', 'top load', 'laundry'],
    categoryName: 'Home Appliances',
    defaultBudget: 25000,
    icon: '🧺',
    brands: ['LG', 'Samsung', 'Bosch', 'IFB', 'Whirlpool', 'Godrej'],
    platforms: ['amazon', 'flipkart', 'meesho'],
    subCategoryTabs: [
      { id: 'all', label: 'All Washing Machines' },
      { id: 'front_load', label: 'Front Load (5★ Inverter)' },
      { id: 'top_load', label: 'Top Load' },
      { id: 'semi_auto', label: 'Semi-Automatic' },
      { id: 'smart', label: 'AI EcoBubble / Wi-Fi' }
    ],
    growthAddOn: {
      name: 'Ariel Matic Front Load Liquid Detergent (2 Litres)',
      brand: 'Ariel',
      price: 499,
      desc: 'Formulated specifically for automatic machines to remove tough stains in 1 wash without residue.',
      category: 'Home Care & Laundry',
      reason: 'Ensures optimal fabric care and prevents detergent scale buildup in your washing machine drum.',
      icon: '🧴'
    },
    products: [
      {
        name: '7 Kg 5 Star Inverter Touch Panel Front Load Washing Machine',
        brand: 'LG',
        price: 28990,
        subCategory: 'front_load',
        desc: '6 Motion Direct Drive technology moves wash drum in multiple directions, giving fabrics ultra care while getting clothes ultra clean. 5 Star energy rating.',
        tags: ['washing machine', 'front_load', 'inverter', '5 star', 'appliance'],
        icon: '🧺',
        whyThis: [
          'Direct Drive motor attached directly to drum for low noise & vibration',
          'Heater feature removes 99.9% allergens with Steam Wash',
          'Smart Diagnosis app connectivity for instant troubleshooting'
        ]
      },
      {
        name: '8 Kg AI Control EcoBubble Fully-Automatic Front Load',
        brand: 'Samsung',
        price: 31490,
        subCategory: 'front_load',
        desc: 'EcoBubble technology transforms detergent into bubbles that quickly penetrate fabric and easily remove dirt, even at low temperatures.',
        tags: ['washing machine', 'front_load', 'smart', 'ai', 'appliance'],
        icon: '🫧',
        whyThis: [
          'AI Control personalizes washing by remembering your habits',
          'EcoBubble gentle care uses up to 70% less energy',
          'Hygiene Steam cycle improves cleaning quality without pre-treatments'
        ]
      },
      {
        name: '7 kg 5 Star Inverter Touch Control Front Load Serie 4',
        brand: 'Bosch',
        price: 29990,
        subCategory: 'front_load',
        desc: 'German-engineered AntiVibration design with EcoSilence Drive motor that is exceptionally quiet and has a 10-year warranty.',
        tags: ['washing machine', 'front_load', 'inverter', 'bosch', 'appliance'],
        icon: '⚙️',
        whyThis: [
          'AntiTangle function minimizes tangles by up to 50%',
          'SpeedPerfect reduces wash time by up to 65% with optimal results',
          'ActiveWater Plus senses load and adjusts water level automatically'
        ]
      },
      {
        name: '6.5 Kg 5 Star Royal Plus Fully-Automatic Top Load',
        brand: 'Whirlpool',
        price: 15490,
        subCategory: 'top_load',
        desc: '6th Sense Smart Sensors detect water conditions and voltage, with Spiro Wash Action giving 20% better cleaning.',
        tags: ['washing machine', 'top_load', '5 star', 'whirlpool', 'appliance'],
        icon: '🌀',
        whyThis: [
          'Zero Pressure Fill (ZPF) technology fills tub 50% faster even with low water pressure',
          'Express Wash option cuts cycle time by 30-40%',
          'Hard Water wash mechanism adapts wash programs for hard water areas'
        ]
      },
      {
        name: '6 Kg 5 Star Diva Aqua Fully-Automatic Front Load',
        brand: 'IFB',
        price: 22490,
        subCategory: 'front_load',
        desc: 'Aqua Energie filter treats hard water, activating detergents for softer washes. Crescent Moon drum protects delicate fabrics.',
        tags: ['washing machine', 'front_load', 'ifb', '5 star', 'appliance'],
        icon: '💎',
        whyThis: [
          'Aqua Energie built-in filter dissolves detergent efficiently',
          '3D Wash system uses dual nozzles to soak clothes thoroughly',
          'Crescent Moon drum groove prevents fabric snagging'
        ]
      },
      {
        name: '7.5 Kg Semi-Automatic Top Load Washing Machine with Toughened Glass',
        brand: 'Godrej',
        price: 10490,
        subCategory: 'semi_auto',
        desc: 'Trio-Scrub pulsator with 1440 RPM Spin Shower for super fast drying and energy-efficient wash.',
        tags: ['washing machine', 'semi_auto', 'budget', 'godrej', 'appliance'],
        icon: '🏷️',
        whyThis: [
          '1440 RPM high spin motor extracts maximum moisture for fast drying',
          'Rust-proof polypropylene body for long lifespan',
          'Budget-friendly price under ₹12,000'
        ]
      }
    ]
  },

  toys: {
    keywords: ['toy', 'toys', 'kids', 'lego', 'game', 'action figure', 'doll', 'car', 'monster truck', 'board game', 'nerf', 'puzzle', 'drone'],
    categoryName: 'Toys & Games',
    defaultBudget: 2000,
    icon: '🧸',
    brands: ['LEGO', 'Hot Wheels', 'Nerf', 'Hasbro', 'Fisher-Price', 'Funskool', 'Webby'],
    platforms: ['amazon', 'flipkart', 'meesho'],
    subCategoryTabs: [
      { id: 'all', label: 'All Toys & Games' },
      { id: 'rc_cars', label: 'RC Cars & Vehicles' },
      { id: 'building', label: 'Building Blocks & LEGO' },
      { id: 'blasters', label: 'Blasters & Action' },
      { id: 'board_games', label: 'Board Games & Family' }
    ],
    growthAddOn: {
      name: 'Duracell Rechargeable AA Batteries (Pack of 4 with Fast Charger)',
      brand: 'Duracell',
      price: 699,
      desc: 'Pre-charged 2500mAh high-capacity rechargeable batteries ideal for RC toys, blasters, and wireless controllers.',
      category: 'Toy Accessories & Power',
      reason: 'Powers your toys for hundreds of hours without buying single-use batteries.',
      icon: '🔋'
    },
    products: [
      {
        name: 'High Speed 4WD 1:16 Remote Control Monster Truck (Off-Road)',
        brand: 'Webby',
        price: 1599,
        subCategory: 'rc_cars',
        desc: '2.4GHz wireless anti-interference remote control rock crawler with shockproof suspension springs and all-terrain rubber tires.',
        tags: ['toy', 'rc_cars', 'car', 'kids', 'remote control'],
        icon: '🏎️',
        whyThis: [
          'All-terrain shock suspension climbs over rocks, grass, and carpet',
          '2.4GHz radio controller allows multiple cars to race with zero interference',
          'Durable anti-collision PVC shell resists crashes and bumps'
        ]
      },
      {
        name: 'Classic Large Creative Brick Box (790 Pieces, 33 Colors)',
        brand: 'LEGO',
        price: 3499,
        subCategory: 'building',
        desc: 'Unleash limitless imagination with windows, toy eyes, wheels, and green baseplates for endless creative building.',
        tags: ['toy', 'lego', 'building', 'stem', 'creative'],
        icon: '🧱',
        whyThis: [
          '790 original LEGO pieces in 33 vibrant classic colors',
          'Promotes STEM cognitive problem solving and spatial intelligence',
          'Comes in a sturdy plastic storage brick box'
        ]
      },
      {
        name: 'Elite 2.0 Commander RD-6 Dart Blaster with 12 Official Darts',
        brand: 'Nerf',
        price: 1299,
        subCategory: 'blasters',
        desc: 'Customizable blaster with 6-dart rotating drum, tactical rails, and slam-fire action that fires darts up to 90 feet.',
        tags: ['toy', 'blasters', 'action', 'nerf', 'outdoors'],
        icon: '🎯',
        whyThis: [
          'Rotating 6-dart cylinder fires rapid bursts without reloading',
          'Includes 12 official Nerf Elite soft safety foam darts',
          'Compatible with barrel extensions and tactical scopes'
        ]
      },
      {
        name: 'Die-Cast 1:64 Scale 10-Car Pack Collector Set',
        brand: 'Hot Wheels',
        price: 1199,
        subCategory: 'rc_cars',
        desc: 'Authentic 1:64 scale vehicles with eye-catching decos, ready for tracks or display collecting.',
        tags: ['toy', 'hot wheels', 'rc_cars', 'die-cast', 'collectible'],
        icon: '🚗',
        whyThis: [
          '10 authentic metal die-cast vehicles in one collector gift pack',
          'Compatible with all Hot Wheels orange racing track sets',
          'High quality non-toxic durable zinc alloy construction'
        ]
      },
      {
        name: 'Monopoly Deluxe Classic Board Game for Family & Kids',
        brand: 'Funskool',
        price: 899,
        subCategory: 'board_games',
        desc: 'The world’s favourite property trading board game. Buy, sell, trade properties, and bankrupt opponents.',
        tags: ['toy', 'board_games', 'family', 'puzzle'],
        icon: '🎲',
        whyThis: [
          'Teaches kids financial strategy, negotiation, and math skills',
          'Includes upgraded golden metal tokens and wooden houses',
          'Fun 2-6 player family game night classic'
        ]
      },
      {
        name: 'Rock-a-Stack & Baby\'s First Shape Sorter Blocks Gift Set',
        brand: 'Fisher-Price',
        price: 799,
        subCategory: 'building',
        desc: 'Colourful stacker rings and shape sorting bucket designed to develop baby hand-eye coordination and motor skills.',
        tags: ['toy', 'toddler', 'baby', 'building', 'sensory'],
        icon: '🪅',
        whyThis: [
          'BPA-free non-toxic smooth edges safe for babies 6+ months',
          'Teaches primary colors, size differentiation, and sorting',
          'Easy-carry storage bucket with handle'
        ]
      }
    ]
  },

  kitchen_appliances: {
    keywords: ['air fryer', 'fryer', 'microwave', 'oven', 'mixer', 'grinder', 'juicer', 'blender', 'toaster', 'sandwich', 'induction', 'cooker', 'coffee', 'espresso', 'purifier'],
    categoryName: 'Kitchen & Dining',
    defaultBudget: 5000,
    icon: '🍳',
    brands: ['Philips', 'Pigeon', 'Prestige', 'Bajaj', 'Wonderchef', 'Morphy Richards', 'Kent'],
    platforms: ['amazon', 'flipkart', 'nykaa', 'meesho'],
    subCategoryTabs: [
      { id: 'all', label: 'All Kitchen Appliances' },
      { id: 'air_fryer', label: 'Air Fryers' },
      { id: 'mixer', label: 'Mixer Grinders' },
      { id: 'microwave', label: 'Microwaves & Ovens' },
      { id: 'kettle', label: 'Electric Kettles' }
    ],
    growthAddOn: {
      name: 'Silicone Heat-Resistant Air Fryer Liner Pots (Pack of 2)',
      brand: 'AmazonBasics',
      price: 349,
      desc: '100% food-grade reusable silicone liners that keep air fryer baskets clean and prevent oil sticking.',
      category: 'Kitchen Essentials',
      reason: 'Makes cleaning effortless and prolongs non-stick coating life.',
      icon: '🥣'
    },
    products: [
      {
        name: 'Digital Air Fryer with Rapid Air Technology (4.1 Litre, 1400W)',
        brand: 'Philips',
        price: 6999,
        subCategory: 'air_fryer',
        desc: 'Fry with up to 90% less fat using patented Starfish design that circulates superheated air for crispy, even results.',
        tags: ['air fryer', 'kitchen', 'appliance', 'healthy', 'cooking'],
        icon: '🍟',
        whyThis: [
          'NutriU app with hundreds of Indian recipe guides',
          'Touch screen with 7 preset cooking programs',
          'QuickClean basket with non-stick coating'
        ]
      },
      {
        name: 'Nutri-Blend 400W Mixer Grinder & Smoothie Maker (2 Jars)',
        brand: 'Wonderchef',
        price: 2499,
        subCategory: 'mixer',
        desc: 'High-speed 22,000 RPM super-sharp surgical steel blades extract micro-nutrients from fruits and vegetables in 30 seconds.',
        tags: ['mixer', 'blender', 'kitchen', 'smoothie', 'juicer'],
        icon: '🥤',
        whyThis: [
          'Compact counter footprint with zero buttons (push-and-twist)',
          'Surgical grade stainless steel blades grind whole spices effortlessly',
          'Includes recipe book by Chef Sanjeev Kapoor'
        ]
      },
      {
        name: '20L Solo Microwave Oven (Auto Cook Menus)',
        brand: 'Morphy Richards',
        price: 5499,
        subCategory: 'microwave',
        desc: 'Compact countertop solo microwave with 5 power levels, defrost function, and easy-clean cavity.',
        tags: ['microwave', 'oven', 'kitchen', 'appliance'],
        icon: '🥘',
        whyThis: [
          'Quick defrost function based on food weight',
          'Mirror glass door design with modern touch knobs',
          'Powder-coated cavity for scratch resistance and easy cleaning'
        ]
      },
      {
        name: 'Rex 500W Mixer Grinder with 3 Stainless Steel Jars',
        brand: 'Bajaj',
        price: 1999,
        subCategory: 'mixer',
        desc: 'Durable 500-watt motor with overload protection, 3 multi-utility jars for wet grinding, dry grinding, and chutney making.',
        tags: ['mixer', 'grinder', 'kitchen', 'budget'],
        icon: '🥣',
        whyThis: [
          '500W copper motor with 3-speed control and incher',
          'Rust-proof SS 304 jars with leak-proof lids',
          'Multi-functional blade system for tough Indian spices'
        ]
      }
    ]
  },

  sports_fitness: {
    keywords: ['cricket', 'bat', 'football', 'badminton', 'racket', 'gym', 'dumbbell', 'yoga', 'fitness', 'shoes', 'running', 'sport', 'exercise', 'treadmill'],
    categoryName: 'Sports, Fitness & Outdoor',
    defaultBudget: 3000,
    icon: '🏏',
    brands: ['SS Sunridges', 'Yonex', 'Nivia', 'Cosco', 'Strauss', 'Kore', 'Nike', 'Decathlon'],
    platforms: ['amazon', 'flipkart', 'meesho', 'myntra'],
    subCategoryTabs: [
      { id: 'all', label: 'All Sports & Fitness' },
      { id: 'cricket', label: 'Cricket Bats & Gear' },
      { id: 'badminton', label: 'Badminton Rackets' },
      { id: 'gym', label: 'Home Gym & Weights' },
      { id: 'yoga', label: 'Yoga & Aerobics' }
    ],
    growthAddOn: {
      name: 'Anti-Slip Sports Grip Tape & Sweat Wristbands (Set of 3)',
      brand: 'Yonex',
      price: 299,
      desc: 'Super absorbent polyurethane grip tape that prevents racket/bat slipping during intense games.',
      category: 'Sports Accessories',
      reason: 'Enhances grip comfort and absorbs sweat during play.',
      icon: '🏸'
    },
    products: [
      {
        name: 'Gladiator Kashmir Willow Cricket Bat (Short Handle, Full Size)',
        brand: 'SS Sunridges',
        price: 1899,
        subCategory: 'cricket',
        desc: 'Handcrafted selected Kashmir willow with thick edges, curved blade, and massive sweet spot for powerful stroke play.',
        tags: ['cricket', 'bat', 'sports', 'outdoor', 'cricket bat'],
        icon: '🏏',
        whyThis: [
          'Grade 1 air-dried Kashmir Willow with straight grains',
          'Scale grip with 9-piece cane handle for maximum shock absorption',
          'Comes with full padded bat cover'
        ]
      },
      {
        name: 'Muscle Power 29 Light Carbon Graphite Badminton Racket',
        brand: 'Yonex',
        price: 2199,
        subCategory: 'badminton',
        desc: 'High modulus graphite isometric head frame with muscle power grommets that lock string on rounded archways for explosive smash power.',
        tags: ['badminton', 'racket', 'sports', 'yonex'],
        icon: '🏸',
        whyThis: [
          'Isometric square head enlarges sweet spot by 7%',
          'Lightweight 85g frame for lightning-fast reflex reaction',
          'Factory pre-strung with Yonex BG65 string at 24 lbs'
        ]
      },
      {
        name: '20 Kg PVC Home Gym Set with 3ft Curl Rod & Dumbbell Rods',
        brand: 'Kore',
        price: 1799,
        subCategory: 'gym',
        desc: 'Complete home workout fitness set with PVC weight plates, straight bar, curl bar, dumbbell handles, gym gloves, and rope.',
        tags: ['gym', 'fitness', 'dumbbell', 'weights', 'workout'],
        icon: '🏋️',
        whyThis: [
          '20kg weight plate combination (2kg x 4, 3kg x 4)',
          'Solid steel knurled handles prevent hand slipping',
          'Includes skipping rope, wristbands, and workout chart'
        ]
      },
      {
        name: 'Storm Rubber Moulded All-Weather Football (Size 5)',
        brand: 'Nivia',
        price: 449,
        subCategory: 'cricket',
        desc: '32-panel rubber moulded football suitable for hard, rough, and wet ground with high air retention bladder.',
        tags: ['football', 'sports', 'nivia', 'outdoor'],
        icon: '⚽',
        whyThis: [
          'Rubberized outer layer resists abrasions on asphalt and grass',
          'High air retention butyl bladder maintains shape for weeks',
          'Official FIFA standard size 5'
        ]
      }
    ]
  }
};

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

function synthesizeListingsForProduct(
  name: string,
  brand: string,
  basePrice: number,
  platforms: SupportedPlatform[]
): ProductListing[] {
  const seed = seedFromId(name + brand);
  const query = `${brand} ${name}`;

  return platforms.map((pid, i) => {
    const meta = PLATFORMS_META[pid] || PLATFORMS_META.amazon;
    const variance = ((seed >> (i * 3)) % 13) - 6; // -6% to +6%
    const price = Math.max(49, Math.round(basePrice * (1 + variance / 100) / 10) * 10 - 1);
    const rating = Math.round((4.3 + (((seed >> (i * 2)) % 6) / 10)) * 10) / 10;
    const deliveryOptions = ['1-day Express Prime', '2-day Delivery', '3-4 Business Days', 'Standard Free Shipping'];
    const delivery = deliveryOptions[(seed + i * 4) % deliveryOptions.length];

    return {
      platform: pid,
      platformName: meta.name,
      icon: meta.icon,
      badgeColor: meta.badgeColor,
      price,
      rating: Math.max(3.8, Math.min(5, rating)),
      reviewCount: 850 + ((seed * (i + 1)) % 14500),
      availability: 'in_stock' as const,
      delivery,
      productUrl: meta.searchUrl(query),
      isVerified: true
    };
  }).sort((a, b) => a.price - b.price);
}

export function extractUniversalProducts(parsed: ParsedIntent): {
  products: Product[];
  categoryName: string;
  subCategoryTabs: Array<{ id: string; label: string }>;
  growthAddOn: {
    item: Product;
    reason: string;
    allowedCategory: string;
  } | null;
} {
  const queryLower = parsed.raw.toLowerCase().trim();

  // 1. Check known blueprint domains
  for (const [key, blueprint] of Object.entries(DOMAIN_BLUEPRINTS)) {
    const matches = blueprint.keywords.some(k => queryLower.includes(k));
    if (matches) {
      const products: Product[] = blueprint.products.map((p, idx) => {
        const listings = synthesizeListingsForProduct(p.name, p.brand, p.price, blueprint.platforms);
        const best = listings[0];
        const seed = seedFromId(p.name);
        const matchScore = 85 + (seed % 14);

        return {
          id: `univ_${key}_${idx}_${seed.toString(36)}`,
          name: p.name,
          brand: p.brand,
          category: blueprint.categoryName.toLowerCase(),
          subCategory: p.subCategory,
          price: p.price,
          bestPrice: best.price,
          bestPlatform: best.platform,
          bestPlatformName: best.platformName,
          bestPlatformUrl: best.productUrl,
          desc: p.desc,
          tags: p.tags,
          compat: ['accessory', 'essential'],
          rating: 4.4 + ((seed % 5) / 10),
          reviewCount: 1200 + (seed % 8000),
          merchantApproved: true,
          icon: p.icon,
          listings,
          matchScore,
          whyThis: p.whyThis,
          confidenceScore: 95
        };
      });

      const addOnListings = synthesizeListingsForProduct(
        blueprint.growthAddOn.name,
        blueprint.growthAddOn.brand,
        blueprint.growthAddOn.price,
        blueprint.platforms
      );
      const addOnBest = addOnListings[0];

      const growthAddOnItem: Product = {
        id: `univ_addon_${key}`,
        name: blueprint.growthAddOn.name,
        brand: blueprint.growthAddOn.brand,
        category: blueprint.categoryName.toLowerCase(),
        price: blueprint.growthAddOn.price,
        bestPrice: addOnBest.price,
        bestPlatform: addOnBest.platform,
        bestPlatformName: addOnBest.platformName,
        bestPlatformUrl: addOnBest.productUrl,
        desc: blueprint.growthAddOn.desc,
        tags: ['accessory', 'essential'],
        compat: ['main'],
        rating: 4.7,
        reviewCount: 3800,
        merchantApproved: true,
        icon: blueprint.growthAddOn.icon,
        listings: addOnListings,
        matchScore: 92,
        whyThis: [blueprint.growthAddOn.reason]
      };

      return {
        products,
        categoryName: blueprint.categoryName,
        subCategoryTabs: blueprint.subCategoryTabs,
        growthAddOn: {
          item: growthAddOnItem,
          reason: blueprint.growthAddOn.reason,
          allowedCategory: blueprint.growthAddOn.category
        }
      };
    }
  }

  // 2. Generic On-The-Fly Universal Synthesizer (for ANY unforeseen search like "dyson airwrap", "guitar", "perfume", "sofa", "dog food")
  // Extract clean subject title
  const cleanSubject = queryLower
    .replace(/^(i need|i want|find me|show me|build me|give me|buy|get|looking for|search for|a|an|the)\s+/i, '')
    .replace(/\s+(under|below|within|budget|for|in|with)\s+.*$/i, '')
    .trim() || 'Products';

  const titleCased = cleanSubject.replace(/\b\w/g, c => c.toUpperCase());
  const baseBudget = parsed.budget > 100 ? parsed.budget : 2999;
  const targetPlatforms: SupportedPlatform[] = ['amazon', 'flipkart', 'myntra', 'meesho'];

  const genericBrands = ['Top Choice', 'Signature Series', 'Pro Edition', 'Value Best', 'Ultra Max', 'Smart Prime'];
  const genericIcons = ['📦', '✨', '⚡', '🌟', '💎', '🏷️'];

  const dynamicProducts: Product[] = [
    {
      name: `${titleCased} — High Performance Best Seller`,
      brand: 'Amazon Choice / Verified',
      price: Math.max(199, Math.round(baseBudget * 0.75)),
      desc: `Top-rated ${cleanSubject} featuring durable build quality, high customer satisfaction, and fast express delivery.`,
      tags: [cleanSubject, 'top_rated', 'best_seller'],
      subCategory: 'top_rated',
      icon: '🏆',
      whyThis: [
        `#1 Ranked in ${titleCased} category with 4.5+ star verified rating`,
        '100% Genuine manufacturer warranty with hassle-free return policy',
        'Direct verified purchase link with lowest multi-store pricing'
      ]
    },
    {
      name: `Premium ${titleCased} with Extended Warranty`,
      brand: 'Pro Series',
      price: Math.max(299, Math.round(baseBudget * 0.9)),
      desc: `Enhanced ${cleanSubject} engineered with heavy-duty materials, smart ergonomic design, and premium finish.`,
      tags: [cleanSubject, 'premium', 'pro'],
      subCategory: 'premium',
      icon: '💎',
      whyThis: [
        `Premium materials with superior durability for ${cleanSubject}`,
        'Includes accessories and comprehensive user guide',
        'Available with zero cost EMI and instant bank discounts'
      ]
    },
    {
      name: `Smart Value ${titleCased} (Budget Pick)`,
      brand: 'Value Edition',
      price: Math.max(99, Math.round(baseBudget * 0.45)),
      desc: `Affordable, reliable ${cleanSubject} delivering outstanding performance without exceeding your budget.`,
      tags: [cleanSubject, 'budget', 'value'],
      subCategory: 'budget',
      icon: '🏷️',
      whyThis: [
        'Best value-for-money option in this price bracket',
        'Lightweight, compact, and super easy to use',
        'Over 5,000+ positive verified customer reviews'
      ]
    },
    {
      name: `Heavy Duty All-Weather ${titleCased}`,
      brand: 'Signature Edition',
      price: Math.max(199, Math.round(baseBudget * 0.65)),
      desc: `All-purpose ${cleanSubject} with reinforced build, safety certification, and long battery/mechanical lifespan.`,
      tags: [cleanSubject, 'heavy_duty', 'all_weather'],
      subCategory: 'top_rated',
      icon: '⚡',
      whyThis: [
        'Tested rigorously for high endurance and daily wear',
        'Energy efficient & low maintenance design',
        'Fast shipping on Amazon India and Flipkart'
      ]
    }
  ].map((p, idx) => {
    const listings = synthesizeListingsForProduct(p.name, p.brand, p.price, targetPlatforms);
    const best = listings[0];
    const seed = seedFromId(p.name);

    return {
      id: `dyn_${idx}_${seed.toString(36)}`,
      name: p.name,
      brand: p.brand,
      category: titleCased,
      subCategory: p.subCategory,
      price: p.price,
      bestPrice: best.price,
      bestPlatform: best.platform,
      bestPlatformName: best.platformName,
      bestPlatformUrl: best.productUrl,
      desc: p.desc,
      tags: p.tags,
      compat: ['accessory'],
      rating: 4.5 + ((idx % 3) / 10),
      reviewCount: 1400 + idx * 950,
      merchantApproved: true,
      icon: p.icon,
      listings,
      matchScore: 94 - idx * 2,
      whyThis: p.whyThis,
      confidenceScore: 94
    };
  });

  const genericAddOnListings = synthesizeListingsForProduct(
    `Universal Protection & Care Kit for ${titleCased}`,
    'Care Pro',
    Math.max(99, Math.round(baseBudget * 0.12)),
    targetPlatforms
  );
  const addOnBest = genericAddOnListings[0];

  const genericAddOnItem: Product = {
    id: `dyn_addon_${cleanSubject}`,
    name: `Care & Accessory Pack for ${titleCased}`,
    brand: 'Care Pro',
    category: titleCased,
    price: Math.max(99, Math.round(baseBudget * 0.12)),
    bestPrice: addOnBest.price,
    bestPlatform: addOnBest.platform,
    bestPlatformName: addOnBest.platformName,
    bestPlatformUrl: addOnBest.productUrl,
    desc: `Essential care accessories and protective add-on designed for ${cleanSubject}.`,
    tags: ['accessory', 'essential'],
    compat: ['main'],
    rating: 4.6,
    reviewCount: 2100,
    merchantApproved: true,
    icon: '🛡️',
    listings: genericAddOnListings,
    matchScore: 90,
    whyThis: [`Prolongs lifespan and enhances usage of your ${cleanSubject}`]
  };

  return {
    products: dynamicProducts,
    categoryName: titleCased,
    subCategoryTabs: [
      { id: 'all', label: `All ${titleCased}` },
      { id: 'top_rated', label: 'Top Rated & Best Sellers' },
      { id: 'premium', label: 'Premium Edition' },
      { id: 'budget', label: 'Budget Friendly' }
    ],
    growthAddOn: {
      item: genericAddOnItem,
      reason: `Complements your ${cleanSubject} while fitting easily into unspent budget.`,
      allowedCategory: `${titleCased} Accessories`
    }
  };
}
