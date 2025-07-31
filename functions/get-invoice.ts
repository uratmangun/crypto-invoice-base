// Using Deno KV for local development and production
// Updated for Deno 2.x with @deno/kv module

import { openKv } from "@deno/kv";

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

    // Use persistent SQLite-based Deno KV
    let invoice: InvoiceData | null = null;
    
    try {
      console.log('Using persistent SQLite-based Deno KV for retrieval...');
      
      // Open persistent SQLite-based KV store
      const kv = await openKv();
      
      // Create invoice key
      const invoiceKey = ["invoice", invoiceId];
      
      // Get invoice data from Deno KV
      const result = await kv.get(invoiceKey);
      
      // Close KV connection
      kv.close();
      
      if (result.value) {
        invoice = result.value as InvoiceData;
        console.log('Invoice retrieved from SQLite KV successfully');
      } else {
        console.log('Invoice not found in SQLite KV');
      }
    } catch (kvError) {
      console.error('Error with Deno KV:', kvError);
      throw new Error(`Failed to retrieve invoice from KV: ${kvError.message}`);
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
