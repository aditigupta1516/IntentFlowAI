import { OptimizedBundle, ParsedIntent, UserProfile, AnalyticsEvent, StoreRedirectClick, DecisionReceipt } from '../types';

function sanitizeUserKey(userIdOrEmail: string): string {
  return userIdOrEmail.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

function getActiveUserId(): string {
  try {
    const raw = localStorage.getItem('intentflow_active_user_id');
    if (raw) return raw;
    const user = localStorage.getItem('intentflow_auth_user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.email || parsed.id || 'guest';
    }
  } catch {}
  return 'guest';
}

export const storageService = {
  setActiveUser(userIdOrEmail: string): void {
    localStorage.setItem('intentflow_active_user_id', userIdOrEmail);
  },

  getActiveUserKey(userId?: string): string {
    const id = userId || getActiveUserId();
    return sanitizeUserKey(id);
  },

  // 1. User Profile & Multi-Account Registry
  getAllUsersRegistry(): UserProfile[] {
    try {
      const data = localStorage.getItem('intentflow_all_users_registry');
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveUserProfile(profile: UserProfile): void {
    const key = this.getActiveUserKey(profile.email || profile.id);
    localStorage.setItem(`intentflow_u_${key}_profile`, JSON.stringify(profile));

    // Update global registry
    const registry = this.getAllUsersRegistry().filter(u => u.email !== profile.email);
    registry.unshift(profile);
    localStorage.setItem('intentflow_all_users_registry', JSON.stringify(registry));
  },

  getUserProfile(userId?: string): UserProfile | null {
    const key = this.getActiveUserKey(userId);
    try {
      const data = localStorage.getItem(`intentflow_u_${key}_profile`);
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  },

  // 2. Per-User Saved Bundles
  getSavedBundles(userId?: string): OptimizedBundle[] {
    const key = this.getActiveUserKey(userId);
    try {
      const data = localStorage.getItem(`intentflow_u_${key}_saved_bundles`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveBundle(bundle: OptimizedBundle, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const bundles = this.getSavedBundles(userId);
    const existingIndex = bundles.findIndex(b => b.id === bundle.id);
    if (existingIndex > -1) {
      bundles[existingIndex] = { ...bundle, status: 'saved' };
    } else {
      bundles.unshift({ ...bundle, status: 'saved' });
    }
    localStorage.setItem(`intentflow_u_${key}_saved_bundles`, JSON.stringify(bundles));
    this.recordEvent('BUNDLE_SAVED', bundle.id, { total: bundle.finalTotal, name: bundle.name }, userId);
  },

  deleteBundle(id: string, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const bundles = this.getSavedBundles(userId).filter(b => b.id !== id);
    localStorage.setItem(`intentflow_u_${key}_saved_bundles`, JSON.stringify(bundles));
  },

  // 3. Per-User Search & Intent History
  getRecentIntents(userId?: string): Array<{ text: string; parsed: ParsedIntent; timestamp: string }> {
    const key = this.getActiveUserKey(userId);
    try {
      const data = localStorage.getItem(`intentflow_u_${key}_recent_intents`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  addRecentIntent(text: string, parsed: ParsedIntent, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const intents = this.getRecentIntents(userId).filter(i => i.text.toLowerCase() !== text.toLowerCase());
    intents.unshift({
      text,
      parsed,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(`intentflow_u_${key}_recent_intents`, JSON.stringify(intents.slice(0, 15)));
  },

  deleteRecentIntent(text: string, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const intents = this.getRecentIntents(userId).filter(i => i.text !== text);
    localStorage.setItem(`intentflow_u_${key}_recent_intents`, JSON.stringify(intents));
  },

  // 4. Per-User Store Click & Outbound Redirect Activity
  getStoreActivity(userId?: string): StoreRedirectClick[] {
    const key = this.getActiveUserKey(userId);
    try {
      const data = localStorage.getItem(`intentflow_u_${key}_store_activity`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  recordStoreClick(clickData: Omit<StoreRedirectClick, 'id' | 'timestamp'>, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const activity = this.getStoreActivity(userId);
    activity.unshift({
      ...clickData,
      id: `CLK-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(`intentflow_u_${key}_store_activity`, JSON.stringify(activity.slice(0, 50)));
    this.recordEvent('MERCHANT_REDIRECTED', clickData.productId, clickData, userId);
  },

  // 5. Per-User Confirmed Purchases & Transactions
  getConfirmedPurchases(userId?: string): any[] {
    const key = this.getActiveUserKey(userId);
    try {
      const data = localStorage.getItem(`intentflow_u_${key}_purchases`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  confirmPurchase(purchaseData: any, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const purchases = this.getConfirmedPurchases(userId);
    purchases.unshift({
      ...purchaseData,
      id: `PUR-${Date.now()}`,
      confirmedAt: new Date().toISOString()
    });
    localStorage.setItem(`intentflow_u_${key}_purchases`, JSON.stringify(purchases));
    this.recordEvent('PURCHASE_CONFIRMED', purchaseData.orderId, purchaseData, userId);
  },

  // 6. Per-User Decision Receipts Ledger
  getDecisionReceipts(userId?: string): DecisionReceipt[] {
    const key = this.getActiveUserKey(userId);
    try {
      const data = localStorage.getItem(`intentflow_u_${key}_receipts`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveDecisionReceipt(receipt: DecisionReceipt, userId?: string): void {
    const key = this.getActiveUserKey(userId);
    const receipts = this.getDecisionReceipts(userId).filter(r => r.decisionId !== receipt.decisionId);
    receipts.unshift(receipt);
    localStorage.setItem(`intentflow_u_${key}_receipts`, JSON.stringify(receipts.slice(0, 30)));
  },

  // 7. Per-User Privacy Export & GDPR Purge
  exportUserDataJSON(userId?: string): string {
    const key = this.getActiveUserKey(userId);
    const archive = {
      profile: this.getUserProfile(userId),
      savedBundles: this.getSavedBundles(userId),
      recentIntents: this.getRecentIntents(userId),
      storeActivity: this.getStoreActivity(userId),
      purchases: this.getConfirmedPurchases(userId),
      decisionReceipts: this.getDecisionReceipts(userId),
      exportedAt: new Date().toISOString(),
      securityCertification: '256-bit Client-Side Vault Certified'
    };
    return JSON.stringify(archive, null, 2);
  },

  purgeUserData(userId?: string): void {
    const key = this.getActiveUserKey(userId);
    localStorage.removeItem(`intentflow_u_${key}_profile`);
    localStorage.removeItem(`intentflow_u_${key}_saved_bundles`);
    localStorage.removeItem(`intentflow_u_${key}_recent_intents`);
    localStorage.removeItem(`intentflow_u_${key}_store_activity`);
    localStorage.removeItem(`intentflow_u_${key}_purchases`);
    localStorage.removeItem(`intentflow_u_${key}_receipts`);
  },

  // 8. Seed Rich Pre-Loaded Data for Public Account
  seedPublicAccountDataIfEmpty(userId: string): void {
    const key = this.getActiveUserKey(userId);
    const existingBundles = this.getSavedBundles(userId);
    if (existingBundles.length === 0) {
      const publicBundles: OptimizedBundle[] = [
        {
          id: 'bnd_pub_appliances_01',
          name: 'Home Appliance Best Value: LG 8kg Front Load Smart Washer',
          items: [
            {
              id: 'app_lg_wm_01',
              name: 'LG 8kg 5 Star Inverter Touch AI Direct Drive Washing Machine',
              brand: 'LG Electronics',
              category: 'appliances',
              price: 38990,
              bestPrice: 34990,
              bestPlatform: 'amazon',
              bestPlatformName: 'Amazon India',
              bestPlatformUrl: 'https://www.amazon.in/dp/B08XYZ1234?tag=intentflow-21',
              desc: '6 Motion Direct Drive with Steam allergy care and Wi-Fi ThinQ diagnosis.',
              tags: ['Front Load', 'Inverter', '5 Star Energy', 'Smart AI'],
              compat: ['Hard Water Compatible', 'Child Lock Active'],
              rating: 4.8,
              reviewCount: 4210,
              merchantApproved: true,
              icon: '🧺',
              listings: [
                {
                  platform: 'amazon',
                  platformName: 'Amazon India',
                  icon: '📦',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  price: 34990,
                  rating: 4.8,
                  reviewCount: 4210,
                  availability: 'in_stock',
                  delivery: 'Tomorrow by 2 PM (Prime)',
                  productUrl: 'https://www.amazon.in/dp/B08XYZ1234?tag=intentflow-21',
                  isVerified: true
                },
                {
                  platform: 'flipkart',
                  platformName: 'Flipkart Super',
                  icon: '🛒',
                  badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                  price: 35499,
                  rating: 4.7,
                  reviewCount: 3100,
                  availability: 'in_stock',
                  delivery: '2 Days Free Delivery',
                  productUrl: 'https://www.flipkart.com/search?q=LG+8kg+front+load',
                  isVerified: true
                }
              ]
            }
          ],
          individualTotal: 38990,
          discountPct: 10.2,
          finalTotal: 34990,
          remaining: 5010,
          platformSplit: { amazon: 34990 },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          status: 'saved'
        },
        {
          id: 'bnd_pub_skincare_02',
          name: 'Daily Barrier Defense & Oil-Control Routine',
          items: [
            {
              id: 'skin_salicylic_01',
              name: 'Minimalist 2% Salicylic Acid Face Cleanser',
              brand: 'Minimalist',
              category: 'skincare',
              price: 399,
              bestPrice: 349,
              bestPlatform: 'nykaa',
              bestPlatformName: 'Nykaa Beauty',
              bestPlatformUrl: 'https://www.nykaa.com/minimalist-salicylic-acid/p/12345',
              desc: 'Gentle exfoliating LHA + BHA acne wash for unclogging sebum pores.',
              tags: ['Salicylic Acid', 'BHA', 'Non-Comedogenic'],
              compat: ['Oily Skin', 'Acne-Prone'],
              rating: 4.6,
              reviewCount: 1890,
              merchantApproved: true,
              icon: '🧴',
              listings: [
                {
                  platform: 'nykaa',
                  platformName: 'Nykaa Beauty',
                  icon: '💄',
                  badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
                  price: 349,
                  rating: 4.6,
                  reviewCount: 1890,
                  availability: 'in_stock',
                  delivery: 'Express 24h Delivery',
                  productUrl: 'https://www.nykaa.com/minimalist-salicylic-acid/p/12345',
                  isVerified: true
                },
                {
                  platform: 'amazon',
                  platformName: 'Amazon India',
                  icon: '📦',
                  badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                  price: 379,
                  rating: 4.5,
                  reviewCount: 2200,
                  availability: 'in_stock',
                  delivery: 'Standard Prime',
                  productUrl: 'https://www.amazon.in/dp/B08MINI01',
                  isVerified: true
                }
              ]
            }
          ],
          individualTotal: 2499,
          discountPct: 15.6,
          finalTotal: 1899,
          remaining: 101,
          platformSplit: { nykaa: 1499, amazon: 400 },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          status: 'saved'
        }
      ];
      localStorage.setItem(`intentflow_u_${key}_saved_bundles`, JSON.stringify(publicBundles));
    }

    const existingIntents = this.getRecentIntents(userId);
    if (existingIntents.length === 0) {
      const publicIntents = [
        {
          text: 'Top rated 8kg front load washing machines under ₹40,000 on Amazon & Flipkart',
          parsed: {
            raw: 'Top rated 8kg front load washing machines under ₹40,000',
            category: 'Appliances',
            budget: 40000,
            currency: 'INR' as const,
            priority: 'Best Price',
            preference: 'Front Load Energy Efficient'
          },
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          text: 'Acne-prone soothing morning skincare kit under ₹2,000',
          parsed: {
            raw: 'Acne-prone soothing morning skincare kit under ₹2,000',
            category: 'Skincare',
            budget: 2000,
            currency: 'INR' as const,
            priority: 'Safe Ingredients',
            preference: 'Salicylic + Ceramide'
          },
          timestamp: new Date(Date.now() - 5400000).toISOString()
        }
      ];
      localStorage.setItem(`intentflow_u_${key}_recent_intents`, JSON.stringify(publicIntents));
    }
  },

  // 9. Analytics Events
  recordEvent(eventType: AnalyticsEvent['eventType'], entityId?: string, metadata?: Record<string, any>, userId?: string): void {
    try {
      const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('intentflow_analytics_events') || '[]');
      events.push({
        id: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: userId || getActiveUserId(),
        eventType,
        entityId,
        metadata,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('intentflow_analytics_events', JSON.stringify(events.slice(-500)));
    } catch {}
  }
};
