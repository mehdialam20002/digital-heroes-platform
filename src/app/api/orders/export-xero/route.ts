import { NextResponse } from 'next/server';
import { DataService } from '@/lib/data-service';

export async function GET() {
  try {
    const orders = await DataService.getAllOrders();

    // Standard Xero Sales Invoice CSV Format headers
    const headers = [
      '*ContactName',
      'EmailAddress',
      'POAddressLine1',
      'POCity',
      'POPostalCode',
      'POCountry',
      '*InvoiceNumber',
      '*InvoiceDate',
      '*DueDate',
      'Total',
      'InventoryItemCode',
      '*Description',
      '*Quantity',
      '*UnitAmount',
      '*AccountCode',
      '*TaxType'
    ];

    const rows: string[] = [headers.join(',')];

    for (const order of orders) {
      const invDate = order.createdAt.split('T')[0];
      const dueDate = new Date(new Date(order.createdAt).getTime() + 14 * 86400000).toISOString().split('T')[0];

      for (const item of order.items) {
        const contactName = `"${(order.customerCompany || order.customerName).replace(/"/g, '""')}"`;
        const email = order.customerEmail;
        const address = `"${(order.shippingAddress?.street || '').replace(/"/g, '""')}"`;
        const city = `"${(order.shippingAddress?.city || '').replace(/"/g, '""')}"`;
        const postCode = order.shippingAddress?.postalCode || '';
        const country = order.shippingAddress?.country || 'United Kingdom';
        const invNum = order.orderNumber;
        const total = order.total.toFixed(2);
        const itemCode = item.divisionSlug.toUpperCase().slice(0, 10);
        const desc = `"${(item.productName + ' - ' + item.configuration.widthMm + 'x' + item.configuration.heightMm + 'mm').replace(/"/g, '""')}"`;
        const qty = item.configuration.quantity;
        const unitAmount = item.pricing.unitPrice.toFixed(2);
        const accountCode = '200'; // 200 - Sales
        const taxType = '20% (VAT on Income)';

        rows.push([
          contactName,
          email,
          address,
          city,
          postCode,
          country,
          invNum,
          invDate,
          dueDate,
          total,
          itemCode,
          desc,
          qty,
          unitAmount,
          accountCode,
          taxType
        ].join(','));
      }
    }

    const csvContent = rows.join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="Xero_Invoices_Export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
