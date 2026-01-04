
import React from 'react';

export const PRODUCT_NAME = "UCX 5X APFC";
export const PRODUCT_TAGLINE = "High-Performance Active Power Factor Correction";

export const FEATURES = [
  {
    id: 'pfc',
    title: 'Correction Factor',
    value: '0.99',
    unit: 'PF',
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  },
  {
    id: 'thd',
    title: 'Harmonic Distortion',
    value: '< 3%',
    unit: 'THD-i',
    icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  },
  {
    id: 'eff',
    title: 'Peak Efficiency',
    value: '98.7',
    unit: '%',
    icon: <path d="M12 2v20m0-20l-4 4m4-4l4 4" />
  }
];

export const TECHNICAL_SPECS = [
  "Modular Multi-Stage Architecture",
  "Zero Voltage Switching (ZVS) Technology",
  "Real-time Phase Balancing",
  "Adaptive Load Prediction AI",
  "Ultra-Low Thermal Dissipation Chassis",
  "Industrial IoT Cloud Integration"
];

export const EFFICIENCY_DATA = [
  { load: 20, efficiency: 94.2 },
  { load: 40, efficiency: 97.8 },
  { load: 60, efficiency: 98.7 },
  { load: 80, efficiency: 98.2 },
  { load: 100, efficiency: 97.5 },
];
