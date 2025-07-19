import type { VercelRequest, VercelResponse } from '@vercel/node';

// Types
interface ConventionData {
  numero_convention: string;
  client_nom: string;
  client_adresse: string;
  client_representant: string;
  client_fonction: string;
  formation_intitule: string;
  formation_duree: string;
  formation_dates: string;
  formation_lieu: string;
  participants: string;
  formation_tarif_ht: string;
  montant_tva: string;
  formation_tarif_ttc: string;
  date_signature: string;
}

// Initialize Gemini API
async function callGeminiAPI(prompt: string) {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY,
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
        generationConfig: {
          responseMimeType: 'application/json'
        }
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content?.parts[0]?.text) {
    console.error('Gemini API response was blocked or empty.', JSON.stringify(data, null, 2));
    throw new Error('La réponse de l\'API Gemini a été bloquée ou est vide.');
  }

  return data.candidates[0].content.parts[0].text;
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

  const prompt = `
À partir de la transcription de la réunion de vente suivante, extrais les informations pour remplir une convention de formation.
Retourne les informations sous forme d'objet JSON. Les clés de l'objet JSON doivent correspondre EXACTEMENT aux noms suivants :
"numero_convention", "client_nom", "client_adresse", "client_representant", "client_fonction",
"formation_intitule", "formation_duree", "formation_dates", "formation_lieu", "participants",
"formation_tarif_ht", "montant_tva", "formation_tarif_ttc", "date_signature".

Instructions spécifiques pour chaque champ :
- numero_convention: Laisse vide si non trouvé. Peut être généré si besoin (ex: SLS-ANNEE-MOIS-JOUR-XXX).
- client_nom: Nom de l'entreprise cliente (ex: Minifel).
- client_adresse: Adresse complète du client. Laisse vide si non explicitement mentionnée.
- client_representant: Nom du contact principal chez le client (celui qui prend la décision, ex: Yann).
- client_fonction: Fonction du représentant client. Laisse vide si non trouvée.
- formation_intitule: Un titre descriptif pour la formation. Peut être "Accompagnement Commercial [NomClient]" ou "Bootcamp Commercial [NomClient]" si non spécifié.
- formation_duree: Durée totale ou par personne. (ex: "Audit individuel 1h/personne + bootcamp").
- formation_dates: Date ou période de début de la formation (ex: "semaine du 16").
- formation_lieu: Lieu de la formation. Si "présentiel pour valoriser l'investissement" est mentionné, indiquer "Présentiel à définir".
- participants: Description des participants (ex: "4 commerciaux et une apprentie"). Inclure les noms si disponibles (ex: Lucie).
- formation_tarif_ht: Montant hors taxes en euros. Si non explicitement trouvé mais que TTC est trouvé, laisse vide pour calcul client.
- montant_tva: Montant de la TVA en euros (basé sur 20% si applicable). Si non explicitement trouvé mais que TTC est trouvé, laisse vide pour calcul client.
- formation_tarif_ttc: Montant toutes taxes comprises en euros. Si un coût total est mentionné (ex: 4950€), utilise-le ici.
- date_signature: Date de signature de la convention. Laisse vide si non trouvée.

Si une information n'est pas explicitement présente dans la transcription, utilise une chaîne vide "" pour la valeur correspondante dans le JSON, SAUF si une instruction de déduction est donnée.
Sois précis et concis.

Transcription:
---
${transcript}
---
Objet JSON attendu:
`;

  try {
    const jsonStr = await callGeminiAPI(prompt);
    
    if (!jsonStr) {
      throw new Error('Réponse vide du service IA');
    }

    // Clean up response if it's wrapped in code blocks
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    const cleanJsonStr = match && match[2] ? match[2].trim() : jsonStr.trim();

    const extractedData = JSON.parse(cleanJsonStr) as Partial<ConventionData>;
    return res.status(200).json(extractedData);
  } catch (error) {
    console.error('Error extracting convention data:', error);
    
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: `Failed to extract data from transcript: ${error.message}` 
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to extract data from transcript due to an unknown error.' 
    });
  }
} 