import { jsPDF } from 'jspdf';
import { ConventionData } from '../types';

// Fonction pour charger une image et la convertir en base64
const loadImageAsBase64 = async (imagePath: string): Promise<string | null> => {
  try {
    console.log('Attempting to load image from:', imagePath);
    const response = await fetch(imagePath);
    console.log('Fetch response status:', response.status);
    
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      return null;
    }
    
    const blob = await response.blob();
    console.log('Blob loaded, size:', blob.size, 'type:', blob.type);
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Image converted to base64 successfully');
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
};

export const generateConventionDocument = async (data: ConventionData, templateString: string): Promise<void> => {
  let populatedTemplate = templateString;

  // Remplacement des variables avec la nouvelle structure
  populatedTemplate = populatedTemplate.replace(/<<numero_convention>>/g, data.numero_convention || '');
  populatedTemplate = populatedTemplate.replace(/<<client_nom>>/g, data.client_nom || '');
  populatedTemplate = populatedTemplate.replace(/<<client_adresse>>/g, data.client_adresse || '');
  populatedTemplate = populatedTemplate.replace(/<<client_representant>>/g, data.client_representant || '');
  populatedTemplate = populatedTemplate.replace(/<<client_fonction>>/g, data.client_fonction || '');
  populatedTemplate = populatedTemplate.replace(/<<formation_intitule>>/g, data.formation_intitule || '');
  populatedTemplate = populatedTemplate.replace(/<<formation_duree>>/g, data.formation_duree || '');
  populatedTemplate = populatedTemplate.replace(/<<formation_dates>>/g, data.formation_dates || '');
  populatedTemplate = populatedTemplate.replace(/<<formation_lieu>>/g, data.formation_lieu || '');
  populatedTemplate = populatedTemplate.replace(/<<participants>>/g, data.participants || '');
  populatedTemplate = populatedTemplate.replace(/<<formation_tarif_ht>>/g, data.formation_tarif_ht?.toString() || '');
  populatedTemplate = populatedTemplate.replace(/<<montant_tva>>/g, data.montant_tva?.toString() || '');
  populatedTemplate = populatedTemplate.replace(/<<formation_tarif_ttc>>/g, data.formation_tarif_ttc?.toString() || '');
  populatedTemplate = populatedTemplate.replace(/<<date_signature>>/g, data.date_signature || '');

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  // Configuration
  const margin = 15;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - 2 * margin;
  const lineHeight = 6;
  let yPosition = margin;

  // Couleurs
  const corporateBlue = '#2F5F83';
  const darkGray = '#333333';

  // Fonction pour ajouter du texte avec style (police réduite de -1)
  const addStyledText = (text: string, x: number, y: number, options: {
    fontSize?: number,
    fontStyle?: string,
    color?: string
  } = {}): number => {
    pdf.setFontSize(options.fontSize || 10); // Réduit de 11 à 10
    pdf.setFont('Helvetica', options.fontStyle || 'normal');
    
    if (options.color) {
      pdf.setTextColor(options.color);
    } else {
      pdf.setTextColor(darkGray);
    }

    const textLines = pdf.splitTextToSize(text, usableWidth);
    let currentY = y;

    textLines.forEach((textLine: string) => {
      if (currentY + lineHeight > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
      pdf.text(textLine, x, currentY);
      currentY += lineHeight;
    });

    return currentY;
  };

  // Charger l'image de signature - essayer plusieurs chemins
  let signatureBase64 = await loadImageAsBase64('./Signature_Laurent.png');
  if (!signatureBase64) {
    signatureBase64 = await loadImageAsBase64('/Signature_Laurent.png');
  }
  if (!signatureBase64) {
    signatureBase64 = await loadImageAsBase64('./public/Signature_Laurent.png');
  }
  if (!signatureBase64) {
    signatureBase64 = await loadImageAsBase64('/public/Signature_Laurent.png');
  }
  console.log('Final signature base64 status:', signatureBase64 ? 'loaded' : 'failed');

  // Fonction pour ajouter une image de signature
  const addSignatureImage = (x: number, y: number, width: number = 30, height: number = 15): number => {
    try {
      if (signatureBase64) {
        console.log('Adding signature image at position:', x, y);
        // Vérifier si on a besoin d'une nouvelle page
        if (y + height > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.addImage(signatureBase64, 'PNG', x, y, width, height);
        return y + height + 5;
      } else {
        console.log('No signature image loaded, using fallback text');
        // Fallback: ajouter un texte plus visible
        pdf.setFontSize(9);
        pdf.setTextColor(darkGray);
        pdf.text('Signature: Laurent SERRE', x, y);
        pdf.setDrawColor(darkGray);
        pdf.setLineWidth(0.3);
        pdf.line(x, y + 3, x + width, y + 3); // Ligne de signature
        return y + 15;
      }
    } catch (error) {
      console.error('Could not add signature image:', error);
      // Fallback en cas d'erreur
      pdf.setFontSize(9);
      pdf.setTextColor(darkGray);
      pdf.text('Signature: Laurent SERRE', x, y);
      return y + 10;
    }
  };

  // Diviser le contenu par les sauts de page
  const sections = populatedTemplate.split('[PAGE_BREAK]');

  sections.forEach((section, sectionIndex) => {
    if (sectionIndex > 0) {
      pdf.addPage();
      yPosition = margin;
    }

    const lines = section.split('\n');

    lines.forEach(line => {
      if (line.trim() === '') {
        yPosition += lineHeight / 2;
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        return;
      }

      // Gestion des styles selon le type de ligne
      if (line.includes('CONVENTION DE FORMATION SLS')) {
        // Titre principal
        yPosition = addStyledText(line, margin, yPosition + lineHeight, {
          fontSize: 13, // Réduit de 14 à 13
          fontStyle: 'bold',
          color: corporateBlue
        });
        yPosition += lineHeight;
      } else if (line.includes('CONDITIONS GENERALES DE VENTE') || line.includes('CONDITIONS PARTICULIÈRES')) {
        // Sous-titre
        yPosition = addStyledText(line, margin, yPosition, {
          fontSize: 11, // Réduit de 12 à 11
          fontStyle: 'bold',
          color: corporateBlue
        });
        yPosition += lineHeight;
      } else if (line.match(/^\d+\./)) {
        // Titre d'article numéroté
        yPosition = addStyledText(line, margin, yPosition + lineHeight, {
          fontSize: 11, // Réduit de 12 à 11
          fontStyle: 'bold',
          color: corporateBlue
        });
        yPosition += lineHeight / 2;
      } else if (line.match(/^\d+\.\d+/)) {
        // Sous-section
        yPosition = addStyledText(line, margin, yPosition + lineHeight / 2, {
          fontSize: 10, // Réduit de 11 à 10
          fontStyle: 'bold'
        });
        yPosition += lineHeight / 2;
      } else if (line.includes('Article ')) {
        // Titre d'article
        yPosition = addStyledText(line, margin, yPosition + lineHeight, {
          fontSize: 11, // Réduit de 12 à 11
          fontStyle: 'bold',
          color: corporateBlue
        });
        yPosition += lineHeight / 2;
      } else if (line.includes('_'.repeat(50))) {
        // Ligne de séparation
        pdf.setDrawColor(corporateBlue);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += lineHeight;
      } else if (line.startsWith('•') || line.startsWith('\t•')) {
        // Élément de liste
        yPosition = addStyledText(line, margin + 5, yPosition, { fontSize: 9 }); // Réduit de 10 à 9
      } else if (line.includes('PROGRAMME DE FORMATION')) {
        // Titre du programme
        yPosition = addStyledText(line, margin, yPosition + lineHeight, {
          fontSize: 13, // Réduit de 14 à 13
          fontStyle: 'bold',
          color: corporateBlue
        });
        yPosition += lineHeight;
      } else if (line.includes('SARL LAURENT SERRE') && line.includes('LE CLIENT')) {
        // Zone de signatures - traitement spécial avec ajout de la signature
        yPosition += lineHeight;
        
        // Signatures côte à côte
        const leftX = margin;
        const rightX = margin + 95;
        
        yPosition = addStyledText('SARL LAURENT SERRE', leftX, yPosition, {
          fontSize: 9, // Réduit de 10 à 9
          fontStyle: 'bold'
        });
        addStyledText('LE CLIENT', rightX, yPosition, {
          fontSize: 9, // Réduit de 10 à 9
          fontStyle: 'bold'
        });
        yPosition += lineHeight * 2;
        
        yPosition = addStyledText('Laurent SERRE', leftX, yPosition, { fontSize: 9 }); // Réduit de 10 à 9
        addStyledText(data.client_representant || '', rightX, yPosition, { fontSize: 9 }); // Réduit de 10 à 9
        yPosition += lineHeight;
        
        // Ajouter la signature de Laurent Serre
        yPosition = addSignatureImage(leftX, yPosition);
        yPosition += lineHeight * 2; // Espace supplémentaire après les signatures
      } else if (line.includes('12. Loi applicable - Contestations – Différends')) {
        // Article 12 - après cela on ajoutera la signature à la fin des CGV
        yPosition = addStyledText(line, margin, yPosition + lineHeight, {
          fontSize: 11,
          fontStyle: 'bold',
          color: corporateBlue
        });
        yPosition += lineHeight / 2;
      } else if (line.includes('À MAUGUIO, le') && line.includes('<<date_signature>>')) {
        // Fin des CGV - ajouter signature après
        yPosition = addStyledText(line, margin, yPosition, { fontSize: 9 });
        yPosition += lineHeight * 3;
        
        // Signatures finales
        const leftX = margin;
        const rightX = margin + 95;
        
        yPosition = addStyledText('SARL LAURENT SERRE', leftX, yPosition, {
          fontSize: 9,
          fontStyle: 'bold'
        });
        addStyledText('LE CLIENT', rightX, yPosition, {
          fontSize: 9,
          fontStyle: 'bold'
        });
        yPosition += lineHeight * 2;
        
        yPosition = addStyledText('Laurent SERRE', leftX, yPosition, { fontSize: 9 });
        addStyledText(data.client_representant || '', rightX, yPosition, { fontSize: 9 });
        yPosition += lineHeight;
        
        // Ajouter la signature de Laurent Serre
        yPosition = addSignatureImage(leftX, yPosition);
        yPosition += lineHeight * 2;
      } else {
        // Texte normal
        yPosition = addStyledText(line, margin, yPosition, { fontSize: 9 }); // Réduit de 10 à 9
      }

      yPosition += 2; // Espacement entre les lignes
    });
  });

  const fileName = data.numero_convention
    ? `Convention_${data.numero_convention.replace(/[^a-z0-9]/gi, '_')}.pdf`
    : 'Convention_de_Formation.pdf';
  pdf.save(fileName);
};
