import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import BootScreen from './components/BootScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LiveTicker from './components/LiveTicker';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/ToastContainer';

// 10 Core Application Pages
import CommandCenter from './pages/CommandCenter';
import ThreatMap from './pages/ThreatMap';
import AlertCenter from './pages/AlertCenter';
import EmissionControl from './pages/EmissionControl';
import PublicHealth from './pages/PublicHealth';
import CitizenReports from './pages/CitizenReports';
import AgentSystem from './pages/AgentSystem';
import Forecast from './pages/Forecast';
import DroneMissions from './pages/DroneMissions';
import AuditTrail from './pages/AuditTrail';

const PAGES = {
  command: CommandCenter,
  map: ThreatMap,
  alerts: AlertCenter,
  emissions: EmissionControl,
  health: PublicHealth,
  reports: CitizenReports,
  ai: AgentSystem,
  forecast: Forecast,
  drones: DroneMissions,
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
          AURA · Atmospheric Understanding & Real-time Air Quality Intelligence Suite · Demonstration command center with simulated IoT mesh telemetry for Delhi NCR Air Basin — follow official CPCB / CAQM / IMD bulletins.
        </footer>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Floating Real-time Toast Notifications */}
      <ToastContainer />
    </>
  );
}
