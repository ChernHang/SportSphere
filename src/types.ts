export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  score: string;
  tournament: string;
  events: string[];
  startTime: string;
  league: string;
  genre: 'football' | 'basketball' | 'tennis' | 'f1' | 'esports';
  summary?: string;
  date?: string; // YYYY-MM-DD format
  region?: 'Global' | 'USA' | 'Europe';
  logoA?: string;
  logoB?: string;
  isIndividual?: boolean;
  banner?: string;
  excitement?: {
    score: number;
    competitiveness: 'high' | 'medium' | 'low';
    upsetPotential: 'high' | 'medium' | 'low';
    storyline: string;
  };
}

export interface Recommendation {
  match: string;
  reason: string;
  hypeLevel: number;
}

export interface UserPreferences {
  favouriteSports: string[];
  favouriteTeams: string[];
}
