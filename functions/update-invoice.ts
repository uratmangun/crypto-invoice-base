// Using persistent SQLite-based Deno KV for invoice updates
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
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Parse request body
    const requestData = await req.json();
    const { invoiceNumber, status } = requestData;

    if (!invoiceNumber || !status) {
      return new Response(
        JSON.stringify({ error: 'Invoice number and status are required' }),
        { status: 400, headers }
      );
    }

    // Use persistent SQLite-based Deno KV
    try {
      console.log('Using persistent SQLite-based Deno KV for update...');
      
      // Open persistent SQLite-based KV store
      const kv = await openKv();
      
      // Create invoice key
      const invoiceKey = ["invoice", invoiceNumber];
      
      // Get existing invoice data
      const existingResult = await kv.get(invoiceKey);
      
      if (!existingResult.value) {
        kv.close();
        return new Response(
          JSON.stringify({ error: 'Invoice not found' }),
          { status: 404, headers }
        );
      }
      
      // Update the invoice status
      const existingInvoice = existingResult.value as InvoiceData;
      const updatedInvoice = {
        ...existingInvoice,
        status: status
      };
      
      // Save updated invoice data to Deno KV
      const result = await kv.set(invoiceKey, updatedInvoice);
      
      // Update the invoice index as well
      const indexKey = ["invoice_index", invoiceNumber];
      await kv.set(indexKey, {
        invoiceNumber: updatedInvoice.invoiceNumber,
        clientName: updatedInvoice.clientName,
        amount: updatedInvoice.amount,
        status: updatedInvoice.status,
        createdDate: updatedInvoice.createdDate
      });
      
      // Close KV connection
      kv.close();
      
      if (!result.ok) {
        throw new Error('Failed to update invoice in KV');
      }
      
      console.log('Invoice status updated in SQLite KV successfully');
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Invoice status updated successfully',
          invoice: updatedInvoice
        }),
        { status: 200, headers }
      );
      
    } catch (kvError) {
      console.error('Error with Deno KV:', kvError);
      throw new Error(`Failed to update invoice in KV: ${kvError.message}`);
    }

  } catch (error) {
    console.error('Error updating invoice:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to update invoice',
        details: error.message 
      }),
      { status: 500, headers }
    );
  }
}
