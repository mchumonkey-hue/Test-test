import { type GroundingMetadata } from "@google/genai";

export interface TripPreferences {
  destination: string;
  vibe: 'relaxed' | 'adventure' | 'foodie' | 'culture' | 'family';
  budget: 'budget' | 'moderate' | 'luxury';
}

export interface GeneratedItinerary {
  id: string;
  preferences: TripPreferences;
  text: string;
  groundingMetadata?: GroundingMetadata;
  createdAt: number;
}

export enum ViewState {
  FORM = 'FORM',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  HISTORY = 'HISTORY'
}
