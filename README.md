# AURA — Urban Air Quality Command & Intelligence System
> **Atmospheric Understanding & Real-time Air Quality Intelligence Suite**  
> *Cyber-Secured Atmospheric Intelligence & Environmental Command Center for Urban Basins*

AURA is an enterprise cyber-tactical environmental operations platform designed to monitor, analyze, and mitigate urban air pollution spikes across metropolitan wards. Inspired by elite defence and naval command structures (such as ORCA), AURA fuses multi-sensor IoT telemetry, satellite aerosol optical depth (AOD), industrial CEMS stack monitoring, and explainable multi-agent artificial intelligence.

---

## 🏛️ System Architecture & 10 Core Modules

The platform mirrors the exact modular architecture and tactical HUD design language:

| # | Module | Route | Operational Capability |
|---|---|---|---|
| **01** | **Air Command Center** | `#/command` | Executive pulse of metropolitan wards, 6 top-tier telemetry KPIs, 24-hour diurnal pollutant progression curves, and infrastructure health. |
| **02** | **Urban AQI Heatmap & Spatial Telemetry** | `#/map` | Interactive dark-mode GIS mesh with color-coded sensor blips, industrial plume circles, heavy freight traffic corridors, and sensitive school/hospital zones. |
| **03** | **Air Quality Alert & Incident Center** | `#/alerts` | Triage hazardous exceedances, calculate severity scores (0–10), and execute automated municipal response playbooks (anti-smog water cannons, school closures, freight diversions). |
| **04** | **Industrial & Vehicular Emission Defense** | `#/emissions` | Zero-trust continuous stack emission (CEMS) monitoring, factory telemetry tamper interception, optical sensor hardware attestation matrix (128-node grid), and statutory penalty issuance. |
| **05** | **Public Health & Citizen Guidance** | `#/health` | Vulnerable population protection (asthma, pediatrics, elderly), dynamic clean air route planning avoiding high-NO2 corridors, and cryptographically authenticated SMS/WhatsApp advisory broadcasts. |
| **06** | **Secure Citizen Air Reports** | `#/reports` | Public incident logging (waste burning, construction dust, chemical odors) chained with SHA-256 cryptographic hashes. Features live **Tamper Simulation** and **Hash-Chain Verification**. |
| **07** | **AURA AI · Multi-Agent System** | `#/ai` | Six specialized autonomous agents (`AerosolNet`, `Sentinel-Air`, `BioValidator`, `MeteoForecaster`, `EmergencyResponder`, `PolicyAuditor`) coordinated by `AURA-CORE`. Includes interactive natural language terminal. |
| **08** | **30-Day Air Quality & Weather Forecast** | `#/forecast` | Predictive WRF-Chem atmospheric dispersion outlook, interactive 30-day calendar matrix, daily thermal boundary inversion briefings, and dual-axis forecast curves. |
| **09** | **Autonomous Drone Mission Control** | `#/drones` | UAV Sentinel-Air-01 live flight operations with vertical PM2.5 stratification profiling, synthetic optical/FLIR infrared camera feed, pause/resume/RTH controls, and encrypted command telemetry. |
| **10** | **Immutable Environmental Audit Trail** | `#/audit` | Tamper-evident ledger recording every human analyst action, AI inference, and sensor alert with timestamps and SHA-256 hashes. Full CSV export supported. |

---

## ⚡ Tech Stack & Design System

- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 4 + Custom Cyber Abyss Color Palette (`#030712`, `#08101e`, `#0c182c`, Neon Cyan `#22d3ee`, Rose `#f43f5e`, Emerald `#34d399`)
- **Typography**: Orbitron (Tactical Headings), JetBrains Mono (Data & Telemetry Readouts), Inter (Body)
- **Mapping**: Leaflet with customized CartoDB dark tactical tiles and SVG radar markers
- **Icons**: Lucide React
- **Security & Integrity**: Simulated SHA-256 hash chaining, Ed25519 signatures, and TPM 2.0 attestation modeling
- **Interaction**: Global Command Palette (`Ctrl+K`), Live Marquee Alert Ticker, Interactive Terminal, Boot Splash sequence with session caching.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/akshithkheeran2008-ctrl/Urban-Air-Quality-Assistant.git
cd Urban-Air-Quality-Assistant

# Install dependencies
npm install
```

### 3. Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

### 4. Production Build
```bash
npm run build
```
The optimized static build is emitted to the `/dist` directory, ready for zero-config deployment on Netlify, Vercel, or GitHub Pages.

---

## 🛡️ License
Licensed under the MIT License.
