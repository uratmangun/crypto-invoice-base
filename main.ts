// Main entry point for Deno Deploy - routes to all functions
import helloFunction from './functions/hello.ts';
import authVerifyFunction from './functions/auth/verify.ts';
import saveInvoiceFunction from './functions/save-invoice.ts';
import getInvoiceFunction from './functions/get-invoice.ts';
import updateInvoiceFunction from './functions/update-invoice.ts';

// Type definitions for function handlers
type FunctionHandler = {
  fetch: (request: Request) => Promise<Response>;
} | ((request: Request) => Promise<Response>);

// Function registry - add new functions here
const functions: Record<string, FunctionHandler> = {
  hello: helloFunction,
  'save-invoice': saveInvoiceFunction,
  'get-invoice': getInvoiceFunction,
  'update-invoice': updateInvoiceFunction,
  // Add more functions here as you create them
  // example: exampleFunction,
};

// Nested function registry for auth endpoints
const nestedFunctions: Record<string, (request: Request) => Promise<Response>> = {
  'auth/verify': authVerifyFunction,
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    
    // Extract function name from path
    // Supports /api/hello, /hello, and nested /api/auth/verify patterns
    const pathParts = url.pathname.split('/').filter(part => part.length > 0);
    let functionName = '';
    let nestedPath = '';
    
    if (pathParts.length >= 2 && pathParts[0] === 'api') {
      if (pathParts.length >= 3) {
        // /api/auth/verify pattern - handle nested routes
        nestedPath = pathParts.slice(1).join('/');
      } else {
        // /api/hello pattern
        functionName = pathParts[1];
      }
    } else if (pathParts.length >= 1) {
      // /hello pattern
      functionName = pathParts[0];
    }
    
    // Route to nested functions first
    if (nestedPath && nestedFunctions[nestedPath as keyof typeof nestedFunctions]) {
      const targetFunction = nestedFunctions[nestedPath as keyof typeof nestedFunctions];
      return await targetFunction(request);
    }
    
    // Handle dynamic routes like /api/get-invoice/{invoiceId}
    if (pathParts.length >= 3 && pathParts[0] === 'api' && pathParts[1] === 'get-invoice') {
      // This is a get-invoice request with an invoice ID
      const targetFunction = functions['get-invoice'];
      if (typeof targetFunction === 'function') {
        return await targetFunction(request);
      } else if (targetFunction && typeof targetFunction.fetch === 'function') {
        return await targetFunction.fetch(request);
      }
    }
    
    // Route to the appropriate function
    if (functionName && functions[functionName as keyof typeof functions]) {
      const targetFunction = functions[functionName as keyof typeof functions];
      // Check if it's an object with fetch method or a direct function
      if (typeof targetFunction === 'function') {
        return await targetFunction(request);
      } else if (targetFunction && typeof targetFunction.fetch === 'function') {
        return await targetFunction.fetch(request);
      }
    }
    
    // Handle root path - return available functions
    if (url.pathname === '/' || url.pathname === '/api') {
      const availableFunctions = Object.keys(functions);
      const response = {
        message: 'Deno Deploy Function Router',
        availableFunctions,
        usage: availableFunctions.map(name => ({
          function: name,
          endpoints: [
            `${url.origin}/api/${name}`,
            `${url.origin}/${name}`
          ]
        })),
        timestamp: new Date().toISOString(),
      };
      
      return new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    // 404 for unknown routes
    return new Response(
      JSON.stringify({
        error: 'Function not found',
        availableFunctions: Object.keys(functions),
        requestedPath: url.pathname,
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  },
};
