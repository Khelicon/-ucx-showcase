
export enum PresentationState {
  INITIALIZING = 'INITIALIZING',
  OVERVIEW = 'OVERVIEW',
  SPECIFICATIONS = 'SPECIFICATIONS',
  IOT_ECOSYSTEM = 'IOT_ECOSYSTEM',
  EFFICIENCY = 'EFFICIENCY',
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
