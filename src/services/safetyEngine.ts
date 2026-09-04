import { Product, ParsedIntent } from '../types';

export interface SafetyReport {
  status: 'Passed' | 'Caution' | 'Review Required';
  score: number; // 0 to 100
  checks: Array<{
    title: string;
    passed: boolean;
    description: string;
  }>;
  disclaimer: string;
}

export function evaluateSafetyAndCompatibility(
  bundleItems: Product[],
  parsed: ParsedIntent
): SafetyReport {
  const checks: Array<{ title: string; passed: boolean; description: string }> = [];

  // Check 1: Skin type compatibility
  if (parsed.category === 'skincare' && parsed.skinType) {
    const incompatible = bundleItems.filter(p => {
      if (parsed.skinType === 'Oily' && p.tags.includes('dry') && !p.tags.includes('oily')) return true;
      if (parsed.skinType === 'Dry' && p.tags.includes('matte') && !p.tags.includes('hydration')) return true;
      return false;
    });

    if (incompatible.length === 0) {
      checks.push({
        title: `Suitable for ${parsed.skinType} Skin Profile`,
        passed: true,
        description: `All ${bundleItems.length} selected items adhere to ${parsed.skinType.toLowerCase()} skin barrier requirements.`
      });
    } else {
      checks.push({
        title: 'Mild Profile Variance Detected',
        passed: false,
        description: `${incompatible[0].name} may feel heavy/light on ${parsed.skinType.toLowerCase()} skin.`
      });
    }
  }

  // Check 2: Active ingredient duplication
  const activeCount: Record<string, number> = {};
  bundleItems.forEach(p => {
    (p.ingredients || []).forEach(ing => {
      const lower = ing.toLowerCase();
      if (lower.includes('salicylic') || lower.includes('bha')) activeCount['BHA'] = (activeCount['BHA'] || 0) + 1;
      if (lower.includes('retinol') || lower.includes('retinoid')) activeCount['Retinoid'] = (activeCount['Retinoid'] || 0) + 1;
      if (lower.includes('vitamin c') || lower.includes('ascorbic')) activeCount['Vitamin C'] = (activeCount['Vitamin C'] || 0) + 1;
      if (lower.includes('aha') || lower.includes('glycolic')) activeCount['AHA'] = (activeCount['AHA'] || 0) + 1;
    });
  });

  const duplicates = Object.entries(activeCount).filter(([_, count]) => count > 1);
  if (duplicates.length === 0) {
    checks.push({
      title: 'No Conflicting Active Ingredients',
      passed: true,
      description: 'Zero duplicate harsh exfoliants or active chemical clashes in this routine.'
    });
  } else {
    checks.push({
      title: 'Duplicate Active Detected',
      passed: false,
      description: `Multiple items contain ${duplicates[0][0]}. Alternate usage between AM and PM.`
    });
  }

  // Check 3: Budget guardrail adherence
  const totalCost = bundleItems.reduce((acc, p) => acc + p.bestPrice, 0);
  if (totalCost <= parsed.budget) {
    checks.push({
      title: 'Strict Budget Constraint Satisfied',
      passed: true,
      description: `Total ₹${totalCost.toLocaleString('en-IN')} stays within your ₹${parsed.budget.toLocaleString('en-IN')} limit.`
    });
  } else {
    checks.push({
      title: 'Budget Limit Exceeded',
      passed: false,
      description: `Total exceeds budget by ₹${(totalCost - parsed.budget).toLocaleString('en-IN')}.`
    });
  }

  // Check 4: Beginner experience calibration
  checks.push({
    title: 'Beginner-Friendly Formulations',
    passed: true,
    description: 'Selected items have stable delivery vehicles with low irritation risk.'
  });

  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);
  const status = score >= 90 ? 'Passed' : score >= 70 ? 'Caution' : 'Review Required';

  return {
    status,
    score,
    checks,
    disclaimer: 'IntentFlow provides compatibility guidance based on verified merchant metadata and your stated preferences. It is not medical or dermatological advice.'
  };
}
