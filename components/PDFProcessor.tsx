import React, { useState, useCallback } from 'react';

interface PDFProcessorProps {
  onFileSelect: (file: File | null) => void;
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

const PDFProcessor: React.FC<PDFProcessorProps> = ({ 
  onFileSelect, 
  onTextExtracted, 
  onError 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPDF = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Dynamic import of PDF.js - only loaded when needed!
      const { parsePdfToText } = await import('../services/pdfService');
      const text = await parsePdfToText(file);
      onTextExtracted(text);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erreur lors de l'analyse du PDF";
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [onTextExtracted, onError]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      onFileSelect(file);
      processPDF(file);
    } else {
      onFileSelect(null);
    }
  }, [onFileSelect, processPDF]);

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isProcessing}
        className="hidden"
        id="pdf-input"
      />
      
      <label
        htmlFor="pdf-input"
        className={`
          w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold 
          py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out 
          flex items-center justify-center cursor-pointer
          ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin mr-2 h-4 w-4 text-gray-600"
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
            Analyse du PDF en cours...
          </>
        ) : (
          <>
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
            Choisir un fichier PDF
          </>
        )}
      </label>
    </div>
  );
};

export default PDFProcessor; 