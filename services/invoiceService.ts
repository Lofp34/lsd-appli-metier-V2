import { jsPDF } from 'jspdf';
import { ConventionData } from '../types';

const PRIMARY_BLUE = '#3A7D9F'; // Approximate color from the PDF
const TEXT_COLOR_DARK = '#333333';
const TEXT_COLOR_LIGHT = '#FFFFFF';
const BORDER_COLOR = '#DDDDDD';

const formatCurrency = (value: string | number | undefined): string => {
  const num = parseFloat(String(value || '0'));

  // Format to string with 2 decimal places, using '.' as decimal separator initially
  const fixedNumStr = num.toFixed(2);

  const parts = fixedNumStr.split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];

  // Add space as thousands separator for the integer part
  // Regex: Inserts a space every three digits from the right of the integer part.
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Combine with French decimal separator ',' and currency symbol
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
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 20;

  // --- Helper to add text and advance yPos ---
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
      color = TEXT_COLOR_DARK,
      align = 'left',
      maxWidth,
    } = options || {};
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color);
    if (maxWidth) {
      const splitText = pdf.splitTextToSize(text, maxWidth);
      pdf.text(splitText, x, y, { align });
      return y + splitText.length * fontSize * 0.35; // Approximate line height
    } else {
      pdf.text(text, x, y, { align });
      return y + fontSize * 0.35; // Approximate line height for a single string
    }
  };

  // --- Header ---
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(PRIMARY_BLUE);
  pdf.text('LAURENT SERRE DEVELOPPEMENT', margin, yPos);
  yPos += 8;
  pdf.setDrawColor(PRIMARY_BLUE);
  pdf.setLineWidth(0.8);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 12;

  // --- FACTURE Title ---
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(TEXT_COLOR_DARK);
  pdf.text('FACTURE', margin, yPos);
  yPos += 10;

  // --- Company Info (Left) & Invoice Meta (Right) ---
  const col1X = margin;
  const col2X = pageWidth / 2 + 10;
  const startYInfo = yPos;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(TEXT_COLOR_DARK);
  pdf.text('SARL LAURENT SERRE', col1X, yPos);
  yPos += 4;
  pdf.setFont('helvetica', 'normal');
  pdf.text('259 rue de la Lavande', col1X, yPos);
  yPos += 4;
  pdf.text('34130 Mauguio', col1X, yPos);
  yPos += 4;
  pdf.text(`SIRET : 43529294100034`, col1X, yPos);
  yPos += 4;
  pdf.text(`N° de TVA intracommunautaire FR344 352 929 41`, col1X, yPos);
  yPos += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(PRIMARY_BLUE);
  pdf.text('06 14 94 40 60', col1X, yPos);
  yPos += 4;
  pdf.text('ls@laurentserre.com', col1X, yPos);

  let yPosRight = startYInfo;
  const invoiceDate = new Date();
  let invoiceNumber = `F-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}${String(invoiceDate.getDate()).padStart(2, '0')}-001`; // Default
  if (data.numero_convention) {
    invoiceNumber = `F-${data.numero_convention}`;
  } else {
    invoiceNumber = `F-${invoiceDate.getFullYear()}${String(invoiceDate.getMonth() + 1).padStart(2, '0')}${String(invoiceDate.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
  }

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(TEXT_COLOR_DARK);
  pdf.text(`Date : ${formatDate(invoiceDate)}`, col2X, yPosRight);
  yPosRight += 5;
  pdf.text(`Numéro de facture : ${invoiceNumber}`, col2X, yPosRight);
  yPosRight += 5;
  pdf.text(`Termes : immédiat`, col2X, yPosRight);

  yPos = Math.max(yPos, yPosRight) + 10; // Ensure yPos is below both columns

  // --- Table ---
  const _tableStartY = yPos; // Table starting position (kept for reference)
  const colWidths = [
    contentWidth * 0.48,
    contentWidth * 0.12,
    contentWidth * 0.15,
    contentWidth * 0.1,
    contentWidth * 0.15,
  ];
  const headerHeight = 8;
  const cellPadding = 2;

  // Table Headers
  pdf.setFillColor(PRIMARY_BLUE);
  pdf.rect(margin, yPos, contentWidth, headerHeight, 'F');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(TEXT_COLOR_LIGHT);

  let currentX = margin + cellPadding;
  pdf.text('Description', currentX, yPos + headerHeight / 2 + 2);
  currentX += colWidths[0];
  pdf.text('Quantité', currentX, yPos + headerHeight / 2 + 2, { align: 'center' });
  currentX += colWidths[1];
  pdf.text(
    'PU HT',
    currentX +
      colWidths[2] -
      cellPadding -
      pdf.getStringUnitWidth('PU HT') * pdf.getFontSize() * 0.35,
    yPos + headerHeight / 2 + 2,
    { align: 'right' }
  );
  currentX += colWidths[2];
  pdf.text(
    'Taux de TVA',
    currentX +
      colWidths[3] -
      cellPadding -
      pdf.getStringUnitWidth('Taux de TVA') * pdf.getFontSize() * 0.35,
    yPos + headerHeight / 2 + 2,
    { align: 'right' }
  );
  currentX += colWidths[3];
  pdf.text(
    'Montant HT',
    currentX +
      colWidths[4] -
      cellPadding * 2 -
      pdf.getStringUnitWidth('Montant HT') * pdf.getFontSize() * 0.35,
    yPos + headerHeight / 2 + 2,
    { align: 'right' }
  );

  yPos += headerHeight;

  // Table Row
  const rowStartY = yPos;
  const descColX = margin + cellPadding;
  let descY = yPos + cellPadding + 3; // Initial Y for description text

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(TEXT_COLOR_DARK);

  const mainItemDesc = data.formation_intitule || 'Formation commerciale-technique de vente';
  pdf.setFont('helvetica', 'bold');
  descY =
    addText(mainItemDesc, descColX, descY, {
      fontSize: 9,
      fontStyle: 'bold',
      maxWidth: colWidths[0] - cellPadding * 2,
    }) + 1;

  pdf.setFont('helvetica', 'normal');
  const clientText = `Client : ${data.client_nom || 'N/A'}`;
  descY =
    addText(clientText, descColX, descY, {
      fontSize: 9,
      maxWidth: colWidths[0] - cellPadding * 2,
    }) + 0.5;

  const participantsText = `Bénéficiaire(s) : ${data.participants || 'N/A'}`;
  descY =
    addText(participantsText, descColX, descY, {
      fontSize: 9,
      maxWidth: colWidths[0] - cellPadding * 2,
    }) + 0.5;

  const conventionText = `Convention n° ${data.numero_convention || 'N/A'} du ${data.date_signature || 'N/A'}`;
  descY =
    addText(conventionText, descColX, descY, {
      fontSize: 9,
      maxWidth: colWidths[0] - cellPadding * 2,
    }) + 0.5;

  const stageText = `Intitulé du stage : ${data.formation_intitule || 'Formation personnalisée'}`;
  descY =
    addText(stageText, descColX, descY, { fontSize: 9, maxWidth: colWidths[0] - cellPadding * 2 }) +
    0.5;

  const datesText = `Dates de formation : ${data.formation_dates || 'N/A'}`;
  descY =
    addText(datesText, descColX, descY, { fontSize: 9, maxWidth: colWidths[0] - cellPadding * 2 }) +
    0.5;

  const dureeText = `Durée de la formation : ${data.formation_duree || 'N/A'}`;
  descY =
    addText(dureeText, descColX, descY, { fontSize: 9, maxWidth: colWidths[0] - cellPadding * 2 }) +
    0.5;

  pdf.setFont('helvetica', 'bold');
  descY = addText('Référence complémentaire :', descColX, descY, {
    fontSize: 9,
    fontStyle: 'bold',
    maxWidth: colWidths[0] - cellPadding * 2,
  });
  pdf.setFont('helvetica', 'normal');

  const rowContentY = rowStartY + cellPadding + 3;
  currentX = margin + colWidths[0];
  pdf.text('1', currentX + colWidths[1] / 2, rowContentY, { align: 'center' });
  currentX += colWidths[1];
  pdf.text(
    formatCurrency(data.formation_tarif_ht),
    currentX + colWidths[2] - cellPadding,
    rowContentY,
    { align: 'right' }
  );
  currentX += colWidths[2];
  pdf.text('20 %', currentX + colWidths[3] - cellPadding, rowContentY, { align: 'right' });
  currentX += colWidths[3];
  pdf.text(
    formatCurrency(data.formation_tarif_ht),
    currentX + colWidths[4] - cellPadding * 2,
    rowContentY,
    { align: 'right' }
  );

  const minRowHeight = 80; // Minimum height for the description section
  const actualRowHeight = Math.max(minRowHeight, descY - rowStartY);
  yPos = rowStartY + actualRowHeight;

  // Draw cell borders
  pdf.setDrawColor(BORDER_COLOR);
  pdf.setLineWidth(0.3);
  let lineX = margin;
  pdf.line(lineX, rowStartY, lineX, yPos); // Left border
  lineX += colWidths[0];
  pdf.line(lineX, rowStartY, lineX, yPos);
  lineX += colWidths[1];
  pdf.line(lineX, rowStartY, lineX, yPos);
  lineX += colWidths[2];
  pdf.line(lineX, rowStartY, lineX, yPos);
  lineX += colWidths[3];
  pdf.line(lineX, rowStartY, lineX, yPos);
  pdf.line(pageWidth - margin, rowStartY, pageWidth - margin, yPos); // Right border
  pdf.line(margin, yPos, pageWidth - margin, yPos); // Bottom border of row

  // Dotted lines for empty space if any (visual only)
  pdf.setLineDashPattern([1, 1], 0);
  const numDottedLines = Math.floor((minRowHeight - (descY - rowStartY) - 5) / 5); // Approx 5mm per line
  let dottedY = descY + 2;
  for (let i = 0; i < numDottedLines && dottedY < yPos - 5; i++) {
    pdf.line(margin + cellPadding, dottedY, margin + colWidths[0] - cellPadding, dottedY);
    dottedY += 5;
  }
  pdf.setLineDashPattern([], 0);

  // --- Totals ---
  yPos += 2; // Gap before totals
  const totalsXAnchor = pageWidth - margin; // Right edge of content

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const addTotalLine = (label: string, value: string, isBoldValue: boolean = false) => {
    yPos += 6;
    const valueFont = isBoldValue ? 'helvetica' : 'helvetica';
    const valueStyle = isBoldValue ? 'bold' : 'normal';

    const labelWidth =
      ((pdf.getStringUnitWidth(label) * pdf.getFontSize()) / pdf.internal.scaleFactor) *
      pdf.internal.scaleFactor *
      0.3527777778 *
      2.8346456693; // mm
    const valueWidth =
      ((pdf.getStringUnitWidth(value) * pdf.getFontSize()) / pdf.internal.scaleFactor) *
      pdf.internal.scaleFactor *
      0.3527777778 *
      2.8346456693; // mm

    const labelX = totalsXAnchor - colWidths[4] - labelWidth - cellPadding * 2;
    const valueX = totalsXAnchor - valueWidth - cellPadding * 2;

    pdf.setFont('helvetica', 'normal');
    pdf.text(label, labelX, yPos + 2);

    pdf.setFont(valueFont, valueStyle);
    pdf.text(value, valueX, yPos + 2);
    pdf.setFont('helvetica', 'normal'); // Reset for next line or border

    pdf.setDrawColor(BORDER_COLOR);
    pdf.line(
      totalsXAnchor - (colWidths[2] + colWidths[3] + colWidths[4]),
      yPos + 4,
      totalsXAnchor,
      yPos + 4
    );
  };

  pdf.line(totalsXAnchor - (colWidths[2] + colWidths[3] + colWidths[4]), yPos, totalsXAnchor, yPos); // Top border for totals block
  addTotalLine('TOTAL HT', formatCurrency(data.formation_tarif_ht), true);
  addTotalLine('TVA 20,00 %', formatCurrency(data.montant_tva));
  addTotalLine('Total TTC', formatCurrency(data.formation_tarif_ttc), true);
  yPos += 6; // final gap

  // --- Payment Info ---
  if (yPos > 200) {
    // Check if new page is needed
    pdf.addPage();
    yPos = margin;
  }
  yPos += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('En votre aimable règlement par virement', margin, yPos);
  yPos += 5;
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    'Références bancaires : IBAN : FR76 1660 7004 3340 0010 5706 393 BIC : CCBPFRPPPPG',
    margin,
    yPos
  );
  yPos += 10;

  // --- Footer ---
  const footerY = pdf.internal.pageSize.getHeight() - 35;
  if (yPos > footerY - 10) {
    pdf.addPage();
    yPos = margin;
  } else {
    yPos = footerY;
  }

  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  const finePrint =
    "A défaut de paiement comptant à l'échéance, les intérêts de retard seront appliqués suivant les modalités et le taux minimum défini par la loi du 31/12/1992. Taux Refi majoré de 10 points. Indemnité forfaitaire pour frais de recouvrement (sans TVA): 40€";
  const splitFinePrint = pdf.splitTextToSize(finePrint, contentWidth);
  pdf.text(splitFinePrint, margin, yPos);
  yPos += splitFinePrint.length * 2.5 + 3;

  pdf.setFontSize(8);
  const footerCompanyDetails1 =
    'SARL LAURENT SERRE – 69 rue Jean Bouin 34130 MAUGUIO - Tél. : 06 14 94 40 60 - n° de déclaration : 91340863434 – RCS :';
  const footerCompanyDetails2 =
    'MONTPELLIER 435292941 N° SIRET : 43529294100034 – Code APE : 4778A - Capital social : 300 000,00 € - TVA intracommunautaire';
  const footerCompanyDetails3 = ': FR344 352 929 41';

  pdf.text(footerCompanyDetails1, margin, yPos);
  yPos += 3.5;
  pdf.text(footerCompanyDetails2, margin, yPos);
  yPos += 3.5;
  pdf.text(footerCompanyDetails3, margin, yPos);

  // Page Number
  pdf.setFontSize(9);
  pdf.text('1', pageWidth - margin - 5, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });

  // --- Save PDF ---
  const fileName = `Facture_${invoiceNumber.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  pdf.save(fileName);
};
