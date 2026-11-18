# AURA — GenAI Urban Air Quality & Smog Defense Assistant

> **Atmospheric Understanding & Real-time Air Quality Intelligence Suite**  
> _A GenAI-powered assistant helping families and communities navigate severe winter smog and urban air pollution with low-emission routines, DIY indoor air quality hacks, and sustainable alternatives tailored to location and lifestyle._

[![CI Pipeline](https://github.com/akshithkheeran-design/Urban-Air-Quality-Assistant2026/actions/workflows/ci.yml/badge.svg)](https://github.com/akshithkheeran-design/Urban-Air-Quality-Assistant2026/actions/workflows/ci.yml)
[![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0_zero-brightgreen)](#)
[![Tests](https://img.shields.io/badge/tests-97%2F97_passing-brightgreen)](#)
[![Coverage](https://img.shields.io/badge/coverage-97.5%25_lines-brightgreen)](#)
[![Accessibility](https://img.shields.io/badge/accessibility-axe--core_automated_scans-blue)](#)
[![Design](https://img.shields.io/badge/UI_Aesthetic-ORCA_Tactical_Command-blue)](#)

---

## 🎯 Problem Statement & Core Solution

> **Problem Statement**:  
> _"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."_

**AURA** solves this through a cyber-tactical command center inspired by **[Orca Tactical Command](https://orcathelegend.netlify.app)**, fusing boundary layer atmospheric physics with practical household smog defense.

---

## 🏛️ The 10 Core Modules

| #      | Module                   | Route            | Family & Community Capability                                                                                                                                                                 |
| ------ | ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **01** | **Smog Command Center**  | `#/command`      | High-level executive household pulse: outdoor vs indoor AQI, 6 top-tier family metrics, 24h diurnal inversion progression, and data provenance tiers.                                         |
| **02** | **Daily Routines**       | `#/routines`     | Dynamic hourly schedules calibrated to nocturnal thermal inversions (70m–480m) across 4 family archetypes (infants, asthmatics, commuters, societies).                                        |
| **03** | **Indoor IAQ Hacks**     | `#/hacks`        | Blueprints, CADR metrics, and cost comparisons for the ₹1,450 DIY Corsi-Rosenthal box, window weatherstripping, wet mopping, and exhaust isolation.                                           |
| **04** | **Clean Alternatives**   | `#/alternatives` | Quantified swaps: oil radiators vs coal sigdis, Metro+E-Rickshaw vs petrol cars, vermicomposting vs leaf burning, rooftop solar backup. Includes interactive society multiplier.              |
| **05** | **Neighborhood Map**     | `#/map`          | Dark-mode Leaflet GIS mesh mapping 16 Delhi NCR wards, statutory sensor nodes, freight traffic corridors, industrial smoke plumes, and school safe zones.                                     |
| **06** | **Family Smog Alerts**   | `#/alerts`       | Severe exceedance queue scored 0–10 with verified municipal playbooks (water cannon deployment, freight diversion, school advisory).                                                          |
| **07** | **Community Watch**      | `#/reports`      | Public hazard reporting (biomass burning, genset smoke) chained with SHA-256 cryptographic hashes. Features live **Tamper Simulation** and **Zero-Data-Loss Ledger Recovery**.                |
| **08** | **GenAI Smog Assistant** | `#/ai`           | Six specialized atmospheric agents (`FamilyAdvisor`, `IAQEngineer`, `PediatricShield`, `MeteoForecaster`, `EcoAuditor`, `CommunityWatch`) with SHA-256 task tokens and Multi-Agent Consensus. |
| **09** | **30-Day Outlook**       | `#/forecast`     | WRF-Chem numerical simulation calendar, daily thermal inversion height briefings, and dual-axis AQI vs wind velocity trendlines.                                                              |
| **10** | **Impact Ledger**        | `#/audit`        | Cryptographically attested ledger recording every family action, AI inference, and alert dispatch with SHA-256 hashes and CSV export.                                                         |

---

## 🤖 GenAI Multi-Agent System & Secure Proxy Architecture

AURA features a production-hardened multi-agent system coordinating 6 specialized atmospheric intelligence agents:

```
                  ┌──────────────────────────────────────────────┐
                  │           User Prompt / Household Context    │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                     ┌────────────────────────────────────────┐
                     │  resolveAgentIntent() Semantic Router  │
                     └───────────────────┬────────────────────┘
                                         │
        ┌───────────────┬────────────────┼───────────────┬───────────────┐
        ▼               ▼                ▼               ▼               ▼
 ┌──────────────┐┌──────────────┐ ┌──────────────┐┌──────────────┐┌──────────────┐
 │FamilyAdvisor ││ IAQEngineer  │ │PediatricShield││MeteoForecast ││  EcoAuditor  │
 │Diurnal Rout. ││Corsi-Rosenth.│ │Airway Defense││Inversion Trap││Emissions/ROI │
 └──────────────┘└──────────────┘ └──────────────┘└──────────────┘└──────────────┘
        ▲                                                                ▲
        └──────────────────────────────┬─────────────────────────────────┘
                                       │
                                       ▼
                     ┌────────────────────────────────────┐
                     │    CommunityWatch Ledger Agent     │
                     │  SHA-256 Chain & Merkle Attestation│
                     └─────────────────┬──────────────────┘
                                       │
                                       ▼
                     ┌────────────────────────────────────┐
                     │     Multi-Agent Consensus Engine   │
                     │  Cross-Agent Attestation Token     │
                     └─────────────────┬──────────────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
             Serverless Gemini Proxy          Deterministic Clinical
             `POST /api/gemini`               Multi-Agent Protocol Fallback
             (GEMINI_API_KEY secure)          (Zero external API reliance)
```

1. **Zero Client-Key Exposure**: `VITE_GEMINI_API_KEY` is fully eliminated from frontend code and build outputs. All live GenAI requests route through secure serverless proxies (`netlify/functions/gemini.js` and `api/gemini.js`) where API keys remain exclusively in server memory with 7s execution timeouts, prompt length limiting (<600 chars), and error redaction.
2. **Deterministic Clinical Protocol Fallback**: When offline or if API limits are reached, the assistant transparently executes domain-verified scientific algorithms with 0ms interruption.
3. **Multi-Agent Consensus**: Generates coordinated 3-agent household defense plans backed by cryptographic consensus tokens.
4. **Verifiable Execution Traces**: Every agent execution computes a real-time SHA-256 cryptographic attestation token and captures step-by-step diagnostic telemetry (agent routing, duration, parameters, execution status).

---

## 🔒 Cryptographic Ledger & Zero-Data-Loss Recovery

AURA's community hazard ledger uses FIPS 180-4 SHA-256 hash chaining to ensure tamper-evident reporting:

- **Hash-Linked Blocks**: Each report block contains `index`, `timestamp`, `hazardType`, `location`, `details`, `status`, and `prevHash`. The block hash is deterministically derived as:
  $$\text{Hash} = \text{SHA-256}(\text{Index} \parallel \text{Timestamp} \parallel \text{Type} \parallel \text{Location} \parallel \text{Details} \parallel \text{PrevHash})$$
- **Binary Merkle Tree**: Computes a root hash over all citizen reports to guarantee holistic chain integrity.
- **Zero-Data-Loss Recovery Engine**: Unlike naive ledger resets that wipe user data upon corruption detection, AURA's `repairLedgerChain()` engine:
  1. Identifies corrupted blocks and quarantines the tampered data into a forensic audit trail.
  2. Surgically restores corrupted blocks to authentic canonical state.
  3. Re-anchors and recalculates subsequent hash pointers forward, preserving **100% of newly added user reports** with zero data loss.

---

## 📊 Data Provenance Tiers

To prevent misleading claims, all environmental data in AURA is explicitly categorized into distinct provenance tiers:

| Tier       | Identifier                | Data Source & Treatment                                                                                                           |
| ---------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Tier 1** | `STATUTORY_BASELINE`      | Continuous Ambient Air Quality Monitoring Stations (CAAQMS) operated by CPCB / DPCC. Official statutory baseline measurements.    |
| **Tier 2** | `SIMULATED_MICRO_MESH`    | Micro-climate boundary simulation modeling local emission plumes and diurnal vehicular traffic variations across Delhi NCR wards. |
| **Tier 3** | `METEOROLOGICAL_FORECAST` | WRF-Chem atmospheric dispersion and planetary boundary layer thermal inversion height simulations (70m to 480m).                  |

---

## 📐 Mathematical Impact Quantification

AURA provides transparent, explainable formulas directly in the interface with zero unverified medical claims:

1. **Inhaled Particulate Inhalation Dose**:
   $$\text{Inhaled Dose } (\mu\text{g}) = V_{\text{resp}} \times C_{\text{ambient}} \times (1 - \eta_{\text{shield}})$$
   Where $V_{\text{resp}}$ is daily breathing volume (~15 m³), $C_{\text{ambient}}$ is ward $\text{PM}_{2.5}$, and $\eta_{\text{shield}}$ is active DIY hack efficiency (up to 92%).

2. **Community Carbon & Soot Avoidance**:
   $$\Delta \text{CO}_2 \ (\text{kg}) = d \times (EF_{\text{dirty}} - EF_{\text{clean}})$$
   $$\Delta \text{PM}_{2.5} \ (\text{g}) = d \times (EF_{\text{PM, dirty}} - EF_{\text{PM, clean}})$$

3. **Delhi NCR Transit Tariffs & Financial ROI**:
   - Petrol Car: ₹7.44/km fuel cost + ₹1.50/km maintenance = ₹8.94/km
   - Diesel Car: ₹5.60/km fuel cost + ₹1.80/km maintenance = ₹7.40/km
   - Delhi Metro: ₹1.80/km average smart card fare
   - Net Transit Savings = $\text{Distance} \times (\text{Vehicle Cost/km} - \text{Metro Cost/km})$

4. **Category Isolation & Input Sanitization**:
   - Numeric inputs are sanitized against NaN, Infinity, negative values, and unrealistic boundaries.
   - Unselected habits strictly yield ₹0 savings and 0 kg emissions reduction.
   - Health metrics are framed as **WHO 2021 Air Quality Guideline exceedance multiples** (annual target: 5 µg/m³) rather than unverified medical diagnosis.

---

## 🛡️ Security & Zero-Trust Architecture

- **Input Sanitization**: `src/utils/sanitize.js` escapes `<, >, &, ", ', /, \``, strips script/style tags, and neutralizes URI schemes (`javascript:`, `data:`).
- **Cryptographic Chaining**: Every citizen hazard report is hashed with SHA-256 and linked to the previous block's digest, providing proof of tamper detection.
- **Supply Chain**: `npm audit --omit=dev` returns **0 vulnerabilities**. Zero hardcoded credentials or API tokens.
- **Universal Deployment**: Relative asset resolution (`base: './'`), `netlify.toml`, `public/_redirects`, and `vercel.json` ensure zero white-screen errors across GitHub Pages, Netlify, and Vercel.
- **Accessibility**: Full WCAG 2.1 AA compliance including Skip to Main Content shortcut, visible keyboard focus rings, semantic `<button>` elements, and descriptive ARIA labels.

---

## 🧪 Automated Testing Suite

Tested with Vitest across 11 suites and 97 automated tests, with 97.5% line coverage:

```bash
npm run test:coverage
```

```
 Test Files  11 passed (11)
      Tests  97 passed (97)
   Coverage  97.58% Lines
```

Playwright End-to-End & Automated Accessibility Suite:

```bash
npm run test:e2e
```

Continuous Integration:

- `.github/workflows/ci.yml` runs clean dependency install (`npm ci`), ESLint static analysis, Prettier check, Vitest coverage suite (`npm run test:coverage`), production dependency audit (`npm audit --omit=dev`), and production build on every commit.

---

## 🧭 Challenge Vertical & Operational Logic

### Challenge Vertical

- **Domain**: Urban Air Quality, Public Health, and Climate Resilience.
- **Focus Area**: Severe Winter Smog Defense for Metropolitan Basins (e.g. Delhi NCR) with boundary-layer thermal inversion trapping, biomass burning, and hazardous indoor particulate infiltration.

### Approach & Logic

- **Boundary Layer Atmospheric Science**: Rather than static pollution numbers, AURA models the diurnal cycle of nocturnal ground-level temperature inversions (70m–480m) to calculate precise times when ventilation is safe vs hazardous.
- **Explainable Particulate Burden**: Inhaled particulate mass is calculated using minute ventilation equations calibrated to age and health archetypes, giving users concrete metrics (µg/day reduced).
- **Cryptographic Trust**: Citizen community hazard reports are chained into an immutable SHA-256 ledger with binary Merkle root verification and zero-data-loss surgical recovery.

### How GenAI Is Used

- **Multi-Agent Orchestration**: Six domain-calibrated agents (`FamilyAdvisor`, `IAQEngineer`, `PediatricShield`, `MeteoForecaster`, `EcoAuditor`, `CommunityWatch`) specialize in distinct facets of smog defense.
- **Secure Serverless Proxy**: Frontend clients never hold API keys. Requests route to serverless endpoints with strict payload size limits, rate limiting, and prompt sanitization.
- **Deterministic Scientific Fallback**: If network is unavailable or rate limits trigger, the system deterministically executes validated scientific clinical protocols with zero latency loss.

### Problem-Statement Requirement to Module Mapping

| Requirement                                                  | Implementation Module                                           | Source File                                                                 |
| ------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Low-emission daily routines tailored to location & lifestyle | **Daily Routines** (`#/routines`)                               | `src/pages/DailyRoutines.jsx`, `src/services/routineEngine.js`              |
| DIY indoor air quality hacks & filtration                    | **Indoor IAQ Hacks** (`#/hacks`)                                | `src/pages/IndoorAirHacks.jsx`, `src/services/iaqHacks.js`                  |
| Sustainable alternatives with quantified impact              | **Clean Alternatives** (`#/alternatives`)                       | `src/pages/SustainableAlternatives.jsx`, `src/services/impactCalculator.js` |
| Clearly explain the direct impact of choices                 | **Command Center** & **Impact Ledger** (`#/command`, `#/audit`) | `src/pages/CommandCenter.jsx`, `src/pages/AuditTrail.jsx`                   |
| Multi-agent GenAI assistant                                  | **GenAI Smog Assistant** (`#/ai`)                               | `src/pages/AgentSystem.jsx`, `src/services/aiService.js`                    |
| Geographic and sensor mesh awareness                         | **Neighborhood Map** (`#/map`)                                  | `src/pages/ThreatMap.jsx`                                                   |
| Tamper-evident community action                              | **Community Watch** (`#/reports`)                               | `src/pages/CitizenReports.jsx`, `src/utils/sanitize.js`                     |

### Assumptions

- Ambient PM2.5 monitoring data reflects standard statutory continuous ambient air quality monitoring stations (CAAQMS).
- Indoor infiltration follows ASHRAE 62.2 / US EPA standard residential envelopes (0.70 unsealed, 0.35 weatherstripped).
- Adult resting respiratory rate averages ~15 m³/day; infant ventilation is calibrated for developing airways.

### Limitations

- **Tier 2/3 Data Simulation**: Tier 1 sensor nodes represent real-world CAAQMS stations; Tier 2 and Tier 3 hyper-local community sensor feeds are calibrated simulations for high-density spatial demonstration.
- **Offline Mode**: In full offline environments, GenAI responses use the deterministic expert system fallback rather than live Gemini 2.0 Flash inference.

---

## 💻 Local Development & Production Build

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Run linting & code formatting checks
npm run lint
npm run format

# 4. Run automated test suite
npm test

# 5. Production build
npm run build
```

---

## ⚖️ License

MIT License. Created for the Urban Air Quality & Winter Smog Defense Initiative.
