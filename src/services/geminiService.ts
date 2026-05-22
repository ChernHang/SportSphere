import { UserPreferences } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
    })
  });
  if (!response.ok) {
    const err = await response.json();
    const errMsg = err?.error?.message || 'Gemini API call failed';
    if (response.status === 429 || errMsg.includes('Quota exceeded')) {
      console.warn('Gemini quota exceeded, returning fallback text.');
      return `[AI Generated Content Unavailable - Quota Exceeded] Please check your API key or try again later.`;
    }
    throw new Error(errMsg);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export const geminiService = {
  async generateSummary(matchData: { teamA: string; teamB: string; tournament: string; score: string; events: string }, variant: string = 'default') {
    const toneMap: Record<string, string> = {
      short: 'Write a very short 2-sentence version.',
      fan: 'Write with passionate fan energy.',
      analyst: 'Write in a calm neutral analyst tone.',
      default: 'Tone: energetic, informative, neutral.',
    };
    const summary = await callGemini(
      'You are a professional sports commentator writing concise match summaries for sports fans worldwide.',
      `Write a short exciting sports match summary for:\n${matchData.teamA} vs ${matchData.teamB}\nTournament: ${matchData.tournament}\nScore: ${matchData.score}\nKey events: ${matchData.events}\nKeep under 120 words.\n${toneMap[variant] || toneMap.default}\nNo emojis. Return plain text only.`
    );
    return { summary };
  },

  async recommendGames(userInterests: UserPreferences, upcomingMatches: any[]) {
    const raw = await callGemini(
      'You are a sports viewing assistant helping users discover exciting live matches.',
      `Favourite sports: ${userInterests.favouriteSports?.join(', ') || 'General'}\nFavourite teams: ${userInterests.favouriteTeams?.join(', ') || 'None'}\nUpcoming matches:\n${upcomingMatches.map(m => `- ${m.teamA} vs ${m.teamB} (${m.tournament}, ${m.startTime})`).join('\n')}\n\nRecommend 5 most exciting matches. Keep each reason under 35 words.\nReturn JSON array only, no markdown:\n[{"match":"string","reason":"string","hypeLevel":1-10}]`
    );
    try {
      const recommendations = JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g, '').trim());
      return { recommendations };
    } catch (e) {
      console.error('Failed to parse recommendGames JSON. Returning empty.', e, raw);
      return { recommendations: [] };
    }
  },

  async findStreaming(userLocation: string, device: string, matchName: string, platforms: string[]) {
    const recommendation = await callGemini(
      'You are a streaming platform advisor for sports fans.',
      `Location: ${userLocation}\nDevice: ${device}\nMatch: ${matchName}\nPlatforms: ${platforms.join(', ')}\n\nRecommend best platform. Under 80 words. Plain text only.`
    );
    return { recommendation };
  },

  async predictExcitement(matchData: any) {
    const raw = await callGemini(
      'You are a sports analyst predicting entertainment value for fans.',
      `Match: ${matchData.teamA} vs ${matchData.teamB}\nTournament: ${matchData.tournament || 'Unknown'}\nStage: ${matchData.league || 'Unknown'}\n\nReturn JSON only, no markdown:\n{"excitementScore":1-10,"competitiveness":"high|medium|low","upsetPotential":"high|medium|low","storyline":"string"}`
    );
    try {
      return JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g, '').trim());
    } catch (e) {
      console.error('Failed to parse predictExcitement JSON. Returning defaults.', e, raw);
      return { excitementScore: 5, competitiveness: 'medium', upsetPotential: 'low', storyline: 'Data unavailable due to API limit.' };
    }
  },

  async generateDigest(userData: any) {
    const digest = await callGemini(
      'You are a sports news editor creating short personalized daily digests.',
      `Favourite sports: ${userData.favouriteSports?.join(', ') || 'General'}\nFavourite teams: ${userData.favouriteTeams?.join(', ') || 'None'}\nRecent results: ${userData.recentResults || 'Not available'}\nUpcoming: ${userData.upcomingMatches || 'Check schedule'}\nHeadlines: ${userData.headlines || 'None'}\n\nKeep under 200 words. Organize into: Top Headlines, Matches To Watch, Team Updates. No emojis. Plain text only.`
    );
    return { digest };
  }
};
