import React, { useCallback, useMemo, useReducer } from 'react';
import { ConventionData } from './types';
import {
  extractConventionDataFromTranscript,
  generateCommercialProposal,
} from './services/geminiService';
import { parsePdfToText } from './services/pdfService';
import { INITIAL_CONVENTION_DATA } from './constants';
import TranscriptInput from './components/TranscriptInput';
import ConventionForm from './components/ConventionForm';
import LoadingSpinner from './components/LoadingSpinner';

// State management with useReducer for better performance
interface AppState {
  transcript: string;
  conventionData: ConventionData;
  isExtractingData: boolean;
  extractionError: string | null;
  isExtracted: boolean;
  isManualEntry: boolean;
  commercialProposal: string | null;
  isGeneratingProposal: boolean;
  proposalError: string | null;
  isParsingPdf: boolean;
  pdfParseError: string | null;
}

type AppAction = 
  | { type: 'SET_TRANSCRIPT'; payload: string }
  | { type: 'SET_CONVENTION_DATA'; payload: ConventionData }
  | { type: 'UPDATE_CONVENTION_FIELD'; payload: { key: keyof ConventionData; value: string } }
  | { type: 'SET_EXTRACTING_DATA'; payload: boolean }
  | { type: 'SET_EXTRACTION_ERROR'; payload: string | null }
  | { type: 'SET_EXTRACTED'; payload: boolean }
  | { type: 'SET_MANUAL_ENTRY'; payload: boolean }
  | { type: 'SET_COMMERCIAL_PROPOSAL'; payload: string | null }
  | { type: 'SET_GENERATING_PROPOSAL'; payload: boolean }
  | { type: 'SET_PROPOSAL_ERROR'; payload: string | null }
  | { type: 'SET_PARSING_PDF'; payload: boolean }
  | { type: 'SET_PDF_PARSE_ERROR'; payload: string | null }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_FOR_MANUAL' };

