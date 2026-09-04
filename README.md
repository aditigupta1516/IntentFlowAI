# IntentFlow AI — Autonomous Commerce Intelligence Platform

> **From Customer Intent to Trusted Transaction.**
> Built for the **Razorpay AI Builder 2026 — Track 1: AI Growth & Agentic Commerce**.

---

## 🌟 Executive Overview

**IntentFlow AI** is a production-grade agentic commerce orchestration platform designed to sit between customer intent and multi-platform retail destinations (Amazon, Nykaa, Flipkart, Meesho, Ajio). 

Instead of forcing users to search across dozens of browser tabs, compare price variances, calculate routine synergies, or worry about conflicting ingredients/hardware, IntentFlow AI enables natural-language shopping orchestration with **strict mathematical budget enforcement, human-in-the-loop decision receipts, and non-intrusive ethical growth mechanics**.

---

## 🚀 Key Architectural Innovations

### 1. 3D Interactive Design System
- **Three.js 3D Hero Mesh**: Real-time WebGL canvas rendering 5 floating icosahedron product meshes with physical light reflections, ambient star particles, and camera parallax.
- **Interactive Canvas Particle Network**: Dynamic node connections with mouse attraction and velocity damping.
- **3D Perspective Tilt Cards**: Sub-pixel mouse orientation with radial glow borders and zero layout shift.
- **9-Stage Animated Pipeline Graph**: Live visual feedback of autonomous decision modules (Intent → Parser → Guardrails → Discovery → Bundle Optimizer → Growth Engine → Trust Layer → Approval → Checkout).

### 2. Multi-Signal Scored Product Discovery
- **Cross-Platform Aggregation**: Normalizes real-time product listings across Amazon, Flipkart, Nykaa, Meesho, and Ajio.
- **Combinatorial Bundle Optimizer**: Satisfies routine slots (e.g., Cleanser + Serum + SPF + Moisturizer) while strictly enforcing user-defined budget caps and calculating stacked merchant volume discounts.
- **Formulation & Hardware Safety Engine**: Automated chemical conflict analysis (e.g., duplicate BHA exfoliants, retinoid clashes) and beginner-suitability scoring.

### 3. Trust & Decision Receipt Layer
- **Reasoning Without Authority**: The autonomous agent has research and recommendation authority, but **zero financial movement authority** without explicit human click approval.
- **Cryptographic Decision Receipts (`IF-2026-XXXX`)**: Tamper-proof Sha-256 decision hashes certifying stated budget, final cost, unspent budget, and compatibility status.
- **Immutable Audit Ledger**: Timestamped chronological log of all autonomous decision steps.

### 4. 4-Gate Ethical Growth Engine
- **Zero-Pressure Cross-Sells**: Analyzes unspent budget margins and only surfaces optional accessories that satisfy 4 mandatory verification gates:
  1. *Intent Relevance*
  2. *Strict Budget Fit*
  3. *Approved Merchant Category*
  4. *Zero Hidden Markup*

### 5. Razorpay Transaction Simulation & Order Recovery Agent
- Multi-state payment execution: `Idle` → `Processing` → `Authorizing` → `Success (Confetti)` / `Failed`.
- **Order Recovery Agent**: Preserves bundle state on bank decline and provides 4 alternative recovery routes (Instant UPI retry, save bundle for later, swap payment method, or adjust routine).

---

## 🛠️ Technology Stack

- **Frontend / Framework**: React 19, TypeScript, Vite, React Router v7
- **3D & Graphics**: Three.js (WebGL), HTML5 Canvas 2D Particles, Canvas Confetti
- **Styling & Design System**: Tailwind CSS v3, Glassmorphism, Custom Deep Space Theme (`#05060b`, `#5b8cff`, `#9b7bff`)
- **Icons & Assets**: Lucide React
- **State & Services**: LocalStorage persistence, multi-provider intent parser, combinatorial optimizer, cryptographic receipt generator

---

## 📦 Project Structure

