import React, { useState, lazy, Suspense } from 'react';
import { useUi } from './context/AppContext';
import BootScreen from './components/BootScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveTicker from './components/LiveTicker';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';

// 10 Core Application Pages for Family Smog Defense (Lazy-loaded for high efficiency)
const CommandCenter = lazy(() => import('./pages/CommandCenter'));
const DailyRoutines = lazy(() => import('./pages/DailyRoutines'));
const IndoorAirHacks = lazy(() => import('./pages/IndoorAirHacks'));
const SustainableAlternatives = lazy(() => import('./pages/SustainableAlternatives'));
const ThreatMap = lazy(() => import('./pages/ThreatMap'));
const AlertCenter = lazy(() => import('./pages/AlertCenter'));
const CitizenReports = lazy(() => import('./pages/CitizenReports'));
const AgentSystem = lazy(() => import('./pages/AgentSystem'));
const Forecast = lazy(() => import('./pages/Forecast'));
const AuditTrail = lazy(() => import('./pages/AuditTrail'));

const PAGES = {
  command: CommandCenter,
  routines: DailyRoutines,
  hacks: IndoorAirHacks,
  alternatives: SustainableAlternatives,
  map: ThreatMap,
  alerts: AlertCenter,
  reports: CitizenReports,
  ai: AgentSystem,
  forecast: Forecast,
  audit: AuditTrail
};

function PageLoader() {
  return (
    <div className="flex h-96 w-full items-center justify-center font-mono text-cyan-400">
      <div className="flex items-center space-x-3 rounded-lg border border-cyan-400/20 bg-slate-900/60 px-6 py-4 shadow-glow">
        <span className="inline-block h-3 w-3 animate-ping rounded-full bg-cyan-400" />
        <span className="text-xs uppercase tracking-widest text-slate-300">
          Loading Atmospheric Telemetry...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const { page, sidebarCollapsed } = useUi();

  const [booted, setBooted] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.sessionStorage?.getItem('aura-boot') === '1';
    } catch {
      return false;
    }
  });

  const handleBootDone = () => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage?.setItem('aura-boot', '1');
      }
    } catch {
      // ignore storage restriction
    }
    setBooted(true);
  };

  /** @type {any} */
  const CurrentPageComponent = PAGES[page] || CommandCenter;

  return (
    <>
      {/* Accessibility Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:font-sans focus:text-xs focus:font-bold focus:text-black focus:shadow-glow focus:outline-none"
      >
        Skip to main content &rarr;
      </a>

      {/* Optional Boot Splash Sequence */}
      {!booted && <BootScreen onDone={handleBootDone} />}

      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`min-h-full transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-64'
        }`}
      >
        {/* Top Header */}
        <Header />

        {/* Live Marquee Ticker */}
        <LiveTicker />

        {/* Dynamic Page Viewport */}
        <main
          id="main-content"
          role="main"
          className="mx-auto max-w-[1600px] p-4 md:p-6 min-h-[calc(100vh-140px)]"
        >
          <ErrorBoundary key={page}>
            <Suspense fallback={<PageLoader />}>
              <CurrentPageComponent />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* High-Tech Footer */}
        <footer className="border-t border-cyan-400/10 px-6 py-4 text-center font-mono text-[10px] text-slate-500 bg-[#030712]">
          AURA · GenAI Family & Community Smog Defense Assistant · Low-emission daily routines,
          indoor air quality hacks & sustainable alternatives for urban winter smog.
        </footer>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Floating Real-time Toast Notifications */}
      <ToastContainer />
    </>
  );
}
