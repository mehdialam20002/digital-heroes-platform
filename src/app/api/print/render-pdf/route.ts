import { NextRequest, NextResponse } from 'next/server';
import { generateProductionPdf, getProductionFilename } from '@/lib/print-engine';
import { DataService } from '@/lib/data-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderItemId } = body;

    let order = await DataService.getOrderById(orderId);
    let item = order?.items.find((it) => it.id === orderItemId);

    if (!item && body.mockItem) {
      item = body.mockItem;
    }

    if (!item) {
      return NextResponse.json(
        { error: 'Order item not found' },
        { status: 404 }
      );
    }

    const orderNumber = order?.orderNumber || `DH-ORDER-${Date.now().toString().slice(-4)}`;
    const pdfBytes = await generateProductionPdf({
      orderNumber,
      productType: item.divisionSlug,
      item,
      includeCropMarks: true,
    });

    const filename = getProductionFilename(orderNumber, item.divisionSlug, 'pdf');

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