```text
intentflow-ai/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Hero3DOrbs.tsx          # Three.js 3D floating meshes
│   │   │   ├── ParticleBackground.tsx  # Interactive connecting particles
│   │   │   └── Pipeline3D.tsx          # 9-stage animated decision pipeline
│   │   ├── common/
│   │   │   ├── Navbar.tsx              # Glassmorphism navigation & auth
│   │   │   ├── Footer.tsx              # Venture-grade footer
│   │   │   ├── TiltCard.tsx            # 3D perspective mouse-tilt card
│   │   │   └── DecisionReceiptCard.tsx # Printable/saveable receipt card
│   │   └── modals/
│   │       ├── ControlCenterModal.tsx  # Guardrail sliders & toggles
│   │       ├── ActivityLedgerModal.tsx # Timestamped audit trail
│   │       ├── ComparePricesModal.tsx  # Multi-platform pricing breakdown
│   │       ├── CheckoutModal.tsx       # Razorpay checkout & recovery agent
│   │       └── OnboardingModal.tsx     # 4-step interactive onboarding
│   ├── context/
│   │   ├── AuthContext.tsx             # Real user auth & profile state
│   │   └── AgentContext.tsx            # Live agent reasoning & pipeline state
│   ├── data/
│   │   └── catalog.ts                  # Multi-category catalog with listings
│   ├── pages/
│   │   ├── LandingPage.tsx             # Cinematic 3D Hero & landing sections
│   │   ├── DashboardPage.tsx           # User dashboard & recent sessions
│   │   ├── AgentWorkspacePage.tsx      # 3-column AI Operating System
│   │   ├── SavedBundlesPage.tsx        # Saved bundle inventory & memory
│   │   ├── MerchantAnalyticsPage.tsx   # Revenue trends, funnels & patterns
│   │   ├── SettingsPage.tsx            # Profile, privacy & GDPR export
│   │   └── auth/
│   │       ├── LoginPage.tsx           # Split-screen glassmorphism login
│   │       └── SignupPage.tsx          # Account creation & password meter
│   ├── services/
│   │   ├── intentParser.ts             # Deterministic semantic extractor
│   │   ├── productDiscovery.ts         # Multi-signal scoring engine
│   │   ├── bundleOptimizer.ts          # Budget & synergy optimizer
│   │   ├── safetyEngine.ts             # Compatibility & chemical check
│   │   ├── growthEngine.ts             # 4-gate ethical upsell engine
│   │   ├── decisionReceipt.ts          # Cryptographic receipt generator
│   │   └── storageService.ts           # Persistent storage & analytics events
│   ├── types/
│   │   └── index.ts                    # Core TypeScript definitions
│   ├── App.tsx                         # Master router & modal tree
│   ├── main.tsx                        # DOM mount
│   └── index.css                       # Design tokens & glassmorphism
├── index.html                          # Root HTML entrypoint
├── tailwind.config.js                  # Custom palette & glow effects
├── vite.config.ts                      # Vite server configuration
├── tsconfig.json                       # TypeScript compiler options
└── package.json                        # Dependencies & scripts
```

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🚀 Deployment to GitHub & GitHub Pages

This repository includes a pre-configured **GitHub Actions CI/CD Workflow** (`.github/workflows/deploy.yml`) for instant automated deployment:

1. **Create a new repository** on [GitHub](https://github.com/new) (e.g. `intentflow-ai`).
2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/intentflow-ai.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to your repository on GitHub: **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. **Access your live site**:
   - Within 1–2 minutes, GitHub Actions will build and deploy your site to:
   - `https://YOUR_USERNAME.github.io/intentflow-ai/`

---

## 🏆 Razorpay Track 1 Compliance Matrix

| Requirement | Implementation in IntentFlow AI |
|---|---|
| **Natural Language Intent Parsing** | Multi-tier regex + semantic classifier extracting category, budget, skin types, and priorities. |
| **Product Discovery & Comparison** | Multi-platform price, rating, review, and delivery comparison across Amazon, Flipkart, Nykaa, Meesho & Ajio. |
| **Bundle Optimization** | Dynamic slot allocation with budget adherence and AI synergy discount stacking. |
| **AI Growth Engine** | 4-gate ethical cross-sell verification for compliant, budget-fitting routine add-ons. |
| **Trust & Guardrails** | Human-in-the-loop explicit approval, Sha-256 Decision Receipts, and editable guardrail sliders. |
| **Checkout & Recovery Agent** | Razorpay demo checkout with bank decline recovery offering 4 alternative transactions. |
| **Merchant Analytics** | Live GMV growth timeline, conversion funnels, top intent patterns, and connector health metrics. |
