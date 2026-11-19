/**
 * Continuous Emission Monitoring System (CEMS) Stack Station Data.
 */

export const createCemsStation = (...args) => {
  const [id, name, ward, pollutant, actual, limit, status, tamperRisk, fine, lastReported] = args;
  return { id, name, ward, pollutant, actual, limit, status, tamperRisk, fine, lastReported };
};

export const INDUSTRIAL_CEMS_STATIONS = [
  createCemsStation(
    'CEMS-WZP-01',
    'Apex Galvanizing & Metal Works',
    'Wazirpur Industrial Sector',
    'SO2 & Acid Mist',
    '192 mg/Nm³',
    '50 mg/Nm³',
    'CRITICAL VIOLATION',
    'LOW',
    '₹ 5,00,000',
    '30s ago'
  ),
  createCemsStation(
    'CEMS-OKH-04',
    'Timarpur-Okhla Waste Energy Stack 2',
    'Okhla Phase-III',
    'Particulate Matter (PM)',
    '148 mg/Nm³',
    '30 mg/Nm³',
    'TAMPER DETECTED',
    'HIGH',
    '₹ 15,00,000',
    '2m ago'
  ),
  createCemsStation(
    'CEMS-MYP-09',
    'Capital Heavy Alloy Castings',
    'Mayapuri Sector',
    'NOx & Lead Fumes',
    '410 mg/Nm³',
    '200 mg/Nm³',
    'EXCEEDING',
    'MEDIUM',
    '₹ 2,50,000',
    '4m ago'
  ),
  createCemsStation(
    'CEMS-BAD-03',
    'NTPC Gas Turbine Backup Unit B',
    'Badarpur Border',
    'NOx',
    '85 mg/Nm³',
    '150 mg/Nm³',
    'COMPLIANT',
    'NONE',
    '₹ 0',
    '15s ago'
  ),
  createCemsStation(
    'CEMS-ND-11',
    'Sahibabad Distilleries & Biofuel Unit',
    'East Border Fringe',
    'VOC & Carbon',
    '64 mg/Nm³',
    '100 mg/Nm³',
    'COMPLIANT',
    'NONE',
    '₹ 0',
    '45s ago'
  )
];
