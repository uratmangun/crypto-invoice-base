import { createPublicClient, http, verifyMessage } from 'npm:viem@2.21.45'
import { base } from 'npm:viem@2.21.45/chains'

// Simple in-memory nonce store (in production, use Redis or a database)
const usedNonces = new Set<string>()

// Create Viem client for Base network
const client = createPublicClient({ 
  chain: base, 
  transport: http() 
})

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })
  }

  try {
    const { address, message, signature } = await req.json()

    if (!address || !message || !signature) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      })
    }

    // Extract nonce from message (SIWE format)
    const nonceMatch = message.match(/Nonce: ([a-f0-9]{32})/i)
    if (!nonceMatch) {
      return new Response(JSON.stringify({ error: 'Invalid message format - nonce not found' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      })
    }

    const nonce = nonceMatch[1]

    // Check if nonce has been used before
    if (usedNonces.has(nonce)) {
      return new Response(JSON.stringify({ error: 'Nonce already used' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      })
    }

    // Verify the signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      })
    }

    // Mark nonce as used
    usedNonces.add(nonce)

    // In a real application, you would:
    // 1. Create a session token or JWT
    // 2. Store user session in database
    // 3. Return the session token

    // For now, just return success
    const sessionToken = crypto.randomUUID()
    
    return new Response(JSON.stringify({ 
      ok: true, 
      address,
      sessionToken,
      message: 'Authentication successful'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })

  } catch (error) {
    console.error('Verification error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    })
  }
}
