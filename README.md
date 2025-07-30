# Crypto Invoice Generator

A modern, decentralized invoice generation and payment platform built on Base Network using USDC. Create and pay invoices with cryptocurrency for fast, secure, and global transactions.

## ✨ Features

### Crypto Payment System
- **Base Network Integration** - Built on Coinbase's Layer 2 solution for fast, low-cost transactions
- **USDC Payments** - Stable cryptocurrency payments (1 USDC = 1 USD)
- **Wallet Connection** - Seamless Web3 wallet integration
- **Global Accessibility** - Send and receive payments anywhere in the world
- **24/7 Availability** - Blockchain never sleeps - create and pay invoices anytime

### Invoice Management
- **Lightning Fast Creation** - Generate professional invoices in seconds
- **Secure & Transparent** - All transactions verifiable on the blockchain
- **No Setup Fees** - Start using immediately without upfront costs
- **Instant Payments** - No waiting days for traditional bank transfers

### Frontend
- **React 19** - Latest version with modern hooks and concurrent features
- **TypeScript** - Full type safety and better development experience
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - Beautiful, accessible, and customizable UI components
- **Dark/Light Theme** - Built-in theme switching with system preference detection
- **Stagewise Toolbar** - Development and debugging tools integration

### Backend
- **Deno Runtime** - Modern JavaScript/TypeScript runtime for serverless functions
- **Function Router** - Automatic routing system for multiple serverless functions
- **CORS Support** - Pre-configured for cross-origin requests
- **Hot Reload** - Local development with automatic server restart

### Deployment
- **Cloudflare Pages** - Global CDN with edge computing capabilities
- **Deno Deploy** - Serverless functions at the edge
- **GitHub Actions** - Automated CI/CD pipeline
- **Environment Sync** - Automatic environment variable synchronization

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - For React development
- **Deno 2.x** - For serverless functions
- **pnpm** - Package manager (yarn as fallback)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/crypto-invoice-generator.git
cd crypto-invoice-generator
```

3. **Install dependencies**:
```bash
pnpm install
```

4. **Start development servers**:
```bash
pnpm dev
```

This starts both:
- React app at `http://localhost:5173`
- Deno server at `http://localhost:8000`

### 🛠 Available Scripts

```bash
# Start both React and Deno servers concurrently
pnpm dev

# Start only React development server
pnpm dev:vite

# Start only Deno server
pnpm dev:deno

# Build React app for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

### Deno Commands

```bash
# Run Deno server directly
deno task dev

# Run main router
deno task main

