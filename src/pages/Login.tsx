import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeft,
  Wallet,
  Zap
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { usePrivy, useLogin } from '@privy-io/react-auth'
import { getApiEndpoints, fetchWithFallback } from '@/config/api'

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  // Privy authentication hooks
  const { ready, authenticated, user } = usePrivy()
  const { login } = useLogin()

  // Redirect to invoice creation if already authenticated
  useEffect(() => {
    if (ready && authenticated && user) {
      navigate('/create-invoice')
    }
  }, [ready, authenticated, user, navigate])

  const handleSignInWithBase = async () => {
    if (!ready) return
    
    setIsLoading(true)
    
    try {
      // Use Privy's login with both wallet and email functionality
      // This will handle SIWE authentication and email OTP automatically
      await login({
        loginMethods: ['wallet'],
        walletChainType: 'ethereum-only', // Focus on Ethereum/Base
        disableSignup: false
      })
      
      // Navigation will be handled by useEffect once authenticated
    } catch (error) {
      console.error('Sign in error:', error)
      alert('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenericWalletConnect = async () => {
    setIsLoading(true)
    
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        if (accounts.length > 0) {
          // For demo purposes, just navigate to invoice creation
          navigate('/create-invoice')
        }
      } else {
        alert('Please install a Web3 wallet like MetaMask to continue')
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Powered by Base Network
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Sign in to manage your crypto invoices
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-blue-100 text-center">
              Access your invoice dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Authenticate with your Coinbase Smart Wallet on Base - no passwords required.
              </p>
            </div>

            <div className="space-y-6">
              {/* Sign in with Base Button */}
              <button
                type="button"
                onClick={handleSignInWithBase}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  minHeight: '56px',
                  fontSize: '16px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                <div 
                  className="w-4 h-4 bg-blue-600 dark:bg-white rounded-sm flex-shrink-0"
                  style={{
                    backgroundColor: '#0000FF'
                  }}
                />
                <span>{isLoading ? 'Connecting...' : 'Sign in with Coinbase Smart Wallet'}</span>
              </button>

            

           
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
