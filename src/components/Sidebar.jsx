import React from 'react';
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Factory,
  HeartPulse,
  FileText,
  Bot,
  CalendarDays,
  Radio,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Leaf
} from 'lucide-react';
import { useApp, NAV_ITEMS } from '../context/AppContext';

const ICON_MAP = {
  LayoutDashboard,
  Clock,
  Sparkles,
  Leaf,
  Map,
  AlertTriangle,
  Factory,
  HeartPulse,
  FileText,
  Bot,
  CalendarDays,
  Radio,
  ShieldCheck
};

export default function Sidebar() {
  const {
    page,
    setPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    alerts
  } = useApp();

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;

  return (
    <aside
      aria-label="Application Navigation"
      className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-cyan-400/10 bg-[#08101e]/95 backdrop-blur-md transition-all duration-300 md:flex ${sidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-cyan-400/10">
        <div className="flex items-center gap-3">
          <img
            src="./aura.svg"
            alt="AURA Smog Defense Logo"
            className={sidebarCollapsed ? 'h-8 w-8' : 'h-9 w-9'}
            style={{ filter: 'drop-shadow(0 0 12px rgba(34,211,238,0.7))' }}
          />
          {!sidebarCollapsed && (
            <div>
              <div className="font-display text-xl font-black tracking-[0.25em] text-white">
                AURA
              </div>
              <div className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-300/70">
                Family Smog Assistant
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main menu" className="mt-3 flex-1 space-y-1.5 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = page === item.id;
          const badgeValue = item.id === 'alerts' ? criticalCount : item.badge;

          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isActive
                ? 'bg-cyan-400/10 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.3)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded bg-cyan-300 shadow-glow" />
              )}
              <IconComponent
                aria-hidden="true"
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? 'text-cyan-300' : 'group-hover:text-cyan-300'
                  }`}
              />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!sidebarCollapsed && badgeValue && (
                <span className={`ml-auto rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border ${item.id === 'alerts'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30'
                  }`}>
                  {badgeValue}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Zero-Trust Status Card & Collapse Toggle */}
      <div className="space-y-3 p-3 border-t border-cyan-400/10">
        {!sidebarCollapsed && (
          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-glow-green" />
              <span>Household Shield Active</span>
            </div>
            <div className="mt-1 font-mono text-[10px] text-slate-500">
              Corsi-Rosenthal · Wet-Mop · Weatherstrip
            </div>
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/10 py-2 text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