# Test individual function
deno task function
```

## 📁 Project Structure

```
├── src/                     # React frontend (Crypto Invoice UI)
│   ├── components/
│   │   ├── ui/             # shadcn/ui components (Button, Card)
│   │   └── ThemeToggle.tsx # Dark/light theme switching
│   ├── contexts/
│   │   └── ThemeContext.tsx # Theme context provider
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn, etc.)
│   ├── assets/             # Static assets (React logo, etc.)
│   ├── App.tsx             # Main crypto invoice landing page
│   ├── App.css             # Application styles
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles with CSS variables
│
├── functions/              # Deno serverless functions
│   └── hello.ts           # Example API function
│
├── main.ts                # Deno function router
├── server.ts              # Local development server
├── deno.json              # Deno configuration and tasks
│
├── .github/workflows/     # CI/CD pipeline
│   └── deploy.yml         # Automated deployment
│
├── .kiro/                 # Kiro AI assistant configuration
│   └── steering/          # AI steering rules and workflows
│
├── .windsurf/             # Windsurf IDE configuration
│   ├── rules/             # Development rules
│   └── workflows/         # Automated workflows
│
├── ai-schema/             # AI schema definitions
│   ├── kiro-hooks-schema.txt
│   ├── kiro-specs-*.md
│   └── windsurf-workflow-schema.txt
│
├── public/                # Static assets
│   └── vite.svg          # Vite logo
│
├── PITCH/                 # Project pitch materials
├── package.json           # Node.js dependencies
├── vite.config.ts         # Vite configuration with Tailwind
├── tsconfig.*.json        # TypeScript configurations
├── eslint.config.js       # ESLint configuration
├── DENO_SETUP.md         # Deno setup instructions
├── DEPLOYMENT_SECRETS.md  # Deployment configuration guide
└── LICENSE               # MIT License
```

## 🎨 Frontend Features

### Landing Page
- **Hero Section** - Compelling introduction to crypto invoicing
- **Feature Showcase** - Six key benefits with beautiful gradient cards:
  - ⚡ Lightning Fast - Instant payments on Base network
  - 🛡️ Secure & Transparent - Blockchain-verified transactions
  - 💰 USDC Stable - No volatility concerns with stablecoin payments
  - 🌍 Global Reach - Borderless payments worldwide
  - 👥 Easy to Use - Simple interface for everyone
  - 🕐 24/7 Available - Always-on blockchain infrastructure

### UI Components
- **shadcn/ui** - Pre-built accessible components with custom styling
- **Gradient Cards** - Beautiful feature cards with hover effects
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Theme Toggle** - Dark/light mode switching with system preference
- **Lucide Icons** - Professional icon library for crypto and finance
- **Call-to-Action Buttons** - Prominent wallet connection and demo buttons

### Web3 Integration (Planned)
- **Wallet Connection** - MetaMask, WalletConnect, and other Web3 wallets
- **Base Network** - Optimized for Coinbase's Layer 2 solution
- **USDC Payments** - Stablecoin payment processing
- **Transaction History** - View and track all invoice payments
- **Smart Contract Integration** - Automated payment verification

### Adding More Functions

1. Create a new file in `functions/` directory:
```typescript
// functions/invoice.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Invoice creation logic here
    const invoice = {
      id: crypto.randomUUID(),
      amount: 100,
      currency: 'USDC',
      status: 'pending',
      created: new Date().toISOString()
    };

    return new Response(JSON.stringify(invoice), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
```

2. Register in `main.ts`:
```typescript
import helloFunction from './functions/hello.ts';
import invoiceFunction from './functions/invoice.ts';

const functions = {
  hello: helloFunction,
  invoice: invoiceFunction, // Add here
};
```

3. Access at `/api/invoice` or `/invoice`

## 💰 Crypto Invoice Features

### Current Implementation
The application currently features a beautiful landing page showcasing the crypto invoice concept with:

- **Hero Section** with compelling value proposition
- **Feature Cards** highlighting key benefits:
  - Lightning Fast payments on Base network
  - Secure & Transparent blockchain transactions
  - USDC Stable payments (no volatility)
  - Global Reach (borderless payments)
  - Easy to Use interface
  - 24/7 Availability
- **Call-to-Action** buttons for wallet connection and demos
- **Responsive Design** with dark/light theme support

### Planned Web3 Integration

#### Invoice Creation
```typescript
// Planned invoice structure
interface CryptoInvoice {
  id: string;
  amount: number;
  currency: 'USDC';
  recipient: string; // Wallet address
  description: string;
  dueDate: Date;
  status: 'pending' | 'paid' | 'expired';
  paymentAddress: string; // Base network address
  transactionHash?: string;
}
```

#### Payment Processing
- **Smart Contract Integration** for automated payment verification
- **Base Network RPC** for transaction monitoring
- **USDC Token Contract** interaction for payment processing
- **Wallet Connection** via Web3 providers (MetaMask, WalletConnect)

#### Features to Implement
1. **Invoice Generator** - Create invoices with USDC amounts
2. **Payment Gateway** - Process payments through Base network
3. **Transaction Tracking** - Monitor payment status in real-time
4. **Wallet Integration** - Connect and manage Web3 wallets
5. **Payment History** - View all sent and received invoices
6. **QR Code Generation** - Easy mobile payments with QR codes

## 🚀 Deployment

### Automated Deployment (Recommended)

The project includes a complete CI/CD pipeline using GitHub Actions:

1. **Set up GitHub Secrets** (see [DEPLOYMENT_SECRETS.md](DEPLOYMENT_SECRETS.md)):
   - `DENO_DEPLOY_TOKEN` - From [dash.deno.com](https://dash.deno.com)
   - `CLOUDFLARE_API_TOKEN` - From Cloudflare dashboard
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
   - `ADMIN_TOKEN` - GitHub token (optional, for repo updates)

2. **Push to main branch**:
```bash
git push origin main
```

3. **Automatic deployment**:
   - Deno functions → Deno Deploy
   - React app → Cloudflare Pages
   - Environment variables synced automatically

### Manual Deployment

#### Deno Deploy
```bash
# Install deployctl
deno install -A --global jsr:@deno/deployctl

# Deploy function
deployctl deploy --project=your-project main.ts
```

#### Cloudflare Pages
```bash
# Build React app
pnpm build

# Deploy to Cloudflare Pages (using Wrangler)
npx wrangler pages deploy dist --project-name=your-project
```

## ⚙️ Configuration

### Environment Variables

#### Development
Create `.env.local` for local development:
```bash
VITE_DENO_API_URL=http://localhost:8000
```

#### Production
Set in Cloudflare Pages dashboard:
- `VITE_DENO_API_URL` - Your Deno Deploy URL (auto-set by GitHub Actions)

### Theming

The app includes a complete theming system:

- **CSS Variables** - Defined in `src/index.css`
- **Theme Context** - React context for theme state
- **System Detection** - Automatic dark/light mode detection
- **Theme Toggle** - User-controlled theme switching

### Path Aliases

Clean imports using the `@/` alias:

```typescript
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/contexts/ThemeContext'
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 19 |
| **Backend Runtime** | Deno 2.x |
| **Language** | TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS 4.x |
| **UI Components** | shadcn/ui + Radix UI |
| **Icons** | Lucide React |
| **Blockchain** | Base Network (Layer 2) |
| **Cryptocurrency** | USDC (USD Coin) |
| **Web3 Tools** | Stagewise Toolbar + React Plugin |
| **Frontend Hosting** | Cloudflare Pages |
| **Backend Hosting** | Deno Deploy |
| **CI/CD** | GitHub Actions |
| **Package Manager** | pnpm |

## 🧪 Local Development

### Development Workflow

1. **Start development servers**:
```bash
pnpm dev  # Starts both React (5173) and Deno (8000)
```

2. **Test the integration**:
   - Open `http://localhost:5173`
   - Click "Call Serverless Function" button
   - Verify the API call works

3. **Add new functions**:
   - Create in `functions/` directory
   - Register in `main.ts`
   - Test locally before deploying

### Code Style Guidelines

#### Frontend (React)
- Use TypeScript for all components
- Follow shadcn/ui patterns for consistency
- Use the `cn()` utility for conditional classes
- Implement proper error boundaries

#### Backend (Deno)
- Export default object with `fetch` method
- Include CORS headers for cross-origin requests
- Use proper TypeScript types
- Handle errors gracefully

### Function Structure

```typescript
// functions/payment.ts
export default {
  async fetch(request: Request): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Payment processing logic for USDC on Base
    const paymentData = {
      transactionHash: '0x...',
      amount: '100.00',
      currency: 'USDC',
      network: 'base',
      status: 'confirmed',
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(paymentData), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
```

## 🔧 Troubleshooting

### Common Issues

#### Function not found (404)
- Verify function is registered in `main.ts`
- Check function export format
- Ensure Deno server is running on port 8000

#### CORS errors
- Functions include CORS headers by default
- Check browser network tab for actual error
- Verify API endpoint URL is correct

#### Build failures
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Verify TypeScript compilation: `pnpm build`

#### Deployment issues
- Check GitHub Secrets are set correctly
- Verify Cloudflare API token permissions
- Check GitHub Actions logs for specific errors

#### Web3 Integration Issues (Future)
- Wallet connection failures
- Base network RPC errors
- USDC contract interaction problems
- Transaction confirmation delays

### Getting Help

1. Check the [GitHub Issues](https://github.com/your-username/crypto-invoice-generator/issues)
2. Review the [deployment documentation](DEPLOYMENT_SECRETS.md)
3. Check Base Network documentation for Web3 integration
4. Consult USDC and stablecoin payment guides

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Test locally with `pnpm dev`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Features in Detail

### Crypto Payment Innovation
- **Base Network Integration** - Built on Coinbase's Layer 2 for fast, cheap transactions
- **USDC Stability** - Eliminate cryptocurrency volatility with USD-pegged stablecoin
- **Global Accessibility** - Send invoices and receive payments from anywhere in the world
- **Instant Settlement** - No waiting 3-5 business days for traditional bank transfers

### User Experience
- **One-Click Invoice Creation** - Generate professional invoices in seconds
- **Wallet Integration** - Connect MetaMask, Coinbase Wallet, and other Web3 wallets
- **Real-time Updates** - Track payment status with blockchain confirmations
- **Mobile Responsive** - Full functionality on desktop, tablet, and mobile devices

### Developer Experience
- **Hot reload** for both frontend and backend during development
- **TypeScript everywhere** for type safety across the stack
- **Modern tooling** with Vite, ESLint, and Deno's built-in formatter
- **Stagewise integration** for enhanced development workflow

### Production Ready
- **Global CDN** deployment with Cloudflare Pages
- **Edge computing** with Deno Deploy serverless functions
- **Automated CI/CD** with GitHub Actions
- **Environment synchronization** between services

### Scalability
- **Serverless architecture** scales automatically with demand
- **Edge deployment** reduces latency worldwide
- **Blockchain infrastructure** handles high transaction volumes
- **Stateless functions** enable horizontal scaling

---

**💰 Crypto-native** • **⚡ Lightning fast** • **🌍 Global payments** • **🔧 Fully customizable**

Built for the decentralized future of finance and payments.

## 🚧 Development Status

### ✅ Completed
- **Landing Page** - Beautiful, responsive crypto invoice showcase
- **UI Components** - Complete shadcn/ui integration with custom styling
- **Theme System** - Dark/light mode with system preference detection
- **Development Setup** - Full-stack development environment with hot reload
- **Deployment Pipeline** - Automated CI/CD with GitHub Actions
- **Project Structure** - Organized codebase ready for Web3 integration

### 🔄 In Progress
- **Web3 Integration** - Wallet connection and Base network setup
- **Smart Contracts** - USDC payment processing contracts
- **Invoice System** - Create, send, and track crypto invoices

### 📋 Roadmap
1. **Phase 1: Web3 Foundation**
   - Wallet connection (MetaMask, WalletConnect)
   - Base network integration
   - USDC token contract interaction

2. **Phase 2: Invoice Core**
   - Invoice creation and management
   - Payment processing with USDC
   - Transaction monitoring and confirmations

3. **Phase 3: Advanced Features**
   - QR code generation for mobile payments
   - Payment history and analytics
   - Multi-currency support (ETH, other tokens)
   - Recurring invoice automation

4. **Phase 4: Enterprise Features**
   - Team collaboration and permissions
   - API for third-party integrations
   - Advanced reporting and tax features
   - White-label solutions
