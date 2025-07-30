// API configuration for Deno backend endpoints
export const getApiEndpoints = () => {
  // Get the Deno Deploy URL from environment variable
  const denoApiUrl = import.meta.env.VITE_DENO_API_URL || 'https://crypto-invoice-base.deno.dev'
  
  return {
    // Auth verification endpoints with fallbacks
    authVerify: [
      'http://localhost:8000/api/auth/verify', // Local Deno server
      `${denoApiUrl}/api/auth/verify`, // Production Deno Deploy endpoint
      '/api/auth/verify' // Fallback endpoint
    ],
    
    // Hello endpoint for testing
    hello: [
      'http://localhost:8000/api/hello', // Local Deno server
      `${denoApiUrl}/api/hello`, // Production Deno Deploy endpoint
      '/api/hello' // Fallback endpoint
    ]
  }
}

// Helper function to try multiple endpoints
export const fetchWithFallback = async (endpoints: string[], options: RequestInit = {}) => {
  let lastError: Error | null = null
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, options)
      
      // If we get a response (even if it's an error status), return it
      // This allows the calling code to handle HTTP errors appropriately
      return response
    } catch (error) {
      console.warn(`Failed to fetch from ${endpoint}:`, error)
      lastError = error as Error
      continue
    }
  }
  
  // If all endpoints failed, throw the last error
  throw lastError || new Error('All API endpoints failed')
}
