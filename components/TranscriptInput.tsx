import React, { useRef, useState } from 'react';

interface TranscriptInputProps {
  onFileSelect: (file: File | null) => void;
  onExtract: () => void;
  isParsingPdf: boolean;
  isExtractingFromTranscript: boolean;
  pdfParseError: string | null;
  transcriptReady: boolean; // True if transcript has been successfully parsed from PDF
}

const TranscriptInput: React.FC<TranscriptInputProps> = ({
  onFileSelect,
  onExtract,
  isParsingPdf,
  isExtractingFromTranscript,
  pdfParseError,
  transcriptReady,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onFileSelect(file);
    } else {
      setSelectedFileName(null);
      onFileSelect(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">1. Charger la Transcription (Fichier PDF)</h2>
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        disabled={isParsingPdf || isExtractingFromTranscript}
      />

      <button
        onClick={handleButtonClick}
        disabled={isParsingPdf || isExtractingFromTranscript}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mb-3"
        aria-label="Choisir un fichier PDF"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        {selectedFileName ? `Fichier : ${selectedFileName}` : 'Choisir un fichier PDF'}
      </button>

      {isParsingPdf && (
        <div className="mt-3 text-sm text-indigo-600 flex items-center justify-center">
          <svg className="animate-spin mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyse du PDF en cours...
        </div>
      )}

      {pdfParseError && !isParsingPdf && (
        <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm" role="alert">
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
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Extraction IA en cours...
          </>
        ) : (
          'Extraire les Données de la Convention (depuis PDF)'
        )}
      </button>
    </div>
  );
};

export default TranscriptInput;