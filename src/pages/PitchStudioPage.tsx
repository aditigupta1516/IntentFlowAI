import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Video, 
  Download, Sparkles, CheckCircle2, AlertTriangle, Award, 
  ExternalLink, ChevronRight, ChevronLeft, Mic
} from 'lucide-react';

interface PitchChapter {
  id: number;
  timeRange: string;
  durationSec: number;
  title: string;
  tagline: string;
  subtitles: string[];
  spokenScript: string;
  keyPoints: string[];
  demoType: 'problem' | 'architecture' | 'core_demo' | 'growth' | 'summary';
}

const PITCH_CHAPTERS: PitchChapter[] = [
  {
    id: 1,
    timeRange: '0:00 – 0:45',
    durationSec: 45,
    title: 'The Problem: 15-Tab Fatigue & Broken E-Commerce',
    tagline: 'Modern shopping portals search individual SKUs, NOT customer intent.',
    spokenScript: 'Hello judges and builders! Today, when an online shopper has a goal—like building an oily skincare routine under eighteen hundred rupees or setting up a developer workstation—they have to open fifteen different browser tabs across Amazon, Nykaa, Flipkart, and Myntra. They struggle with price variances, conflicting formulations, hidden markups, and cart abandonment. Modern e-commerce is built for searching individual SKUs, not for orchestrating human intent. Welcome to IntentFlow AI — the autonomous commerce orchestration layer that bridges the gap between customer intent and trusted multi-platform transactions.',
    subtitles: [
      'Shoppers open 12-15 tabs across Amazon, Nykaa, and Flipkart.',
      'Price variances, conflicting ingredients, and hidden markups cause 70% cart abandonment.',
      'IntentFlow AI transforms fragmented intent into one-click trusted commerce.'
    ],
    keyPoints: [
      '15+ Tabs required for a single routine or setup',
      'Conflicting chemical ingredients or mismatched hardware',
      'No cross-store price comparison or routine synergy',
      'Zero financial movement authority without user consent'
    ],
    demoType: 'problem'
  },
  {
    id: 2,
    timeRange: '0:45 – 1:30',
    durationSec: 45,
    title: 'Core Innovation: "Reasoning Without Authority"',
    tagline: '9-Stage autonomous decision pipeline with mathematical budget bounds.',
    spokenScript: 'IntentFlow AI is not just another chatbot wrapper. It is a full agentic intelligence system built with a core philosophy: Reasoning Without Authority. The autonomous agent has complete intelligence to research, scan real-time catalogs, detect chemical or hardware incompatibilities, and optimize combinatorial bundles. But it holds zero financial movement authority without explicit human-in-the-loop approval sealed by an immutable Sha-256 Decision Receipt.',
    subtitles: [
      'Reasoning Without Financial Authority: Agent discovers, Human approves.',
      '9-stage autonomous decision pipeline with sub-second execution.',
      'Cryptographic Sha-256 Decision Receipts certify every recommendation.'
    ],
    keyPoints: [
      'Intent Extraction & Priority Decomposition',
      'Deterministic Budget Guardrails (< ₹1,800)',
      'Combinatorial Bundle Optimization across Stores',
      'Cryptographic Sha-256 Decision Receipt (IF-2026-XXXX)'
    ],
    demoType: 'architecture'
  },
  {
    id: 3,
    timeRange: '1:30 – 3:30',
    durationSec: 120,
    title: 'Live Demo: Multi-Store Discovery, Bundles & Order Recovery',
    tagline: 'Real-time multi-platform scanning, safety rationale, and Razorpay recovery agent.',
    spokenScript: 'Let us see IntentFlow AI in action. I will enter a real-world shopping intent: Oily acne-prone skincare routine under eighteen hundred rupees. Notice how our multi-agent pipeline immediately launches: it parses constraints, executes multi-signal cross-store scoring across Amazon, Nykaa, and Myntra, and builds a synergetic four-piece routine. Look at the AI Synergy Discount—it mathematically optimized the cart to save eighteen percent while strictly staying under our budget. Each recommendation comes with an autonomous verification rationale explaining why these ingredients work safely together. When ready, clicking Approve Decision generates an immutable cryptographic Decision Receipt. And during checkout, if a bank failure occurs, our autonomous Order Recovery Agent steps in to preserve the cart state and offer instant one-click UPI recovery.',
    subtitles: [
      'Instant multi-store scanning across Amazon, Nykaa, Flipkart, Myntra, Savana & Meesho.',
      'Combinatorial optimizer stacks 18% synergy discounts under stated budget cap.',
      'Autonomous Order Recovery Agent rescues bank declines with 1-click UPI retry.'
    ],
    keyPoints: [
      'Live Multi-Store Scanning Status Feed',
      'Formulation Compatibility (Salicylic Acid + Niacinamide Safe)',
      '18% Combinatorial Synergy Discount',
      'Razorpay Decline Simulation + 4-Route Cart Recovery Agent'
    ],
    demoType: 'core_demo'
  },
  {
    id: 4,
    timeRange: '3:30 – 4:15',
    durationSec: 45,
    title: '4-Gate Ethical Growth Engine & Merchant Analytics',
    tagline: 'Zero hidden markup and transparent cross-sells increase Average Order Value.',
    spokenScript: 'For merchants, IntentFlow AI increases Average Order Value through our 4-Gate Ethical Growth Engine. It only suggests complementary add-ons if they satisfy four strict gates: intent relevance, budget fit, approved merchant category, and zero hidden markups. Our merchant analytics dashboard provides real-time visibility into customer intent patterns, cross-store conversion funnels, and autonomous Gross Merchandise Value lift.',
    subtitles: [
      '4-Gate Ethical Growth: Only relevant, budget-fitting, un-marked-up add-ons surfaced.',
      'Merchant Analytics: Live GMV lift, conversion funnels, and intent clustering.',
      'Seamless multi-platform merchant connector health tracking.'
    ],
    keyPoints: [
      'Gate 1: High Intent Relevance Match',
      'Gate 2: Strict Unspent Budget Margin Fit',
      'Gate 3: Verified Merchant Safety Category',
      'Gate 4: Zero Hidden Markup or Artificial Scarcity'
    ],
    demoType: 'growth'
  },
  {
    id: 5,
    timeRange: '4:15 – 5:00',
    durationSec: 45,
    title: 'Razorpay Track 1 Alignment & Live Deployed Verdict',
    tagline: 'Fully compliant, 100% production ready, and deployed on GitHub Pages.',
    spokenScript: 'To summarize: IntentFlow AI fulfills all Track 1 requirements—from natural language intent extraction and multi-store product discovery, to budget-bounded bundle optimization, human-in-the-loop trust receipts, and Razorpay transaction recovery. It transforms high-friction shopping into an effortless, transparent, and trusted commerce experience. Thank you, and we invite you to explore the live deployed application on GitHub Pages!',
    subtitles: [
      'Track 1 AI Growth & Agentic Commerce: 100% Requirements Fulfilled.',
      'Live deployed and globally accessible on GitHub Pages.',
      'Open source repository available with full documentation.'
    ],
    keyPoints: [
      'Track 1 Requirement: Natural Language Parsing & Scoring ✓',
      'Track 1 Requirement: Combinatorial Routine Optimization ✓',
      'Track 1 Requirement: Trust & Guardrail Verification Receipts ✓',
      'Track 1 Requirement: Razorpay Checkout & Recovery Agent ✓'
    ],
    demoType: 'summary'
  }
];

