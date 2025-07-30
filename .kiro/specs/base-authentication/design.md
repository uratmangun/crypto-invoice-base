# Base Authentication Design

## Architecture Overview
The Base authentication system implements a decentralized Web3 authentication flow using wallet signatures and the SIWE (Sign-In with Ethereum) standard. The architecture consists of a React frontend for user interaction, a Deno backend for signature verification, and a fallback API configuration system for reliability across environments.

## Technical Approach
- **Frontend**: React components with Web3 wallet integration using standard `window.ethereum` API
- **Backend**: Deno functions using Viem library for cryptographic signature verification on Base network
- **Authentication Standard**: SIWE (EIP-4361) for structured message signing and verification
- **Security**: Nonce-based replay attack prevention and server-side signature validation
- **Deployment**: Deno Deploy functions with local development support

## Component Design

### Frontend Components

#### Login Component (`src/pages/Login.tsx`)
- **Purpose**: Provides Web3 authentication interface with Base branding
- **Dependencies**: React Router for navigation, Web3 wallet APIs, API configuration
- **Interface**: Handles wallet connection, message signing, and backend verification calls
- **State Management**: Loading states, error handling, authentication status

#### API Configuration (`src/config/api.ts`)
- **Purpose**: Centralizes API endpoint management with fallback support
- **Dependencies**: Environment variables, fetch API
- **Interface**: Provides endpoint URLs and fallback fetch functionality
- **Fallback Strategy**: Attempts multiple endpoints in order (local → production → fallback)

### Backend Components

#### Signature Verification Function (`functions/auth/verify.ts`)
- **Purpose**: Cryptographically verifies wallet signatures using Viem
- **Dependencies**: Viem library, Base network configuration
- **Interface**: REST API endpoint accepting address, message, and signature
- **Security Features**: Nonce validation, replay attack prevention, CORS handling

#### Function Router (`main.ts`)
- **Purpose**: Routes API requests to appropriate Deno functions
- **Dependencies**: Deno Deploy function registry
- **Interface**: Handles nested routing for `/api/auth/verify` endpoint
- **Scalability**: Supports both top-level and nested function routing

## Data Flow

1. **Authentication Initiation**
   - User clicks "Sign in with Base" button
   - Frontend requests wallet connection via Web3 provider
   - System generates unique nonce for session

2. **Message Creation and Signing**
   - Frontend creates SIWE-compliant message with domain, nonce, and chain ID
   - User signs message using connected wallet
   - Frontend captures signature and wallet address

3. **Backend Verification**
   - Frontend sends address, message, and signature to `/api/auth/verify`
   - Backend verifies signature cryptographically using Viem
   - System validates nonce and marks it as consumed
   - Backend returns authentication result

4. **Session Management**
   - On successful verification, user is redirected to invoice creation
   - Authentication state is maintained for the session
   - Error states provide user feedback and retry options

## Technical Considerations

### Security
- **Signature Verification**: All signatures verified server-side using cryptographic libraries
- **Nonce Management**: Unique nonces prevent replay attacks
- **CORS Configuration**: Proper headers for cross-origin requests
- **Input Validation**: All user inputs validated before processing

### Performance
- **Fallback Endpoints**: Multiple API endpoints ensure reliability
- **Async Operations**: Non-blocking authentication flow
- **Error Handling**: Graceful degradation with user feedback

### Scalability
- **Stateless Functions**: Deno functions can scale independently
- **Environment Flexibility**: Works across development and production
- **Modular Design**: Components can be extended or replaced independently

### Development Experience
- **Hot Reload**: Development server supports live updates
- **Environment Variables**: Configurable API endpoints
- **TypeScript**: Full type safety across frontend and backend
- **Concurrent Development**: Frontend and backend can be developed simultaneously
