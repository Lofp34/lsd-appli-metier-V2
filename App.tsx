import React, { useState, useCallback } from 'react';
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

const App: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [conventionData, setConventionData] = useState<ConventionData>(INITIAL_CONVENTION_DATA);
  const [isExtractingData, setIsExtractingData] = useState<boolean>(false); // For convention data extraction
  const [extractionError, setExtractionError] = useState<string | null>(null); // For convention data extraction
  const [isExtracted, setIsExtracted] = useState<boolean>(false); // Tracks if extraction has been attempted
  const [isManualEntry, setIsManualEntry] = useState<boolean>(false); // Nouveau state pour la saisie manuelle

  const [commercialProposal, setCommercialProposal] = useState<string | null>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState<boolean>(false);
  const [proposalError, setProposalError] = useState<string | null>(null);

  const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
  const [pdfParseError, setPdfParseError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) {
      setTranscript('');
      setPdfParseError(null);
      setIsExtracted(false); // Reset extraction status if file is cleared
      setConventionData(INITIAL_CONVENTION_DATA); // Reset form data
      setIsManualEntry(false); // Reset manual entry mode
      return;
    }

    setIsParsingPdf(true);
    setPdfParseError(null);
    setTranscript(''); // Clear previous transcript
    setIsExtracted(false);
    setConventionData(INITIAL_CONVENTION_DATA);
    setIsManualEntry(false); // Reset manual entry mode

    try {
      const text = await parsePdfToText(file);
      setTranscript(text);
    } catch (err) {
      console.error('PDF Parsing Error:', err);
      if (err instanceof Error) {
        setPdfParseError(err.message || "Erreur lors de l'analyse du PDF.");
      } else {
        setPdfParseError("Une erreur inconnue est survenue lors de l'analyse du PDF.");
      }
      setTranscript('');
    } finally {
      setIsParsingPdf(false);
    }
  }, []);

  const postProcessFinancials = (data: Partial<ConventionData>): ConventionData => {
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
  };

  const handleExtractData = useCallback(async () => {
    if (!transcript.trim()) {
      setExtractionError('Le contenu de la transcription (issu du PDF) est vide.');
      setIsExtracted(true);
      setConventionData(INITIAL_CONVENTION_DATA);
      return;
    }
    setIsExtractingData(true);
    setExtractionError(null);

    try {
      const extracted = await extractConventionDataFromTranscript(transcript);
      const processedData = postProcessFinancials(extracted);
      setConventionData(processedData);
    } catch (err) {
      if (err instanceof Error) {
        setExtractionError(err.message);
      } else {
        setExtractionError("Une erreur inconnue est survenue lors de l'extraction des données.");
      }
      setConventionData(INITIAL_CONVENTION_DATA);
    } finally {
      setIsExtractingData(false);
      setIsExtracted(true);
    }
  }, [transcript]);

  const handleConventionDataChange = useCallback((key: keyof ConventionData, value: string) => {
    setConventionData(prevData => {
      const newData = { ...prevData, [key]: value };
      const parse = (val: string): number => parseFloat(val) || 0;

      if (key === 'formation_tarif_ttc') {
        const ttc = parse(value);
        if (ttc > 0) {
          const ht = ttc / 1.2;
          const tva = ttc - ht;
          newData.formation_tarif_ht = ht.toFixed(2);
          newData.montant_tva = tva.toFixed(2);
        } else {
          newData.formation_tarif_ht = '';
          newData.montant_tva = '';
        }
      } else if (key === 'formation_tarif_ht') {
        const ht = parse(value);
        if (ht > 0) {
          const tva = ht * 0.2;
          const ttc = ht + tva;
          newData.montant_tva = tva.toFixed(2);
          newData.formation_tarif_ttc = ttc.toFixed(2);
        } else {
          newData.montant_tva = '';
          newData.formation_tarif_ttc = '';
        }
      } else if (key === 'montant_tva') {
        const tva = parse(value);
        const ht = parse(newData.formation_tarif_ht);
        if (ht > 0) {
          const newTtc = ht + tva;
          newData.formation_tarif_ttc = newTtc.toFixed(2);
        } else if (tva > 0) {
          const derivedHt = tva / 0.2;
          newData.formation_tarif_ht = derivedHt.toFixed(2);
          newData.formation_tarif_ttc = (derivedHt + tva).toFixed(2);
        } else {
          if (ht <= 0) newData.formation_tarif_ht = '';
          newData.formation_tarif_ttc = ''; // Should be based on ht if ht is present
        }
      }
      return newData;
    });
  }, []);

  const handleGenerateProposal = useCallback(async () => {
    if (!transcript.trim()) {
      setProposalError(
        'La transcription (issue du PDF) ne peut pas être vide pour générer une proposition.'
      );
      setCommercialProposal(null);
      return;
    }
    setIsGeneratingProposal(true);
    setProposalError(null);
    setCommercialProposal(null);

    try {
      const proposalText = await generateCommercialProposal(transcript);
      setCommercialProposal(proposalText);
    } catch (err) {
      if (err instanceof Error) {
        setProposalError(err.message);
      } else {
        setProposalError(
          'Une erreur inconnue est survenue lors de la génération de la proposition.'
        );
      }
    } finally {
      setIsGeneratingProposal(false);
    }
  }, [transcript]);

  // Nouvelle fonction pour la saisie manuelle
  const handleManualEntry = useCallback(() => {
    // Reset all states
    setTranscript('');
    setPdfParseError(null);
    setExtractionError(null);
    setCommercialProposal(null);
    setProposalError(null);
    setConventionData(INITIAL_CONVENTION_DATA);
    
    // Activate manual entry mode
    setIsManualEntry(true);
    setIsExtracted(true); // Show the form
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700">
          Extracteur de Données de Convention & Générateur de Proposition
        </h1>
        <p className="text-gray-600 mt-2">
          Chargez un PDF de transcription, extrayez les informations clés, préparez votre convention
          et générez une proposition commerciale.
        </p>
      </header>

      <TranscriptInput
        onFileSelect={handleFileSelect}
        onExtract={handleExtractData}
        isParsingPdf={isParsingPdf}
        isExtractingFromTranscript={isExtractingData}
        pdfParseError={pdfParseError}
        transcriptReady={!!transcript.trim() && !isParsingPdf}
        onManualEntry={handleManualEntry}
      />

      {/* This loading spinner is for Gemini API extraction. Parsing has its own indicator. */}
      {isExtractingData && <LoadingSpinner />}

      {extractionError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-md"
          role="alert"
        >
          <p className="font-bold">Erreur d'extraction des données de la convention</p>
          <p>{extractionError}</p>
        </div>
      )}

      {(isExtracted && !isExtractingData) || isManualEntry ? (
        <ConventionForm
          data={conventionData}
          onDataChange={handleConventionDataChange}
          isExtracted={isExtracted || isManualEntry} // keeps the form visible if an extraction was attempted or manual entry
          onGenerateProposal={handleGenerateProposal}
          isGeneratingProposal={isGeneratingProposal}
          commercialProposal={commercialProposal}
          proposalError={proposalError}
          hasTranscript={!!transcript.trim()}
          isManualEntry={isManualEntry}
        />
      ) : null}
    </div>
  );
};

export default App;
