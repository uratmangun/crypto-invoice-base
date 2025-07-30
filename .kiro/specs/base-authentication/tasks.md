# Implementation Plan

- [x] 1. Remove Legacy Authentication UI
  - Replace email/password form with Web3 authentication interface
  - Update Login component to remove traditional form elements
  - Maintain existing navigation and routing structure
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement Base Brand Guidelines
  - Add "Sign in with Base" button with official Base blue square icon
  - Implement proper hover states and visual feedback
  - Ensure dark mode compatibility for button styling
  - Follow Base's typography and color specifications
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Integrate Web3 Wallet Connection
  - Implement wallet connection using standard `window.ethereum` API
  - Handle wallet detection and connection prompts
  - Add fallback messaging for users without Web3 wallets
  - Implement error handling for connection failures
  - _Requirements: 2.1, 5.4_

- [x] 4. Implement SIWE Message Generation
  - Generate unique nonces for each authentication session
  - Create SIWE-compliant messages with domain, URI, statement, chain ID
  - Include proper timestamp and expiration handling
  - Ensure message format follows EIP-4361 specification
  - _Requirements: 2.2, 2.3_

- [x] 5. Add Frontend Signature Handling
  - Request wallet signature for generated SIWE message
  - Capture signature and wallet address from user interaction
  - Handle signature rejection with appropriate error messaging
  - Implement retry mechanism for failed signature attempts
  - _Requirements: 2.4, 2.5, 5.3_

- [x] 6. Create Deno Backend Verification Function
  - Implement `/functions/auth/verify.ts` with Viem integration
  - Add cryptographic signature verification for Base network
  - Implement nonce tracking and replay attack prevention
  - Configure proper CORS headers for cross-origin requests
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7. Configure Function Routing
  - Update `main.ts` to support nested function routing
  - Add `/api/auth/verify` endpoint to function registry
  - Implement routing logic for nested paths
  - Update server logging to show all available endpoints
  - _Requirements: 3.1, 4.1_

- [x] 8. Implement API Configuration System
  - Create `src/config/api.ts` for centralized endpoint management
  - Implement fallback endpoint strategy for reliability
  - Add environment variable support for production URLs
  - Create `fetchWithFallback` utility for automatic retry logic
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 9. Update Frontend to Use API Configuration
  - Replace hardcoded API URLs with configuration system
  - Integrate `fetchWithFallback` for authentication requests
  - Add proper error handling for API failures
  - Ensure compatibility with both development and production
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 10. Create Environment Configuration
  - Add `.env.example` with `VITE_DENO_API_URL` placeholder
  - Document environment variable usage for deployment
  - Provide fallback URLs for development and production
  - Include setup instructions for different environments
  - _Requirements: 4.5_

- [x] 11. Implement User Experience Enhancements
  - Add loading states during authentication process
  - Disable authentication button during signature requests
  - Implement success redirect to invoice creation page
  - Add comprehensive error messaging for various failure scenarios
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

