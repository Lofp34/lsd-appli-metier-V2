import React, { useState, Suspense, lazy } from 'react';

// Lazy load PDF processor - only when user wants to upload PDF
const PDFProcessor = lazy(() => import('./PDFProcessor'));
const PDFProcessorSkeleton = lazy(() => import('./PDFProcessorSkeleton'));

interface TranscriptInputProps {
  onFileSelect: (file: File | null) => void;
  onExtract: () => void;
  onManualEntry: () => void;
  isParsingPdf: boolean;
  isExtractingFromTranscript: boolean;
  pdfParseError: string | null;
  transcriptReady: boolean; // True if transcript has been successfully parsed from PDF
}

const TranscriptInput: React.FC<TranscriptInputProps> = ({
  onFileSelect,
  onExtract,
  onManualEntry,
  isParsingPdf,
  isExtractingFromTranscript,
  pdfParseError,
  transcriptReady,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [showPDFProcessor, setShowPDFProcessor] = useState(false);

  const handleShowPDFProcessor = () => {
    setShowPDFProcessor(true);
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName(null);
    }
    onFileSelect(file);
  };

  const handleTextExtracted = (_text: string) => {
    // Text will be handled by parent component
    // We just need to acknowledge the extraction
  };

  const handlePDFError = (error: string) => {
    // Handle PDF processing errors
    console.error('PDF Processing Error:', error);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        1. Charger la Transcription (Fichier PDF) ou Saisie Manuelle
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-600 mb-3">Option A : Upload PDF</h3>
        
        {!showPDFProcessor ? (
          <button
            onClick={handleShowPDFProcessor}
            disabled={isExtractingFromTranscript}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mb-3"
            aria-label="Activer le processeur PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Activer le Processeur PDF
          </button>
        ) : (
          <Suspense fallback={<PDFProcessorSkeleton />}>
            <PDFProcessor
              onFileSelect={handleFileSelect}
              onTextExtracted={handleTextExtracted}
              onError={handlePDFError}
            />
          </Suspense>
        )}

        {selectedFileName && (
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-medium">Fichier sélectionné :</span> {selectedFileName}
          </div>
        )}

        {pdfParseError && (
          <div
            className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm"
            role="alert"
          >
            <p className="font-semibold">Erreur d'analyse PDF</p>
            <p>{pdfParseError}</p>
          </div>
        )}

        {!isParsingPdf && transcriptReady && !pdfParseError && selectedFileName && (
          <div className="mt-3 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm">
            PDF analysé avec succès. Prêt à extraire les données.
          </div>
        )}

        <button
          onClick={onExtract}
          disabled={isParsingPdf || isExtractingFromTranscript || !transcriptReady || !!pdfParseError}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isExtractingFromTranscript ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Extraction IA en cours...
            </>
          ) : (
            'Extraire les Données de la Convention (depuis PDF)'
          )}
        </button>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-600 mb-3">Option B : Saisie Manuelle</h3>
        <p className="text-sm text-gray-500 mb-4">
          Si vous n'avez pas de transcription PDF, vous pouvez saisir manuellement les informations de la convention.
          <br />
          <span className="text-amber-600 font-medium">Note :</span> La génération de proposition commerciale ne sera pas disponible.
        </p>
        
        <button
          onClick={onManualEntry}
          disabled={isParsingPdf || isExtractingFromTranscript}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="Activer la saisie manuelle de la convention"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Saisie Manuelle de la Convention
        </button>
      </div>
    </div>
  );
};

export default TranscriptInput;
