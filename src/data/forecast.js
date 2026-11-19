/**
 * Diurnal Trends & 30-Day Meteorological Forecast Modeling.
 */

export const HOURLY_TRENDS = [
  { time: '00:00', pm25: 280, pm10: 410, no2: 85, o3: 20 },
  { time: '02:00', pm25: 310, pm10: 440, no2: 90, o3: 18 },
  { time: '04:00', pm25: 345, pm10: 485, no2: 96, o3: 15 },
  { time: '06:00', pm25: 380, pm10: 512, no2: 104, o3: 14 },
  { time: '08:00', pm25: 340, pm10: 470, no2: 98, o3: 25 },
  { time: '10:00', pm25: 290, pm10: 395, no2: 82, o3: 42 },
  { time: '12:00', pm25: 220, pm10: 310, no2: 64, o3: 65 },
  { time: '14:00', pm25: 185, pm10: 260, no2: 52, o3: 78 },
  { time: '16:00', pm25: 205, pm10: 295, no2: 61, o3: 72 },
  { time: '18:00', pm25: 260, pm10: 380, no2: 78, o3: 48 },
  { time: '20:00', pm25: 315, pm10: 430, no2: 89, o3: 32 },
  { time: '22:00', pm25: 335, pm10: 460, no2: 94, o3: 24 }
];

export const AQI_THRESHOLDS = {
  STAGE_IV_EMERGENCY: 350,
  STAGE_III_SEVERE: 280,
  STAGE_II_VERY_POOR: 200,
  PM25_CUTOFF: 250,
  PM10_CUTOFF: 180,
  BRIEFING_CRITICAL: 300,
  BRIEFING_MODERATE: 200
};

const FORECAST_PHASES = [
  {
    maxDay: 3,
    baseAqi: 360,
    wave: 'sin',
    waveAmp: 30,
    risk: 'Critical',
    windSpeed: 3.5,
    temp: 18,
    rainChance: 0,
    inversionHeight: 85
  },
  {
    maxDay: 8,
    baseAqi: 280,
    wave: 'cos',
    waveAmp: 35,
    risk: 'High',
    windSpeed: 6.2,
    temp: 19,
    rainChance: 5,
    inversionHeight: 160
  },
  {
    maxDay: 13,
    baseAqi: 190,
    wave: 'sin',
    waveAmp: 25,
    risk: 'Moderate',
    windSpeed: 9.8,
    temp: 21,
    rainChance: 15,
    inversionHeight: 320
  },
  {
    maxDay: 18,
    baseAqi: 340,
    wave: 'sin',
    waveAmp: 40,
    risk: 'Critical',
    windSpeed: 4.0,
    temp: 17,
    rainChance: 0,
    inversionHeight: 90
  },
  {
    maxDay: 24,
    baseAqi: 240,
    wave: 'cos',
    waveAmp: 30,
    risk: 'High',
    windSpeed: 7.5,
    temp: 20,
    rainChance: 10,
    inversionHeight: 210
  },
  {
    maxDay: Infinity,
    baseAqi: 145,
    wave: 'sin',
    waveAmp: 30,
    risk: 'Moderate',
    windSpeed: 11.2,
    temp: 22,
    rainChance: 40,
    inversionHeight: 420
  }
];

function getForecastPhaseMetrics(index) {
  const phase = FORECAST_PHASES.find((p) => index < p.maxDay) || FORECAST_PHASES[0];
  const waveVal = phase.wave === 'cos' ? Math.cos(index) : Math.sin(index);
  return {
    aqi: phase.baseAqi + Math.floor(waveVal * phase.waveAmp),
    risk: phase.risk,
    windSpeed: phase.windSpeed,
    temp: phase.temp,
    rainChance: phase.rainChance,
    inversionHeight: phase.inversionHeight
  };
}

function getPollutantByAqi(aqi) {
  if (aqi > AQI_THRESHOLDS.PM25_CUTOFF) return 'PM2.5 (Fine Combustion Particles)';
  if (aqi > AQI_THRESHOLDS.PM10_CUTOFF) return 'PM10 (Resuspended Road Dust)';
  return 'O3 (Photochemical Ozone)';
}

function getGrapStage(aqi) {
  if (aqi > AQI_THRESHOLDS.STAGE_IV_EMERGENCY) return 'Stage IV (Severe+ Emergency)';
  if (aqi > AQI_THRESHOLDS.STAGE_III_SEVERE) return 'Stage III (Severe Action)';
  if (aqi > AQI_THRESHOLDS.STAGE_II_VERY_POOR) return 'Stage II (Very Poor)';
  return 'Stage I (Moderate Watch)';
}

function getAqiBriefing(aqi) {
  if (aqi > AQI_THRESHOLDS.BRIEFING_CRITICAL) {
    return 'Severe thermal boundary inversion trapping high-density vehicular and industrial exhaust. Unfavourable dispersion conditions. Anti-smog measures strictly enforced.';
  }
  if (aqi > AQI_THRESHOLDS.BRIEFING_MODERATE) {
    return 'Moderate wind ventilation clearing afternoon surface boundary layer, with evening particulate buildup expected. Vulnerable groups advised to wear N95.';
  }
  return 'Strong convective mixing and elevated wind currents creating favourable dispersion. Ambient air quality within tolerable municipal thresholds.';
}

export const THIRTY_DAY_FORECAST = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1;
  const date = new Date();
  date.setDate(date.getDate() + i);

  const { aqi, risk, windSpeed, temp, rainChance, inversionHeight } = getForecastPhaseMetrics(i);

  return {
    day: dayNum,
    dateStr: date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    fullDate: date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    aqi,
    risk,
    windSpeed,
    temp,
    rainChance,
    inversionHeight,
    peakPollutant: getPollutantByAqi(aqi),
    grapStage: getGrapStage(aqi),
    briefing: getAqiBriefing(aqi)
  };
});
