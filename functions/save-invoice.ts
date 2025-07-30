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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Parse the request body
    const invoiceData: InvoiceData = await req.json();

    // Validate required fields
    if (!invoiceData.invoiceNumber || !invoiceData.clientName || 
        !invoiceData.description || !invoiceData.amount || 
        !invoiceData.walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Add created date and status if not provided
    const invoiceToSave = {
      ...invoiceData,
      createdDate: invoiceData.createdDate || new Date().toISOString().split('T')[0],
      status: invoiceData.status || 'pending'
    };

    // Try Deno KV first, fallback to file storage
    let saveSuccess = false;
    
    try {
      // Check if Deno KV is available (Deno 1.32+)
      if (typeof Deno.openKv === 'function') {
        console.log('Using Deno KV for storage...');
        const kv = await Deno.openKv();
        
        // Create invoice key
        const invoiceKey = ["invoice", invoiceData.invoiceNumber];
        
        // Save invoice data to Deno KV
        const result = await kv.set(invoiceKey, invoiceToSave);
        
        // Also add to a list of all invoices for easier querying
        const allInvoicesKey = ["invoices", "all", Date.now()];
        await kv.set(allInvoicesKey, invoiceData.invoiceNumber);
        
        // Close KV connection
        kv.close();
        
        saveSuccess = result.ok;
      } else {
        throw new Error('Deno KV not available, using file storage');
      }
    } catch (kvError) {
      console.log('Deno KV not available, using file storage:', kvError.message);
      
      // Fallback to file-based storage
      // Use a directory outside the source to avoid Vite watching it
      const dataDir = './storage/data';
      const invoicesFile = `${dataDir}/invoices.json`;
      
      // Ensure data directory exists
      try {
        await Deno.mkdir(dataDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
      
      // Read existing invoices or create empty array
      let existingInvoices = [];
      try {
        const fileContent = await Deno.readTextFile(invoicesFile);
        existingInvoices = JSON.parse(fileContent);
      } catch (error) {
        // File doesn't exist yet, start with empty array
      }
      
      // Add new invoice
      existingInvoices.push(invoiceToSave);
      
      // Save back to file
      await Deno.writeTextFile(invoicesFile, JSON.stringify(existingInvoices, null, 2));
      
      saveSuccess = true;
      console.log('Invoice saved to file storage');
    }
    
    if (!saveSuccess) {
      throw new Error('Failed to save invoice to database');
    }

    console.log(`Invoice ${invoiceData.invoiceNumber} saved successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invoice saved successfully',
        invoiceNumber: invoiceData.invoiceNumber
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Error saving invoice:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to save invoice',
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
}
