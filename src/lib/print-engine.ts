import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CanvasDesignState, OrderItem } from '@/types';

// Convert mm to PDF Points (72 points per inch, 25.4 mm per inch)
export function mmToPoints(mm: number): number {
  return (mm * 72) / 25.4;
}

export interface ProductionPdfOptions {
  orderNumber: string;
  productType: string;
  item: OrderItem;
  includeCropMarks?: boolean;
}

export async function generateProductionPdf(options: ProductionPdfOptions): Promise<Uint8Array> {
  const { orderNumber, productType, item, includeCropMarks = true } = options;
  const config = item.configuration;
  const bleedMm = 3; // Standard 3mm bleed

  // Physical size + bleed
  const trimWidthPoints = mmToPoints(config.widthMm);
  const trimHeightPoints = mmToPoints(config.heightMm);
  const bleedPoints = mmToPoints(bleedMm);

  // Total canvas with bleed and slug for crop marks
  const slugPoints = includeCropMarks ? 36 : 0; // 0.5 inch slug border for crop marks
  const totalWidth = trimWidthPoints + (bleedPoints * 2) + (slugPoints * 2);
  const totalHeight = trimHeightPoints + (bleedPoints * 2) + (slugPoints * 2);

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([totalWidth, totalHeight]);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Offset origin to trim box
  const originX = slugPoints + bleedPoints;
  const originY = slugPoints + bleedPoints;

  // 1. Draw Bleed Area Background
  page.drawRectangle({
    x: slugPoints,
    y: slugPoints,
    width: trimWidthPoints + (bleedPoints * 2),
    height: trimHeightPoints + (bleedPoints * 2),
    color: rgb(0.96, 0.96, 0.96),
  });

  // 2. Draw Trim Box (Product Finished Size)
  page.drawRectangle({
    x: originX,
    y: originY,
    width: trimWidthPoints,
    height: trimHeightPoints,
    borderColor: rgb(0.2, 0.2, 0.2),
    borderWidth: 0.5,
    color: rgb(1, 1, 1),
  });

  // 3. Render Canvas Elements if designState exists
  if (item.designState && item.designState.elements) {
    const scaleX = trimWidthPoints / item.designState.widthMm;
    const scaleY = trimHeightPoints / item.designState.heightMm;

    for (const el of item.designState.elements) {
      if (el.type === 'text' && el.text) {
        const textX = originX + (el.x * scaleX);
        const textY = originY + trimHeightPoints - ((el.y + (el.fontSize || 16)) * scaleY);

        page.drawText(el.text, {
          x: Math.max(originX, textX),
          y: Math.max(originY, textY),
          size: (el.fontSize || 16) * 0.75,
          font: helveticaBold,
          color: rgb(0.1, 0.1, 0.1),
        });
      } else if (el.type === 'shape') {
        const shapeX = originX + (el.x * scaleX);
        const shapeY = originY + trimHeightPoints - ((el.y + el.height) * scaleY);
        page.drawRectangle({
          x: shapeX,
          y: shapeY,
          width: el.width * scaleX,
          height: el.height * scaleY,
          color: rgb(0.9, 0.9, 0.95),
          borderColor: rgb(0.3, 0.3, 0.4),
          borderWidth: 1,
        });
      }
    }
  } else {
    // Default placeholder artwork indicator
    page.drawText(`${item.productName.toUpperCase()}`, {
      x: originX + 20,
      y: originY + trimHeightPoints - 35,
      size: 16,
      font: helveticaBold,
      color: rgb(0.1, 0.15, 0.25),
    });

    page.drawText(`Dimensions: ${config.widthMm}mm x ${config.heightMm}mm | Material: ${config.materialId}`, {
      x: originX + 20,
      y: originY + trimHeightPoints - 55,
      size: 10,
      font: helveticaFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(`Approved for Production (Ready to Print)`, {
      x: originX + 20,
      y: originY + 20,
      size: 9,
      font: helveticaBold,
      color: rgb(0.1, 0.6, 0.2),
    });
  }

  // 4. Draw Industrial Crop Marks & Alignment Lines
  if (includeCropMarks) {
    const markLength = 18;
    const markOffset = 4;
    const strokeColor = rgb(0.1, 0.1, 0.1);
    const strokeWidth = 0.5;

    // Top-Left crop marks
    page.drawLine({
      start: { x: originX, y: originY + trimHeightPoints + markOffset },
      end: { x: originX, y: originY + trimHeightPoints + markOffset + markLength },
      color: strokeColor,
      thickness: strokeWidth,
    });
    page.drawLine({
      start: { x: originX - markOffset, y: originY + trimHeightPoints },
      end: { x: originX - markOffset - markLength, y: originY + trimHeightPoints },
      color: strokeColor,
      thickness: strokeWidth,
    });

    // Top-Right crop marks
    page.drawLine({
      start: { x: originX + trimWidthPoints, y: originY + trimHeightPoints + markOffset },
      end: { x: originX + trimWidthPoints, y: originY + trimHeightPoints + markOffset + markLength },
      color: strokeColor,
      thickness: strokeWidth,
    });
    page.drawLine({
      start: { x: originX + trimWidthPoints + markOffset, y: originY + trimHeightPoints },
      end: { x: originX + trimWidthPoints + markOffset + markLength, y: originY + trimHeightPoints },
      color: strokeColor,
      thickness: strokeWidth,
    });

    // Bottom-Left crop marks
    page.drawLine({
      start: { x: originX, y: originY - markOffset },
      end: { x: originX, y: originY - markOffset - markLength },
      color: strokeColor,
      thickness: strokeWidth,
    });
    page.drawLine({
      start: { x: originX - markOffset, y: originY },
      end: { x: originX - markOffset - markLength, y: originY },
      color: strokeColor,
      thickness: strokeWidth,
    });

    // Bottom-Right crop marks
    page.drawLine({
      start: { x: originX + trimWidthPoints, y: originY - markOffset },
      end: { x: originX + trimWidthPoints, y: originY - markOffset - markLength },
      color: strokeColor,
      thickness: strokeWidth,
    });
    page.drawLine({
      start: { x: originX + trimWidthPoints + markOffset, y: originY },
      end: { x: originX + trimWidthPoints + markOffset + markLength, y: originY },
      color: strokeColor,
      thickness: strokeWidth,
    });

    // Production Slug Metadata (Top edge of slug)
    const formattedDate = new Date().toISOString().split('T')[0];
    const slugLine = `DIGITAL HEROES PRODUCTION OUTPUT | ORDER: ${orderNumber} | DIVISION: ${productType} | TRIM: ${config.widthMm}x${config.heightMm}mm | DATE: ${formattedDate}`;
    page.drawText(slugLine, {
      x: slugPoints,
      y: totalHeight - 16,
      size: 7,
      font: helveticaFont,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  return await pdfDoc.save();
}

export function getProductionFilename(orderNumber: string, productType: string, extension: string = 'pdf'): string {
  const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const cleanType = productType.replace(/[^a-zA-Z0-9]/g, '_');
  return `${orderNumber}_${cleanType}_${dateStr}_Output.${extension}`;
}
