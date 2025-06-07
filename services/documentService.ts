import { jsPDF } from 'jspdf';
import { ConventionData } from '../types';

export const generateConventionDocument = (data: ConventionData, templateString: string): void => {
  let populatedTemplate = templateString;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const placeholder = `<<${key}>>`;
      const value = String(data[key as keyof ConventionData] || '');
      populatedTemplate = populatedTemplate.replace(new RegExp(placeholder, 'g'), value);
    }
  }

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  // Définir les marges et la largeur du texte
  const margin = 15; // mm
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - 2 * margin;
  const lineHeight = 7; // mm, approximativement pour une police de 11-12pt
  let yPosition = margin;

  // Définir la police (jsPDF a des polices de base intégrées)
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(11);

  const lines = populatedTemplate.split('\n');

  lines.forEach(line => {
    // Gérer les lignes vides (sauts de paragraphe)
    if (line.trim() === '') {
      yPosition += lineHeight / 2; // Un plus petit saut pour les lignes vides
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      return;
    }

    // `splitTextToSize` divise le texte pour qu'il s'adapte à la largeur
    const textLines = pdf.splitTextToSize(line, usableWidth);

    textLines.forEach((textLine: string) => {
      if (yPosition + lineHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(textLine, margin, yPosition);
      yPosition += lineHeight;
    });
  });

  const fileName = data.numero_convention
    ? `Convention_${data.numero_convention.replace(/[^a-z0-9]/gi, '_')}.pdf`
    : 'Convention_de_Formation.pdf';
  pdf.save(fileName);
};
