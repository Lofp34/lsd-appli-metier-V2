import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// Correctly set the workerSrc.
// The path 'pdfjs-dist/build/pdf.worker.mjs' will be resolved by the browser 
// using the import map to the full esm.sh URL.
// This needs to be set for pdf.js to initialize its worker.
// We ensure it's set at the module level so it's configured before any PDF parsing attempts.
if (typeof pdfjsLib.GlobalWorkerOptions.workerSrc !== 'string' || pdfjsLib.GlobalWorkerOptions.workerSrc === '') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';
}


export const parsePdfToText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Ensure worker is configured before calling getDocument
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    console.warn("PDF.js workerSrc not set, attempting to set it again.");
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';
  }

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
    }).join(' '); // Join text items with a space, not an empty string, for better word separation.
    fullText += pageText + '\n'; // Add a newline between pages for readability
  }

  return fullText.trim();
};