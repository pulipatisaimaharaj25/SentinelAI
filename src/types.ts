export type Language = 'en' | 'te';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 'New' | 'Under Review' | 'Help Dispatched' | 'Resolved';

export type IncidentType = 
  | 'Road Accident'
  | 'Flood/Water Hazard'
  | 'Road Hazard'
  | 'Missing Person'
  | 'Other Emergency';

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  location: string;
  severity: Severity;
  status: IncidentStatus;
  timestamp: string; // ISO string or human relative time
  createdAt: number;
  photoUrl?: string;
  titleEn: string;
  titleTe: string;
  reassuranceEn: string;
  reassuranceTe: string;
  adviceEn: string[];
  adviceTe: string[];
  estimatedResponseTime?: string;
  reporterContact?: string;
}

export interface MissingPerson {
  id: string;
  name: string;
  age: number | string;
  lastSeenLocation: string;
  contactNumber: string;
  photoUrl?: string;
  additionalDetails?: string;
  reportedAt: string;
  alertEn: string;
  alertTe: string;
  status: 'Searching' | 'Found';
}

export type WeatherRiskLevel = 'Low' | 'Medium' | 'High' | 'Severe';

export interface ActivityLog {
  id: string;
  time: string;
  textEn: string;
  textTe: string;
  severity?: Severity;
  type?: string;
}

export interface InsightCard {
  title: string;
  detail: string;
  suggestion: string;
}

export type ActiveTab = 
  | 'home'
  | 'report'
  | 'missing'
  | 'weather'
  | 'dashboard'
  | 'analytics'
  | 'about';
