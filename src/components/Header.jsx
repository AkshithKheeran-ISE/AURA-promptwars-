import React, { useState, useEffect, useMemo } from 'react';
import { Search, AlertOctagon, ShieldCheck, Bell } from 'lucide-react';
import { useUi, useAlerts } from '../context/AppContext';
import { NAV_ITEMS } from '../constants/navigation';

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const ist = time.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' });
  const utc = time.toLocaleTimeString('en-GB', { timeZone: 'UTC' });

  return (
    <div className="hidden text-right lg:block font-mono">
      <div className="text-sm font-semibold text-cyan-200 flex items-center gap-1 justify-end">
        <span>{ist}</span>
        <span className="text-[10px] text-slate-500 font-normal">IST</span>
      </div>
      <div className="text-[10px] text-slate-500">{utc} UTC</div>
    </div>
  );
}

function NotificationDropdown({ alerts, notifOpen, criticalCount, onToggle, onSelectAlert }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
        aria-label={`View notifications, ${criticalCount} critical alerts`}
        aria-expanded={notifOpen}
        title="Notifications"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {criticalCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 shadow-glow-red" />
        )}
      </button>

      {notifOpen && (
        <div
          className="absolute right-0 mt-2 w-80 panel p-3 z-50 shadow-2xl"
          onMouseLeave={onToggle}
        >
          <div className="flex items-center justify-between border-b border-cyan-400/10 pb-2 mb-2">
            <span className="label text-cyan-300">Recent Incident Stream</span>
            <span className="text-[10px] font-mono text-slate-400">{alerts.length} Active</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {alerts.slice(0, 4).map((alr) => (
              <button
                key={alr.id}
                type="button"
                onClick={onSelectAlert}
                className="w-full text-left rounded-lg p-2 hover:bg-white/5 cursor-pointer border border-transparent hover:border-cyan-400/20 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-rose-300 font-bold">{alr.id}</span>
                  <span className="text-[10px] text-slate-500">{alr.timestamp}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">
                  {alr.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{alr.ward}</div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onSelectAlert}
            className="mt-2 block w-full text-center text-xs text-cyan-300 hover:underline pt-2 border-t border-cyan-400/10 cursor-pointer"
          >
            Open Alert Center &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function HeaderUserProfile() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-cyan-400/15 bg-[#08101e] py-1 pl-1 pr-3">
      <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-[#030712]">
        PF
      </div>
      <div className="hidden leading-tight sm:block text-left">
        <div className="text-xs font-semibold text-white">Priya Family Lead</div>
        <div className="flex items-center gap-1 font-mono text-[9px] text-cyan-300/70">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>2 Children + Asthmatic
          Senior
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { page, setPage, setCommandPaletteOpen } = useUi();
  const { alerts } = useAlerts();

  const [notifOpen, setNotifOpen] = useState(false);
  const criticalCount = useMemo(
    () => alerts.filter((a) => a.severity === 'critical').length,
    [alerts]
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-cyan-400/10 bg-[#030712]/85 px-4 backdrop-blur-md md:px-6">
      {/* Mobile Brand & Module Select */}
      <div className="flex items-center gap-2 md:hidden">
        <img src="./aura.svg" alt="AURA" className="h-7 w-7" />
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          aria-label="Select application view"
          className="rounded-lg border border-cyan-400/20 bg-[#0c182c] px-2 py-1 text-xs text-white focus:outline-none"
        >
          {NAV_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Global Search Bar (opens Command Palette) */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Search pollutants, stations, or open command palette (Ctrl+K)"
          className="flex w-full items-center justify-between rounded-lg border border-cyan-400/15 bg-[#08101e] py-2 pl-9 pr-3 text-sm text-slate-400 hover:border-cyan-400/40 hover:bg-[#0c182c] transition cursor-pointer text-left"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <span className="truncate">Search pollutants, stations, wards, industrial stacks...</span>
          <kbd className="rounded border border-slate-700 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            CTRL K
          </kbd>
        </button>
      </div>

      {/* Right Action Icons & Status Badges */}
      <div className="ml-auto flex items-center gap-3">
        {/* Threat Level Badge */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5">
          <AlertOctagon className="h-3.5 w-3.5 animate-pulse text-rose-400" />
          <span className="font-mono text-[11px] font-bold tracking-wider text-rose-300">
            AQI STATUS · CRITICAL (GRAP-IV)
          </span>
        </div>

        {/* Cryptographic Ledger Integrity Badge */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
          <span className="font-mono text-[10px] text-emerald-300">SHA-256 VERIFIED LEDGER</span>
        </div>

        {/* Live Clock */}
        <LiveClock />

        {/* Notification Bell Dropdown */}
        <NotificationDropdown
          alerts={alerts}
          notifOpen={notifOpen}
          criticalCount={criticalCount}
          onToggle={() => setNotifOpen(!notifOpen)}
          onSelectAlert={() => {
            setPage('alerts');
            setNotifOpen(false);
          }}
        />

        <HeaderUserProfile />
      </div>
    </header>
  );
}
