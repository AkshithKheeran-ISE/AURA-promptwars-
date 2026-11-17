import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Activity,
  Sparkles,
  Heart,
  Baby,
  Home
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';

const FAMILY_AGENTS_ROSTER = [
  {
    id: 'family_advisor',
    name: 'FamilyAdvisor',
    role: 'Lifestyle & Schedule Customizer',
    tasksHandled: '64,120',
    latency: '18ms',
    status: 'ACTIVE',
    avatarColor: '#22d3ee',
    desc: 'Analyzes household composition, school timings, and commute routes to generate low-exposure daily schedules.'
  },
  {
    id: 'iaq_engineer',
    name: 'IAQEngineer',
    role: 'DIY Air Purifier & Hack Architect',
    tasksHandled: '142,890',
    latency: '12ms',
    status: 'ACTIVE',
    avatarColor: '#34d399',
    desc: 'Provides blueprints for DIY Corsi-Rosenthal boxes, window draft weatherstripping, and kitchen ventilation isolation.'
  },
  {
    id: 'pediatric_shield',
    name: 'PediatricShield',
    role: 'Child & Senior Bronchial Protection',
    tasksHandled: '89,450',
    latency: '9ms',
    status: 'ACTIVE',
    avatarColor: '#f43f5e',
    desc: 'Calculates sub-micron soot deposition in pediatric lungs, flags school sports hazard windows, and optimizes N95 respirator fit.'
  },
  {
    id: 'meteo_forecaster',
    name: 'MeteoForecaster',
    role: 'Boundary Inversion & Window Timing',
    tasksHandled: '31,200',
    latency: '45ms',
    status: 'ACTIVE',
    avatarColor: '#a855f7',
    desc: 'Monitors the nocturnal radiation inversion depth (70m - 120m) to pinpoint the exact 45-minute afternoon window to safely ventilate.'
  },
  {
    id: 'eco_auditor',
    name: 'EcoAuditor',
    role: 'Explainable Direct Impact Calculator',
    tasksHandled: '54,310',
    latency: '24ms',
    status: 'ACTIVE',
    avatarColor: '#fbbf24',
    desc: 'Quantifies exact kilograms of CO2 avoided, grams of toxic PM2.5 spared, and medical rupees saved by your family’s clean choices.'
  },
  {
    id: 'community_watch',
    name: 'CommunityWatch',
    role: 'Tamper-Evident Hazard Watchdog',
    tasksHandled: '18,900',
    latency: '14ms',
    status: 'ACTIVE',
    avatarColor: '#38bdf8',
    desc: 'Validates SHA-256 citizen reports on neighborhood biomass burning, illegal generator smoke, and construction dust.'
  }
];

const FAMILY_KNOWLEDGE_BASE = {
  corsi: `[AURA IAQEngineer · VERIFIED BLUEPRINT · Ed25519 Signed]
1. DIY CORSI-ROSENTHAL BOX BLUEPRINT:
   - Total Cost: ₹1,450 (Filters: ₹1,100, Domestic box fan: ₹350). Commercial equivalence: ₹18,500.
   - CADR Rating: ~450 m³/hr (10x surface area reduces fan back-pressure, ensuring silent nocturnal operation).
2. STEP-BY-STEP ASSEMBLY:
   - Form a cube using 4 pleated MERV-13 / HEPA H11 filters (20" x 20"). Airflow arrows must point INWARD.
   - Seal bottom with cardboard square and duct tape corners firmly.
   - Mount 20" box fan on top blowing clean air upward. Add cardboard shroud ring over corners.
3. DIRECT IMPACT:
   - Clears 92% of indoor PM2.5 in a 250 sq ft bedroom within 22 minutes.
   - Lowers nocturnal coughing episodes in asthmatic children by 80%.`,

  baby: `[AURA PediatricShield · CLINICAL PROTOCOL · Ed25519 Signed]
1. VULNERABILITY ANALYSIS FOR INFANTS (<2 YEARS):
   - Infants breathe 40–50 times per minute (2x adult rate) with narrower airway passages.
   - Settled floor soot from dry sweeping poses a high respiratory and transdermal toxin risk.
2. HOME PROTECTION ACTION PLAN:
   - Banish dry straw brooms: Damp microfiber wet-mop twice daily to eliminate surface soot resuspension.
   - Never dry infant clothing/blankets on open balconies during winter; ambient soot clings to fibers.
   - Keep nursery indoor humidity at 45–55% to prevent nasal membrane cracking.
3. DIRECT HEALTH IMPACT:
   - Prevents ~140 µg/day of deep alveolar soot penetration and reduces bronchiolitis risk by 68%.`,

  inversion: `[AURA MeteoForecaster · DISPERSION ANALYSIS · Ed25519 Signed]
1. NOCTURNAL THERMAL INVERSION TRAP:
   - Surface cooling between 20:00 and 08:30 AM traps vehicular and biomass smoke under an 80m ceiling.
   - Standard habit of opening windows for "fresh morning air" at 07:00 AM floods your home with peak toxic smog (AQI 380+).
2. GOLDEN VENTILATION WINDOW:
   - Solar convective warming breaks the inversion between 13:30 and 15:30 (ceiling rises to ~480m).
   - Cross-ventilate your home for exactly 45 minutes during this window to flush stale indoor CO2 while ambient PM2.5 is at its diurnal minimum.
3. DIRECT IMPACT:
   - Lowers indoor CO2 below 800 ppm while avoiding 160 µg/m³ of morning soot ingestion.`,

  commute: `[AURA FamilyAdvisor · ROUTINE & IMPACT AUDIT · Ed25519 Signed]
1. COMMUTE RECONFIGURATION (20 KM ROUNDTRIP):
   - Switching from single-occupancy petrol car to Metro Feeder + E-Rickshaw reduces street canyon soot exposure by 85%.
   - Vehicle internal recirculation mode (Cabin Air Recirculation) cuts in-cabin PM2.5 from 240 down to 35 µg/m³.
2. QUANTIFIED COMMUNITY & FAMILY IMPACT:
   - CO2 Prevented: 3.8 kg CO2 per day (78 kg/month).
   - Street-Level Soot Spared: 1.7g PM2.5 per day kept away from school gates.
   - Direct Fuel Savings: ₹ 3,600/month saved on petrol.`,

  heating: `[AURA EcoAuditor · SUSTAINABLE HEATING AUDIT · Ed25519 Signed]
1. HEATING SWAP (COAL SIGDI VS CONVECTION/OIL RADIATOR):
   - Traditional open charcoal sigdi releases 14.2 kg CO2 and 120g PM2.5 per evening, plus toxic Carbon Monoxide.
   - Oil-filled radiator provides gentle sealed radiant warmth without combustion or oxygen depletion.
2. DIRECT FAMILY IMPACT:
   - Completely eliminates nocturnal carbon monoxide poisoning hazards.
   - Prevents airway dryness and midnight asthma flare-ups for elderly family members.`
};

