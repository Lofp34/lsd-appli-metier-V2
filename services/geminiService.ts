import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ConventionData } from '../types';
import { COMMERCIAL_PROPOSAL_SYSTEM_INSTRUCTION } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the app and displayed to the user if API_KEY is not set.
  // However, per instructions, we assume API_KEY is pre-configured.
  // This check is more for development robustness.
  console.error("API_KEY for Gemini is not configured in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const modelName = 'gemini-2.5-flash-preview-04-17';

export const extractConventionDataFromTranscript = async (transcript: string): Promise<Partial<ConventionData>> => {
  if (!API_KEY) {
    throw new Error("API_KEY for Gemini is not configured.");
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
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    return JSON.parse(jsonStr) as Partial<ConventionData>;

  } catch (error) {
    console.error("Error calling Gemini API for convention data extraction:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to extract data from transcript: ${error.message}`);
    }
    throw new Error("Failed to extract data from transcript due to an unknown error.");
  }
};

export const generateCommercialProposal = async (transcript: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API_KEY for Gemini is not configured.");
  }
  if (!transcript.trim()) {
    throw new Error("Transcript cannot be empty for proposal generation.");
  }

  const userPrompt = `À partir de la transcription suivante, agis selon ton instruction système pour générer une proposition commerciale.\n\nTranscription:\n---\n${transcript}\n---`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: COMMERCIAL_PROPOSAL_SYSTEM_INSTRUCTION,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for commercial proposal:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate commercial proposal: ${error.message}`);
    }
    throw new Error("Failed to generate commercial proposal due to an unknown error.");
  }
};