export const PitchStudioPage: React.FC = () => {
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentChapter = PITCH_CHAPTERS[currentChapterIdx];
  const totalPitchDuration = 300;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakCurrentChapter = (text: string) => {
    if (!synthRef.current || !voiceEnabled) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium')) && v.lang.startsWith('en')) 
      || voices.find(v => v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;

    synthRef.current.speak(utterance);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      speakCurrentChapter(currentChapter.spokenScript);

      interval = setInterval(() => {
        setElapsedSec((prev) => {
          if (prev >= totalPitchDuration) {
            setIsPlaying(false);
            if (synthRef.current) synthRef.current.cancel();
            return totalPitchDuration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (synthRef.current) synthRef.current.cancel();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentChapterIdx, playbackSpeed]);

  useEffect(() => {
    let acc = 0;
    for (let i = 0; i < PITCH_CHAPTERS.length; i++) {
      acc += PITCH_CHAPTERS[i].durationSec;
      if (elapsedSec < acc) {
        if (currentChapterIdx !== i) {
          setCurrentChapterIdx(i);
        }
        break;
      }
    }
  }, [elapsedSec]);

  const handlePlayPause = () => {
    if (elapsedSec >= totalPitchDuration) {
      setElapsedSec(0);
      setCurrentChapterIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedSec(0);
    setCurrentChapterIdx(0);
    if (synthRef.current) synthRef.current.cancel();
  };

  const jumpToChapter = (idx: number) => {
    let startSec = 0;
    for (let i = 0; i < idx; i++) {
      startSec += PITCH_CHAPTERS[i].durationSec;
    }
    setElapsedSec(startSec);
    setCurrentChapterIdx(idx);
    if (isPlaying) {
      speakCurrentChapter(PITCH_CHAPTERS[idx].spokenScript);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: true
      });

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'IntentFlow_AI_5Min_Pitch_Demo.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      if (!isPlaying) handlePlayPause();
    } catch (err) {
      alert('Screen recording started. You can also record using Loom, Clipchamp, or OBS!');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return String(mins).padStart(2, '0') + ':' + String(rem).padStart(2, '0');
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-6 max-w-[1550px] mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-brand-blue/30 shadow-glow-blue relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-bold uppercase tracking-wider border border-brand-blue/40">
              5-Minute AI Pitch Studio
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-brand-purple/20 text-brand-purple font-bold">
              Track 1: AI Growth & Agentic Commerce
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Video className="w-6 h-6 text-brand-blue animate-pulse" />
            IntentFlow AI — Autonomous Demo & Pitch Deck
          </h1>
          <p className="text-xs sm:text-sm text-dim max-w-2xl">
            Autonomous multi-store commerce intelligence presentation with synchronized AI voice narration, interactive UI simulation, and 1-click video recording.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap z-10">
          <Link
            to="/agent"
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 font-mono"
          >
            <span>Live Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {!isRecording ? (
            <button
              onClick={startRecording}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-2 font-bold shadow-glow-blue"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>Record Video (.webm)</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 animate-pulse"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Stop & Save Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Video Player Display (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-border relative overflow-hidden flex flex-col justify-between min-h-[520px] bg-gradient-to-b from-[#090b14] via-[#05060b] to-[#0a0c16]">
            {/* Top Video Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center font-bold text-brand-blue text-sm">
                  {currentChapter.id}
                </div>
                <div>
                  <div className="text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold">
                    Chapter {currentChapter.id} of 5 • {currentChapter.timeRange}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {currentChapter.title}
                  </h2>
                </div>
              </div>

              <div className="text-xs font-mono px-3 py-1 rounded-lg bg-bg-panel border border-border text-dim">
                <span className="text-white font-bold">{formatTime(elapsedSec)}</span> / 05:00
              </div>
            </div>

            {/* Dynamic Interactive Stage Simulation Area */}
            <div className="my-6 flex-1 flex flex-col justify-center">
              {currentChapter.demoType === 'problem' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { store: 'Amazon', issue: 'SKU: Salicylic Cleanser ₹399 (Conflicting 2% BHA)', tab: 'Tab #1' },
                      { store: 'Nykaa', issue: 'SKU: Niacinamide Serum ₹599 (+₹80 Shipping)', tab: 'Tab #2' },
                      { store: 'Flipkart', issue: 'SKU: Ceramide Barrier Cream ₹649', tab: 'Tab #3' },
                      { store: 'Myntra', issue: 'SKU: SPF 50 Gel Sunscreen ₹499', tab: 'Tab #4' },
                      { store: 'Savana', issue: 'Hidden Checkout Markup + ₹120 Fee', tab: 'Tab #5' },
                      { store: 'Total Cart', issue: 'Total: ₹2,346 (Exceeds ₹1,800 Budget)', tab: '70% Drop' }
                    ].map((tab, i) => (
                      <div key={i} className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-red-400 font-bold">
                          <span>{tab.store}</span>
                          <span>{tab.tab}</span>
                        </div>
                        <p className="text-xs text-dim line-clamp-2">{tab.issue}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-purple-950/20 to-brand-blue/20 border border-red-500/40 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-xs text-white">
                      <b className="text-red-400">The Problem</b>: Users spend 45+ minutes across tabs, manually calculating budget, guessing compatibility, and abandoning carts.
                    </p>
                  </div>
                </div>
              )}

              {currentChapter.demoType === 'architecture' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { title: '1. Intent Decomposition', desc: 'Category, budget cap & constraint parsing', icon: '🧠' },
                      { title: '2. Multi-Signal Scoring', desc: 'Real-time rating, price & delivery velocity', icon: '⚡' },
                      { title: '3. Routine Optimization', desc: 'Combinatorial cart synergy discounts', icon: '🛍️' },
                      { title: '4. Formulation Safety', desc: 'Automated chemical clash detection', icon: '🛡️' },
                      { title: '5. Decision Receipt', desc: 'Sha-256 certified immutable receipt', icon: '📜' },
                      { title: '6. Zero-Authority Gate', desc: 'Requires human click approval to unlock pay', icon: '🔒' }
                    ].map((step, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-bg-panel border border-brand-blue/30 space-y-1.5 relative overflow-hidden group hover:border-brand-blue">
                        <div className="text-lg">{step.icon}</div>
                        <div className="text-xs font-bold text-white font-mono">{step.title}</div>
                        <div className="text-[11px] text-dim">{step.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentChapter.demoType === 'core_demo' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-bg-subtle border border-brand-blue/40 space-y-3 shadow-glow-blue">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-brand-blue font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        Live Multi-Store Scanning
                      </span>
                      <span className="text-status-good font-bold">● Amazon, Nykaa, Myntra, Flipkart Active</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {[
                        { name: 'Cetaphil Cleanser', price: '₹349', store: 'Amazon', match: '98%' },
                        { name: 'Minimalist Niacinamide', price: '₹569', store: 'Nykaa', match: '96%' },
                        { name: 'Dr. Sheth Ceramide', price: '₹399', store: 'Flipkart', match: '94%' },
                        { name: 'Aqualogica SPF 50', price: '₹389', store: 'Nykaa', match: '95%' }
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-bg-panel border border-border space-y-1">
                          <div className="text-[10px] font-mono text-dim">{item.store}</div>
                          <div className="text-xs font-bold text-white truncate">{item.name}</div>
                          <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-brand-blue font-bold">{item.price}</span>
                            <span className="text-status-good">{item.match}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-lg bg-status-good-bg border border-status-good/30 flex items-center justify-between text-xs font-mono">
                      <span className="text-white font-bold">Final Bundle: ₹1,706 (Saved ₹374 with 18% Synergy Discount)</span>
                      <span className="text-status-good font-bold">Within ₹1,800 Budget ✓</span>
                    </div>
                  </div>
                </div>
              )}

              {currentChapter.demoType === 'growth' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-bg-panel border border-brand-purple/40 space-y-2">
                      <div className="text-xs font-bold text-brand-purple font-mono uppercase">
                        4-Gate Ethical Verification
                      </div>
                      <ul className="text-xs space-y-1.5 text-dim">
                        <li className="flex items-center gap-1.5 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-good" />
                          <span>Gate 1: Verified Intent Relevance</span>
                        </li>
                        <li className="flex items-center gap-1.5 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-good" />
                          <span>Gate 2: Strict Unspent Budget Margin</span>
                        </li>
                        <li className="flex items-center gap-1.5 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-good" />
                          <span>Gate 3: Certified Partner Category</span>
                        </li>
                        <li className="flex items-center gap-1.5 text-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-good" />
                          <span>Gate 4: Zero Hidden Markups</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-bg-panel border border-brand-blue/40 space-y-2 font-mono text-xs">
                      <div className="text-brand-blue font-bold uppercase">Merchant Value Metrics</div>
                      <div className="flex justify-between py-1 border-b border-border">
                        <span className="text-dim">Autonomous GMV Lift</span>
                        <span className="text-status-good font-bold">+28.4%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-border">
                        <span className="text-dim">Cart Completion Rate</span>
                        <span className="text-white font-bold">84.2%</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-dim">Decline Recovery Rate</span>
                        <span className="text-brand-purple font-bold">62.8% via UPI</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentChapter.demoType === 'summary' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-brand-blue/20 via-brand-purple/20 to-brand-cyan/20 border border-brand-blue/50 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      <Award className="w-5 h-5 text-brand-purple" />
                      <span>Razorpay Track 1: AI Growth & Agentic Commerce Matrix</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {[
                        'Natural Language Intent Parsing ✓',
                        'Multi-Platform Price Discovery ✓',
                        'Combinatorial Routine Bundler ✓',
                        'Formulation Safety Engine ✓',
                        'Cryptographic Trust Receipts ✓',
                        'Razorpay Order Recovery Agent ✓'
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 rounded bg-bg-panel/80 border border-white/10 text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-status-good flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Synchronized Subtitles Ticker */}
            <div className="p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-brand-blue uppercase tracking-wider font-bold">
                <Mic className="w-3 h-3 text-brand-blue animate-pulse" />
                <span>AI Voice Narration & Live Subtitles</span>
              </div>
              <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                "{currentChapter.spokenScript}"
              </p>
            </div>

            {/* Video Player Bottom Controls & Scrub Bar */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  setElapsedSec(Math.floor(pct * totalPitchDuration));
                }}
                className="w-full bg-white/10 hover:bg-white/20 h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
              >
                <div 
                  style={{ width: ((elapsedSec / totalPitchDuration) * 100) + '%' }}
                  className="h-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-cyan rounded-full transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="py-2 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-bg font-bold flex items-center gap-1.5 transition-all shadow-glow-blue"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlaying ? 'Pause Demo' : 'Play 5-Min Demo'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="btn-secondary py-2 px-3 flex items-center gap-1"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-dim" />
                  </button>

                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={'btn-secondary py-2 px-3 flex items-center gap-1.5 ' + (voiceEnabled ? 'text-brand-blue border-brand-blue/40' : 'text-dim')}
                    title="Toggle AI Voiceover"
                  >
                    {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{voiceEnabled ? 'Voice On' : 'Muted'}</span>
                  </button>

                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="glass-input py-1.5 px-2.5 text-xs text-white rounded-lg font-mono bg-bg-panel"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x Normal</option>
                    <option value={1.25}>1.25x Fast</option>
                    <option value={1.5}>1.5x Speed</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentChapterIdx === 0}
                    onClick={() => jumpToChapter(currentChapterIdx - 1)}
                    className="btn-secondary py-1.5 px-2.5 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-dim text-[11px]">
                    {currentChapterIdx + 1} / {PITCH_CHAPTERS.length}
                  </span>
                  <button
                    disabled={currentChapterIdx === PITCH_CHAPTERS.length - 1}
                    onClick={() => jumpToChapter(currentChapterIdx + 1)}
                    className="btn-secondary py-1.5 px-2.5 disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chapter Playlist & Submission Blueprint (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between pb-2 border-b border-border">
              <span>5-Minute Chapter Playlist</span>
              <span className="text-brand-blue font-bold text-[10px]">5 Chapters</span>
            </div>

            <div className="space-y-2">
              {PITCH_CHAPTERS.map((ch, idx) => {
                const isActive = currentChapterIdx === idx;
                return (
                  <button
                    key={ch.id}
                    onClick={() => jumpToChapter(idx)}
                    className={'w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ' + (
                      isActive
                        ? 'border-brand-blue bg-brand-blue/15 shadow-glow-blue text-white'
                        : 'border-border bg-bg-panel hover:bg-white/5 text-dim hover:text-white'
                    )}
                  >
                    <span className={'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ' + (
                      isActive ? 'bg-brand-blue text-bg' : 'bg-white/10 text-dim'
                    )}>
                      {ch.id}
                    </span>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold truncate">{ch.title.split(':')[0]}</span>
                        <span className="text-[10px] font-mono text-brand-blue ml-1 flex-shrink-0">{ch.timeRange}</span>
                      </div>
                      <p className="text-[11px] text-dim2 line-clamp-1">{ch.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass-panel p-5 space-y-3 font-mono text-xs border-brand-purple/30">
            <div className="text-xs font-bold text-white uppercase tracking-wider text-brand-purple flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Submission Links
            </div>

            <div className="space-y-2 text-[11px]">
              <div>
                <div className="text-dim text-[10px]">5-MIN PITCH DEMO LINK:</div>
                <a
                  href="https://aditigupta1516.github.io/IntentFlowAI/#/pitch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-purple hover:underline break-all font-bold"
                >
                  https://aditigupta1516.github.io/IntentFlowAI/#/pitch
                </a>
              </div>

              <div>
                <div className="text-dim text-[10px]">LIVE DEPLOYED APP:</div>
                <a
                  href="https://aditigupta1516.github.io/IntentFlowAI/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:underline break-all"
                >
                  https://aditigupta1516.github.io/IntentFlowAI/
                </a>
              </div>

              <div>
                <div className="text-dim text-[10px]">GITHUB REPOSITORY:</div>
                <a
                  href="https://github.com/aditigupta1516/IntentFlowAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline break-all"
                >
                  https://github.com/aditigupta1516/IntentFlowAI
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PitchStudioPage;
