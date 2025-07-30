# Implementation Plan

- [x] 1. Review Privy Documentation and Setup
  - Study Privy authentication documentation at https://docs.privy.io/llms-full.txt
  - Identify React/web quickstart integration requirements
  - Extract server SDK requirements for backend integration
  - _Requirements: 1.1, 7.1_

- [x] 2. Install and Configure Privy SDK
  - Install Privy React SDK package
  - Set up Privy provider wrapper around React application
  - Configure Privy App ID and basic authentication settings
  - _Requirements: 1.1, 1.2_

- [x] 3. Replace Sign-In Button with Privy Authentication
  - Remove existing "Sign in with Base" button implementation
  - Integrate Privy authentication trigger in sign-in component
  - Implement authentication success and error state handling
  - Test wallet connection authentication flow
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. Add Email Authentication Method
  - Configure Privy to support email sign-in alongside wallet authentication
  - Update authentication UI to present both options to users
  - Test email authentication flow and session management
  - Ensure consistent user experience across authentication methods
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Implement Logout Functionality
  - Create logout button component for authenticated pages
  - Add logout button to /create-invoice page header/navigation
  - Implement Privy session termination on logout
  - Add redirect to home page after successful logout
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 6. Update Environment Configuration
  - Add Privy environment variables to .env.example file
  - Document required PRIVY_APP_ID and other necessary variables
  - Add REDIS_URL environment variable for data persistence
  - Include clear setup instructions in documentation
  - _Requirements: 7.1, 7.3, 7.4_

- [x] 7. Update Deployment Configuration
  - Modify .github/workflows/deploy.yml for Cloudflare Pages
  - Add environment variable injection for Privy configuration
  - Include REDIS_URL in deployment environment variables
  - Test deployment pipeline with new environment requirements
  - _Requirements: 7.2, 7.3_

- [x] 8. Enhance Invoice Creation Form
  - Remove Client Address and Client Email fields from form
  - Make due date field optional with "no deadline" option
  - Add wallet address auto-fill button using Privy user data
  - Implement wallet address population from authenticated user context
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 9. Create Invoice Viewing Page
  - Design and implement invoice viewing component
  - Create route and navigation for invoice viewing functionality
  - Implement mock data display for demonstration purposes
  - Ensure consistent styling with existing application design
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 10. Implement Redis Data Persistence
  - Create Deno function for saving invoice data to Redis
  - Set up Redis client connection using REDIS_URL environment variable
  - Implement error handling for Redis connection and operation failures
  - Add invoice data validation and sanitization before storage
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. Test Integration Locally
  - Set up local development environment with all required variables
  - Test complete authentication flow (wallet and email methods)
  - Verify invoice creation with Redis persistence
  - Test logout functionality and session management
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [x] 12. Documentation and Final Validation
  - Update README with Privy integration setup instructions
  - Document environment variable requirements and setup process
  - Provide manual server start instructions (following user rules)
  - Validate all requirements are met and functionality works end-to-end
  - _Requirements: 7.1, 7.3, 7.4_
