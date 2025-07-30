// Simple Deno server for local development
import mainHandler from './main.ts';

const PORT = 8000;

async function handler(request: Request): Promise<Response> {
  // Use the main handler which routes to all functions
  return await mainHandler.fetch(request);
}

console.log(`🦕 Deno server running on http://localhost:${PORT}`);
console.log(`📡 Function endpoints:`);
console.log(`   - http://localhost:${PORT}/api/hello`);
console.log(`   - http://localhost:${PORT}/api/auth/verify`);

Deno.serve({ port: PORT }, handler);
