
export enum PresentationState {
  INITIALIZING = 'INITIALIZING',
  OVERVIEW = 'OVERVIEW',
  ONSITE_OPERATION = 'ONSITE_OPERATION',
  SPECIFICATIONS = 'SPECIFICATIONS',
  IOT_ECOSYSTEM = 'IOT_ECOSYSTEM',
  EFFICIENCY = 'EFFICIENCY',
  DASHBOARD = 'DASHBOARD',
  AI_ANALYSIS = 'AI_ANALYSIS'
}

export interface ProductFeature {
  title: string;
  description: string;
  value: string;
  unit: string;
}

export interface GeminiInsight {
  topic: string;
  content: string;
  impactScore: number;
}
