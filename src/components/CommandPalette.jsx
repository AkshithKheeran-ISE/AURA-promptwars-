import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, LayoutDashboard, MapPin, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp, NAV_ITEMS } from '../context/AppContext';
import { WARDS_DATA } from '../data/airData';

export default function CommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setPage,
    setSelectedWardId,
    addToast,
    simulateTamper,
    verifyLedger,
    toggleHack
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!commandPaletteOpen) {
      setQuery('');
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const filteredPages = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return NAV_ITEMS;
    return NAV_ITEMS.filter(
      (item) => item.label.toLowerCase().includes(term) || item.id.toLowerCase().includes(term)
    );
  }, [query]);

  const filteredWards = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return WARDS_DATA;
    return WARDS_DATA.filter(
      (ward) =>
        ward.name.toLowerCase().includes(term) ||
        ward.id.toLowerCase().includes(term) ||
        ward.status.toLowerCase().includes(term)
    );
  }, [query]);

  if (!commandPaletteOpen) return null;

  const handleSelectPage = (id) => {
    setPage(id);
    setCommandPaletteOpen(false);
  };

  const handleSelectWard = (id) => {
    setSelectedWardId(id);
    setPage('map');
    setCommandPaletteOpen(false);
    addToast('Sector Loaded', `Loaded monitoring telemetry for ${id}`, 'cyan');
  };

  const handleAction = (label, actionFn) => {
    actionFn();
    setCommandPaletteOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-[3000] grid place-items-start justify-center bg-black/70 p-4 pt-20 backdrop-blur-sm cursor-pointer"
    >
      <div
        className="w-full max-w-2xl panel panel-corners border-cyan-400/30 bg-[#08101e] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-cyan-400/20 px-4 py-3">
          <Search className="h-5 w-5 text-cyan-400" aria-hidden="true" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, routine, IAQ hack, ward, or action..."
            aria-label="Search modules and actions"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            aria-label="Close command palette"
            className="rounded p-1 text-slate-400 hover:text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 font-sans text-sm">
          {/* Quick Family Actions */}
          <div>
            <div className="label px-2 mb-1.5 text-cyan-400">Tactical Quick Actions</div>
            <div className="space-y-1">
              <button
                onClick={() =>
                  handleAction('Activate Corsi Box', () => {
                    toggleHack('corsi_rosenthal');
                    setPage('hacks');
                  })
                }
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-cyan-400/10 hover:text-cyan-200 transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Toggle DIY Corsi-Rosenthal Box Filtration</span>
                <span className="ml-auto font-mono text-[10px] text-emerald-300">
                  92% PM2.5 Shield
                </span>
              </button>

              <button
                onClick={() => handleAction('Simulate Tamper', simulateTamper)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-rose-500/10 hover:text-rose-200 transition cursor-pointer"
              >
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <span>Simulate Cryptographic Ledger Tampering</span>
                <span className="ml-auto font-mono text-[10px] text-rose-400">Tamper Test</span>
              </button>

              <button
                onClick={() => handleAction('Verify Ledger', verifyLedger)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-200 transition cursor-pointer"
              >
                <Zap className="h-4 w-4 text-emerald-400" />
                <span>Verify & Recalculate SHA-256 Hash Chain</span>
                <span className="ml-auto font-mono text-[10px] text-emerald-400">Validate</span>
              </button>
            </div>
          </div>

          {/* Modules / Navigation */}
          <div>
            <div className="label px-2 mb-1.5 text-slate-400">AURA Modules</div>
            <div className="grid grid-cols-2 gap-1">
              {filteredPages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectPage(item.id)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wards & Sectors */}
          {filteredWards.length > 0 && (
            <div>
              <div className="label px-2 mb-1.5 text-slate-400">Urban Wards & Air Stations</div>
              <div className="space-y-1">
                {filteredWards.slice(0, 5).map((ward) => (
                  <button
                    key={ward.id}
                    onClick={() => handleSelectWard(ward.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/5 hover:text-white transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{ward.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span
                        className={
                          ward.aqi > 300
                            ? 'text-rose-400'
                            : ward.aqi > 200
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                        }
                      >
                        AQI {ward.aqi}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">({ward.status})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-cyan-400/10 bg-black/40 px-4 py-2 text-xs font-mono text-slate-500">
          <span>Press ESC to close</span>
          <span>AURA Family Smog Defense v4.2.1</span>
        </div>
      </div>
    </div>
  );
}
