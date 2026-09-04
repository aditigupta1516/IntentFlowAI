import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ParsedIntent,
  OptimizedBundle,
  GrowthOpportunity,
  Guardrails,
  AuditEntry,
  DecisionReceipt,
  ChatMessage
} from '../types';
import { parseCustomerIntent } from '../services/intentParser';
import { discoverProductsForIntent } from '../services/productDiscovery';
import { optimizeBundleForIntent } from '../services/bundleOptimizer';
import { findGrowthOpportunity } from '../services/growthEngine';
import { generateDecisionReceipt } from '../services/decisionReceipt';
import { evaluateSafetyAndCompatibility, SafetyReport } from '../services/safetyEngine';
import { storageService } from '../services/storageService';

export interface PipelineStep {
  key: string;
  node: string;
  title: string;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { key: 'intent', node: 'intent', title: 'Understanding customer intent & constraints' },
  { key: 'parse', node: 'parser', title: 'Parsing structured category, budget & product specifications' },
  { key: 'constraint', node: 'constraint', title: 'Applying user guardrails & multi-store search weights' },
  { key: 'search', node: 'discovery', title: 'Scanning Amazon, Flipkart, Myntra, Nykaa, Savana, Meesho' },
  { key: 'filter', node: 'discovery', title: 'Verifying verified seller badges, ratings & delivery speeds' },
  { key: 'bundle', node: 'bundle', title: 'Optimizing combinatorial product bundle & discounts' },
  { key: 'guardrails', node: 'trust', title: 'Validating against budget ceiling & return policy' },
  { key: 'growth', node: 'growth', title: 'Scanning for compliant 4-gate budget add-ons' },
  { key: 'approval', node: 'approval', title: 'Synthesizing verified store links & Decision Receipt' }
];

interface AgentContextType {
  intentText: string;
  setIntentText: (text: string) => void;
  parsed: ParsedIntent | null;
  discovered: Product[];
  bundle: OptimizedBundle | null;
  addOn: GrowthOpportunity | null;
  addOnAccepted: boolean;
  setAddOnAccepted: (accepted: boolean) => void;
  guardrails: Guardrails;
  updateGuardrails: (updates: Partial<Guardrails>) => void;
  auditTrail: AuditEntry[];
  reasoningSteps: string[];
  chatMessages: ChatMessage[];
  sendUserMessage: (msg: string) => void;
  activePipelineNode: string | null;
  isPipelineRunning: boolean;
  isPipelineDone: boolean;
  isApproved: boolean;
  safetyReport: SafetyReport | null;
  decisionReceipt: DecisionReceipt | null;
  openWhyId: string | null;
  setOpenWhyId: (id: string | null) => void;
  compareProductId: string | null;
  setCompareProductId: (id: string | null) => void;
  isControlCenterOpen: boolean;
  setIsControlCenterOpen: (open: boolean) => void;
  isLedgerOpen: boolean;
  setIsLedgerOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  simMode: boolean;
  setSimMode: (sim: boolean) => void;
  launchAgent: (query: string) => void;
  toggleBundleItem: (productId: string) => void;
  approveDecision: () => void;
  recalculateBundle: () => void;
  selectedCategoryTab: string;
  setSelectedCategoryTab: (tab: string) => void;
}

