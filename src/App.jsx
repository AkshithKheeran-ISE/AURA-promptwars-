import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import BootScreen from './components/BootScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveTicker from './components/LiveTicker';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/ToastContainer';

// 10 Core Application Pages for Family Smog Defense
import CommandCenter from './pages/CommandCenter';
import DailyRoutines from './pages/DailyRoutines';
import IndoorAirHacks from './pages/IndoorAirHacks';
import SustainableAlternatives from './pages/SustainableAlternatives';
import ThreatMap from './pages/ThreatMap';
import AlertCenter from './pages/AlertCenter';
import CitizenReports from './pages/CitizenReports';
import AgentSystem from './pages/AgentSystem';
import Forecast from './pages/Forecast';
import AuditTrail from './pages/AuditTrail';

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

export default function App() {
  const { page, sidebarCollapsed } = useApp();

  const [booted, setBooted] = useState(() => {
    return sessionStorage.getItem('aura-boot') === '1';
  });

  const handleBootDone = () => {
    sessionStorage.setItem('aura-boot', '1');
    setBooted(true);
  };

  const CurrentPageComponent = PAGES[page] || CommandCenter;

  return (
    <>
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
        <main className="mx-auto max-w-[1600px] p-4 md:p-6 min-h-[calc(100vh-140px)]">
          <CurrentPageComponent />
        </main>

        {/* High-Tech Footer */}
        <footer className="border-t border-cyan-400/10 px-6 py-4 text-center font-mono text-[10px] text-slate-500 bg-[#030712]">
          AURA · GenAI Family & Community Smog Defense Assistant · Low-emission daily routines, indoor air quality hacks & sustainable alternatives for urban winter smog.
        </footer>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Floating Real-time Toast Notifications */}
      <ToastContainer />
    </>
  );
}
