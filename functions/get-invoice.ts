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
    const invoiceKey = `invoice:${invoiceId}`;

    // Get invoice data from Redis
    const invoiceData = await redis.get(invoiceKey);

    await redis.quit();

    if (!invoiceData) {
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { status: 404, headers }
      );
    }

    // Parse the JSON data
    const invoice: InvoiceData = JSON.parse(invoiceData);

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
