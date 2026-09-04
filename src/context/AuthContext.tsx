import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { GoogleAccountModal } from '../components/modals/GoogleAccountModal';
import { AuthModal } from '../components/modals/AuthModal';
import { EmailOtpModal } from '../components/modals/EmailOtpModal';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  allUsers: UserProfile[];
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  openEmailOtpModal: (email?: string) => void;
  loginAsPublicAccount: () => void;
  switchUser: (targetUser: UserProfile) => void;
  logout: () => void;
  updatePreferences: (updates: Partial<UserProfile>) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  // Auth Modal (Exact replica of screenshots)
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeAuthModal: () => void;
  // 1-Free Interaction Gate
  requireAuthOrProceed: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('intentflow_auth_user');
      if (stored) {
        const u = JSON.parse(stored);
        storageService.setActiveUser(u.email || u.id);
        return u;
      }
    } catch {}
    storageService.setActiveUser('guest');
    return null;
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => storageService.getAllUsersRegistry());
  const [loading, setLoading] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [isEmailOtpModalOpen, setIsEmailOtpModalOpen] = useState<boolean>(false);
  const [otpTargetEmail, setOtpTargetEmail] = useState<string>('');
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [guestInteractionCount, setGuestInteractionCount] = useState<number>(0);

  useEffect(() => {
    setAllUsers(storageService.getAllUsersRegistry());
  }, [user]);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openEmailOtpModal = (email?: string) => {
    setOtpTargetEmail(email || '');
    setIsAuthModalOpen(false);
    setIsGoogleModalOpen(false);
    setIsEmailOtpModalOpen(true);
  };

  const requireAuthOrProceed = (): boolean => {
    if (user) return true;
    if (guestInteractionCount === 0) {
      setGuestInteractionCount(1);
      return true; // Allow 1st free query
    }
    // Block subsequent actions until sign in
    openSignupModal();
    return false;
  };

  const login = async (email: string, _password?: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    
    // Check if user profile already exists
    const existing = storageService.getUserProfile(email);
    let targetUser: UserProfile;

    if (existing) {
      targetUser = existing;
    } else {
      // Auto-register if logging in for the first time
      const cleanName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const role = email.includes('merchant') ? 'merchant' : email.includes('admin') ? 'admin' : 'user';
      targetUser = {
        id: `usr_${Date.now()}`,
        name: cleanName || 'New Shopper',
        email,
        authProvider: 'email',
        avatarInitial: (cleanName || email).charAt(0).toUpperCase(),
        role,
        interests: ['Appliances', 'Skincare', 'Fashion', 'Electronics', 'Toys'],
        shoppingPriorities: ['Best Verified Price'],
        preferredPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Savana', 'Meesho'],
        skinType: 'Oily',
        encryptionKeyId: `ENC-256-AES-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      storageService.saveUserProfile(targetUser);
    }

    storageService.setActiveUser(targetUser.email);
    setUser(targetUser);
    localStorage.setItem('intentflow_auth_user', JSON.stringify(targetUser));
    setLoading(false);
    setIsAuthModalOpen(false);
  };

  const signup = async (name: string, email: string, _password?: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'New Shopper',
      email: email.trim().toLowerCase(),
      authProvider: 'email',
      avatarInitial: (name.trim() || email).charAt(0).toUpperCase(),
      role: 'user',
      interests: ['Appliances', 'Skincare', 'Fashion', 'Electronics', 'Toys'],
      shoppingPriorities: ['Best Price', 'Verified Quality'],
      preferredPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Savana', 'Meesho'],
      encryptionKeyId: `ENC-256-AES-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    storageService.saveUserProfile(newUser);
    storageService.setActiveUser(newUser.email);
    setUser(newUser);
    localStorage.setItem('intentflow_auth_user', JSON.stringify(newUser));
    setLoading(false);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async () => {
    setIsAuthModalOpen(false);
    setIsGoogleModalOpen(true);
  };

  const handleGoogleAccountSelect = (account: { name: string; email: string }) => {
    setIsGoogleModalOpen(false);
    setLoading(true);
    setTimeout(() => {
      const normalizedEmail = account.email.trim().toLowerCase();
      const existing = storageService.getUserProfile(normalizedEmail);
      let targetUser: UserProfile;

      if (existing) {
        targetUser = { ...existing, name: account.name || existing.name, authProvider: 'google' };
      } else {
        // Register new Google user
        targetUser = {
          id: `usr_google_${Date.now()}`,
          name: account.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          authProvider: 'google',
          avatarInitial: (account.name || normalizedEmail).charAt(0).toUpperCase(),
          role: 'user',
          interests: ['Appliances', 'Skincare', 'Fashion', 'Electronics', 'Toys'],
          shoppingPriorities: ['Best Verified Price', 'Authentic Sellers'],
          preferredPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Savana', 'Meesho'],
          skinType: 'Oily',
          skinConcerns: ['Acne', 'Dullness'],
          defaultBudget: 25000,
          encryptionKeyId: `ENC-256-GGL-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
          createdAt: new Date().toISOString()
        };
        storageService.saveUserProfile(targetUser);
      }

      storageService.setActiveUser(targetUser.email);
      setUser(targetUser);
      localStorage.setItem('intentflow_auth_user', JSON.stringify(targetUser));
      setLoading(false);
      setIsAuthModalOpen(false);
    }, 250);
  };

  const handleOtpSuccess = (verifiedEmail: string, optionalName?: string) => {
    setLoading(true);
    const normalizedEmail = verifiedEmail.trim().toLowerCase();
    const existing = storageService.getUserProfile(normalizedEmail);
    let targetUser: UserProfile;

    if (existing) {
      targetUser = { ...existing, authProvider: 'smtp_otp' };
    } else {
      const cleanName = optionalName || normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      targetUser = {
        id: `usr_smtp_${Date.now()}`,
        name: cleanName || 'Verified Shopper',
        email: normalizedEmail,
        authProvider: 'smtp_otp',
        avatarInitial: cleanName.charAt(0).toUpperCase(),
        role: 'user',
        interests: ['Appliances', 'Skincare', 'Fashion', 'Electronics', 'Toys'],
        shoppingPriorities: ['Best Price', 'Verified Sellers'],
        preferredPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Savana', 'Meesho'],
        skinType: 'Combination',
        encryptionKeyId: `ENC-256-SMTP-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        createdAt: new Date().toISOString()
      };
      storageService.saveUserProfile(targetUser);
    }

    storageService.setActiveUser(targetUser.email);
    setUser(targetUser);
    localStorage.setItem('intentflow_auth_user', JSON.stringify(targetUser));
    setLoading(false);
  };

  const loginAsPublicAccount = () => {
    setLoading(true);
    const publicUser: UserProfile = {
      id: 'usr_public_shopper',
      name: 'Public Explorer',
      email: 'public.shopper@intentflow.ai',
      authProvider: 'public',
      avatarInitial: '🌐',
      role: 'user',
      isPublicProfile: true,
      interests: ['Appliances', 'Skincare', 'Fashion', 'Electronics', 'Toys'],
      shoppingPriorities: ['Best Verified Price', 'Multi-Store Deals'],
      preferredPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Savana', 'Meesho'],
      skinType: 'Combination',
      skinConcerns: ['Hydration', 'Sun Protection'],
      defaultBudget: 25000,
      encryptionKeyId: 'ENC-256-PUBLIC-EXPLORER',
      createdAt: new Date().toISOString()
    };

    storageService.saveUserProfile(publicUser);
    storageService.setActiveUser(publicUser.email);
    storageService.seedPublicAccountDataIfEmpty(publicUser.email);

    setUser(publicUser);
    localStorage.setItem('intentflow_auth_user', JSON.stringify(publicUser));
    setLoading(false);
    setIsAuthModalOpen(false);
    setIsGoogleModalOpen(false);
  };

  const switchUser = (targetUser: UserProfile) => {
    storageService.setActiveUser(targetUser.email);
    setUser(targetUser);
    localStorage.setItem('intentflow_auth_user', JSON.stringify(targetUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('intentflow_auth_user');
    storageService.setActiveUser('guest');
    setGuestInteractionCount(0);
  };

  const updatePreferences = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storageService.saveUserProfile(updated);
    localStorage.setItem('intentflow_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        loading,
        login,
        signup,
        loginWithGoogle,
        openEmailOtpModal,
        loginAsPublicAccount,
        switchUser,
        logout,
        updatePreferences,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAuthModalOpen,
        authModalMode,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        requireAuthOrProceed
      }}
    >
      {children}
      {/* Exact replica of screenshots for Login & Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
      {/* Google Account Selector Dialog */}
      <GoogleAccountModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelect}
      />
      {/* SMTP Email OTP Authentication Modal */}
      <EmailOtpModal
        isOpen={isEmailOtpModalOpen}
        onClose={() => setIsEmailOtpModalOpen(false)}
        initialEmail={otpTargetEmail}
        onSuccess={handleOtpSuccess}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
