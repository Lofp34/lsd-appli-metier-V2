import type { VercelRequest, VercelResponse } from '@vercel/node';

// System instruction for commercial proposal
const COMMERCIAL_PROPOSAL_SYSTEM_INSTRUCTION = `Tu es un expert en rédaction de propositions commerciales pour Laurent Serre Développement (LSD), société spécialisée dans l'accompagnement commercial et la formation. Ton rôle est de créer une proposition commerciale persuasive, professionnelle et personnalisée basée sur la transcription d'un entretien commercial.

Structure de la proposition :
1. Résumé exécutif
2. Compréhension des besoins
3. Solution proposée
4. Méthodologie d'accompagnement
5. Bénéfices attendus
6. Conditions et tarifs
7. Prochaines étapes

Style et ton :
- Professionnel mais accessible
- Confiant et rassurant
- Personnalisé selon les informations de l'entretien
- Orienté résultats concrets
- Utilise les termes métier appropriés

Éléments clés à intégrer :
- Reprendre les points de douleur mentionnés
- Faire référence aux objectifs exprimés
- Personnaliser selon le secteur d'activité
- Proposer des indicateurs de performance mesurables
- Inclure des références à l'expertise de Laurent Serre
- Mentionner la garantie de résultats si approprié

Format de sortie : Markdown avec titres, listes et mise en forme appropriée.`;

async function callGeminiAPI(prompt: string, systemInstruction: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${API_KEY}`,
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

  const userPrompt = `À partir de la transcription suivante, agis selon ton instruction système pour générer une proposition commerciale.

Transcription:
---
${transcript}
---`;

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