const initialState: AppState = {
  transcript: '',
  conventionData: INITIAL_CONVENTION_DATA,
  isExtractingData: false,
  extractionError: null,
  isExtracted: false,
  isManualEntry: false,
  commercialProposal: null,
  isGeneratingProposal: false,
  proposalError: null,
  isParsingPdf: false,
  pdfParseError: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };
    case 'SET_CONVENTION_DATA':
      return { ...state, conventionData: action.payload };
    case 'UPDATE_CONVENTION_FIELD':
      return {
        ...state,
        conventionData: { ...state.conventionData, [action.payload.key]: action.payload.value }
      };
    case 'SET_EXTRACTING_DATA':
      return { ...state, isExtractingData: action.payload };
    case 'SET_EXTRACTION_ERROR':
      return { ...state, extractionError: action.payload };
    case 'SET_EXTRACTED':
      return { ...state, isExtracted: action.payload };
    case 'SET_MANUAL_ENTRY':
      return { ...state, isManualEntry: action.payload };
    case 'SET_COMMERCIAL_PROPOSAL':
      return { ...state, commercialProposal: action.payload };
    case 'SET_GENERATING_PROPOSAL':
      return { ...state, isGeneratingProposal: action.payload };
    case 'SET_PROPOSAL_ERROR':
      return { ...state, proposalError: action.payload };
    case 'SET_PARSING_PDF':
      return { ...state, isParsingPdf: action.payload };
    case 'SET_PDF_PARSE_ERROR':
      return { ...state, pdfParseError: action.payload };
    case 'RESET_ALL':
      return {
        ...initialState,
        transcript: '',
        conventionData: INITIAL_CONVENTION_DATA,
      };
    case 'RESET_FOR_MANUAL':
      return {
        ...initialState,
        isManualEntry: true,
        isExtracted: true,
        conventionData: INITIAL_CONVENTION_DATA,
      };
    default:
      return state;
  }
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Memoize expensive financial calculations
  const postProcessFinancials = useCallback((data: Partial<ConventionData>): ConventionData => {
    const fullData = { ...INITIAL_CONVENTION_DATA, ...data };
    const { formation_tarif_ht, montant_tva: _montant_tva, formation_tarif_ttc } = fullData;

    const htNum = parseFloat(formation_tarif_ht);
    const ttcNum = parseFloat(formation_tarif_ttc);

    if (!isNaN(ttcNum) && ttcNum > 0 && (isNaN(htNum) || htNum === 0)) {
      const calculatedHt = ttcNum / 1.2;
      const calculatedTva = ttcNum - calculatedHt;
      fullData.formation_tarif_ht = calculatedHt.toFixed(2);
      fullData.montant_tva = calculatedTva.toFixed(2);
    } else if (!isNaN(htNum) && htNum > 0 && (isNaN(ttcNum) || ttcNum === 0)) {
      const calculatedTva = htNum * 0.2;
      const calculatedTtc = htNum + calculatedTva;
      fullData.montant_tva = calculatedTva.toFixed(2);
      fullData.formation_tarif_ttc = calculatedTtc.toFixed(2);
    }
    return fullData;
  }, []);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      dispatch({ type: 'RESET_ALL' });
      return;
    }

    dispatch({ type: 'SET_PARSING_PDF', payload: true });
    dispatch({ type: 'SET_PDF_PARSE_ERROR', payload: null });
    dispatch({ type: 'RESET_ALL' });

    try {
      const text = await parsePdfToText(file);
      dispatch({ type: 'SET_TRANSCRIPT', payload: text });
    } catch (err) {
      console.error('PDF Parsing Error:', err);
      if (err instanceof Error) {
        dispatch({ type: 'SET_PDF_PARSE_ERROR', payload: err.message || "Erreur lors de l'analyse du PDF." });
      } else {
        dispatch({ type: 'SET_PDF_PARSE_ERROR', payload: "Une erreur inconnue est survenue lors de l'analyse du PDF." });
      }
      dispatch({ type: 'SET_TRANSCRIPT', payload: '' });
    } finally {
      dispatch({ type: 'SET_PARSING_PDF', payload: false });
    }
  }, []);

  const handleExtractData = useCallback(async () => {
    if (!state.transcript.trim()) {
      dispatch({ type: 'SET_EXTRACTION_ERROR', payload: 'Le contenu de la transcription (issu du PDF) est vide.' });
      dispatch({ type: 'SET_EXTRACTED', payload: true });
      dispatch({ type: 'SET_CONVENTION_DATA', payload: INITIAL_CONVENTION_DATA });
      return;
    }
    
    dispatch({ type: 'SET_EXTRACTING_DATA', payload: true });
    dispatch({ type: 'SET_EXTRACTION_ERROR', payload: null });

    try {
      const extracted = await extractConventionDataFromTranscript(state.transcript);
      const processedData = postProcessFinancials(extracted);
      dispatch({ type: 'SET_CONVENTION_DATA', payload: processedData });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({ type: 'SET_EXTRACTION_ERROR', payload: err.message });
      } else {
        dispatch({ type: 'SET_EXTRACTION_ERROR', payload: "Une erreur inconnue est survenue lors de l'extraction des données." });
      }
      dispatch({ type: 'SET_CONVENTION_DATA', payload: INITIAL_CONVENTION_DATA });
    } finally {
      dispatch({ type: 'SET_EXTRACTING_DATA', payload: false });
      dispatch({ type: 'SET_EXTRACTED', payload: true });
    }
  }, [state.transcript, postProcessFinancials]);

  const handleConventionDataChange = useCallback((key: keyof ConventionData, value: string) => {
    // First, update the field
    dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key, value } });
    
    // Then handle financial calculations
    const parse = (val: string): number => parseFloat(val) || 0;
    
    if (key === 'formation_tarif_ttc') {
      const ttc = parse(value);
      if (ttc > 0) {
        const ht = ttc / 1.2;
        const tva = ttc - ht;
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ht', value: ht.toFixed(2) } });
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'montant_tva', value: tva.toFixed(2) } });
      } else {
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ht', value: '' } });
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'montant_tva', value: '' } });
      }
    } else if (key === 'formation_tarif_ht') {
      const ht = parse(value);
      if (ht > 0) {
        const tva = ht * 0.2;
        const ttc = ht + tva;
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'montant_tva', value: tva.toFixed(2) } });
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ttc', value: ttc.toFixed(2) } });
      } else {
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'montant_tva', value: '' } });
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ttc', value: '' } });
      }
    } else if (key === 'montant_tva') {
      const tva = parse(value);
      const ht = parse(state.conventionData.formation_tarif_ht);
      if (ht > 0) {
        const newTtc = ht + tva;
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ttc', value: newTtc.toFixed(2) } });
      } else if (tva > 0) {
        const derivedHt = tva / 0.2;
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ht', value: derivedHt.toFixed(2) } });
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ttc', value: (derivedHt + tva).toFixed(2) } });
      } else {
        if (ht <= 0) dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ht', value: '' } });
        dispatch({ type: 'UPDATE_CONVENTION_FIELD', payload: { key: 'formation_tarif_ttc', value: '' } });
      }
    }
  }, [state.conventionData.formation_tarif_ht]);

  const handleGenerateProposal = useCallback(async () => {
    if (!state.transcript.trim()) {
      dispatch({ type: 'SET_PROPOSAL_ERROR', payload: 'La transcription (issue du PDF) ne peut pas être vide pour générer une proposition.' });
      dispatch({ type: 'SET_COMMERCIAL_PROPOSAL', payload: null });
      return;
    }
    
    dispatch({ type: 'SET_GENERATING_PROPOSAL', payload: true });
    dispatch({ type: 'SET_PROPOSAL_ERROR', payload: null });
    dispatch({ type: 'SET_COMMERCIAL_PROPOSAL', payload: null });

    try {
      const proposalText = await generateCommercialProposal(state.transcript);
      dispatch({ type: 'SET_COMMERCIAL_PROPOSAL', payload: proposalText });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({ type: 'SET_PROPOSAL_ERROR', payload: err.message });
      } else {
        dispatch({ type: 'SET_PROPOSAL_ERROR', payload: 'Une erreur inconnue est survenue lors de la génération de la proposition.' });
      }
    } finally {
      dispatch({ type: 'SET_GENERATING_PROPOSAL', payload: false });
    }
  }, [state.transcript]);

  const handleManualEntry = useCallback(() => {
    dispatch({ type: 'RESET_FOR_MANUAL' });
  }, []);

  // Memoize derived values
  const transcriptReady = useMemo(() => Boolean(state.transcript && !state.isParsingPdf), [state.transcript, state.isParsingPdf]);
  const hasTranscript = useMemo(() => Boolean(state.transcript.trim()), [state.transcript]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl font-bold shadow-lg">
              LSD
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Extracteur de Données de Convention
          </h1>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
            & Générateur de Proposition
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Laurent Serre Développement - Solution professionnelle pour l'extraction automatique de données et la génération de propositions commerciales
          </p>
        </header>

        <main>
          <TranscriptInput
            onFileSelect={handleFileSelect}
            onExtract={handleExtractData}
            onManualEntry={handleManualEntry}
            isParsingPdf={state.isParsingPdf}
            isExtractingFromTranscript={state.isExtractingData}
            pdfParseError={state.pdfParseError}
            transcriptReady={transcriptReady}
          />

          {state.isExtractingData && (
            <div className="mb-8">
              <LoadingSpinner />
              <p className="text-center text-gray-600 mt-2">Extraction des données en cours...</p>
            </div>
          )}

          {state.extractionError && (
            <div
              className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
              role="alert"
            >
              <p className="font-bold">Erreur d'Extraction</p>
              <p>{state.extractionError}</p>
            </div>
          )}

          <ConventionForm
            data={state.conventionData}
            onDataChange={handleConventionDataChange}
            isExtracted={state.isExtracted}
            onGenerateProposal={handleGenerateProposal}
            isGeneratingProposal={state.isGeneratingProposal}
            commercialProposal={state.commercialProposal}
            proposalError={state.proposalError}
            hasTranscript={hasTranscript}
            isManualEntry={state.isManualEntry}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