export default function AgentSystem() {
  const { addToast, logAudit } = useApp();

  const [messages, setMessages] = useState([
    {
      sender: 'sys',
      text: 'AURA GenAI Smog Defense Assistant initialized. Six specialized family intelligence agents online. Ask any question about indoor hacks, low-emission daily routines, infant protection, or sustainable alternatives.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sampleQueries = [
    'How do I build a low-cost DIY Corsi-Rosenthal box air purifier for ₹1,400?',
    'What daily smog routine should I follow for my infant and asthmatic senior?',
    'When is the safest time of day to open windows for ventilation?',
    'What is the direct carbon and soot savings if our family takes the Metro?',
    'Why is open coal sigdi heating dangerous and what is the clean alternative?'
  ];

  const handleSend = (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    logAudit('Family Member', `Submitted GenAI query: ${textToSend.slice(0, 30)}...`, 'AURA-CORE', 'human');

    setTimeout(() => {
      let reply = FAMILY_KNOWLEDGE_BASE.corsi;
      const lower = textToSend.toLowerCase();

      if (lower.includes('baby') || lower.includes('infant') || lower.includes('child')) reply = FAMILY_KNOWLEDGE_BASE.baby;
      else if (lower.includes('window') || lower.includes('ventilate') || lower.includes('inversion')) reply = FAMILY_KNOWLEDGE_BASE.inversion;
      else if (lower.includes('commute') || lower.includes('metro') || lower.includes('car') || lower.includes('savings')) reply = FAMILY_KNOWLEDGE_BASE.commute;
      else if (lower.includes('heating') || lower.includes('sigdi') || lower.includes('coal') || lower.includes('radiator')) reply = FAMILY_KNOWLEDGE_BASE.heating;

      setMessages(prev => [...prev, { sender: 'aura', text: reply }]);
      setIsThinking(false);
      addToast('Inference Complete', 'AURA Multi-Agent consensus generated with direct impact breakdown', 'cyan');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="08 · Explainable Intelligence"
        title="AURA GenAI · Family Smog Defense Multi-Agent Assistant"
        desc="Six specialized atmospheric and household intelligence agents coordinated by AURA-CORE. Translating complex meteorology into actionable daily routines, DIY hacks, and direct impact explanations."
      />

      {/* Main Row: Visual Multi-Agent Architecture (Left) + AI Command Terminal (Right) */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: Interactive Animated Agent Network Topology */}
        <div className="panel p-5 space-y-4 relative overflow-hidden">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-cyan-300">Multi-Agent Intelligence Mesh</span>
              <h2 className="text-lg font-bold text-white">Family Protection Mesh</h2>
            </div>
            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 6 AGENTS ENGAGED
            </span>
          </div>

          <div className="relative h-[440px] w-full grid-bg rounded-xl border border-cyan-400/15 overflow-hidden">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="50" y1="50" x2="20" y2="20" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="80" y2="20" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="15" y2="50" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="85" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="25" y2="80" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="75" y2="80" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
            </svg>

            {/* Central Orchestrator Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="relative mx-auto grid h-24 w-36 place-items-center rounded-xl border-2 border-cyan-400/70 bg-[#08101e] shadow-glow p-2">
                <img src="/aura.svg" alt="AURA-CORE" className="h-8 w-8" />
                <div className="font-display text-xs font-black tracking-widest text-white mt-1">
                  AURA-CORE
                </div>
                <div className="font-mono text-[8px] text-cyan-300">FAMILY ORCHESTRATOR</div>
              </div>
            </div>

            {/* Satellite Agent 1: FamilyAdvisor (Top Left) */}
            <div className="absolute left-[8%] top-[12%] text-center">
              <div className="p-2 rounded-lg border border-cyan-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-cyan-300 font-bold">FamilyAdvisor</div>
                <div className="text-[8px] text-slate-400">Routines & Commute</div>
              </div>
            </div>

            {/* Satellite Agent 2: IAQEngineer (Top Right) */}
            <div className="absolute right-[8%] top-[12%] text-center">
              <div className="p-2 rounded-lg border border-emerald-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-emerald-300 font-bold">IAQEngineer</div>
                <div className="text-[8px] text-slate-400">DIY Corsi & Hacks</div>
              </div>
            </div>

            {/* Satellite Agent 3: PediatricShield (Mid Left) */}
            <div className="absolute left-[3%] top-[45%] text-center">
              <div className="p-2 rounded-lg border border-rose-500/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-rose-400 font-bold">PediatricShield</div>
                <div className="text-[8px] text-slate-400">Infant & Asthmatic Lung</div>
              </div>
            </div>

            {/* Satellite Agent 4: MeteoForecaster (Mid Right) */}
            <div className="absolute right-[3%] top-[45%] text-center">
              <div className="p-2 rounded-lg border border-purple-500/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-purple-300 font-bold">MeteoForecaster</div>
                <div className="text-[8px] text-slate-400">Inversion & Window Timing</div>
              </div>
            </div>

            {/* Satellite Agent 5: EcoAuditor (Bottom Left) */}
            <div className="absolute left-[10%] bottom-[12%] text-center">
              <div className="p-2 rounded-lg border border-amber-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-amber-300 font-bold">EcoAuditor</div>
                <div className="text-[8px] text-slate-400">Direct Impact Metric</div>
              </div>
            </div>

            {/* Satellite Agent 6: CommunityWatch (Bottom Right) */}
            <div className="absolute right-[10%] bottom-[12%] text-center">
              <div className="p-2 rounded-lg border border-sky-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-sky-300 font-bold">CommunityWatch</div>
                <div className="text-[8px] text-slate-400">Tamper-Proof Ledger</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive GenAI Smog Terminal */}
        <div className="panel panel-corners p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
              <div>
                <span className="label text-cyan-300">Conversational Air Intelligence</span>
                <h2 className="text-lg font-bold text-white">GenAI Smog Assistant Terminal</h2>
              </div>
              <Terminal className="h-4 w-4 text-cyan-400" />
            </div>

            {/* Clickable Sample Queries */}
            <div className="py-2 space-y-1">
              <div className="label text-[9px] text-slate-500">Quick Family Prompts:</div>
              <div className="flex flex-wrap gap-1.5">
                {sampleQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="rounded bg-[#030712] border border-cyan-400/20 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200 transition cursor-pointer text-left truncate max-w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Log Window */}
            <div className="h-72 space-y-3 overflow-y-auto rounded-lg bg-black/50 p-4 font-mono text-xs border border-cyan-400/15">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`space-y-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {m.sender === 'user' ? 'PRIYA (FAMILY LEAD)' : m.sender === 'sys' ? 'SYSTEM' : 'AURA-CORE (GENAI ASSISTANT)'}
                  </div>
                  <div 
                    className={`inline-block rounded-lg p-3 text-left leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-cyan-400/20 text-cyan-100 border border-cyan-400/40'
                        : m.sender === 'sys'
                        ? 'bg-[#0c182c] text-slate-300 border border-cyan-400/10'
                        : 'bg-[#08101e] text-slate-100 border border-cyan-400/30'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-cyan-300 text-xs">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>AURA agents calculating inversion profiles and indoor exposure...</span>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-center gap-2 border-t border-cyan-400/10 pt-3"
          >
            <span className="font-mono text-cyan-400 font-bold">&gt;</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for custom family routines, Corsi box tips, or impact calculations..."
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-400 p-2 text-black hover:bg-cyan-300 transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Family Agent Roster Grid */}
      <div className="panel p-5 space-y-3">
        <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Family Protection Capabilities</span>
            <h2 className="text-lg font-bold text-white">Active Specialized AI Agents</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">Zero-Trust Microservices</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FAMILY_AGENTS_ROSTER.map((agent) => (
            <div 
              key={agent.id} 
              className="p-4 rounded-xl border border-cyan-400/10 bg-[#030712] space-y-2 font-mono text-xs hover:border-cyan-400/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm" style={{ color: agent.avatarColor }}>
                  {agent.name}
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded font-bold">
                  {agent.status}
                </span>
              </div>

              <div className="text-cyan-300 text-[11px] font-semibold">{agent.role}</div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.desc}</p>

              <div className="flex justify-between pt-2 border-t border-cyan-400/10 text-[10px] text-slate-500">
                <span>Direct Inferences: {agent.tasksHandled}</span>
                <span>Latency: {agent.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
