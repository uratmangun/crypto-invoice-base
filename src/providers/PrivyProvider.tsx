'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, baseSepolia } from 'viem/chains';

interface PrivyAppProviderProps {
  children: React.ReactNode;
}

export default function PrivyAppProvider({ children }: PrivyAppProviderProps) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID;
  const clientId = import.meta.env.VITE_PRIVY_CLIENT_ID;

  if (!appId || !clientId) {
    console.error('Privy credentials missing. Please check your environment variables.');
    return <div>Privy configuration error. Please check environment variables.</div>;
  }

  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        // Configure login methods
        loginMethods: ['wallet', 'email', 'sms'],
        
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },

        // Configure supported chains (Base network focus)
        supportedChains: [base, baseSepolia],
        
        // Set Base as the default chain
        defaultChain: base,

        // Appearance configuration for the crypto invoice theme
        appearance: {
          theme: 'dark',
          accentColor: '#3b82f6', // Blue color to match our brand
          logo: undefined, // You can add your logo URL here
          landingHeader: 'Sign in to Crypto Invoice Generator',
          landingSubheader: 'Create and manage your crypto invoices with USDC on Base',
          showWalletLoginFirst: true, // Show wallet login prominently
        },

        // Enable wallet confirmation modals
        walletConfirmationModals: {
          ethereum: true,
        },

        // External wallet configuration
        externalWallets: {
          ethereum: {
            includeEmbeddedWallets: true,
            overrideUnsupported: true,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
