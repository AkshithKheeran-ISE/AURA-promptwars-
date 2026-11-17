import React, { useState } from 'react';
import { Send, Terminal, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { sanitizeInput } from '../utils/sanitize';
import { queryAiAssistant, getAiServiceStatus } from '../services/aiService';

const FAMILY_AGENTS_ROSTER = [
  {
    id: 'family_advisor',
    name: 'FamilyAdvisor',
    role: 'Lifestyle & Schedule Customizer',
    sampleQuery:
      'What diurnal daily smog schedule should our family follow to minimize inhaled PM2.5?',
    status: 'ACTIVE',
    avatarColor: '#22d3ee',
    desc: 'Analyzes household composition, school timings, and commute routes to generate low-exposure diurnal schedules.'
  },
  {
    id: 'iaq_engineer',
    name: 'IAQEngineer',
    role: 'DIY Air Purifier & Hack Architect',
    sampleQuery: 'How do I build a low-cost DIY Corsi-Rosenthal box air purifier for ₹1,450?',
    status: 'ACTIVE',
    avatarColor: '#34d399',
    desc: 'Provides blueprints for DIY Corsi-Rosenthal boxes, window draft weatherstripping, and kitchen ventilation isolation.'
  },
  {
    id: 'pediatric_shield',
    name: 'PediatricShield',
    role: 'Child & Senior Bronchial Protection',
    sampleQuery:
      'What specific airway protection actions should we take for an infant and asthmatic senior?',
    status: 'ACTIVE',
    avatarColor: '#f43f5e',
    desc: 'Calculates sub-micron soot deposition in pediatric lungs, flags school sports hazard windows, and optimizes N95 respirator fit.'
  },
  {
    id: 'meteo_forecaster',
    name: 'MeteoForecaster',
    role: 'Boundary Inversion & Window Timing',
    sampleQuery: 'When is the safest diurnal window to open windows for cross-ventilation?',
    status: 'ACTIVE',
    avatarColor: '#a855f7',
    desc: 'Monitors the nocturnal radiation inversion depth (70m - 120m) to pinpoint the exact 45-minute afternoon window to safely ventilate.'
  },
  {
    id: 'eco_auditor',
    name: 'EcoAuditor',
    role: 'Explainable Direct Impact Calculator',
    sampleQuery:
      'What is the direct carbon and soot savings if our family takes the Metro and swaps coal sigdi for a radiator?',
    status: 'ACTIVE',
    avatarColor: '#fbbf24',
    desc: 'Quantifies exact kilograms of CO2 avoided, grams of toxic PM2.5 spared, and medical rupees saved by your family’s clean choices.'
  },
  {
    id: 'community_watch',
    name: 'CommunityWatch',
    role: 'Tamper-Evident Hazard Watchdog',
    sampleQuery:
      'How does the SHA-256 community ledger protect neighborhood air hazard reports from tampering?',
    status: 'ACTIVE',
    avatarColor: '#38bdf8',
    desc: 'Validates SHA-256 citizen reports on neighborhood biomass burning, illegal generator smoke, and construction dust.'
  }
];

export default function AgentSystem() {
  const { addToast, logAudit } = useApp();
  const aiStatus = getAiServiceStatus();

  const [messages, setMessages] = useState([
    {
      sender: 'sys',
      text: `AURA GenAI Assistant online · Six specialized family intelligence agents active.\nOperating Mode: ${aiStatus.engineName}.\nAsk any question regarding indoor IAQ hacks, low-emission daily routines, infant bronchial protection, or sustainable alternatives.`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sampleQueries = [
    'How do I build a low-cost DIY Corsi-Rosenthal box air purifier for ₹1,450?',
    'What daily smog routine should I follow for my infant and asthmatic senior?',
    'When is the safest time of day to open windows for ventilation?',
    'What is the direct carbon and soot savings if our family takes the Metro?',
    'Why is open coal sigdi heating dangerous and what is the clean alternative?'
  ];

  const handleSend = async (queryText) => {
    const rawText = queryText || inputText;
    const cleanText = sanitizeInput(rawText, 500);
    if (!cleanText.trim()) return;

    const userMsg = { sender: 'user', text: cleanText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    logAudit(
      'Family Member',
      `Submitted GenAI query: ${cleanText.slice(0, 30)}...`,
      'AURA-CORE',
      'human'
    );

    try {
      const response = await queryAiAssistant(cleanText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'aura',
          agent: response.agent,
          engine: response.engine,
          text: response.text
        }
      ]);
      addToast(
        'Inference Complete',
        `${response.agent}: Response generated with direct impact breakdown`,
        'cyan'
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'aura',
          agent: 'AURA-CORE',
          engine: 'System Fallback',
          text: 'Encountered temporary inference exception. Please try again with a specific topic.'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="08 · Explainable Intelligence"
        title="AURA GenAI · Family Smog Defense Multi-Agent Assistant"
        desc="Six specialized atmospheric and household intelligence agents coordinated by AURA-CORE. Translating complex meteorology into actionable daily routines, DIY hacks, and direct impact explanations."
        right={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-[#0c182c] px-3 py-1.5 font-mono text-xs text-cyan-300">
              <Cpu className="h-3.5 w-3.5 text-cyan-400" />
              <span>{aiStatus.isLiveConfigured ? 'Gemini 2.0 Flash' : 'Deterministic Mesh'}</span>
            </span>
          </div>
        }
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
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 6 AGENTS
              ENGAGED
            </span>
          </div>

          <div className="relative h-[440px] w-full grid-bg rounded-xl border border-cyan-400/15 overflow-hidden">
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="50"
                y1="50"
                x2="20"
                y2="20"
                stroke="#22d3ee"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="animate-dash"
                opacity="0.6"
              />
              <line
                x1="50"
                y1="50"
                x2="80"
                y2="20"
                stroke="#34d399"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="animate-dash"
                opacity="0.6"
              />
              <line
                x1="50"
                y1="50"
                x2="15"
                y2="50"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="animate-dash"
                opacity="0.6"
              />
              <line
                x1="50"
                y1="50"
                x2="85"
                y2="50"
                stroke="#a855f7"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="animate-dash"
                opacity="0.6"
              />
              <line
                x1="50"
                y1="50"
                x2="25"
                y2="80"
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="animate-dash"
                opacity="0.6"
              />
              <line
                x1="50"
                y1="50"
                x2="75"
                y2="80"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="animate-dash"
                opacity="0.6"
              />
            </svg>

            {/* Central Orchestrator Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="relative mx-auto grid h-24 w-36 place-items-center rounded-xl border-2 border-cyan-400/70 bg-[#08101e] shadow-glow p-2">
                <img src="./aura.svg" alt="AURA-CORE" className="h-8 w-8" />
                <div className="font-display text-xs font-black tracking-widest text-white mt-1">
                  AURA-CORE
                </div>
                <div className="font-mono text-[8px] text-cyan-300">FAMILY ORCHESTRATOR</div>
              </div>
            </div>

            {/* Satellite Agent 1: FamilyAdvisor (Top Left) */}
            <button
              onClick={() => handleSend(FAMILY_AGENTS_ROSTER[0].sampleQuery)}
              className="absolute left-[8%] top-[12%] text-center cursor-pointer hover:scale-105 transition"
            >
              <div className="p-2 rounded-lg border border-cyan-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-cyan-300 font-bold">FamilyAdvisor</div>
                <div className="text-[8px] text-slate-400">Routines & Commute</div>
              </div>
            </button>

            {/* Satellite Agent 2: IAQEngineer (Top Right) */}
            <button
              onClick={() => handleSend(FAMILY_AGENTS_ROSTER[1].sampleQuery)}
              className="absolute right-[8%] top-[12%] text-center cursor-pointer hover:scale-105 transition"
            >
              <div className="p-2 rounded-lg border border-emerald-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-emerald-300 font-bold">IAQEngineer</div>
                <div className="text-[8px] text-slate-400">DIY Corsi & Hacks</div>
              </div>
            </button>

            {/* Satellite Agent 3: PediatricShield (Mid Left) */}
            <button
              onClick={() => handleSend(FAMILY_AGENTS_ROSTER[2].sampleQuery)}
              className="absolute left-[3%] top-[45%] text-center cursor-pointer hover:scale-105 transition"
            >
              <div className="p-2 rounded-lg border border-rose-500/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-rose-400 font-bold">PediatricShield</div>
                <div className="text-[8px] text-slate-400">Infant & Asthmatic Lung</div>
              </div>
            </button>

            {/* Satellite Agent 4: MeteoForecaster (Mid Right) */}
            <button
              onClick={() => handleSend(FAMILY_AGENTS_ROSTER[3].sampleQuery)}
              className="absolute right-[3%] top-[45%] text-center cursor-pointer hover:scale-105 transition"
            >
              <div className="p-2 rounded-lg border border-purple-500/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-purple-300 font-bold">MeteoForecaster</div>
                <div className="text-[8px] text-slate-400">Inversion & Timing</div>
              </div>
            </button>

            {/* Satellite Agent 5: EcoAuditor (Bottom Left) */}
            <button
              onClick={() => handleSend(FAMILY_AGENTS_ROSTER[4].sampleQuery)}
              className="absolute left-[10%] bottom-[12%] text-center cursor-pointer hover:scale-105 transition"
            >
              <div className="p-2 rounded-lg border border-amber-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-amber-300 font-bold">EcoAuditor</div>
                <div className="text-[8px] text-slate-400">Direct Impact Metric</div>
              </div>
            </button>

            {/* Satellite Agent 6: CommunityWatch (Bottom Right) */}
            <button
              onClick={() => handleSend(FAMILY_AGENTS_ROSTER[5].sampleQuery)}
              className="absolute right-[10%] bottom-[12%] text-center cursor-pointer hover:scale-105 transition"
            >
              <div className="p-2 rounded-lg border border-sky-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-sky-300 font-bold">CommunityWatch</div>
                <div className="text-[8px] text-slate-400">Tamper-Proof Ledger</div>
              </div>
            </button>
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
                    {m.sender === 'user'
                      ? 'FAMILY RESIDENT'
                      : m.sender === 'sys'
                        ? 'SYSTEM'
                        : `${m.agent || 'AURA-CORE'} (${m.engine || 'AI ASSISTANT'})`}
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
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-cyan-400/10 pt-3"
          >
            <label htmlFor="agent-query-input" className="sr-only">
              Ask AURA GenAI Assistant
            </label>
            <span className="font-mono text-cyan-400 font-bold" aria-hidden="true">
              &gt;
            </span>
            <input
              id="agent-query-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for custom family routines, Corsi box tips, or impact calculations..."
              aria-label="Ask for custom family routines, Corsi box tips, or impact calculations"
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Send message to GenAI assistant"
              className="rounded-lg bg-cyan-400 p-2 text-black hover:bg-cyan-300 transition cursor-pointer"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
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
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> 6 Clinical & Environmental Models Verified
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FAMILY_AGENTS_ROSTER.map((agent) => (
            <div
              key={agent.id}
              className="p-4 rounded-xl border border-cyan-400/10 bg-[#030712] space-y-2 font-mono text-xs hover:border-cyan-400/30 transition flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-white text-sm"
                    style={{ color: agent.avatarColor }}
                  >
                    {agent.name}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded font-bold">
                    {agent.status}
                  </span>
                </div>

                <div className="text-cyan-300 text-[11px] font-semibold">{agent.role}</div>
                <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.desc}</p>
              </div>

              <div className="pt-2 border-t border-cyan-400/10">
                <button
                  onClick={() => handleSend(agent.sampleQuery)}
                  className="w-full text-left truncate text-[11px] text-cyan-400 hover:text-cyan-200 transition cursor-pointer flex items-center justify-between"
                  title={agent.sampleQuery}
                >
                  <span>Ask this agent &rarr;</span>
                  <span className="text-[10px] text-slate-500 font-sans">Click to query</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
