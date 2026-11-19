import { NextRequest, NextResponse } from 'next/server';
import { processCsvVariableMerge, parseCsvFile, CsvMergeRow } from '@/lib/csv-merge-engine';
import { getProductionFilename } from '@/lib/print-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber = 'DH-BATCH-VAR', divisionSlug = 'race-event-numbers', csvData, rows, widthMm = 210, heightMm = 148 } = body;

    let parsedRows: CsvMergeRow[] = rows || [];
    if (csvData && (!parsedRows || parsedRows.length === 0)) {
      parsedRows = await parseCsvFile(csvData);
    }

    if (!parsedRows || parsedRows.length === 0) {
      return NextResponse.json({ error: 'No CSV rows provided' }, { status: 400 });
    }

    const pdfBytes = await processCsvVariableMerge({
      orderNumber,
      divisionSlug,
      widthMm,
      heightMm,
      rows: parsedRows,
    });

    const filename = getProductionFilename(orderNumber, `${divisionSlug}_VariableBatch`, 'pdf');

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('CSV Variable Merge Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
