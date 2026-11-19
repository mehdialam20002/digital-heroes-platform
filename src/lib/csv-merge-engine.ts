import Papa from 'papaparse';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { mmToPoints } from './print-engine';

export interface CsvMergeRow {
  [key: string]: string;
}

export interface VariableDataMergeOptions {
  orderNumber: string;
  divisionSlug: string;
  widthMm: number;
  heightMm: number;
  rows: CsvMergeRow[];
  templateConfig?: {
    eventName?: string;
    showBarcode?: boolean;
    primaryNumberField?: string;
    participantNameField?: string;
    categoryField?: string;
  };
}

export async function processCsvVariableMerge(
  options: VariableDataMergeOptions
): Promise<Uint8Array> {
  const {
    orderNumber,
    widthMm,
    heightMm,
    rows,
    templateConfig = {
      eventName: 'DIGITAL HEROES ULTRA MARATHON 2026',
      primaryNumberField: 'Bib Number',
      participantNameField: 'First Name',
      categoryField: 'Wave',
    },
  } = options;

  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const trimW = mmToPoints(widthMm);
  const trimH = mmToPoints(heightMm);
  const bleed = mmToPoints(3); // 3mm bleed
  const slug = 28;

  const totalW = trimW + (bleed * 2) + (slug * 2);
  const totalH = trimH + (bleed * 2) + (slug * 2);

  const originX = slug + bleed;
  const originY = slug + bleed;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const page = pdfDoc.addPage([totalW, totalH]);

    // Background
    page.drawRectangle({
      x: originX,
      y: originY,
      width: trimW,
      height: trimH,
      color: rgb(0.99, 0.99, 1),
      borderColor: rgb(0.1, 0.1, 0.1),
      borderWidth: 0.5,
    });

    // Top Header / Event Banner
    page.drawRectangle({
      x: originX,
      y: originY + trimH - 45,
      width: trimW,
      height: 45,
      color: rgb(0.08, 0.11, 0.17),
    });

    page.drawText(templateConfig.eventName || 'DIGITAL HEROES RACING', {
      x: originX + 16,
      y: originY + trimH - 30,
      size: 14,
      font: fontBold,
      color: rgb(0.95, 0.8, 0.3),
    });

    // Dynamic Bib Number (Large, Centered with Shrink-to-fit logic)
    const bibValue =
      row[templateConfig.primaryNumberField || 'Bib Number'] ||
      row['Number'] ||
      row['bib'] ||
      String(i + 1).padStart(3, '0');

    let bibFontSize = 84;
    let bibWidth = fontBold.widthOfTextAtSize(bibValue, bibFontSize);
    const maxBibWidth = trimW - 60;

    // Shrink-to-fit calculation
    if (bibWidth > maxBibWidth) {
      bibFontSize = (maxBibWidth / bibWidth) * bibFontSize;
      bibWidth = fontBold.widthOfTextAtSize(bibValue, bibFontSize);
    }

    const bibX = originX + (trimW - bibWidth) / 2;
    const bibY = originY + (trimH / 2) - 15;

    page.drawText(bibValue, {
      x: bibX,
      y: bibY,
      size: bibFontSize,
      font: fontBold,
      color: rgb(0.06, 0.08, 0.12),
    });

    // Participant Name (Variable Data)
    const firstName = row['First Name'] || row['firstname'] || row['Name'] || '';
    const lastName = row['Last Name'] || row['lastname'] || '';
    const fullName = `${firstName} ${lastName}`.trim().toUpperCase() || 'ATHLETE PARTICIPANT';

    let nameFontSize = 18;
    let nameWidth = fontBold.widthOfTextAtSize(fullName, nameFontSize);
    if (nameWidth > trimW - 40) {
      nameFontSize = ((trimW - 40) / nameWidth) * nameFontSize;
      nameWidth = fontBold.widthOfTextAtSize(fullName, nameFontSize);
    }

    page.drawText(fullName, {
      x: originX + (trimW - nameWidth) / 2,
      y: bibY - 32,
      size: nameFontSize,
      font: fontBold,
      color: rgb(0.2, 0.25, 0.35),
    });

    // Category / Wave Badge (Bottom Bar)
    const wave = row[templateConfig.categoryField || 'Wave'] || row['Category'] || 'OPEN DIVISION';
    page.drawRectangle({
      x: originX,
      y: originY,
      width: trimW,
      height: 36,
      color: rgb(0.92, 0.94, 0.96),
    });

    page.drawText(`GROUP: ${wave.toUpperCase()}`, {
      x: originX + 16,
      y: originY + 13,
      size: 11,
      font: fontBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    page.drawText(`REC: #${i + 1} / ${rows.length}`, {
      x: originX + trimW - 100,
      y: originY + 13,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.4, 0.45, 0.5),
    });

    // 4 Corner Safety Pin Hole Indicators (Common for Race Bibs)
    const holeRadius = 3;
    const holeOffset = 14;
    const corners = [
      { x: originX + holeOffset, y: originY + holeOffset },
      { x: originX + trimW - holeOffset, y: originY + holeOffset },
      { x: originX + holeOffset, y: originY + trimH - holeOffset },
      { x: originX + trimW - holeOffset, y: originY + trimH - holeOffset },
    ];

    for (const pt of corners) {
      page.drawCircle({
        x: pt.x,
        y: pt.y,
        size: holeRadius,
        borderColor: rgb(0.5, 0.5, 0.6),
        borderWidth: 1,
      });
    }

    // Slug / Crop Naming
    const slugText = `ORDER: ${orderNumber} | ROW: ${i + 1} | BIB: ${bibValue} | DIGITAL HEROES CSV MERGE ENGINE`;
    page.drawText(slugText, {
      x: slug,
      y: totalH - 18,
      size: 7,
      font: fontHelvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
  }

  return await pdfDoc.save();
}

export function parseCsvFile(csvContent: string): Promise<CsvMergeRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvMergeRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (err: any) => {
        reject(err);
      },
    });
  });
}
