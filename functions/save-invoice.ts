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

    // Use persistent SQLite-based Deno KV
    let saveSuccess = false;
    
    try {
      console.log('Using persistent SQLite-based Deno KV for storage...');
      
      // Open persistent SQLite-based KV store
      const kv = await openKv();
      
      // Create invoice key
      const invoiceKey = ["invoice", invoiceData.invoiceNumber];
      
      // Save invoice data to Deno KV
      const result = await kv.set(invoiceKey, invoiceToSave);
      
      // Also add to a list of all invoices for easier querying
      const allInvoicesKey = ["invoices", "all", Date.now()];
      await kv.set(allInvoicesKey, invoiceData.invoiceNumber);
      
      // Add to invoice index for listing
      const indexKey = ["invoice_index", invoiceData.invoiceNumber];
      await kv.set(indexKey, {
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName,
        amount: invoiceData.amount,
        status: invoiceToSave.status,
        createdDate: invoiceToSave.createdDate
      });
      
      // Close KV connection
      kv.close();
      
      saveSuccess = result.ok;
      console.log('Invoice saved to SQLite KV successfully');
    } catch (kvError) {
      console.error('Error with Deno KV:', kvError);
      throw new Error(`Failed to save invoice to KV: ${kvError.message}`);
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
