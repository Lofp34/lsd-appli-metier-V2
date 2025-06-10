import { jsPDF } from 'jspdf';
import { ConventionData } from '../types';

// Palette couleur professionnelle selon recommandations graphiste
const CORPORATE_BLUE = '#2F5F83'; // Bleu corporate pour titres et filets
const TEXT_DARK = '#333333'; // Gris foncé pour texte principal
const TEXT_LIGHT = '#FFFFFF'; // Blanc pour texte sur fond foncé
const BACKGROUND_LIGHT = '#F5F8FA'; // Gris clair pour fonds zones totaux
const BORDER_COLOR = '#E1E5E9'; // Bordures fines et discrètes

const formatCurrency = (value: string | number | undefined): string => {
  const num = parseFloat(String(value || '0'));
  const fixedNumStr = num.toFixed(2);
  const parts = fixedNumStr.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${integerPart},${decimalPart} €`;
};

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const generateInvoiceDocument = (data: ConventionData): void => {
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20; // Marges externes 20mm pour look premium
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper pour ajouter du texte avec gestion automatique de ligne
  const addText = (
    text: string,
    x: number,
    y: number,
    options?: {
      fontSize?: number;
      fontStyle?: string;
      color?: string;
      align?: 'left' | 'center' | 'right';
      maxWidth?: number;
    }
  ) => {
    const {
      fontSize = 10,
      fontStyle = 'normal',
      color = TEXT_DARK,
      align = 'left',
      maxWidth,
    } = options || {};
    
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color);
    
    if (maxWidth) {
      const splitText = pdf.splitTextToSize(text, maxWidth);
      pdf.text(splitText, x, y, { align });
      return y + splitText.length * fontSize * 0.35;
    } else {
      pdf.text(text, x, y, { align });
      return y + fontSize * 0.35;
    }
  };

  // --- EN-TÊTE : GRILLE 3 COLONNES FIXES ---
  const col1Width = contentWidth * 0.35; // Émetteur
  const col2Width = contentWidth * 0.35; // Destinataire  

  const col1X = margin;
  const col2X = margin + col1Width;
  const col3X = margin + col1Width + col2Width;

  // --- LOGO ET RAISON SOCIALE (Colonne 1) ---
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(CORPORATE_BLUE);
  pdf.setCharSpace(1); // Letter-spacing pour élégance
  addText('LAURENT SERRE DÉVELOPPEMENT', col1X, yPos, {
    fontSize: 16,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });
  
  yPos += 8;
  
  // Filet élégant sous le titre
  pdf.setDrawColor(CORPORATE_BLUE);
  pdf.setLineWidth(0.5);
  pdf.line(col1X, yPos, col1X + col1Width - 5, yPos);
  
  yPos += 8;

  // Informations émetteur avec hiérarchie typographique
  let yPosCol1 = yPos;
  pdf.setCharSpace(0);
  addText('SARL LAURENT SERRE', col1X, yPosCol1, {
    fontSize: 10,
    fontStyle: 'bold',
    color: TEXT_DARK
  });
  yPosCol1 += 5;
  
  addText('259 rue de la Lavande', col1X, yPosCol1, {
    fontSize: 9,
    color: TEXT_DARK
  });
  yPosCol1 += 4;
  
  addText('34130 Mauguio', col1X, yPosCol1, {
    fontSize: 9,
    color: TEXT_DARK
  });
  yPosCol1 += 6;
  
  // Coordonnées en couleur corporate
  addText('Tel: 06 14 94 40 60', col1X, yPosCol1, {
    fontSize: 9,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });
  yPosCol1 += 4;
  
  addText('Email: ls@laurentserre.com', col1X, yPosCol1, {
    fontSize: 9,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });

  // --- INFORMATIONS CLIENT (Colonne 2) ---
  let yPosCol2 = yPos;
  addText('FACTURÉ À :', col2X, yPosCol2, {
    fontSize: 10,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });
  yPosCol2 += 6;

  const clientName = data.client_nom || 'Entreprise cliente';
  addText(clientName.toUpperCase(), col2X, yPosCol2, {
    fontSize: 11,
    fontStyle: 'bold',
    color: TEXT_DARK,
    maxWidth: col2Width - 5
  });
  yPosCol2 += 6;

  // Adresse client avec gestion intelligente
  const clientAddress = data.client_adresse || 'Adresse non spécifiée';
  const addressLines = clientAddress.split(/[,\n]/).map(line => line.trim()).filter(line => line.length > 0);
  
  addressLines.forEach(line => {
    addText(line, col2X, yPosCol2, {
      fontSize: 9,
      color: TEXT_DARK,
      maxWidth: col2Width - 5
    });
    yPosCol2 += 4;
  });

  // Contact client si disponible
  if (data.client_representant && data.client_representant.trim()) {
    yPosCol2 += 2;
    addText(`Att: ${data.client_representant}`, col2X, yPosCol2, {
      fontSize: 9,
      fontStyle: 'italic',
      color: TEXT_DARK
    });
    if (data.client_fonction && data.client_fonction.trim()) {
      yPosCol2 += 3;
      addText(data.client_fonction, col2X, yPosCol2, {
        fontSize: 8,
        fontStyle: 'italic',
        color: TEXT_DARK
      });
    }
  }

  // --- MÉTADONNÉES FACTURE (Colonne 3) ---
  let yPosCol3 = yPos;
  const invoiceDate = new Date();
  const echeanceDate = new Date(invoiceDate);
  echeanceDate.setDate(invoiceDate.getDate() + 2); // Échéance J+2 pour paiement avant formation

  let invoiceNumber = `F-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}${String(invoiceDate.getDate()).padStart(2, '0')}-001`;
  if (data.numero_convention) {
    invoiceNumber = `F-${data.numero_convention}`;
  }

  // Métadonnées avec hiérarchie claire
  addText('Date :', col3X, yPosCol3, {
    fontSize: 9,
    fontStyle: 'bold',
    color: TEXT_DARK
  });
  addText(formatDate(invoiceDate), col3X + 15, yPosCol3, {
    fontSize: 9,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });
  yPosCol3 += 5;

  addText('N° Facture :', col3X, yPosCol3, {
    fontSize: 9,
    fontStyle: 'bold',
    color: TEXT_DARK
  });
  addText(invoiceNumber, col3X + 20, yPosCol3, {
    fontSize: 9,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });
  yPosCol3 += 5;

  addText('Échéance :', col3X, yPosCol3, {
    fontSize: 9,
    fontStyle: 'bold',
    color: TEXT_DARK
  });
  addText(formatDate(echeanceDate), col3X + 20, yPosCol3, {
    fontSize: 9,
    fontStyle: 'bold',
    color: CORPORATE_BLUE
  });

  // Ajustement position Y selon la colonne la plus haute
  yPos = Math.max(yPosCol1, yPosCol2, yPosCol3) + 15;

  // --- TITRE FACTURE AVEC FOND COLORÉ ---
  const titleHeight = 12;
  pdf.setFillColor(CORPORATE_BLUE);
  pdf.rect(margin, yPos, contentWidth, titleHeight, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(TEXT_LIGHT);
  pdf.text('FACTURE', margin + contentWidth/2, yPos + titleHeight/2 + 3, { align: 'center' });
  
  yPos += titleHeight + 15;

  // --- TABLEAU AVEC NOUVELLES PROPORTIONS ---
  const colWidths = [
    contentWidth * 0.60, // Description 60%
    contentWidth * 0.10, // Quantité 10%
    contentWidth * 0.12, // Prix unitaire 12%
    contentWidth * 0.08, // TVA % 8%
    contentWidth * 0.10, // Total HT 10%
  ];
  
  const headerHeight = 10;

  // En-tête tableau avec fond gris clair
  pdf.setFillColor(BACKGROUND_LIGHT);
  pdf.rect(margin, yPos, contentWidth, headerHeight, 'F');
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(TEXT_DARK);

  let currentX = margin;
  pdf.text('DESCRIPTION', currentX + 3, yPos + headerHeight/2 + 2);
  
  currentX += colWidths[0];
  pdf.text('QTÉ', currentX + colWidths[1]/2, yPos + headerHeight/2 + 2, { align: 'center' });
  
  currentX += colWidths[1];
  pdf.text('PU HT', currentX + colWidths[2]/2, yPos + headerHeight/2 + 2, { align: 'center' });
  
  currentX += colWidths[2];
  pdf.text('TVA %', currentX + colWidths[3]/2, yPos + headerHeight/2 + 2, { align: 'center' });
  
  currentX += colWidths[3];
  pdf.text('TOTAL HT', currentX + colWidths[4]/2, yPos + headerHeight/2 + 2, { align: 'center' });

  yPos += headerHeight;

  // Ligne de données avec format amélioré
  const rowStartY = yPos;
  const rowPadding = 3;
  let descY = yPos + rowPadding;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(TEXT_DARK);

  // Titre principal de la formation
  const mainItemDesc = data.formation_intitule || 'Formation commerciale-technique de vente';
  descY = addText(mainItemDesc, margin + rowPadding, descY, {
    fontSize: 10,
    fontStyle: 'bold',
    color: TEXT_DARK,
    maxWidth: colWidths[0] - rowPadding * 2,
  }) + 2;

  // Détails avec puces discrètes
  pdf.setFont('helvetica', 'normal');
  const details = [
    `• Client : ${data.client_nom || 'N/A'}`,
    `• Bénéficiaire(s) : ${data.participants || 'N/A'}`,
    `• Convention n° ${data.numero_convention || 'N/A'} du ${data.date_signature || 'N/A'}`,
    `• Dates de formation : ${data.formation_dates || 'N/A'}`,
    `• Durée : ${data.formation_duree || 'N/A'}`
  ];

  details.forEach(detail => {
    descY = addText(detail, margin + rowPadding + 2, descY, {
      fontSize: 8,
      color: TEXT_DARK,
      maxWidth: colWidths[0] - rowPadding * 2,
    }) + 1;
  });

  // Données numériques alignées
  const rowContentY = rowStartY + rowPadding + 2;
  currentX = margin + colWidths[0];
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text('1', currentX + colWidths[1]/2, rowContentY, { align: 'center' });
  
  currentX += colWidths[1];
  pdf.text(formatCurrency(data.formation_tarif_ht), currentX + colWidths[2] - rowPadding, rowContentY, { align: 'right' });
  
  currentX += colWidths[2];
  pdf.text('20%', currentX + colWidths[3]/2, rowContentY, { align: 'center' });
  
  currentX += colWidths[3];
  pdf.text(formatCurrency(data.formation_tarif_ht), currentX + colWidths[4] - rowPadding, rowContentY, { align: 'right' });

  const rowHeight = Math.max(30, descY - rowStartY + 5);
  yPos = rowStartY + rowHeight;

  // Bordures tableau discrètes
  pdf.setDrawColor(BORDER_COLOR);
  pdf.setLineWidth(0.3);
  pdf.line(margin, rowStartY, pageWidth - margin, rowStartY); // Top
  pdf.line(margin, yPos, pageWidth - margin, yPos); // Bottom

  yPos += 10;

  // --- ZONE TOTAUX AVEC FOND GRIS CLAIR ---
  const totalsStartY = yPos;
  const totalsWidth = 80;
  const totalsX = pageWidth - margin - totalsWidth;
  const totalsHeight = 25;

  pdf.setFillColor(BACKGROUND_LIGHT);
  pdf.rect(totalsX, yPos, totalsWidth, totalsHeight, 'F');

  // Bordure fine
  pdf.setDrawColor(BORDER_COLOR);
  pdf.setLineWidth(0.5);
  pdf.rect(totalsX, yPos, totalsWidth, totalsHeight, 'S');

  const addTotalLine = (label: string, value: string, isBold: boolean = false, extraSize: number = 0) => {
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    pdf.setFontSize(9 + extraSize);
    pdf.setTextColor(TEXT_DARK);
    
    pdf.text(label, totalsX + 3, yPos + 5);
    pdf.text(value, totalsX + totalsWidth - 3, yPos + 5, { align: 'right' });
    yPos += 6;
  };

  yPos = totalsStartY + 3;
  addTotalLine('TOTAL HT', formatCurrency(data.formation_tarif_ht));
  addTotalLine('TVA 20%', formatCurrency(data.montant_tva));
  addTotalLine('TOTAL TTC', formatCurrency(data.formation_tarif_ttc), true, 1);

  yPos = totalsStartY + totalsHeight + 8;

     // --- BLOC PAIEMENT COLLÉ AUX TOTAUX (agranди pour les nouvelles infos) ---
   const paymentBlockHeight = 28; // Augmenté pour contenir toutes les infos
   pdf.setFillColor(BACKGROUND_LIGHT);
   pdf.rect(totalsX, yPos, totalsWidth, paymentBlockHeight, 'F');
   pdf.setDrawColor(BORDER_COLOR);
   pdf.rect(totalsX, yPos, totalsWidth, paymentBlockHeight, 'S');

   pdf.setFont('helvetica', 'bold');
   pdf.setFontSize(9);
   pdf.setTextColor(CORPORATE_BLUE);
   pdf.text('MODALITÉS DE PAIEMENT', totalsX + totalsWidth/2, yPos + 4, { align: 'center' });

   yPos += 8;
   pdf.setFont('helvetica', 'normal');
   pdf.setFontSize(7); // Taille réduite pour que l'IBAN rentre
   pdf.setTextColor(TEXT_DARK);
   
   // IBAN sur 2 lignes si nécessaire
   const iban = 'FR76 1660 7004 3340 0010 5706 393';
   const ibanSplitText = pdf.splitTextToSize(`IBAN: ${iban}`, totalsWidth - 4);
   pdf.text(ibanSplitText, totalsX + 2, yPos);
   yPos += ibanSplitText.length * 3;
   
   pdf.text('BIC: CCBPFRPPPPG', totalsX + 2, yPos);
   yPos += 3;
   
   // Nom de banque sur 2 lignes si nécessaire
   const bankName = 'Banque Dupuy de Parseval';
   const bankSplitText = pdf.splitTextToSize(`Banque: ${bankName}`, totalsWidth - 4);
   pdf.text(bankSplitText, totalsX + 2, yPos);

  // --- PIED DE PAGE COMPACT AVEC MENTIONS LÉGALES ---
  const footerY = pageHeight - 30; // Augmenté pour 5 lignes
  pdf.setFillColor(BACKGROUND_LIGHT);
  pdf.rect(margin, footerY, contentWidth, 25, 'F'); // Hauteur augmentée

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(TEXT_DARK);

  const legalMentions = [
    'A défaut de paiement comptant à l\'échéance, les intérêts de retard seront appliqués suivant les modalités et le taux minimum défini par la loi du 31/12/1992. Taux',
    'Refi majoré de 10 points. Indemnité forfaitaire pour frais de recouvrement (sans TVA): 40€',
    'SARL LAURENT SERRE – 69 rue Jean Bouin 34130 MAUGUIO - Tél. : 06 14 94 40 60 - n° de déclaration : 91340863434 – RCS :',
    'MONTPELLIER 435292941 N° SIRET : 43529294100034 – Code APE : 4778A - Capital social : 300 000,00 € - TVA intracommunautaire',
    ': FR344 352 929 41'
  ];

  let footerTextY = footerY + 4;
  legalMentions.forEach(mention => {
    pdf.text(mention, margin + 2, footerTextY);
    footerTextY += 3;
  });

  // Numérotation page
  pdf.text('Page 1/1', pageWidth - margin - 15, footerY + 21, { align: 'right' });

  // Sauvegarde
  const fileName = `Facture_${invoiceNumber}_${data.client_nom?.replace(/[^a-zA-Z0-9]/g, '_') || 'Client'}.pdf`;
  pdf.save(fileName);
};
