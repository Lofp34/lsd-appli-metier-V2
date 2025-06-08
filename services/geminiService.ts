import { ConventionData } from '../types';

// Check if we're in development or production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? 'http://localhost:5173' : '';

export const extractConventionDataFromTranscript = async (
  transcript: string
): Promise<Partial<ConventionData>> => {
  if (!transcript.trim()) {
    throw new Error('Le contenu de la transcription est vide.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/extract-convention-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const extractedData = await response.json();
    return extractedData as Partial<ConventionData>;
  } catch (error) {
    console.error('Error calling convention data extraction API:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract data from transcript: ${error.message}`);
    }
    throw new Error('Failed to extract data from transcript due to an unknown error.');
  }
};

export const generateCommercialProposal = async (transcript: string): Promise<string> => {
  if (!transcript.trim()) {
    throw new Error('La transcription ne peut pas être vide pour générer une proposition.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-commercial-proposal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.proposal || '';
  } catch (error) {
    console.error('Error calling commercial proposal generation API:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate commercial proposal: ${error.message}`);
    }
    throw new Error('Failed to generate commercial proposal due to an unknown error.');
  }
};
