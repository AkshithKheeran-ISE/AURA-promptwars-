# AURA — GenAI Urban Air Quality & Smog Defense Assistant

> **Atmospheric Understanding & Real-time Air Quality Intelligence Suite**  
> *A GenAI-powered assistant helping families and communities navigate severe winter smog and urban air pollution with low-emission routines, DIY indoor air quality hacks, and sustainable alternatives tailored to location and lifestyle.*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Vulnerabilities](https://img.shields.io/badge/vulnerabilities-0_zero-brightgreen)](#)
[![Tests](https://img.shields.io/badge/tests-30%2F30_passing-brightgreen)](#)
[![WCAG](https://img.shields.io/badge/WCAG_2.1-AA_Compliant-cyan)](#)
[![Design](https://img.shields.io/badge/UI_Aesthetic-ORCA_Tactical_Command-blue)](#)

---

## 🎯 Problem Statement & Core Solution

> **Problem Statement**:  
> *"Create a GenAI-powered assistant that helps families and communities navigate severe winter smog and urban air pollution. The application should suggest low-emission daily routines, indoor air quality hacks, and sustainable alternatives tailored to their location and lifestyle, while clearly explaining the direct impact of their choices."*

**AURA** solves this through a cyber-tactical command center inspired by **[Orca Tactical Command](https://orcathelegend.netlify.app)**, fusing real-time boundary layer atmospheric physics with practical household smog defense.

---

## 🏛️ The 10 Core Modules

| # | Module | Route | Family & Community Capability |
|---|---|---|---|
| **01** | **Smog Command Center** | `#/command` | High-level executive household pulse: outdoor vs indoor AQI, 6 top-tier family metrics, 24h diurnal inversion progression, and quick toggles. |
| **02** | **Daily Routines** | `#/routines` | Dynamic hourly schedules calibrated to nocturnal thermal inversions (70m–480m) across 4 family archetypes (infants, asthmatics, commuters, societies). |
| **03** | **Indoor IAQ Hacks** | `#/hacks` | Blueprints, CADR metrics, and cost comparisons for the ₹1,450 DIY Corsi-Rosenthal box, window weatherstripping, wet mopping, and exhaust isolation. |
| **04** | **Clean Alternatives** | `#/alternatives` | Quantified swaps: oil radiators vs coal sigdis, Metro+E-Rickshaw vs petrol cars, vermicomposting vs leaf burning, rooftop solar backup. Includes interactive society multiplier. |
| **05** | **Neighborhood Map** | `#/map` | Dark-mode Leaflet GIS mesh mapping 16 Delhi NCR wards, sensor nodes, freight traffic corridors, industrial smoke plumes, and school safe zones. |
| **06** | **Family Smog Alerts** | `#/alerts` | Severe exceedance queue scored 0–10 with verified municipal playbooks (water cannon deployment, freight diversion, school advisory). |
| **07** | **Community Watch** | `#/reports` | Public hazard reporting (biomass burning, genset smoke) chained with SHA-256 cryptographic hashes. Features live **Tamper Simulation** and **Chain Re-verification**. |
| **08** | **GenAI Smog Assistant** | `#/ai` | Six specialized atmospheric agents (`FamilyAdvisor`, `IAQEngineer`, `PediatricShield`, `MeteoForecaster`, `EcoAuditor`, `CommunityWatch`) with interactive terminal. |
| **09** | **30-Day Outlook** | `#/forecast` | WRF-Chem numerical simulation calendar, daily thermal inversion height briefings, and dual-axis AQI vs wind velocity trendlines. |
| **10** | **Impact Ledger** | `#/audit` | Cryptographically attested ledger recording every family action, AI inference, and alert dispatch with SHA-256 hashes and CSV export. |

---

## 📐 Mathematical Impact Quantification

AURA provides transparent, explainable formulas directly in the interface:

1. **Inhaled Particulate Inhalation Dose**:
   $$\text{Inhaled Dose } (\mu\text{g}) = V_{\text{resp}} \times C_{\text{ambient}} \times (1 - \eta_{\text{shield}})$$
   Where $V_{\text{resp}}$ is daily breathing volume (~15 m³), $C_{\text{ambient}}$ is ward $\text{PM}_{2.5}$, and $\eta_{\text{shield}}$ is active DIY hack efficiency (up to 92%).

2. **Community Carbon & Soot Avoidance**:
   $$\Delta \text{CO}_2 \ (\text{kg}) = d \times (EF_{\text{dirty}} - EF_{\text{clean}})$$
   $$\Delta \text{PM}_{2.5} \ (\text{g}) = d \times (EF_{\text{PM, dirty}} - EF_{\text{PM, clean}})$$

3. **Respiratory Relief Index**:
   $$\text{Relief } (\%) = \left(1 - \frac{\text{Indoor } \text{PM}_{2.5}}{\text{Outdoor } \text{PM}_{2.5}}\right) \times 100$$

---

## 🛡️ Security & Zero-Trust Architecture

- **Input Sanitization**: `src/utils/sanitize.js` escapes `<, >, &, ", ', /, \``, strips script/style tags, and neutralizes URI schemes (`javascript:`, `data:`).
- **Cryptographic Chaining**: Every citizen hazard report is hashed with SHA-256 and linked to the previous block's digest, providing proof of tamper detection.
- **Supply Chain**: `npm audit` returns **0 vulnerabilities**. Zero hardcoded credentials or API tokens.
- **Universal Deployment**: Relative asset resolution (`base: './'`), `netlify.toml`, `public/_redirects`, and `vercel.json` ensure zero white-screen errors across GitHub Pages, Netlify, and Vercel.

---

## 🧪 Automated Testing Suite

Tested with Vitest across 6 suites and 30 automated unit tests:

```bash
npm test
```

```
 ✓ tests/cryptographicLedger.test.js (2 tests)
 ✓ tests/sanitize.test.js (15 tests)
 ✓ tests/impactCalculator.test.js (3 tests)
 ✓ tests/routineEngine.test.js (3 tests)
 ✓ tests/iaqHacks.test.js (2 tests)
 ✓ tests/airData.test.js (5 tests)

 Test Files  6 passed (6)
      Tests  30 passed (30)
   Duration  837ms
```

---

## 💻 Local Development & Production Build

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Run test suite
npm test

# 4. Production build
npm run build
```

---

## ⚖️ License
MIT License. Created for the Urban Air Quality & Winter Smog Defense Initiative.
