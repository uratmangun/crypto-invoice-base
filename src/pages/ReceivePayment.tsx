import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { useState } from 'react'

export function ReceivePayment() {
  const { user, authenticated, login } = usePrivy()
  const [copied, setCopied] = useState(false)

  const walletAddress = user?.wallet?.address || ''

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to view your payment QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={login}
              className="w-full mb-4"
              size="lg"
            >
              Sign In to View QR Code
            </Button>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Receive USDC Payment
          </h1>
        </div>

        {/* QR Code Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Payment Address
            </CardTitle>
            <CardDescription>
              Share this QR code or address to receive USDC payments on Base network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code with Base Icon */}
            <div className="flex justify-center">
              <div className="relative bg-white p-6 rounded-lg shadow-lg">
                <QRCode
                  value={walletAddress}
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox="0 0 256 256"
                />
                {/* Base Icon Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <img 
                      src="/base-icon.svg" 
                      alt="Base Network" 
                      className="w-8 h-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Wallet Address (Base Network)
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm break-all">
                  {walletAddress}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Address copied to clipboard!
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                How to receive payments:
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Share this QR code with the person sending you USDC</li>
                <li>• Or copy and share your wallet address</li>
                <li>• Payments will arrive on the Base network</li>
                <li>• Make sure the sender uses USDC on Base network</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link to="/create-invoice">
            <Button variant="outline">
              Create Invoice
            </Button>
          </Link>
          <Button onClick={() => window.print()}>
            Print QR Code
          </Button>
        </div>
      </div>
    </div>
  )
}
