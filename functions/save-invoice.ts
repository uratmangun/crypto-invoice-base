import { connect } from "https://deno.land/x/redis@v0.32.4/mod.ts";

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

    // Get Redis URL from environment variables
    const redisUrl = Deno.env.get('REDIS_URL');
    if (!redisUrl) {
      console.error('REDIS_URL environment variable not set');
      return new Response(
        JSON.stringify({ error: 'Redis connection not configured' }),
        { status: 500, headers }
      );
    }

    // Connect to Redis
    const redis = await connect({ url: redisUrl });

    // Create invoice key
    const invoiceKey = `invoice:${invoiceData.invoiceNumber}`;

    // Add created date and status if not provided
    const invoiceToSave = {
      ...invoiceData,
      createdDate: invoiceData.createdDate || new Date().toISOString().split('T')[0],
      status: invoiceData.status || 'pending'
    };

    // Save invoice data to Redis as JSON
    await redis.set(invoiceKey, JSON.stringify(invoiceToSave));

    // Set expiration to 1 year (31536000 seconds)
    await redis.expire(invoiceKey, 31536000);

    // Also add to a list of all invoices for easier querying
    await redis.zadd('invoices:all', Date.now(), invoiceData.invoiceNumber);

    // Close Redis connection
    await redis.quit();

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
