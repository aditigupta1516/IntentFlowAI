export type SupportedPlatform =
  | 'amazon'
  | 'myntra'
  | 'flipkart'
  | 'nykaa'
  | 'renee'
  | 'savana'
  | 'meesho'
  | 'ajio'
  | 'purplle'
  | 'tira';

export interface ProductListing {
  platform: SupportedPlatform;
  platformName: string;
  icon: string;
  badgeColor: string;
  price: number;
  rating: number;
  reviewCount: number;
  availability: 'in_stock' | 'low_stock' | 'pre_order';
  delivery: string;
  productUrl: string;
  isVerified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subCategory?: string;
  price: number;
  bestPrice: number;
  bestPlatform: SupportedPlatform;
  bestPlatformName: string;
  bestPlatformUrl: string;
  desc: string;
  tags: string[];
  compat: string[];
  rating: number;
  reviewCount: number;
  merchantApproved: boolean;
  icon: string;
  image?: string;
  listings: ProductListing[];
  matchScore?: number;
  whyThis?: string[];
  ingredients?: string[];
  confidenceScore?: number;
}

export interface ParsedIntent {
  raw: string;
  category: string;
  detectedSubject?: string;
  budget: number;
  currency: 'INR' | 'USD';
  skinType?: 'Oily' | 'Dry' | 'Combination' | 'Sensitive' | 'Normal' | null;
  concerns?: string[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  priority: string;
  preference: string;
  targetPlatform?: string;
  missingFields?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    action: string;
    payload?: any;
  }>;
  highlightBundle?: boolean;
}

export interface BundleItem {
  product: Product;
  selectedListing: ProductListing;
  quantity: number;
}

export interface OptimizedBundle {
  id: string;
  name: string;
  items: Product[];
  individualTotal: number;
  discountPct: number;
  finalTotal: number;
  remaining: number;
  platformSplit: Record<string, number>;
  createdAt: string;
  status: 'draft' | 'saved' | 'approved' | 'redirected' | 'purchase_confirmed';
}

export interface GrowthOpportunity {
  item: Product;
  relevance: number;
  predictedAcceptance: number;
  revenueImpact: number;
  allowedCategory: string;
  reason: string;
}

export interface Guardrails {
  maxBudget: number;
  allowAboveBudget: boolean;
  requireApproval: boolean;
  allowAlternatives: boolean;
  maxDiscountPct: number;
  maxBundleSize: number;
  preferredPlatforms: string[];
}

export interface AuditEntry {
  id: string;
  time: string;
  action: string;
  detail: string;
  status: 'ok' | 'warn' | 'bad';
  node: string;
}

export interface DecisionReceipt {
  decisionId: string;
  intentText: string;
  parsedSummary: string;
  budget: number;
  bundleCost: number;
  remainingBudget: number;
  productCount: number;
  safetyStatus: 'Passed' | 'Caution' | 'Review Required';
  dataConfidence: 'High' | 'Moderate' | 'Limited (Demo)';
  platformCount: number;
  timestamp: string;
  approvalStatus: 'Approved' | 'Waiting for Customer';
  decisionHash: string;
}

export interface StoreRedirectClick {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  platform: SupportedPlatform;
  platformName: string;
  price: number;
  productUrl: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  authProvider: 'google' | 'email' | 'smtp_otp' | 'public';
  avatarUrl?: string;
  avatarInitial?: string;
  role: 'user' | 'merchant' | 'admin';
  isPublicProfile?: boolean;
  interests: string[];
  shoppingPriorities: string[];
  preferredPlatforms: string[];
  skinType?: string;
  skinConcerns?: string[];
  defaultBudget?: number;
  encryptionKeyId?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  eventType: 'INTENT_CREATED' | 'PRODUCT_VIEWED' | 'PRODUCT_CLICKED' | 'BUNDLE_CREATED' | 'BUNDLE_SAVED' | 'BUNDLE_APPROVED' | 'MERCHANT_REDIRECTED' | 'PURCHASE_CONFIRMED';
  entityId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}