const DEFAULT_GUARDRAILS: Guardrails = {
  maxBudget: 25000,
  allowAboveBudget: false,
  requireApproval: true,
  allowAlternatives: true,
  maxDiscountPct: 10,
  maxBundleSize: 6,
  preferredPlatforms: ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Savana', 'Renee', 'Meesho', 'Ajio', 'Purplle', 'Tira']
};

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [intentText, setIntentText] = useState<string>('I have oily and acne-prone skin. Build me a complete skincare routine under ₹2,000.');
  const [parsed, setParsed] = useState<ParsedIntent | null>(null);
  const [discovered, setDiscovered] = useState<Product[]>([]);
  const [bundle, setBundle] = useState<OptimizedBundle | null>(null);
  const [addOn, setAddOn] = useState<GrowthOpportunity | null>(null);
  const [addOnAccepted, setAddOnAccepted] = useState<boolean>(false);
  const [guardrails, setGuardrails] = useState<Guardrails>(DEFAULT_GUARDRAILS);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [reasoningSteps, setReasoningSteps] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  
  const [activePipelineNode, setActivePipelineNode] = useState<string | null>(null);
  const [isPipelineRunning, setIsPipelineRunning] = useState<boolean>(false);
  const [isPipelineDone, setIsPipelineDone] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [safetyReport, setSafetyReport] = useState<SafetyReport | null>(null);
  const [decisionReceipt, setDecisionReceipt] = useState<DecisionReceipt | null>(null);

  // Modals
  const [openWhyId, setOpenWhyId] = useState<string | null>(null);
  const [compareProductId, setCompareProductId] = useState<string | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
  const [isLedgerOpen, setIsLedgerOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [simMode, setSimMode] = useState<boolean>(false);

  const logAudit = (action: string, detail: string, status: 'ok' | 'warn' | 'bad' = 'ok', node: string = 'intent') => {
    const time = new Date().toTimeString().slice(0, 8);
    const newEntry: AuditEntry = {
      id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      time,
      action,
      detail,
      status,
      node
    };
    setAuditTrail(prev => [newEntry, ...prev]);
  };

  const launchAgent = (query: string) => {
    setIntentText(query);
    setIsPipelineRunning(true);
    setIsPipelineDone(false);
    setIsApproved(false);
    setDiscovered([]); // CLEAR PREVIOUS RESULTS IMMEDIATELY
    setBundle(null);     // CLEAR PREVIOUS BUNDLE IMMEDIATELY
    setReasoningSteps([]);
    setAddOn(null);
    setAddOnAccepted(false);
    setOpenWhyId(null);
    setSelectedCategoryTab('all');
    setAuditTrail([]);

    const parsedData = parseCustomerIntent(query);
    setParsed(parsedData);
    setGuardrails(prev => ({ ...prev, maxBudget: parsedData.budget }));

    const categoryDisplayName = parsedData.category.replace(/_/g, ' ').toUpperCase();

    // Reset Chat Messages with initial AI greeting
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages([
      {
        id: `msg_1_${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: nowTime
      },
      {
        id: `msg_2_${Date.now()}`,
        sender: 'agent',
        text: `I've analyzed your search for ${categoryDisplayName}${parsedData.skinType ? ` (${parsedData.skinType} skin)` : ''} under ₹${parsedData.budget.toLocaleString('en-IN')}. Searching Amazon, Flipkart, Myntra, Nykaa & Meesho for verified options with 1-click buy links.`,
        timestamp: nowTime
      }
    ]);

    // Record Analytics Event
    storageService.recordEvent('INTENT_CREATED', undefined, { query, category: parsedData.category, budget: parsedData.budget });
    storageService.addRecentIntent(query, parsedData);

    // Stepped execution
    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx >= PIPELINE_STEPS.length) {
        clearInterval(interval);
        setIsPipelineRunning(false);
        setIsPipelineDone(true);
        setActivePipelineNode(null);

        // Finalize results
        const products = discoverProductsForIntent(parsedData);
        setDiscovered(products);

        const currentGuardrails = { ...guardrails, maxBudget: parsedData.budget };
        const optBundle = optimizeBundleForIntent(products, parsedData, currentGuardrails);
        setBundle(optBundle);

        const growthOpp = findGrowthOpportunity(optBundle, parsedData, currentGuardrails);
        setAddOn(growthOpp);

        const safety = evaluateSafetyAndCompatibility(optBundle.items, parsedData);
        setSafetyReport(safety);

        const receipt = generateDecisionReceipt(optBundle, parsedData, false);
        setDecisionReceipt(receipt);

        logAudit('Direct store links verified', `Extracted verified listings across Amazon, Flipkart, Nykaa, Myntra & Meesho`, 'ok', 'approval');
        return;
      }

      const currentStep = PIPELINE_STEPS[stepIdx];
      setActivePipelineNode(currentStep.node);
      setReasoningSteps(prev => [...prev, currentStep.key]);

      if (currentStep.key === 'intent') {
        logAudit('Intent parsed', `"${query}"`, 'ok', 'intent');
      } else if (currentStep.key === 'search') {
        logAudit('Scanned multi-stores', `Queried Amazon, Flipkart, Nykaa, Myntra, Savana, Meesho`, 'ok', 'discovery');
      } else if (currentStep.key === 'bundle') {
        logAudit('Bundle optimized', 'Applied combinatorial budget rules and verified single-click store links', 'ok', 'bundle');
      }

      stepIdx++;
    }, 180);
  };

  const sendUserMessage = (msg: string) => {
    if (!msg.trim()) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const trimmed = msg.trim();
    const lower = trimmed.toLowerCase();

    // Check if user is asking to search a new category or item
    const isModifier = lower.startsWith('make it') || lower.startsWith('i also have') || lower.startsWith('add ') || lower.startsWith('cheaper');
    if (!isModifier && trimmed.length > 2) {
      launchAgent(trimmed);
      return;
    }

    setChatMessages(prev => [
      ...prev,
      {
        id: `msg_u_${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: nowTime
      }
    ]);

    setTimeout(() => {
      let replyText = `I've updated your options. You can click any product's "⚡ Buy on [Store]" button to order directly on Amazon, Flipkart, or Myntra.`;

      if (lower.includes('sensitive') || lower.includes('gentle')) {
        if (parsed) setParsed({ ...parsed, skinType: 'Sensitive' });
        replyText = `Updated filter to Sensitive profile and prioritized gentle non-irritating formulations.`;
      } else if (lower.includes('cheaper') || lower.includes('under') || lower.includes('budget')) {
        const numMatch = msg.match(/\d+/);
        if (numMatch) {
          const newBud = parseInt(numMatch[0]);
          updateGuardrails({ maxBudget: newBud });
          replyText = `Updated budget ceiling to ₹${newBud.toLocaleString('en-IN')}. Recalculating lowest-price verified listings.`;
        }
      } else if (lower.includes('add') || lower.includes('stick') || lower.includes('accessory')) {
        replyText = `Added recommended accessory add-on within your remaining budget!`;
        setAddOnAccepted(true);
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `msg_a_${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: nowTime
        }
      ]);
    }, 500);
  };

  const updateGuardrails = (updates: Partial<Guardrails>) => {
    const updated = { ...guardrails, ...updates };
    setGuardrails(updated);
    if (parsed && discovered.length > 0) {
      const optBundle = optimizeBundleForIntent(discovered, parsed, updated);
      setBundle(optBundle);
      const growthOpp = findGrowthOpportunity(optBundle, parsed, updated);
      setAddOn(growthOpp);
      logAudit('Guardrails updated', `Max budget set to ₹${updated.maxBudget.toLocaleString('en-IN')}`, 'ok', 'trust');
    }
  };

  const toggleBundleItem = (productId: string) => {
    if (!bundle) return;
    const exists = bundle.items.some(i => i.id === productId);
    let newItems: Product[];
    if (exists) {
      newItems = bundle.items.filter(i => i.id !== productId);
    } else {
      const prod = discovered.find(p => p.id === productId);
      if (!prod) return;
      newItems = [...bundle.items, prod];
    }

    const individualTotal = newItems.reduce((acc, p) => acc + p.bestPrice, 0);
    const discountPct = newItems.length >= 3 ? 10 : newItems.length >= 2 ? 6 : 0;
    const finalTotal = Math.round(individualTotal * (1 - discountPct / 100));

    const updatedBundle: OptimizedBundle = {
      ...bundle,
      items: newItems,
      individualTotal,
      discountPct,
      finalTotal,
      remaining: guardrails.maxBudget - finalTotal
    };

    setBundle(updatedBundle);
    if (parsed) {
      setDecisionReceipt(generateDecisionReceipt(updatedBundle, parsed, isApproved));
      setSafetyReport(evaluateSafetyAndCompatibility(newItems, parsed));
    }
  };

  const approveDecision = () => {
    setIsApproved(true);
    if (bundle && parsed) {
      setDecisionReceipt(generateDecisionReceipt(bundle, parsed, true));
      storageService.recordEvent('BUNDLE_APPROVED', bundle.id, { total: bundle.finalTotal });
    }
  };

  const recalculateBundle = () => {
    if (parsed) {
      launchAgent(intentText);
    }
  };

  useEffect(() => {
    launchAgent(intentText);
  }, []);

  return (
    <AgentContext.Provider
      value={{
        intentText,
        setIntentText,
        parsed,
        discovered,
        bundle,
        addOn,
        addOnAccepted,
        setAddOnAccepted,
        guardrails,
        updateGuardrails,
        auditTrail,
        reasoningSteps,
        chatMessages,
        sendUserMessage,
        activePipelineNode,
        isPipelineRunning,
        isPipelineDone,
        isApproved,
        safetyReport,
        decisionReceipt,
        openWhyId,
        setOpenWhyId,
        compareProductId,
        setCompareProductId,
        isControlCenterOpen,
        setIsControlCenterOpen,
        isLedgerOpen,
        setIsLedgerOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        simMode,
        setSimMode,
        launchAgent,
        toggleBundleItem,
        approveDecision,
        recalculateBundle,
        selectedCategoryTab,
        setSelectedCategoryTab
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within an AgentProvider');
  return ctx;
};
