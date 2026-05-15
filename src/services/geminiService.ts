import { Match, Recommendation, UserPreferences } from '../types';

export const geminiService = {
  async generateSummary(matchData: { teamA: string; teamB: string; tournament: string; score: string; events: string }) {
    const response = await fetch('/api/gemini/generate-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchData }),
    });
    if (!response.ok) throw new Error('Failed to generate summary');
    return response.json();
  },

  async recommendGames(userInterests: UserPreferences, upcomingMatches: any[]) {
    const response = await fetch('/api/gemini/recommend-games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInterests, upcomingMatches }),
    });
    if (!response.ok) throw new Error('Failed to recommend games');
    return response.json();
  },

  async findStreaming(userLocation: string, device: string, matchName: string, platforms: string[]) {
    const response = await fetch('/api/gemini/find-streaming', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userLocation, device, matchName, platforms }),
    });
    if (!response.ok) throw new Error('Failed to find streaming');
    return response.json();
  },

  async predictExcitement(matchData: any) {
    const response = await fetch('/api/gemini/predict-excitement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchData }),
    });
    if (!response.ok) throw new Error('Failed to predict excitement');
    return response.json();
  },

  async generateDigest(userData: any) {
    const response = await fetch('/api/gemini/generate-digest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData }),
    });
    if (!response.ok) throw new Error('Failed to generate digest');
    return response.json();
  }
};
