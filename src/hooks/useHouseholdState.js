import { useState, useMemo } from 'react';
import { WARDS_DATA } from '../data/airData';
import {
  calculateInhaledExposure,
  calculateCommunitySavings,
  calculateHealthRiskIndex
} from '../services/impactCalculator';

/**
 * Manages ward selection, family archetype, active IAQ hacks, and derived health risk metrics.
 * @param {Function} addToast - Toast dispatcher
 * @param {Function} logAudit - Audit logger
 */
export function useHouseholdState(addToast, logAudit) {
  const [selectedWardId, setSelectedWardId] = useState('wazirpur');
  const [familyArchetype, setFamilyArchetype] = useState('school_infant');
  const [dwellingType, setDwellingType] = useState('apartment_high');
  const [activeHacks, setActiveHacks] = useState([
    'corsi_rosenthal',
    'weatherstrip_seals',
    'wet_mopping_protocol'
  ]);
  const [transitChoice, setTransitChoice] = useState('eRickshawMetro');

  const selectedWard = useMemo(
    () => WARDS_DATA.find((w) => w.id === selectedWardId) || WARDS_DATA[0],
    [selectedWardId]
  );

  const usesHEPA = activeHacks.includes('corsi_rosenthal');
  const weatherstripped = activeHacks.includes('weatherstrip_seals');
  const exposureCalc = useMemo(
    () => calculateInhaledExposure(selectedWard.pm25, 24, usesHEPA, weatherstripped, 'n95'),
    [selectedWard.pm25, usesHEPA, weatherstripped]
  );
  const communitySavings = useMemo(
    () => calculateCommunitySavings(18, 'petrolCar', transitChoice, true, true),
    [transitChoice]
  );
  const healthRisk = useMemo(
    () =>
      calculateHealthRiskIndex(
        exposureCalc.indoorPm25,
        familyArchetype === 'asthma_seniors',
        familyArchetype === 'school_infant'
      ),
    [exposureCalc.indoorPm25, familyArchetype]
  );

  const toggleHack = (hackId) => {
    setActiveHacks((prev) => {
      const exists = prev.includes(hackId);
      const next = exists ? prev.filter((h) => h !== hackId) : [...prev, hackId];
      addToast(
        exists ? 'Hack Deactivated' : 'Hack Activated',
        exists
          ? `Removed ${hackId} from active household defense`
          : `Applied ${hackId} — updated IAQ recalculation`,
        exists ? 'amber' : 'green'
      );
      logAudit(
        'Household Member',
        `${exists ? 'Deactivated' : 'Activated'} IAQ hack: ${hackId}`,
        'Household Defense',
        'human'
      );
      return next;
    });
  };

  return {
    selectedWardId,
    setSelectedWardId,
    selectedWard,
    familyArchetype,
    setFamilyArchetype,
    dwellingType,
    setDwellingType,
    activeHacks,
    toggleHack,
    transitChoice,
    setTransitChoice,
    exposureCalc,
    communitySavings,
    healthRisk
  };
}
