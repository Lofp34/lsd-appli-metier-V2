import * as pdfjsLib from 'pdfjs-dist';

// Configuration du worker PDF.js avec fichier local dans public/
// Ce fichier est servi directement par Vite comme asset statique
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const parsePdfToText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => {
          // Type guard to ensure item is an object with 'str' property
          if (typeof item === 'object' && item !== null && 'str' in item) {
              return (item as { str: string }).str;
          }
          return '';
      }).join(' '); // Join text items with a space for better word separation
      fullText += pageText + '\n'; // Add a newline between pages for readability
    }

    return fullText.trim();
  } catch (error) {
    console.error('Erreur lors de l\'analyse du PDF:', error);
    throw new Error(`Erreur lors de l'analyse du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};