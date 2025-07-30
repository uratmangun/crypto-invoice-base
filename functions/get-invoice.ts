// Using Deno KV for local development and production
// No external dependencies needed!

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  description: string;
  amount: string;
  dueDate: string;
  walletAddress: string;
  createdDate: string;
  status: string;
  noDeadline?: boolean;
}

export default async function handler(req: Request): Promise<Response> {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Extract invoice ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const invoiceId = pathParts[pathParts.length - 1];

    if (!invoiceId) {
      return new Response(
        JSON.stringify({ error: 'Invoice ID is required' }),
        { status: 400, headers }
      );
    }

    // Try Deno KV first, fallback to file storage
    let invoice: InvoiceData | null = null;
    
    try {
      // Check if Deno KV is available (Deno 1.32+)
      if (typeof Deno.openKv === 'function') {
        console.log('Using Deno KV for retrieval...');
        const kv = await Deno.openKv();
        
        // Create invoice key
        const invoiceKey = ["invoice", invoiceId];
        
        // Get invoice data from Deno KV
        const result = await kv.get(invoiceKey);
        
        // Close KV connection
        kv.close();
        
        if (result.value) {
          invoice = result.value as InvoiceData;
        }
      } else {
        throw new Error('Deno KV not available, using file storage');
      }
    } catch (kvError) {
      console.log('Deno KV not available, using file storage:', kvError.message);
      
      // Fallback to file-based storage
      const dataDir = './data';
      const invoicesFile = `${dataDir}/invoices.json`;
      
      try {
        const fileContent = await Deno.readTextFile(invoicesFile);
        const existingInvoices: InvoiceData[] = JSON.parse(fileContent);
        
        // Find the invoice by invoice number
        invoice = existingInvoices.find(inv => inv.invoiceNumber === invoiceId) || null;
        
        console.log('Invoice retrieved from file storage');
      } catch (error) {
        console.log('No invoices file found or error reading it:', error.message);
      }
    }
    
    if (!invoice) {
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers }
      );
    }

    console.log(`Invoice ${invoiceId} retrieved successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invoice: invoice
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Error retrieving invoice:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to retrieve invoice',
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
}
