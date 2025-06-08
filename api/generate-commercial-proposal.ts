import type { VercelRequest, VercelResponse } from '@vercel/node';

// Optimized system instruction - shorter and more focused
const COMMERCIAL_PROPOSAL_SYSTEM_INSTRUCTION = `Tu es un expert en propositions commerciales pour Laurent Serre Développement. Génère une proposition concise et professionnelle (maximum 800 mots) avec cette structure :

1. **Résumé exécutif** (2-3 lignes)
2. **Besoins identifiés** (3-4 points)
3. **Solution proposée** (méthodologie en 4-5 points)
4. **Bénéfices attendus** (3-4 résultats mesurables)
5. **Prochaines étapes** (2-3 actions)

Style : professionnel, personnalisé, orienté résultats. Format Markdown.`;

async function callGeminiAPI(prompt: string, systemInstruction: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  // Use faster model and optimized config
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            {
              text: systemInstruction
            }
          ]
        },
        generationConfig: {
          maxOutputTokens: 1000,  // Limit output length
          temperature: 0.7,       // Balanced creativity
          topP: 0.9              // Optimize for speed
        }
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string') {
    return res.status(400).json({ error: 'Transcript is required and must be a string' });
  }

  if (!transcript.trim()) {
    return res.status(400).json({ error: 'Transcript cannot be empty for proposal generation.' });
  }

  // Simplified and shorter prompt
  const userPrompt = `Génère une proposition commerciale concise pour Laurent Serre Développement basée sur cette transcription d'entretien :

${transcript}

Concentre-toi sur les points de douleur identifiés et propose une solution d'accompagnement commercial adaptée.`;

  try {
    const proposalText = await callGeminiAPI(userPrompt, COMMERCIAL_PROPOSAL_SYSTEM_INSTRUCTION);
    
    if (!proposalText) {
      throw new Error('Réponse vide du service IA');
    }

    return res.status(200).json({ proposal: proposalText });
  } catch (error) {
    console.error('Error generating commercial proposal:', error);
    
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: `Failed to generate commercial proposal: ${error.message}` 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate commercial proposal due to an unknown error.' 
    });
  }
} 