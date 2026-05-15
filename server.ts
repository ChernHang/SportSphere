import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post('/api/gemini/generate-summary', async (req, res) => {
    try {
      const { matchData } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a short exciting sports match summary for:
          ${matchData.teamA} vs ${matchData.teamB}
          Tournament: ${matchData.tournament}
          Score: ${matchData.score}
          Key events: ${matchData.events}
          Keep under 120 words.
          Tone: energetic, informative, neutral.
          Mention standout moments and the match result.
          No emojis.
          Return plain text only.`,
        config: {
          systemInstruction: "You are a professional sports commentator writing concise match summaries for sports fans worldwide.",
        }
      });
      res.json({ summary: response.text });
    } catch (error: any) {
      console.error('Error generating summary:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gemini/recommend-games', async (req, res) => {
    try {
      const { userInterests, upcomingMatches } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `User interests:
          Favourite sports: ${userInterests.favouriteSports.join(', ')}
          Favourite teams: ${userInterests.favouriteTeams.join(', ')}
          Upcoming matches tonight:
          ${upcomingMatches.map((m: any) => `- ${m.teamA} vs ${m.teamB} (${m.league}) ${m.startTime}`).join('\n')}

          Recommend the 5 most exciting matches.
          Explain briefly why each match is worth watching.
          Prioritize rivalry, rankings, playoffs, finals, or star players.
          Keep each recommendation under 35 words.
          Return JSON array of objects with keys: match, reason, hypeLevel (1-10).`,
        config: {
          systemInstruction: "You are a sports viewing assistant helping users discover exciting live matches.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                match: { type: Type.STRING },
                reason: { type: Type.STRING },
                hypeLevel: { type: Type.NUMBER }
              },
              required: ["match", "reason", "hypeLevel"]
            }
          }
        }
      });
      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error('Error recommending games:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gemini/find-streaming', async (req, res) => {
    try {
      const { userLocation, device, matchName, platforms } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `User location: ${userLocation}
          Device: ${device}
          Match: ${matchName}
          Available platforms:
          ${platforms.join('\n')}

          Recommend the best platform to watch this match.
          Consider stream quality, accessibility, device compatibility, and cost efficiency.
          Keep response under 80 words.
          Plain text only.`,
        config: {
          systemInstruction: "You are a streaming platform advisor for sports fans.",
        }
      });
      res.json({ recommendation: response.text });
    } catch (error: any) {
      console.error('Error finding streaming:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gemini/predict-excitement', async (req, res) => {
    try {
      const { matchData } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyse this upcoming match:
          ${matchData.teamA} vs ${matchData.teamB}
          Rankings: ${matchData.rankings}
          Recent form: ${matchData.form}
          Tournament stage: ${matchData.stage}
          Rivalry history: ${matchData.history}

          Predict the outcome and excitement.`,
        config: {
          systemInstruction: "You are a sports analyst predicting entertainment value for fans.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              excitementScore: { type: Type.NUMBER },
              competitiveness: { type: Type.STRING, enum: ["high", "medium", "low"] },
              upsetPotential: { type: Type.STRING, enum: ["high", "medium", "low"] },
              storyline: { type: Type.STRING }
            },
            required: ["excitementScore", "competitiveness", "upsetPotential", "storyline"]
          }
        }
      });
      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error('Error predicting excitement:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gemini/generate-digest', async (req, res) => {
    try {
      const { userData } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a personalized sports digest for this user.

          Favourite sports: ${userData.favouriteSports.join(', ')}
          Favourite teams: ${userData.favouriteTeams.join(', ')}
          Recent results: ${userData.results}
          Upcoming matches: ${userData.upcoming}
          Headlines: ${userData.news}

          Keep under 200 words.
          Friendly sports-news tone.
          Organize into:
          Top Headlines
          Matches To Watch
          Team Updates
          No emojis.
          Plain text only.`,
        config: {
          systemInstruction: "You are a sports news editor creating short personalized daily digests.",
        }
      });
      res.json({ digest: response.text });
    } catch (error: any) {
      console.error('Error generating digest:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
